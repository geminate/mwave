/* Created By liuhuihao 2018/6/6 15:33  */

const state = {
    musicList: [],
    musicIndex: 0
};

const getters = {

    musicListIsEmpty(state) {
        return state.musicList.length <= 0;
    },

    currentMusicFileName(state, getters) {
        if (getters.musicListIsEmpty) {
            return "";
        } else {
            return state.musicList[state.musicIndex].fileName;
        }
    },

    currentMusicTitle(state, getters) {
        if (getters.musicListIsEmpty) {
            return "无文件";
        } else {
            return state.musicList[state.musicIndex].title;
        }
    }
};

const mutations = {

    //设置播放列表
    setMusicList(state, musicList) {
        state.musicList = musicList;
    },

    //设置播放序号
    setMusicIndex(state, musicIndex) {
        state.musicIndex = musicIndex;
    },

    //上一首歌曲
    playBackward(state) {
        if (state.musicIndex == 0) {
            state.musicIndex = state.musicList.length - 1;
        } else {
            state.musicIndex--;
        }
    },

    //下一首歌曲
    playForward(state) {
        if (state.musicIndex == state.musicList.length - 1) {
            state.musicIndex = 0;
        } else {
            state.musicIndex++;
        }
    }
};

const actions = {};

export default {
    state,
    getters,
    mutations,
    actions
}
