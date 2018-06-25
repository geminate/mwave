<!-- Created By liuhuihao 2018/5/25 10:38  -->
<!-- 播放器歌曲名称组件 -->
<template>
    <div class="music-name">
        {{currentMusicTitle}}
    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';

    export default {
        name: 'musicName',
        props: [],
        components: {},
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                'currentMusicTitle'
            ]),
        },
        watch: {},
        methods: {},
        mounted() {
        },
        updated() {
        },
        destroy() {
        }
    }
</script>

<style lang="less" scoped>
    .music-name {
        color: rgba(255, 255, 255, 0.8);
        font-size: 32px;
        letter-spacing: -1px;
        z-index: -1;
        pointer-events: none;
        user-select: none;
    }
</style>