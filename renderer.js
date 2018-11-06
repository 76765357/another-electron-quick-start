// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require("electron")

var data = ipcRenderer.sendSync('get-file-data')

if (data ===  null) {
    console.log("There is no file")
} else {
    // Do something with the file.
    console.log(data)
}
