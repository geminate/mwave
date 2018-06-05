<!-- Created By liuhuihao 2018/5/30 14:38  -->
<!-- 播放器时间显示组件 -->
<template>
    <div class="music-info">
        {{durationFormat}} ' {{currentTimeFormat}}
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'musicInfo',
        computed: {
            ...mapGetters(['durationFormat', 'currentTimeFormat']),
        },
        methods: {}
    }
</script>

<style lang="less" scoped>
    .music-info {
        color: rgba(255, 192, 203, 0.8);
        font-size: 22px;
        letter-spacing: 1px;
        z-index: -1;
        pointer-events: none;
        user-select: none;
    }
</style>