// requires
const http = require('http');

// helper vars
const headers = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
};

// general vars
let users = [];
const port = 1337;

// server handler
let handleRegistry = async function (req, res) {
    let path = req.url.split('?')[0].replace('/', '');

    if (req.method === "GET") {
        if (path === "users") {
            sendRegistryUsers(res);
        } else {
            sendRegistryUser(path, res);
        }
    }

    if (req.method === "POST") {
        if (path === "register") {
            storeRegistryUser(res, req);
        }
    }

    if (req.method === "DELETE") {
        if (path === "pinginterval") {
            clearInterval(pingInterval);
        } else {
            deleteRegistryUser(res, path);
        }
    }
}

// functions
function sendRegistryUsers(res) {
    res.writeHead(200, headers);
    res.end(JSON.stringify(toArray(users)));
}

function sendRegistryUser(path, res) {
    if(users[path]) {
        res.writeHead(200, headers);
        res.end(JSON.stringify(users[path]));
    } else {
        res.writeHead(404, headers);
        res.end('{"error": "404", "message": "user not found"}');
    }
}

function storeRegistryUser(res, req) {
    let body = '';

    req.on('data', function (data) {
        body += data.toString();
    });

    req.on('error', function (error) {
        console.log(error);
        res.writeHead(500, headers);
        res.end(error);
    })

    req.on('end', function () {
        let user = JSON.parse(body);

        if(validateUser(user)) {
            // if user exists check
            if (!isUserOnline(user.name)) {
                users[user.name] = user;

                res.writeHead(200, headers);
                res.end(`{"message": "connected", "identity": "${user.name}", "users": ${JSON.stringify(toArray(users))}}`);
            } else {
                res.writeHead(500, headers);
                res.end('{"error": 500, "message": "cet utilisateur existe déjà dans le registre"}');
            }
        } else {
            res.writeHead(500, headers);
            res.end('{"error": 500, "message": "la requête de login est invalide"}');
        }
    });
}

function deleteRegistryUser(res, path) {
    if(users[path] !== undefined) {
        delete users[path];
        res.writeHead(200, headers);
        res.end(`{"users": ${JSON.stringify(users)}, "message": "successfully logged out"}`);
    } else {
        res.writeHead(404, headers);
        res.end('{"status":"404", "message": "user is not connected"}');
    }
}

// helpers
function validateUser(data) {
    return 'name' in data && 'host' in data && 'port' in data;
}

function isUserOnline(user) {
    return user in users;
}

function toArray(obj) {
    return Object.keys(obj).map((k) => obj[k])
}

// ping func
function ping() {
    Object.keys(users).forEach(user => {
        const ping = http.get(`http://${users[user].host}:${users[user].port}/ping`, (res) => {
            const { statusCode } = res;

            if(statusCode !== 200) {
                console.log(`User ${user} died, deleting from registry...`)
                delete users[user];
            }
            console.log(`User ${user} ponged back.`);
        });

        ping.on('error', function (e) {
            console.log(`User ${user} died, deleting from registry...`)
            delete users[user];
        });
    });
}

// ping every 30sec
const pingInterval = setInterval(() => {
    ping();
}, 60000);

// starter
const registry = http.createServer(handleRegistry);
registry.listen(port);
console.log(`Registry server running on port ${port}`);