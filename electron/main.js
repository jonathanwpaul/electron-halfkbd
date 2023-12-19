const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  globalShortcut,
} = require("electron");
const { channels } = require("../src/shared/constants.js");
const { uIOhook, UiohookKey } = require("uiohook-napi");
const robot = require("robotjs");

//const electronReload = require("electron-reload");

// electronReload(__dirname, {
//   electron: path.join(process.cwd(), "node_modules", ".bin", "electron.cmd"),
//   hardResetMethod: "exit",
// });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window = null;
let pressedKeys = new Set();
let lastTime;

function readable(event) {
  return (
    (event.ctrlKey ? "Ctrl " : "") +
    (event.shiftKey ? "Shift " : "") +
    (event.altKey ? "Alt " : "") +
    (event.metaKey ? "Meta " : "") +
    Object.keys(UiohookKey).filter(
      (val, i) => Object.values(UiohookKey)[i] === event.keycode
    )[0]
  );
}

// uIOhook.on('input', (e) => console.log(pressedKeys))
uIOhook.on("keydown", (e) => {
  pressedKeys.add(readable(e));
  // if (e.ctrlKey && e.shiftKey && e.keycode === UiohookKey.Space) {
  //   pressedKeys.forEach((key) => uIOhook.keyToggle(key.keycode, 'up'))
  //   pressedKeys.forEach((key) => uIOhook.keyToggle(key.keycode, 'down'))
  // }

  

  console.log(pressedKeys);
});

uIOhook.on("keyup", (e) => {
  pressedKeys.delete(readable(e));
  const inputKey = UiohookKey.Alt
  
  if (lastTime && e.keycode === inputKey && e.time - lastTime < 500) {
    console.log('double pressed shorcut')
    robot.typeString('test')
  } else if (e.keycode === inputKey) {
    lastTime = e.time
  }
});

function createWindow() {
  const startURL = process.env.ELECTRON_START_URL;
  // Create the browser window.
  window = new BrowserWindow({
    x: 0,
    y: 0,
    width: 200,
    maxWidth: 200,
    height: 300,
    maxHeight: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: true,
    alwaysOnTop: true,
  });

  // window.on('show', (e) => {
  //   window.setAlwaysOnTop(true)
  //   window.setAlwaysOnTop(false)
  // })

  // Load the index.html of the app.
  window.loadURL(startURL);
}

app.on("ready", () => {
  createWindow();
  uIOhook.start();
  // globalShortcut.register("CommandOrControl+Shift+Space", () => {
  //   console.log("before typing, ", pressedKeys);
  //   robot.typeString("test")
  //   console.log("finished typing, ", pressedKeys)
  
  // });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on(channels.GET_DATA, (event, arg) => {
  const { product } = arg;
  console.log(product);
});
