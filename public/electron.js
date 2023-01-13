const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = null;
app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 1024,
    title: "Chat desktop app demo"
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  electron.systemPreferences.askForMediaAccess('microphone').then(access => {
    console.log('Microphone', { access })
  }).catch(err => {
    console.log('Error while getting microphone access', { err })
  })

  mainWindow.on('page-title-updated', function (e) {
    e.preventDefault()
  });
}