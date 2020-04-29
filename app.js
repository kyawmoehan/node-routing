const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const filepath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filepath);
    let contentType = 'text/html';
    switch(extname) {
        case '.js': 
            contentType = 'text/javascript';
            break;
        case '.css': 
            contentType = 'text/css';
            break;
        case '.json': 
            contentType = 'application/json';
            break;
        case '.png': 
            contentType = 'image/png';
            break;
        case '.jpg': 
            contentType = 'image/jpg';
            break;
    }
    fs.readFile(filepath, (err, content) => {
        if(err) {
            if(err.code === 'ENOENT') {
                // file not found
                fs.readFile(path.join(__dirname, 'public/pages/404.html'), (err, content) => {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(content);
                });
            } else {
                // Some server error
                res.writeHead(500);
                res.end(`Server error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log(`Server running on port: ${PORT}`);
    }
});