<!-- Created By liuhuihao 2018/5/31 15:33  -->
<!-- 播放控制按钮组件 -->
<template>
    <div class="music-control">
        <template v-if="!musicListIsEmpty">
            <i class="fa fa-backward" @click="playBackward"></i>
            <i class="fa" :class="[{'fa-pause':playStatus},{'fa-play':!playStatus}]" @click="togglePlayState"></i>
            <i class="fa fa-forward" @click="playForward"></i>
        </template>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';

    export default {
        name: 'musicControl',
        computed: {
            ...mapState([
                'playStatus', 'musicList'
            ]),
            ...mapGetters([
                'musicListIsEmpty'
            ]),
        },
        methods: {
            ...mapMutations(['togglePlayState', 'playBackward', 'playForward']),
        }
    }
</script>

<style lang="less" scoped>
    .music-control {
        display: flex;
        justify-content: space-around;
        width: 190px;

        i {
            cursor: pointer;
            color: rgba(72, 226, 251, 0.8);
            -webkit-app-region: no-drag;
        }
    }
</style>