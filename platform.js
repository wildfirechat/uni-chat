// 平台相关代码，目前主要用来处理electron 和 浏览器之间不同

import wfc from './wfc/client/wfc'

export function isElectron() {
    return false;
}

export function connect(userId, token) {
    wfc.connect(userId, token);
}

// pc
export const remote = null;
export const ipcRenderer = null;
export const ipcMain = null;
export const fs = null;
export const currentWindow = null;
export const BrowserWindow = null;
export const AppPath = null;
export const desktopCapturer = null;

// for web
// export const PostMessageEventEmitter = require('./windowEmitter');
