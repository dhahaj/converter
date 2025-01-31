const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 450,
        alwaysOnTop: true, // Initially enabled
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false,
            sandbox: true,
        },
        darkTheme: true,
        title: 'Converter',
    });

    mainWindow.loadFile('index.html');

    // Build an application menu (optional, as you already have an HTML toggle)
    const menuTemplate = [
        {
            label: 'Options',
            submenu: [
                {
                    label: 'Always on Top',
                    type: 'checkbox',
                    checked: mainWindow.isAlwaysOnTop(),
                    click: (menuItem) => {
                        mainWindow.setAlwaysOnTop(menuItem.checked);
                    },
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    ipcMain.on('close-window', () => {
        if (mainWindow) mainWindow.close();
    });

    // Listen for always on top setting from the HTML toggle
    ipcMain.on('set-always-on-top', (event, value) => {
        if (mainWindow) {
            mainWindow.setAlwaysOnTop(value);
        }
    });
}

app.on('ready', createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
