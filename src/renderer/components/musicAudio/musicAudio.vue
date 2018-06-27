<!-- Created By liuhuihao 2018/6/1 19:20  -->
<!-- 播放器音频核心组件 -->
<template>
    <audio ref="audio" controls preload :src="path" crossOrigin="anonymous"></audio>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import electron from 'electron';
    import IPC from '#/IPC.js';

    export default {
        name: 'musicAudio',
        computed: {
            ...mapState([
                'playStatus', 'currentTime', 'duration', 'currentPoint', 'musicList', 'musicIndex'
            ]),
            ...mapGetters([
                'currentMusicFileName'
            ]),
            path() {
                return "http://localhost:8580/" + this.currentMusicFileName;
            }
        },
        watch: {

            /**
             * 监听播放、暂停状态改变
             * -----------------------
             * 将 store 中 playStatus 的变化映射到 audio
             */
            playStatus(newVal, oldVal) {
                newVal ? this.$refs.audio.play() : this.$refs.audio.pause();
            },

            /**
             * 监听当前播放时间改变
             * -----------------------
             * 当播放至最后一秒时跳转到下一首
             */
            currentTime(newVal, oldVal) {
                if ((oldVal >= this.duration || newVal >= this.duration) && this.playStatus) {
                    this.playForward();
                }
            },

            /**
             * 监听进度条百分比改变
             * -----------------------
             * 将 store 中 currentPoint 的变化映射到 audio
             */
            currentPoint(newVal, oldVal) {
                this.$refs.audio.currentTime = newVal * this.duration;
            }
        },
        methods: {
            ...mapMutations(['setDuration', 'setCurrentTime', 'setCurrentPoint', 'setAnalyser', 'setMusicList', 'setMusicIndex', 'setPlayStatus', 'playForward']),

            /**
             * 创建音乐分析器
             */
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

            /**
             * 监听主进程修改播放列表事件
             * -----------------------
             * 设置播放列表、将播放序号置为0、设置进度条百分比为0、设置播放状态为暂停
             * 如果播放列表为空则设置播放时长为0
             */
            electron.ipcRenderer.on(IPC.SET_MUSIC_LIST, (event, musicList) => {
                this.setMusicList(musicList);
                this.setMusicIndex(0);
                this.setCurrentPoint(0);
                this.setPlayStatus(false);
                if (!musicList || musicList.length <= 0) {
                    this.setDuration(0);
                }
            });

            /**
             * 监听audio加载音乐完成事件
             * -----------------------
             * 设置当前音乐总时长
             * 如果当前处于播放状态则开始播放否则暂停
             */
            this.$refs.audio.addEventListener("loadedmetadata", () => {
                this.setDuration(this.$refs.audio.duration);
                if (this.playStatus) {
                    this.$refs.audio.play();
                } else {
                    this.$refs.audio.pause();
                }
            });

            /**
             * 监听 audio 当前播放时间改变事件
             * -----------------------
             * 修改 store 中的播放时间
             */
            this.$refs.audio.addEventListener("timeupdate", () => {
                this.setCurrentTime(this.$refs.audio.currentTime);
            });

            /**
             *  设置音乐分析器
             */
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