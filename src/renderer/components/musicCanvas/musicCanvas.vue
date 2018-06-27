<!-- Created By liuhuihao 2018/6/1 19:36  -->
<!-- 播放器Canvas组件 -->
<template>
    <canvas ref="canvas" id="canvas" width="600" height="600"></canvas>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';

    export default {
        name: 'musicCanvas',
        computed: {
            ...mapState([
                'analyser'
            ])
        },
        methods: {
            /**
             * 创建 canvas 上下文
             */
            createCtx() {
                const canvas = this.$refs.canvas;
                const ctx = canvas.getContext('2d');
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(72, 226, 251, 0.8)';
                ctx.fillStyle = "rgba(72, 226, 251, 0.8)";
                return ctx;
            },

            /**
             * Canvas 动画
             */
            animateCanvas(ctx) {
                ctx.clearRect(0, 0, 600, 600);
                this.analyser.fftSize = 1024;
                const arrayLength = this.analyser.frequencyBinCount;
                const array = new Uint8Array(arrayLength);
                ctx.beginPath();
                this.analyser.getByteFrequencyData(array);
                for (let i = 0; i < 512; i++) {
                    this.drawOuter(array, i, ctx);
                    this.drawInner(array, i, ctx);
                }
                ctx.stroke();
                ctx.fill();
                requestAnimationFrame(() => {
                    this.animateCanvas(ctx);
                });
            },

            /**
             * 绘制内圈 point
             */
            drawInner(array, i, ctx) {
                if (i < 136) {
                    var point = i % 9 > 4 ? (9 - i % 9) : (i % 9);
                    var value = (array[i]) * 120 / 256 * ((5 - point) / 5);
                    if (value > 70) {
                        value = ((value - 70) * 120 / 50);
                    } else {
                        value = 0;
                    }
                    ctx.moveTo(( Math.sin(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300), Math.cos(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300);
                    ctx.arc(( Math.sin(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300), Math.cos(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300, 0.6, 0, 2 * Math.PI);

                    ctx.moveTo((-Math.sin(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300), Math.cos(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300);
                    ctx.arc(( -Math.sin(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300), Math.cos(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300, 0.6, 0, 2 * Math.PI);
                }
            },

            /**
             * 绘制外圈 bar
             */
            drawOuter(array, i, ctx) {
                if (i > 130 && i < 271) {
                    var value = (array[i]) * 120 / 256;
                    if (value > 20) {
                        value = (value - 20) * 120 / 100;
                    } else {
                        value = 0;
                    }
                    ctx.moveTo(( Math.sin((i * 4 / 3) / 180 * Math.PI) * 200 + 300), Math.cos((i * 4 / 3) / 180 * Math.PI) * 200 + 300);
                    ctx.lineTo(( Math.sin((i * 4 / 3) / 180 * Math.PI) * (200 + value) + 300), Math.cos((i * 4 / 3) / 180 * Math.PI) * (200 + value) + 300);

                    ctx.moveTo(( -Math.sin((i * 4 / 3) / 180 * Math.PI) * 200 + 300), Math.cos((i * 4 / 3) / 180 * Math.PI) * 200 + 300);
                    ctx.lineTo(( -Math.sin((i * 4 / 3) / 180 * Math.PI) * (200 + value) + 300), Math.cos((i * 4 / 3) / 180 * Math.PI) * (200 + value) + 300);

                }
            }

        },
        mounted() {
            const ctx = this.createCtx();
            requestAnimationFrame(() => {
                this.animateCanvas(ctx);
            });
        }
    }
</script>

<style lang="less" scoped>
    canvas {
        position: absolute;
        left: 0px;
        top: 0px;
        pointer-events: none;
        user-select: none;
        z-index: -1;
    }
</style>