<!-- Created By liuhuihao 2018/6/6 14:39  -->
<template>
    <div>
        <audio controls preload src="http://localhost:8580/secret base.mp3" crossOrigin="anonymous"></audio>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';

    export default {
        name: 'musicList',
        computed: {
            ...mapState({
                musicList: state => state.musicList.musicList
            })
        },
    }
</script>

<style lang="less" scoped>
    audio {
        -webkit-app-region: no-drag;
    }
</style>