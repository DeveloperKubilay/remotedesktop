const io = require('socket.io-client');
const screenshot = require('screenshot-desktop')
const fs = require("fs")
const exec = require("child_process").exec
var kill = require('tree-kill');
var machine = "cli1"
const socket = io('http://localhost:3000',{
    auth:{auth:machine}
});
var pid = 0
pid = exec("node autorun.js").pid//example autorun
socket.on('connect', () => {
console.log("connected")
});
  
  socket.on('message', (data) => {
    if(data.machine !=machine) return;
    if(data.screenshot){
        screenshot({format: 'png'}).then((img) => {
            socket.emit('clientMessage', {
                screenshot:img.toString("base64"),
                process:process.env
            });
        }).catch((err) => {})
    }else if(data.kill) kill(pid, 'SIGKILL');
    else if(data.exec){
        pid = exec(data.exec).pid
    }else if(data.file){
        fs.writeFileSync(data.file[0],data.file[1])
    }else if(data.keypress){
       try{
    require("@jitsi/robotjs").keyTap(data.keypress);
       }catch{}
    }else if(data.click){
        try{
         var robot = require("@jitsi/robotjs");
    robot.moveMouse(data.click[0],data.click[1]);
    robot.mouseClick(data.click[3]);
        }catch{}
    }else if(data.move){
        try{
         var robot = require("@jitsi/robotjs");
    robot.moveMouse(data.move[0],data.move[1]);
        }catch{}
    }else if(data.scroll){
        try{
         var robot = require("@jitsi/robotjs");
         robot.scrollMouse(0,-data.scroll);
        }catch{}
     }
  });
  
