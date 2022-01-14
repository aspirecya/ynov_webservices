const http = require('http');

// server vars
let registryHostname = "localhost";
let registryPort = 8690;

let serverHostname = "localhost";
let serverPort = 8691;

let server2Hostname = "localhost";
let server2Port = 8692;

// general vars
let messages = {};
let users = {};

let server1User = JSON.stringify({
    'name': 'server1',
    'port': serverPort,
    'host': serverHostname
});

let server2User = JSON.stringify({
    'name': 'server2',
    'port': server2Port,
    'host': server2Hostname
});

let handleServer = async function (req, res) {
    let path = req.url.split('?')[0].replace('/', '');

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
                console.log("all");
                getAllMessages(res);
            } else {
                getMessages(res, path);
            }
        }

        if (req.method === "POST") {
            if(path === "login") {
                login(req, res);
            } else {
                await pushMessage(req, res, path);
            }
        }

        if (req.method === "DELETE") {
            logout(req, res, path);
        }
    }
}

// ping func
function ping(res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end();
}

// registry func
function initializeRegistry() {
    const options = {
        hostname: registryHostname,
        port: registryPort,
        path : '/registry',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
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
            response.writeHead(500, {'Content-type': 'application/json'});
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
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const req = http.request(options, response => {
        response.on("error", function (e) {
            console.log(e);
            response.writeHead(500, {'Content-type': 'application/json'});
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
        http.get(`http://${registryHostname}:${registryPort}/registry`, (res) => {
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
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const loginRequest = http.request(options, response => {
        let body = '';
        response.on("error", function(e){
            console.log(e);
            res.writeHead(500, {'Content-type': 'application/json'});
            res.end(e);
        });
        response.on("data", function(data){
            body += data.toString();
        });
        response.on('end', function(){
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(body);
        });
    });

    req.on("error", function(e){
        console.log(e);
        res.writeHead(500, {'Content-type': 'application/json'});
        res.end(e);
    });
    req.pipe(loginRequest)
}

function logout(req, res, path) {
    const options = {
        hostname: registryHostname,
        port: registryPort,
        path: `/${path}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const logoutRequest = http.request(options, response => {
        let body = '';
        response.on("error", function(e){
            console.log(e);
            res.writeHead(500, {'Content-type': 'application/json'});
            res.end(e);
        });
        response.on("data", function(data){
            body += data.toString();
        });
        response.on('end', function(){
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(body);
        });
    });

    req.on("error", function(e){
        console.log(e);
        res.writeHead(500, {'Content-type': 'application/json'});
        res.end(e);
    });
    req.pipe(logoutRequest)
}

// message func
function getMessages(res, path) {
    res.writeHead(200, {'Content-Type': 'application/json'});

    if(!messages[path]) {
        res.end(JSON.stringify([]));
    } else {
        res.end(JSON.stringify(messages[path]));
        // delete messages[path];
    }
}

function getAllMessages(res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(messages));
}

async function pushMessage(req, res, path) {
    const buffers = [];
    let receiver = await fetchUserFromRegistry(path);

    if(receiver !== undefined) {
        for await (const chunk of req) {
            buffers.push(chunk);
        }

        let user = JSON.parse(receiver);
        const message = Buffer.concat(buffers).toString();

        if (!messages[user.name]) {
            messages[user.name] = [];
        }

        messages[user.name].push(Buffer.concat(buffers).toString());
        pushToClient(message, user, res);
    } else {
        res.end('{status: 200, message: "user not connected"}');
    }
}

function pushToClient(message, receiver, res) {
    const options = {
        port : receiver.port,
        hostname : receiver.host,
        host : `${receiver.host}:${receiver.port}`,
        path : receiver.name,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': message.length
        }
    }

    const req = http.request(options, response => {
        console.log(`statusCode: ${response.statusCode}`)

        response.on('data', d => {
            process.stdout.write(d)
        })

        req.on('error', error => {
            console.error(error)
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(error);
        })
    });

    req.write(message);
    req.end();
    res.end('{status: 200, message: "message sent"}');
}

// ----
initializeRegistry();
// postRegistry(server1User);
// postRegistry(server2User);

const server1 = http.createServer(handleServer);
const server2 = http.createServer(handleServer);

server1.listen(serverPort);
console.log(`✅ Server 1 running on port ${serverPort}`);
// console.log("📄 Server 1 connected to registry");

server2.listen(server2Port);
console.log(`✅ Server 2 running on port ${server2Port}`);
// console.log("📄 Server 2 connected to registry");
