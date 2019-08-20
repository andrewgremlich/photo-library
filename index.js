const { app, BrowserWindow, dialog } = require('electron');

const debug = /--debug/.test(process.argv[2]);

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: true
        }
    });

    if (debug) {
        mainWindow.webContents.openDevTools();
        // mainWindow.maximize();
    }

    mainWindow.loadFile('./app/index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());

app.on('activate', () => mainWindow === null && createWindow());
