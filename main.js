const { app, BrowserWindow } = require('electron'); // Ensure Electron is properly imported
const path = require('path');

// Function to create the main window
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        alwaysOnTop: true, // Optional: Keep the window on top of others
        frame: false, // Optional: Remove the window frame
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Optional: If no preload script, remove this line
            nodeIntegration: true, // Allows Node.js in your HTML
            contextIsolation: false, // Allows the use of require in renderer processes
        },
    });

    mainWindow.loadFile('index.html'); // Load your HTML file
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
