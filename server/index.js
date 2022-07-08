var url = "http://localhost:80"
var password = "hi"
var ping = 1000
var sping= 100
var scrollmouse = 100

const fetch = require('axios')
var robot = require("@jitsi/robotjs");
const screenshot = require('screenshot-desktop')
setInterval(() =>{
screenshot({format: 'png'}).then((img) => {fetch.post(url+"/screenupload/",{png:img,ps:password}).catch((err) => {})}).catch((err) => {})
},sping)

const kubitdbonline = require('kubitdbonline')
const db = new kubitdbonline(url,password)
setInterval(()=>{db.al().then(kubitdb=>{
if(kubitdb["mouse"]) {
console.log(kubitdb["mouse"])
if(kubitdb["mouse"].v === "d") {robot.mouseToggle("down");} else {robot.mouseToggle("up")}
if (kubitdb["mouse"].v === "cd") robot.mouseClick("right")
if (kubitdb["mouse"].v === "ca") robot.mouseClick("left")
if (kubitdb["mouse"].v === "cw") robot.scrollMouse(0,scrollmouse);
if (kubitdb["mouse"].v === "cs") robot.scrollMouse(0, -scrollmouse);
try{robot.moveMouse(kubitdb["mouse"].x, kubitdb["mouse"].y)}catch{}
}
if(kubitdb["keypress"]) {kubitdb["keypress"].map((x)=>{
 robot.keyTap(x);
})}
})},ping)