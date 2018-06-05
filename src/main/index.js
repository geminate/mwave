import {app, BrowserWindow} from 'electron';
import http from 'http';
import ms from 'mediaserver';

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
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
    startMusicServer();// 开启音乐服务器
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
    ms.pipe(req, res, "C:\\Users\\liuhuihao\\Music\\恋爱循环.mp3");
}

/**
 * 应用启动
 */
app.on('ready', createWindow);

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