const http = require('http');

let users = {};

let handleServer = async function (req, res) {
    let path = req.url.split('?')[0].replace('/', '');

    if(!path || path === "/") {
        res.end('{status:"404"}');
    } else {
        if(path === "registry" && req.method === "GET") {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(users));
        }

        if (path === "registry" && req.method === "POST") {
            let body = '';

            req.on('data', function(data){
                body += data.toString();
            });

            req.on('end', function() {

                let parsedRequest = JSON.parse(body);
                users[parsedRequest['name']] = parsedRequest;

                res.end(JSON.stringify(users));
            });

            // if(!users[path]) {
            //     users[path] = [];
            // }
            //
            // users[path].push(Buffer.concat(buffers).toString());
            // pushToServer(req.url, Buffer.concat(buffers).toString());
            // res.end('{status: 200}');
        }
    }
}

function pushToServer(path, data) {
    const options = {
        hostname: 'localhost',
        port: 8690,
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

const server1 = http.createServer(handleServer);
const server2 = http.createServer(handleServer);

server1.listen(8690);
console.log("Registry server running on port 8690");
