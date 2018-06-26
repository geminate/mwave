import {parseTime} from '@/utils';

const state = {
    duration: 0, // 总长度秒数
    currentTime: 0, // 当前播放秒数
    currentPoint: 0,// 进度条百分比
    playStatus: false, // 播放状态 false-暂停 true-播放中,
    analyser: null, // analyser
};

const getters = {

    // 总长度秒数
    duration(state) {
        return state.duration;
    },

    // 当前播放秒数
    currentTime(state) {
        return state.currentTime;
    },

    // 播放状态
    playStatus(state) {
        return state.playStatus;
    },

    // analyser
    analyser(state) {
        return state.analyser;
    },

    // 总播放长度 03：05格式
    durationFormat(state) {
        return parseTime(state.duration);
    },

    // 当前播放位置 03：05格式
    currentTimeFormat(state) {
        return parseTime(state.currentTime);
    },

    // 当前播放百分比数 0-100
    currentTimePercent(state) {
        return state.currentTime / state.duration * 100;
    },
};

const mutations = {

    // 设置歌曲的总长度
    setDuration(state, duration) {
        state.duration = duration;
    },

    // 设置Audio分析器
    setAnalyser(state, analyser) {
        state.analyser = analyser;
    },

    // 设置当前播放进度
    setCurrentTime(state, currentTime) {
        state.currentTime = currentTime;
    },

    // 设置歌曲播放进度 0-1
    setCurrentPoint(state, currentPoint) {
        state.currentPoint = currentPoint;
        // state.currentTime = state.duration * currentPoint;
    },

    setPlayStatus(state, playStatus) {
        state.playStatus = playStatus;
    },

    //切换 播放、暂停状态
    togglePlayState(state) {
        state.playStatus = !state.playStatus;
    },

};

const actions = {};

export default {
    state,
    getters,
    mutations,
    actions
}
