import http from 'http';
import fs from 'fs';
import path from 'path';
import ms from 'mediaserver';

import store from './store';

/**
 * Music server class
 */
class MusicServer {

    start() {
        const server = http.createServer((req, res) => {
            this.pipeMusic(req, res);
        }).listen(8580);
        return server;
    }

    pipeMusic(req, res) {
        if (store.get("MUSIC_PATHS") == undefined || store.get("MUSIC_PATHS").length <= 0) {
            return this.notFound(res);
        }
        const musicUrl = decodeURIComponent(req.url);
        const fileUrl = path.join(store.get("MUSIC_PATHS")[0], musicUrl.substring(1));
        if (musicUrl.substring(1) == '' || !fs.existsSync(fileUrl)) {
            return this.notFound(res);
        }
        ms.pipe(req, res, fileUrl);
    }

    notFound(res) {
        res.writeHead(200);
        res.end('not found');
    }
}

export default MusicServer;