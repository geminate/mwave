import {app, Menu, Tray, BrowserWindow, dialog, ipcMain} from 'electron';
import store from './store';
import http from 'http';
import path from 'path';
import ms from 'mediaserver';
import fs from 'fs';
import IPC from '../IPC.js';
import electron from 'electron';
import jsmediatags from 'jsmediatags';
import async from 'async';

let tray = null;

if (process.env.NODE_ENV !== 'development') {
    global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

/**
 * 创建主窗口
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


function startMusicServer() {
    const server = http.createServer(pipeMusic).listen(8580);
    return server;
}

function pipeMusic(req, res) {
    if (store.get("MUSIC_PATHS") == undefined || store.get("MUSIC_PATHS").length <= 0) {
        return notFound(res);
    }
    const musicUrl = decodeURIComponent(req.url);
    const fileUrl = path.join(store.get("MUSIC_PATHS")[0], musicUrl.substring(1));
    if (musicUrl.substring(1) == '' || !fs.existsSync(fileUrl)) {
        return notFound(res);
    }
    ms.pipe(req, res, fileUrl);
}

function notFound(res) {
    res.writeHead(200);
    res.end('not found');
}

// 创建任务栏右侧托盘图标
function createTray() {
    let iconPath = path.join(__static, 'icons/256x256.png');
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
 * 选定文件夹按钮点击
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
 * 获取音乐列表
 * @param filePaths
 * @returns {Array}
 */
function getMusicList(filePaths) {
    const fileArray = [];
    filePaths.forEach((filePath) => {
        const fileNames = fs.readdirSync(filePath);
        fileNames.forEach((fileName, index) => {
            let fullPath = path.join(filePath, fileName);
            let stats = fs.statSync(fullPath);
            if (stats.isFile() && path.extname(fullPath) == '.mp3') {
                getTags(fullPath).then((tags) => {
                    fileArray.push(fileArray)
                });
            }
        });
    });
    return fileArray;
}

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
 * 发送音乐列表
 * @param musicPaths 音乐路径地址
 */
function sendMusicList(musicPaths) {
    if (mainWindow) {
        store.set("MUSIC_PATHS", musicPaths);
        musicPaths.forEach((filePath) => {
            let fileNames = fs.readdirSync(filePath);
            fileNames = fileNames.filter((fileName) => {
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
        });
    }
}

/**
 * 应用启动
 */
app.on('ready', () => {
    createTray();
    startMusicServer();
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
 * 应用关闭
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

/**
 * 应用被激活(Mac)
 */
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});