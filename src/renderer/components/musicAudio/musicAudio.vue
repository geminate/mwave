<!-- Created By liuhuihao 2018/6/1 19:20  -->
<!-- 播放器音频核心组件 -->
<template>
    <audio ref="audio" controls preload :src="src" crossOrigin="anonymous"></audio>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import electron from 'electron';
    import IPC from '#/IPC.js';

    export default {
        name: 'musicAudio',
        computed: {
            ...mapState({
                playStatus: state => state.music.playStatus,
                currentTime: state => state.music.currentTime,
                musicList: state => state.musicList.musicList,
                duration: state => state.music.duration,
                isDrag: state => state.music.isDrag,
                currentPoint: state => state.music.currentPoint
            }),
            ...mapGetters([
                'currentMusicFileName'
            ]),
            src() {
                return "http://localhost:8580/" + this.currentMusicFileName
            }
        },
        watch: {
            // 监听播放、暂停状态改变
            playStatus(newVal, oldVal) {
                if (this.currentTime >= this.duration && newVal) {
                    this.playForward();
                }
                newVal ? this.$refs.audio.play() : this.$refs.audio.pause();
            },
            // 监听当前播放时间改变
            currentTime(newVal, oldVal) {
                if (newVal >= this.duration && this.playStatus) {
                    this.playForward();
                }
            },
            currentPoint(newVal, oldVal) {
                this.$refs.audio.currentTime = newVal * this.duration;
            }
        },
        methods: {
            ...mapMutations(['setDuration', 'setCurrentTime', 'setCurrentPoint', 'setAnalyser', 'setMusicList', 'setMusicIndex', 'setPlayStatus', 'playForward']),
            createAnalyser() {
                const AC = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = AC.createAnalyser();
                const gainnode = AC.createGain();
                gainnode.gain.value = 1;
                const source = AC.createMediaElementSource(this.$refs.audio);
                source.connect(analyser);
                analyser.connect(gainnode);
                gainnode.connect(AC.destination);
                return analyser;
            },
        },
        mounted() {
            // 设置 播放列表
            electron.ipcRenderer.on(IPC.SET_MUSIC_LIST, (event, musicList) => {
                this.setMusicList(musicList);
                this.setMusicIndex(0);
                this.setCurrentPoint(0);
                this.setPlayStatus(false);
                if (!musicList || musicList.length <= 0) {
                    this.setDuration(0);
                }
            });

            // 设置 总时长
            this.$refs.audio.addEventListener("loadedmetadata", () => {
                this.setDuration(this.$refs.audio.duration);
                if (this.playStatus) {
                    this.$refs.audio.play();
                } else {
                    this.$refs.audio.pause();
                }
            });

            // 设置 播放时间
            this.$refs.audio.addEventListener("timeupdate", () => {
                this.setCurrentTime(this.$refs.audio.currentTime);
            });

            // 设置 Analyser
            this.setAnalyser(this.createAnalyser());
        }
    }
</script>

<style lang="less" scoped>
    audio {
        visibility: hidden;
        -webkit-app-region: no-drag;
    }
</style>