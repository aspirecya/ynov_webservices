const http = require('http');
const url = require("url");
const path = require("path");

let messages = {};

let handleRequest = async function (req,res) {
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
            res.end('{status: 200}');
        }
    }
}

const old_client = http.createServer(handleRequest);

old_client.listen(8690);
console.log("Server running");