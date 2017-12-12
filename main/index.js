const dotenv = require('dotenv');

// load configuration
dotenv.config();

// Native
const { format } = require('url');

// Packages
const { BrowserWindow, app, Menu } = require('electron');
const isDev = require('electron-is-dev');
const prepareNext = require('electron-next');
const { resolve } = require('app-root-path');

global.mainWindow = null;

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');

  global.mainWindow = new BrowserWindow({
    width: 1024,
    height: 768
  });

  global.mainWindow.on('closed', () => {
    global.mainWindow = null;
  });

  const devPath = 'http://localhost:8000/start';

  const prodPath = format({
    pathname: resolve('renderer/out/start/index.html'),
    protocol: 'file:',
    slashes: true
  });

  const url = isDev ? devPath : prodPath;
  global.mainWindow.loadURL(url);


  // Create the Application's main menu
  const template = [{
    label: 'Application',
    submenu: [
      { label: 'Quit', accelerator: 'Command+Q', click() { app.quit(); } }
    ]
  }, {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() {
          global.mainWindow.loadURL(format({
            pathname: resolve('renderer/out/about/about.html'),
            protocol: 'file:',
            slashes: true
          }));
        }
      }
    ]
  }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);
