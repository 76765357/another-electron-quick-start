const electron = require('electron')
const ipcMain = require('electron').ipcMain
const {Menu} = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let openFilePath = false

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  createMenu() 
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('will-finish-launching', function() {
    app.on('open-file', function(ev, path) {
        openFilePath  = path
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// read the file and send data to the render process
ipcMain.on('get-file-data', function(event) {
  if (process.platform == 'win32' && process.argv.length >= 2) {
    openFilePath = process.argv[1]
  }
  event.returnValue = openFilePath
})

//创建主菜单菜单
function createMenu() {
  const template = [
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          selector: 'undo:'
        },
        {
          label: '重做',
          accelerator: 'Shift+CmdOrCtrl+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: '剪切',
          accelerator: 'CmdOrCtrl+X',
          selector: 'cut:'
        },
        {
          label: '拷贝',
          accelerator: 'CmdOrCtrl+C',
          selector: 'copy:'
        },
        {
          label: '粘贴',
          accelerator: 'CmdOrCtrl+V',
          selector: 'paste:'
        },
        {
          label: '全选',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        }
      ]
    },
    {
      label: '帮助',
      role: 'help',
      submenu: [
        {
          label: '开发者工具',
          accelerator: 'CmdOrCtrl+Shift+I',
          click() {
            mainWindow.webContents.openDevTools()
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: '退出',
          role: 'quit'
        }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
