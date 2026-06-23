const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Evento",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // In development, point the Desktop app to the Vite local server
  // In production, you would point it to the built files or the Cloudflare URL
  win.loadURL('http://localhost:5173')
  
  // Or load the local built files if the server is offline:
  // win.loadFile(path.join(__dirname, 'dist', 'index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
