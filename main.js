const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1620,
    height: 900,
    minWidth: 800, // Minimum width
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      nodeIntegrationInSubFrames: true,
      webSecurity: false, // Enable cross-origin iframe
    },
    frame: true, // Keep the frame for native title bar
    transparent: true, // Enable window transparency
    backgroundColor: "#00000000", // Transparent background
    titleBarStyle: "hidden", // Changed to hidden to implement our own title bar
  });

  mainWindow.loadFile("index.html");

  // Open DevTools for debugging (optional - you can remove this in production)
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  // Enable webview by default
  app.on("web-contents-created", (e, contents) => {
    if (contents.getType() === "webview") {
      // Enable navigation on webview
      contents.on("new-window", (e, url) => {
        e.preventDefault();
        contents.loadURL(url);
      });
    }
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
