const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require('path')

// modify your existing createWindow() function
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'src/images/icon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('src/index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('show-notification', (event, ...args) => {
  const notification = {
    title: 'New Task',
    body: `Added: ${args[0]}`
  }

  new Notification(notification).show()
});

/*
win.webContents.on('new-window', function (e, url) {
  e.preventDefault();
  require('electron').shell.openExternal(url);
});
*/