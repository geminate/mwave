<!-- Created By liuhuihao 2018/6/1 19:20  -->
<!-- 播放器音频核心组件 -->
<template>
    <audio ref="audio" controls preload src="http://localhost:8580/" crossOrigin="anonymous"></audio>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';

    export default {
        name: 'musicAudio',
        computed: {
            ...mapState({
                playStatus: state => state.music.playStatus,
                currentTime: state => state.music.currentTime,
            }),
        },
        watch: {
            // 监听播放、暂停状态改变
            playStatus(newVal, oldVal) {
                newVal ? this.$refs.audio.play() : this.$refs.audio.pause();
            },
            // 监听当前播放时间改变
            currentTime(newVal, oldVal) {
                this.$refs.audio.currentTime = newVal;
            }
        },
        methods: {
            ...mapMutations(['setDuration', 'setCurrentTime', 'setAnalyser']),
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
            // 设置 总时长
            this.$refs.audio.addEventListener("loadedmetadata", () => {
                this.setDuration(this.$refs.audio.duration);
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
    }
</style>