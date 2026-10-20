'use strict';
const { app, BrowserWindow, shell, session } = require('electron');
const path = require('path');
const fs = require('fs');

const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'app-config.json'), 'utf8'));

app.setName(cfg.productName);
// Ogni app ha la sua cartella dati: MARTINELLI e AUTONOMI SPETTACOLO non si mescolano mai.
app.setPath('userData', path.join(app.getPath('appData'), cfg.dir));

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

let win = null;

function create() {
  win = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: cfg.productName,
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#fbfbf8',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });
  win.loadFile(path.join(__dirname, 'www', 'index.html'));

  // I collegamenti esterni si aprono nel browser, mai dentro l'app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (ev, url) => {
    if (!url.startsWith('file:')) {
      ev.preventDefault();
      if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    }
  });
  win.on('closed', () => { win = null; });
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.whenReady().then(() => {
  // Nessun permesso speciale (fotocamera, posizione, ecc.) serve a queste app.
  session.defaultSession.setPermissionRequestHandler((wc, permission, cb) => cb(false));
  create();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) create();
  });
});

app.on('window-all-closed', () => app.quit());
