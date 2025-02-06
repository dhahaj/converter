const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

let mainWindow;
let store;

async function createWindow() {
    // Dynamically import electron-store
    const { default: Store } = await import('electron-store');
    store = new Store();

    const alwaysOnTopSetting = store.get('alwaysOnTop', true);
    mainWindow = new BrowserWindow({
        width: 800,
        height: 450,
        alwaysOnTop: alwaysOnTopSetting,
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

    const menuTemplate = [
        {
            label: 'Options',
            submenu: [
                {
                    label: 'Always on Top',
                    type: 'checkbox',
                    checked: alwaysOnTopSetting,
                    click: (menuItem) => {
                        mainWindow.setAlwaysOnTop(menuItem.checked);
                        store.set('alwaysOnTop', menuItem.checked);
                    },
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // show dev tools
    // mainWindow.webContents.openDevTools();

    ipcMain.on('close-window', () => {
        if (mainWindow) mainWindow.close();
    });

    ipcMain.on('set-always-on-top', (event, value) => {
        if (mainWindow) {
            mainWindow.setAlwaysOnTop(value);
            store.set('alwaysOnTop', value);
        }
    });

    ipcMain.handle('get-always-on-top', () => {
        return mainWindow ? mainWindow.isAlwaysOnTop() : true;
    });
}

app.whenReady().then(createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
