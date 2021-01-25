const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 5555;

app.get('/', (req, res) => {
 res.status(200).send(`Hello World! Our IOT Device HTTP server is running on port ${port}`);
});

server.listen(port, () => {
 console.log(`Server running at port ${port}`);
});