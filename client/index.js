const express = require('express')
const settings = require('./settings.json')
const app = express()
app.listen(settings.port)
const fs = require('fs')
const bodyParser = require("body-parser")
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
const {exec} = require('child_process')
var robot = require("@jitsi/robotjs");
var keypress = require('keypress');
const {kubitdb} = require('kubitdb')
const db = new kubitdb("settings")
const tdb = new Map()
keypress(process.stdin);

app.post('/screenupload/', function (req, res) {
if(req.body.ps != settings.password) return;
try{fs.unlink("utils/screan.png")}catch{}
fs.writeFileSync("utils/screan.png", Buffer.from(req.body.png), "binary",function(err) {if(err) {}});
})

exec("utils/remote.html")
app.get('/kubitdbonlineall/'+settings.password, function (req, res) {res.json(db.hepsi())})
app.post('/kubitdbonline', function (req, res) {
if (parola === settings.password) {
if(req.body.yapilcak === "set"){db.ayarla(req.body.deger1,req.body.deger2)}
if(req.body.yapilcak === "add"){db.ekle(req.body.deger1,req.body.deger2)}
if(req.body.yapilcak === "delete"){db.sil(req.body.deger1)}
if(req.body.yapilcak === "subtract"){db.cıkar(req.body.deger1,req.body.deger2)}
if(req.body.yapilcak === "push"){db.it(req.body.deger1,req.body.deger2)}
if(req.body.yapilcak === "clear"){db.temizle()}  
res.end()
}})

db.delete("keypress")
db.delete("mouse")
process.stdin.on('keypress', function (ch, key) {
var ms ="n"
if(key.shift && key.ctrl) ms = "d"
if(key.shift && key.name === "w" || key.shift && key.ctrl && key.name === "q"){//up
    if(key.shift && key.meta) ms = "cw"
db.set("mouse",{v:ms,x:robot.getMousePos().x,y:robot.getMousePos().y-settings.mouse})
} else if (key.shift && key.name === "d"){//=>
if(key.shift && key.meta) ms = "cd"
    db.set("mouse",{v:ms,x:robot.getMousePos().x+settings.mouse,y:robot.getMousePos().y})
} else if (key.shift && key.name === "a"){//<=
    if(key.shift && key.meta) ms = "ca"
    db.set("mouse",{v:ms,x:robot.getMousePos().x-settings.mouse,y:robot.getMousePos().y})
} else if (key.shift && key.name === "s"){//down
    if(key.shift && key.meta) ms = "cs"
    db.set("mouse",{v:ms,x:robot.getMousePos().x,y:robot.getMousePos().y+settings.mouse})
} else {
    db.push("keypress",key.name)
}
setTimeout(()=>{
db.delete("mouse")
db.delete("keypress")
},settings.ping)
}); 
process.stdin.setRawMode(true);
process.stdin.resume();