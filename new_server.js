const http = require('http');

// server vars
let registryHostname = "localhost";
let registryPort = 8690;

// general vars
let messages = {};
let users = {};

let handleServer = async function (req, res) {
    let path = req.url.split('?')[0].replace('/', '');

    if(!path || path === "/") {
        res.end('{status:"404"}');
    } else {
        if (req.method === "GET") {
            res.writeHead(200, {'Content-Type': 'application/json'});
            if(!messages[path]) {
                res.end(JSON.stringify([]));
            } else {
                res.end(JSON.stringify(messages[path]));
                delete messages[path];
            }
        }

        if (req.method === "POST") {
            const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk);
            }

            if(!messages[path]) {
                messages[path] = [];
            }

            messages[path].push(Buffer.concat(buffers).toString());
            pushToServer(req.url, Buffer.concat(buffers).toString());
            res.end('{status: 200}');
        }
    }
}

function pushToServer(path, data) {
    const options = {
        hostname: 'localhost',
        port: 8691,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
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

    req.write(data);
    req.end();
}

function fetchUserRegistry() {
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
            console.log("request body", body);
            users = body;
        });

        response.on("error", function (e) {
            console.log(e);
            response.writeHead(500, {'Content-type': 'application/json'});
            response.end(e);
        });
    });

    req.end();
}

fetchUserRegistry();

const server1 = http.createServer(handleServer);
// const server2 = http.createServer(handleServer);

server1.listen(8691);
console.log("Server 1 running on port 8691");
console.log("📄 Connected users:", users);

// server2.listen(8692);
// console.log("Server 2 running on port 8692");
