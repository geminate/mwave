import {app, Menu, Tray, BrowserWindow, dialog, ipcMain} from 'electron';

import path from 'path';
import fs from 'fs';
import electron from 'electron';
import jsmediatags from 'jsmediatags';
import async from 'async';

import musicServer from './musicServer';
import store from './store';
import IPC from '../IPC.js';

let tray = null;

if (process.env.NODE_ENV !== 'development') {
    global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

/**
 * Create main window
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 600,
        titleBarStyle: 'hidden-inset',
        frame: false,
        transparent: true,
    });
    mainWindow.loadURL(winURL);
    mainWindow.on('closed', () => {
        mainWindow = null
    });
}

/**
 * Create Tray
 */
function createTray() {
    let iconPath = path.join(__static, 'icons/icon.png');
    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '选择文件夹', type: 'normal', click: onChooseFolderClick
        },
        {label: '退出', type: 'normal', role: 'quit'}
    ]);
    contextMenu.items[1].checked = false;
    tray.setContextMenu(contextMenu);
    tray.setToolTip("mwave");
}

/**
 * when choose folder btn click
 */
function onChooseFolderClick() {
    const musicPaths = dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (musicPaths != null && musicPaths != 'undefined') {
        sendMusicList(musicPaths);
    }
}

/**
 * Get music tags such as title adn artist
 * @param fullPath file path
 * @returns {Promise}
 */
function getTags(fullPath) {
    return new Promise((resolve, reject) => {
        new jsmediatags.Reader(fullPath).setTagsToRead(["title", "artist"]).read({
            onSuccess: ({tags}) => {
                resolve(tags);
            }
        });
    })
}

/**
 * Send music list
 * @param musicPaths music path
 */
function sendMusicList(musicPaths) {
    if (mainWindow) {
        store.set("MUSIC_PATHS", musicPaths);
        musicPaths.forEach((filePath) => {
            if (fs.existsSync(filePath)) {
                let fileNames = fs.readdirSync(filePath);
                fileNames = fileNames.filter((fileName) => { // we just need .mp3 files
                    let fullPath = path.join(filePath, fileName);
                    try {
                        let stats = fs.statSync(fullPath);
                        return stats.isFile() && path.extname(fullPath) == '.mp3';
                    } catch (e) {
                    }
                });

                if (fileNames.length <= 0) {
                    mainWindow.webContents.send(IPC.SET_MUSIC_LIST, []);
                } else {
                    async.map(fileNames, (fileName, callback) => {
                        let fullPath = path.join(filePath, fileName);
                        new jsmediatags.Reader(fullPath).setTagsToRead(["title", "artist"]).read({
                            onSuccess: ({tags}) => {
                                callback(null, {fileName, artist: tags.artist, title: tags.title});
                            }
                        });
                    }, (err, results) => {
                        mainWindow.webContents.send(IPC.SET_MUSIC_LIST, results);
                    });
                }
            } else {
                mainWindow.webContents.send(IPC.SET_MUSIC_LIST, []);
            }
        });
    }
}

/**
 * On ready
 * ----------------------
 * 1. create tray
 * 2. create window
 * 3. listen ,if vue is ready ,get the music path and set the music list
 */
app.on('ready', () => {
    createTray();
    new musicServer().start();
    createWindow();
    ipcMain.on(IPC.RENDER_READY, (event, arg) => {
        if (store.get("MUSIC_PATHS") == undefined || store.get("MUSIC_PATHS").length <= 0) {
            const dataPath = (electron.app || electron.remote.app).getPath('userData');
            sendMusicList([dataPath]);
        } else {
            sendMusicList(store.get("MUSIC_PATHS"))
        }
    });
});

/**
 * On close
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

/**
 * On active
 */
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});