// requires
const http = require('http');

// general vars
let users = {};

// server handler
let handleRegistry = async function (req, res) {
    let path = req.url.split('?')[0].replace('/', '');

    if(path === "registry" && req.method === "GET") {
        sendRegistryUsers(res);
    } else if (req.method === "GET") {
        sendRegistryUser(path, res);
    }

    if (path === "registry" && req.method === "POST") {
        storeRegistryUser(res, req);
    }

    if (req.method === "DELETE") {
        deleteRegistryUser(res, path);
    }
}

// functions
function sendRegistryUsers(res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(users));
}

function sendRegistryUser(path, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(users[path]));
}

function storeRegistryUser(res, req) {
    let body = '';

    req.on('data', function(data){
        body += data.toString();
    });

    req.on('end', function() {
        let parsedRequest = JSON.parse(body);

        // if user exists check
        if(users[parsedRequest['name']] === undefined) {
            users[parsedRequest['name']] = parsedRequest;
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(users));
        } else {
            res.send('{status: "404", message: "user exists"}');
        }
    });
}

function deleteRegistryUser(res, path) {
    if(users[path] !== undefined) {
        delete users[path];
        res.end(JSON.stringify(users));
    } else {
        res.end('{status:"404"}');
    }
}

// starter
const registry = http.createServer(handleRegistry);
registry.listen(8690);
console.log("Registry server running on port 8690");