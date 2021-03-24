const express = require('express');
const app = express();
const http = require('http');
const si = require("systeminformation")

const server = http.createServer(app);
const port = 8089;

app.get('/device/cpu', (req, res) => {
 si.cpu().then(data => res.status(200).send(data));
});

app.get('/device/mem', (req,res) => {
 si.mem().then(data => res.status(200).send(data));
})

app.get('/device/os', (req,res) => {
 si.osInfo().then(data => res.status(200).send(data));
})

server.listen(port, () => {
 console.log(`Server running at port ${port}`);
});