const express = require("express")
const http = require('http');
const socketIo = require('socket.io');
const ejs = require("ejs")
var app = express()
const server = http.createServer(app);
const io = socketIo(server, {
    maxHttpBufferSize: 4 * 1024 * 1024,
});
var machines = []
app.set("view engine", "ejs")
app.set("views", "./")
app.get("/", function (req, res) {
    var html = ""
    machines.map((x) => { html += "<a href='/" + x + "'>" + x + "</a><br>" })
    res.send(html)
})
app.get("/:machine", function (req, res) {
    res.render("website.ejs", {
        machine: req.params.machine
    })
})



io.on('connection', (socket) => {
    if (socket.handshake.auth.auth == "a1") {
        socket.on('adminmessage', (data) => {
            io.emit('message', data)
        })
    } else {
        machines.push(socket.handshake.auth.auth)
        socket.on('clientMessage', (data) => {
            data.machine = socket.handshake.auth.auth
            io.emit('adminmessagec', data)
        });
        socket.on('disconnect', () => {
            machines = machines.filter(z => z != socket.handshake.auth.auth)
        })
    }
});


server.listen(3000);
console.log("Running")
