<!-- Created By liuhuihao 2018/5/23 11:54  -->
<template>
    <div class="main-page">

        <div class="music-name-container">
            <music-name></music-name>
        </div>

        <div class="music-progress-container">
            <music-progress></music-progress>
        </div>

        <div class="music-info-container">
            <music-info></music-info>
        </div>

        <div class="music-control-container">
            <music-control></music-control>
        </div>
        <music-audio></music-audio>
        <music-canvas></music-canvas>
        <music-list></music-list>
    </div>
</template>

<script>
    import {musicProgress, musicName, musicInfo, musicControl, musicAudio, musicCanvas, MusicList} from '@/components';

    export default {
        name: 'mainPage',
        components: {
            MusicList,
            musicProgress, musicName, musicInfo, musicControl, musicAudio, musicCanvas
        }
    }
</script>

<style lang="less" scoped>
    .main-page {
        width: 100vw;
        height: 100vh;
        /*background: gray;*/
        -webkit-app-region: drag;

        .music-name-container, .music-progress-container, .music-info-container, .music-control-container {
            position: absolute;
            left: 50%;
            transform: translate(-50%);
        }

        .music-name-container {
            top: 220px;
            width: 100%;
            text-align: center;
        }

        .music-progress-container {
            top: 290px;
        }

        .music-info-container {
            top: 316px;
        }

        .music-control-container {
            top: 356px;
        }
    }
</style>