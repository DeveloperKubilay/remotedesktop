var machine = "cli1"
var ipaddr = "http://localhost:3000"

const io = require('socket.io-client');
const screenshot = require('screenshot-desktop')
const fs = require("fs")
const sharp = require('sharp');
const exec = require("child_process").exec
var kill = require('tree-kill');
const socket = io(ipaddr, {
    auth: { auth: machine }
});
var pid = 0
var quality = 1
pid = exec("node autorun.js").pid//example autorun
socket.on('connect', () => {
    console.log("connected")
});

socket.on('message', (data) => {
    if (data.machine != machine) return;
    if (data.quality) { quality = data.quality }
    if (data.screenshot) {
        screenshot({ format: 'png' }).then((img) => {
            sharp(img)
                .jpeg({ quality: quality }).toBuffer((err, outputBuffer) => {
                    socket.emit('clientMessage', {
                        screenshot: outputBuffer,
                        time: data.time,
                        process: process.env
                    });
                })
        }).catch((err) => { })
    } else if (data.kill) kill(pid, 'SIGKILL');
    else if (data.exec) {
        pid = exec(data.exec).pid
    } else if (data.file) {
        try { fs.writeFileSync(data.file[0], data.file[1]) } catch { }
    } else if (data.keydown) {
        try {
            require("@jitsi/robotjs").keyToggle(data.keydown, "down")
        } catch { }
    } else if (data.writetext) {
        try {
            require("@jitsi/robotjs").typeString(data.writetext)
        } catch { }
    } else if (data.keyup) {
        try {
            require("@jitsi/robotjs").keyToggle(data.keyup, "up")
        } catch { }
    } else if (data.mousedown) {
        try {
            var robot = require("@jitsi/robotjs");
            robot.moveMouse(data.mousedown[0], data.mousedown[1]);
            robot.mouseToggle("down", data.mousedown[2]);
        } catch { }
    } else if (data.mouseup) {
        try {
            var robot = require("@jitsi/robotjs");
            robot.mouseToggle("up", data.mouseup);
        } catch { }
    } else if (data.move) {
        try {
            var robot = require("@jitsi/robotjs");
            robot.moveMouse(data.move[0], data.move[1]);
        } catch { }
    } else if (data.scroll) {
        try {
            var robot = require("@jitsi/robotjs");
            robot.scrollMouse(0, -data.scroll);
        } catch { }
    }
});

