# Remote Desktop Control App 🖥️🔥

No cap, this app is straight fire for controlling computers remotely! Built with Node.js and Socket.io for that real-time connection vibes. ✨

## Features 💪

- 📸 Real-time screenshots
- ⌨️ Remote keyboard control
- 🖱️ Remote mouse control
- 📄 File transfers
- 🚀 Command execution
- 📱 Multiple machine support

## Installation 📲

### Prerequisites

- Node.js 14+ (don't use older versions)
- npm (comes with Node.js)

### Setup Steps

```bash
# Clone the repo (or download it)
git clone https://yourgitrepo.com/remotedesktop.git

# Go to the project folder
cd remotedesktop

# Install dependencies (server)
cd server
npm install

# Install dependencies (client)
cd ../client
npm install

# For the all-in-one version
cd ../Allinside
npm install
```

## How to Use 🤔

### Server Mode

```bash
cd server
node index.js
```
Server runs on port 3000 by default. Access at `http://localhost:3000`

### Client Mode

Edit the client config in `client/index.js`:
```javascript
var machine = "your-machine-name"  // Change this to identify your machine
var ipaddr = "http://server-ip:3000"  // Change to your server address
```

Then run:
```bash
cd client
node index.js
```

### All-In-One Mode

The all-in-one version combines both server and client:
```bash
cd Allinside
node index.js
```

Default password is "a1" - change it in the code for security!

## Configuration Options ⚙️

- Change screenshot quality (1-100)
- Adjust resolution settings
- Custom command execution

## Security Note ⚠️

No cap, this tool is powerful - use responsibly! Change the default password in Allinside/index.js:
```javascript
var password = "your_secure_password"
```

## Sources 📚

Built using:
- [Socket.IO](https://socket.io/) - For real-time communication
- [Express](https://expressjs.com/) - For web server
- [screenshot-desktop](https://www.npmjs.com/package/screenshot-desktop) - For screen capture
- [robotjs](https://www.npmjs.com/package/robotjs) - For keyboard/mouse control

---

## Made with ❤️ by DeveloperKubilay