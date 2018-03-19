const http = require('http');       // HTTP actions
const port = require('../config').port;
const app = require('./server.js');

const PORT = 9876;

const server = http.createServer((request, response) => {
    request.on('error', err => {

    }).on('data', chunk => {

    }).on('end', () => {
        response.on('error', err => {
            error(err);
        });
        app.serve(request, response);
    })
}).listen(port);