<!-- Created By liuhuihao 2018/5/25 10:05  -->
<!-- 播放进度条组件 -->
<template>
    <div ref="progress" class="music-progress" @click="changeProgress">
        <div class="progress"></div>
        <div class="progress-btn" :class="{active:playStatus}" :style="{left:currentTimePercent+'%'}"></div>
        <div @mousedown="mousedown"
             class="progress-btn-inner"
             :class="{active:playStatus}"
             :style="{left:currentTimePercent+'%'}">
        </div>

    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';

    export default {
        name: 'musicProgress',
        data() {
            return {
                dragFlag: false, // 当前是否正在拖动
                dragPlayFlag: false // 拖动开始的时候，是否处于播放状态
            }
        },
        computed: {
            ...mapState({
                playStatus: state => state.music.playStatus
            }),
            ...mapGetters(['currentTimePercent'])
        },
        watch: {},
        methods: {
            ...mapMutations(['setCurrentPoint', 'setIsDrag', 'setPlayStatus']),
            changeProgress(e) {
                const offset = e.pageX - this.$refs.progress.getBoundingClientRect().left;
                if (offset <= 0) {
                    this.setCurrentPoint(0);
                } else if (offset >= this.$refs.progress.offsetWidth) {
                    this.setCurrentPoint(1);
                } else {
                    this.setCurrentPoint(offset / this.$refs.progress.offsetWidth);
                }
            },
            mousedown() {
                this.dragFlag = true;
                this.dragPlayFlag = this.playStatus;
                this.setPlayStatus(false);
            }
        },
        mounted() {
            document.onmousemove = (e) => {
                e.preventDefault();
                if (this.dragFlag) {
                    const offset = e.clientX - this.$refs.progress.getBoundingClientRect().left;
                    if (offset <= 0) {
                        this.setCurrentPoint(0);
                    } else if (offset >= this.$refs.progress.offsetWidth) {
                        this.setCurrentPoint(1);
                    } else {
                        this.setCurrentPoint(offset / this.$refs.progress.offsetWidth);
                    }
                }
            };

            document.onmouseup = (e) => {
                if (this.dragFlag) {
                    this.setPlayStatus(this.dragPlayFlag);
                    this.dragFlag = false;
                }
            };
        }
    }
</script>

<style lang="less" scoped>
    .music-progress {
        position: relative;
        width: 400px;
        height: 24px;

        .progress {
            position: absolute;
            top: 50%;
            margin-top: -1px;
            height: 2px;
            width: 100%;
            background: rgba(255, 255, 255, 0.7);
            -webkit-app-region: no-drag;
        }

        .progress-btn {
            position: absolute;
            top: 0px;
            margin-left: -12px;
            transform-origin: 50% 50%;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.8);
            width: 24px;
            height: 24px;
            z-index: -1;
            animation: scaleBtn 0.6s ease-in infinite alternate;
            animation-play-state: paused;

            &.active {
                animation-play-state: running;
            }
        }

        .progress-btn-inner {
            position: absolute;
            top: 0px;
            margin-left: -12px;
            width: 24px;
            height: 24px;
            background-image: url("./img/btn.png");
            background-size: 100% 100%;
            cursor: pointer;
            z-index: 999;
            -webkit-app-region: no-drag;
            animation: rotateBtn 2s linear infinite;
            animation-play-state: paused;

            &.active {
                animation-play-state: running;
            }
        }

        @keyframes scaleBtn {
            from {
                transform: scale(1.2, 1.2);
            }
            to {
                transform: scale(2, 2);
            }
        }

        @keyframes rotateBtn {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

    }
</style>