import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, './../public/favicon.ico'),
  });

  // Maximize the window BEFORE loading content (guarantees full screen)
  win.maximize();

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    
    // 🔥 SET THIS TO 'false' IF YOU DON'T WANT F12 TO OPEN AUTOMATICALLY
    const AUTO_OPEN_DEVTOOLS = false; // <-- CHANGE TO 'true' IF YOU NEED DEBUGGING
    
    if (AUTO_OPEN_DEVTOOLS) {
      win.webContents.openDevTools();
    }
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Now show the window (it will appear already maximized)
  win.show();
};

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});