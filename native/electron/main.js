'use strict';

/**
 * Electron desktop shell for COSYtools.
 *
 * Loads the static bundle from `native/www` over a custom `app://` scheme rather
 * than `file://`, so the browser `fetch()` calls used by the reference engines
 * keep working (the Fetch spec rejects `file://` requests).
 */

const { app, BrowserWindow, dialog, protocol, net, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');

const SCHEME = 'app';

// Packaged: www sits beside main.js. Dev: the bundle is at native/www.
const WWW = [path.join(__dirname, 'www'), path.join(__dirname, '..', 'www')]
  .find((p) => fs.existsSync(p));

protocol.registerSchemesAsPrivileged([
  { scheme: SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } },
]);

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

function resolveRequest(requestUrl) {
  const parsed = new URL(requestUrl);
  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname === '/' || pathname === '') pathname = '/index.html';
  const target = path.normalize(path.join(WWW, pathname));
  if (!target.startsWith(WWW)) return null;
  return target;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 360,
    minHeight: 480,
    backgroundColor: '#fdf8f0',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.webContents.setWindowOpenHandler(({ url: target }) => {
    if (/^https?:\/\//i.test(target)) shell.openExternal(target);
    return { action: 'deny' };
  });

  win.loadURL(`${SCHEME}://cosytools/index.html`);
}

app.on('second-instance', () => {
  const [win] = BrowserWindow.getAllWindows();
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.whenReady().then(() => {
  if (!WWW) {
    dialog.showErrorBox('COSYtools', 'The web bundle is missing. Run `npm run app:build` first.');
    app.quit();
    return;
  }

  protocol.handle(SCHEME, (request) => {
    const target = resolveRequest(request.url);
    if (!target) return new Response('Not found', { status: 404 });
    return net.fetch(url.pathToFileURL(target).toString());
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
