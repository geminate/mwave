<!-- Created By liuhuihao 2018/6/6 14:39  -->
<template>
    <div>
        <!--{{musicList}}-->
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

</style>