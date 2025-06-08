var password = "a1"

const screenshot = require('screenshot-desktop')
const fs = require("fs")
const sharp = require('sharp');
const exec = require("child_process").exec
var kill = require('tree-kill');
const ck = require("@jitsi/robotjs")
var resulation = {}
var pid = 0
var quality = 1
pid = exec("node autorun.js").pid//example autorun

const express = require("express")
const http = require('http');
const socketIo = require('socket.io');
const app = express()
const path = require('path');
const server = http.createServer(app);
const io = socketIo(server, { maxHttpBufferSize: 4 * 1024 * 1024, });
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./website.html"))
})
server.listen(3000, () => console.log("Running"));




io.on('connection', (socket) => {
    if (socket.handshake.auth.auth != password) return socket.disconnect(true);
    socket.on("adminmessage", function (data) {

        if (data.screenshot) {
            screenshot({ format: 'png' }).then((img) => {
                sharp(img)
                    .resize(resulation.x, resulation.y) // Yeni genişlik ve yükseklik değerlerini buraya girin
                    .webp({ quality: quality }).toBuffer((err, outputBuffer) => {
                        let sizeInBytes = outputBuffer.length / (1024);
                        socket.emit('adminmessagec', {
                            screenshot: outputBuffer,
                            time: data.time,
                            kb: sizeInBytes.toFixed(0)
                        });
                    })
            }).catch((err) => { })
        }
        else if (data.quality) { quality = data.quality }
        else if (data.kill) kill(pid, 'SIGKILL');
        else if (data.exec) {
            if (data.exec == "process") return socket.emit('adminmessagec', { process: process.env });
            pid = exec(data.exec).pid
        } else if (data.file) {
            try { fs.writeFileSync(data.file[0], data.file[1]) } catch { }
        } else if (data.keydown) {
            try {
                ck.keyToggle(data.keydown, "down")
            } catch { }
        } else if (data.writetext) {
            try {
                ck.typeString(data.writetext)
            } catch { }
        } else if (data.keyup) {
            try {
                ck.keyToggle(data.keyup, "up")
            } catch { }
        } else if (data.mousedown) {
            try {
                ck.moveMouse(data.mousedown[0], data.mousedown[1]);
                ck.mouseToggle("down", data.mousedown[2]);
            } catch { }
        } else if (data.mouseup) {
            try {
                ck.mouseToggle("up", data.mouseup);
            } catch { }
        } else if (data.move) {
            try {
                ck.moveMouse(data.move[0], data.move[1]);
            } catch { }
        } else if (data.scroll) {
            try {
                ck.scrollMouse(0, -data.scroll);
            } catch { }
        } else if (data.ready) {
            exec("cmd /c wmic path Win32_VideoController get VideoModeDescription", (error, stdout, stderr) => {
                console.log("WMIC output:", stdout); // Debug output
                
                // Default resolution in case parsing fails
                let width = 1920;
                let height = 1080;
                
                try {
                    // Split by lines and find the first line that contains 'x' (resolution format)
                    const lines = stdout.split('\n');
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (line && line.includes('x')) {
                            const parts = line.split('x');
                            if (parts.length >= 2) {
                                width = parseInt(parts[0].trim());
                                height = parseInt(parts[1].trim());
                                break;
                            }
                        }
                    }
                } catch (e) {
                    console.error("Error parsing resolution:", e);
                    // Fallback to default resolution
                }
                
                console.log(`Detected resolution: ${width}x${height}`);
                
                var data2 = {
                    height: height,
                    width: width
                }
                resulation.x = data.resulation.x
                resulation.y = Number((data.resulation.x / (data2.width / data2.height)).toFixed(0))
                data2.resulation = resulation

                socket.emit('adminmessagec', data2);
            })
        } else if (data.keypress) {
            ck.keyTap(data.keypress);
        }
    })
});



