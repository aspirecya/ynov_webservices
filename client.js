const http = require('http');

// helper vars
const headers = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods":"PUT,GET,POST,DELETE,OPTIONS"
};

// server vars
let registryHostname = "localhost";
let registryPort = 1337;

let serverHostname = "localhost";
let serverPort = 8005;

// general vars
let messages = {};
let users = [];
let client = null;

let server1User = JSON.stringify({
    'name': 'server1',
    'port': serverPort,
    'host': serverHostname
});

let handleServer = async function (req, res) {
    let path = req.url.split('?')[0].replace('/', '');
    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST,GET,OPTIONS,DELETE,PUT"
      );
    if(!path || path === "/") {
        res.end('{status:"404"}');
    } else {
        if (req.method === "GET") {
            if(path === "ping") {
                ping(res);
            }
            else if(path === "users") {
                let promise = await fetchUsersFromRegistry(res);
                res.end(promise);
            }
            else if(path === "all") {
                getAllMessages(res);
            } else {
                getMessages(res, path);
            }
        }

        if (req.method === "POST") {
            if(path === "login") {
                login(req, res);
            } else if(path.includes('chat')) {
                if(client) {
                    await pushMessage(req, res, path.split('/')[1]);
                } else {
                    res.writeHead(404, headers);
                    res.end('{"status":"404", "message": "not logged in"}');
                }
            } else {
                res.writeHead(404, headers);
                res.end('{"status":"404"}');
            }
        }

        if (req.method === "DELETE") {
          
                logout(req, res, path);
            
        }
    }
}

// ping func
function ping(res) {
    res.writeHead(200, headers);
    res.end();
}

// registry func
function initializeRegistry() {
    const options = {
        hostname: registryHostname,
        port: registryPort,
        path : '/users',
        method: 'GET',
        headers: headers
    }

    const req = http.request(options, response => {
        let body = '';

        response.on("data", function (data) {
            body += data.toString();
        });

        response.on("end", function () {
            users = JSON.parse(body);
        });

        response.on("error", function (e) {
            console.log(e);
            response.writeHead(500, headers);
            response.end(e);
        });
    });

    req.end();
}

function postRegistry(userData) {
    const options = {
        hostname: registryHostname,
        port: registryPort,
        path : '/register',
        method: 'POST',
        headers: headers
    }

    const req = http.request(options, response => {
        response.on("error", function (e) {
            console.log(e);
            response.writeHead(500, headers);
            response.end(e);
        });
    });

    req.write(userData);
    req.end();
}

function fetchUserFromRegistry(username) {
    return new Promise(function (resolve, reject) {
        http.get(`http://${registryHostname}:${registryPort}/${username}`, (res) => {
            res.setEncoding('utf8');
            res.on('data', function (res) {
                resolve(res);
            });
        });
    })
}

function fetchUsersFromRegistry() {
    return new Promise(function (resolve, reject) {
        http.get(`http://${registryHostname}:${registryPort}/users`, (res) => {
            res.setEncoding('utf8');
            res.on('data', function (res) {
                resolve(res);
            });
        });
    })
}


function login(req, res) {
    const options = {
        hostname: registryHostname,
        port: registryPort,
        path: '/register',
        method: 'POST',
        headers: headers
    }

    const loginRequest = http.request(options, response => {
        let body = '';
        response.on("error", function(e){
            console.log(e);
            res.writeHead(500, headers);
            res.end(e);
        });
        response.on("data", function(data){
            body += data.toString();
        });
        response.on('end', function(){
            storeClientIdentity(JSON.parse(body));
            res.writeHead(200, headers);
            res.end(body);
        });
    });

    req.on("error", function(e){
        console.log(e);
        res.writeHead(500, headers);
        res.end(e);
    });
    req.pipe(loginRequest);
}

function logout(req, res, path) {
    const options = {
        hostname: registryHostname,
        port: registryPort,
        path: `/${path}`,
        method: 'DELETE',
        headers: headers
    }

    const logoutRequest = http.request(options, response => {
        let body = '';
        response.on("error", function(e){
            console.log(e);
            res.writeHead(500, headers);
            res.end(e);
        });
        response.on("data", function(data){
            body += data.toString();
        });
        response.on('end', function(){
            res.writeHead(200, headers);
            res.end(body);
        });
    });

    req.on("error", function(e){
        console.log(e);
        res.writeHead(500, headers);
        res.end(e);
    });

    req.pipe(logoutRequest)
}

// message func
function getMessages(res, path) {
    res.writeHead(200, headers);

    if(!messages[path]) {
        res.end(JSON.stringify([]));
    } else {
        res.end(JSON.stringify(messages[path]));
        delete messages[path];
    }
}

function getAllMessages(res) {
    res.writeHead(200, headers);
    res.end(JSON.stringify(messages));
}

async function pushMessage(req, res, path) {
    const buffers = [];
    let receiver = await fetchUserFromRegistry(path);
    console.log("REQUEST ✅", req.headers.from);

    if(receiver !== undefined) {
        let user = JSON.parse(receiver);

        if(!user.error) {
            for await (const chunk of req) {
                buffers.push(chunk);
            }

            const message = Buffer.concat(buffers).toString();

            if(req.headers.from === undefined) {
                pushToClient(message, user, res);
            } else {

                if (!messages[req.headers.from]) {
                    messages[req.headers.from] = [];
                }

                messages[req.headers.from].push(message);
            }
        } else {
            res.writeHead(user.error, headers);
            res.end(`{"status": ${user.error}, "message": ${user.message}}`);
        }
    } else {
        res.writeHead(404, headers);
        res.end('{"status": "404", "message": "user not connected"}');
    }
}

function pushToClient(message, receiver, res) {
    const options = {
        port : receiver.port,
        hostname : receiver.host,
        host : `${receiver.host}:${receiver.port}`,
        path : `/chat/${receiver.name}`,
        method: 'POST',
        headers: {
            'from': client,
            'Content-Length': message.length,
            ...headers
        }
    }

    const req = http.request(options, response => {
        console.log(`statusCode: ${response.statusCode}`)

        response.on('data', d => {
            process.stdout.write(d)
        })

        req.on('error', error => {
            console.error(error)
            response.writeHead(500, headers);
            response.end(error);
        })
    });

    req.write(message);
    req.end();
    res.writeHead(200, headers);
    res.end('{"status": "200", "message": "message sent"}');
}

// helper func

function storeClientIdentity(data) {
    if(!data.error) {
        client = data.identity;
    }
}

function validateUser(data) {
    return 'name' in data && 'host' in data && 'port' in data;
}


// ----
initializeRegistry();
// postRegistry(server1User);

const server1 = http.createServer(handleServer);

server1.listen(serverPort);
console.log(`✅ Server 1 running on port ${serverPort}`);
