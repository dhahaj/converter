const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

// Function to create the main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 450,
        alwaysOnTop: true, // Optional: Keep the window on top of others
        frame: false, // Optional: Remove the window frame
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Optional preload
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false,
            sandbox: true,
        },
    });

    mainWindow.loadFile('index.html'); // Load your HTML file

    ipcMain.on('close-window', () => {
        if (mainWindow) {
            mainWindow.close();
        }
    });
}

// Ensure the app is ready before creating windows
app.on('ready', createWindow);

// Handle activation on macOS (reopens when clicking on the dock icon)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
