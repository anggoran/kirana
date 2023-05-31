import { ChildProcess } from "child_process";
import { flaskConnect } from "./flask-connector";
import { app, BrowserWindow } from "electron";
import { join } from "path";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;
let PYTHON_CHILD_PROCESS: ChildProcess | null;

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  if (app.isPackaged) {
    PYTHON_CHILD_PROCESS = flaskConnect(app.getPath("exe"));
  }

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  if (!app.isPackaged) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  return PYTHON_CHILD_PROCESS;
};

app.on("ready", createWindow);

app.on("before-quit", async function () {
  if (app.isPackaged) {
    PYTHON_CHILD_PROCESS?.kill();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
