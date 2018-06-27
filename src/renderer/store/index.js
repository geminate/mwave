import Vue from 'vue';
import Vuex from 'vuex';

import {parseTime} from '@/utils';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        duration: 0, // 当前歌曲总长度秒数
        currentTime: 0, // 当前歌曲播放秒数
        currentPoint: 0,// 当前歌曲进度条百分比 0-1
        playStatus: false, // 当前歌曲播放状态 false-暂停 true-播放中
        analyser: null, // 当前歌曲分析器
        musicList: [], // 音乐播放列表
        musicIndex: 0 // 当前播放序号
    },
    getters: {

        // 当前歌曲总长度秒数格式化： xx:xx
        durationFormat(state) {
            return parseTime(state.duration);
        },

        // 当前歌曲播放秒数格式化：xx:xx
        currentTimeFormat(state) {
            return parseTime(state.currentTime);
        },

        // 当前歌曲播放秒数占总长度百分比：0-100
        currentTimePercent(state) {
            return state.currentTime / state.duration * 100;
        },

        // 播放列表是否为空
        musicListIsEmpty(state) {
            return state.musicList.length <= 0;
        },

        // 当前歌曲文件名
        currentMusicFileName(state, getters) {
            if (getters.musicListIsEmpty) {
                return "";
            } else {
                return state.musicList[state.musicIndex].fileName;
            }
        },

        // 当前歌曲标题名
        currentMusicTitle(state, getters) {
            if (getters.musicListIsEmpty) {
                return "无文件";
            } else {
                return state.musicList[state.musicIndex].title;
            }
        }
    },
    mutations: {

        // 设置当前歌曲总长度秒数
        setDuration(state, duration) {
            state.duration = duration;
        },

        // 设置当前歌曲播放秒数
        setCurrentTime(state, currentTime) {
            state.currentTime = currentTime;
        },

        // 设置歌曲进度条百分比
        setCurrentPoint(state, currentPoint) {
            state.currentPoint = currentPoint;
        },

        // 设置当前歌曲播放状态
        setPlayStatus(state, playStatus) {
            state.playStatus = playStatus;
        },

        // 设置当前歌曲分析器
        setAnalyser(state, analyser) {
            state.analyser = analyser;
        },

        // 设置音乐播放列表
        setMusicList(state, musicList) {
            state.musicList = musicList;
        },

        // 设置当前播放序号
        setMusicIndex(state, musicIndex) {
            state.musicIndex = musicIndex;
        },

        // 播放上一首歌曲
        playBackward(state) {
            if (state.musicIndex == 0) {
                state.musicIndex = state.musicList.length - 1;
            } else {
                state.musicIndex--;
            }
        },

        // 播放下一首歌曲
        playForward(state) {
            if (state.musicIndex == state.musicList.length - 1) {
                state.musicIndex = 0;
            } else {
                state.musicIndex++;
            }
        },

        // 切换 播放、暂停状态
        togglePlayState(state) {
            state.playStatus = !state.playStatus;
        },
    },
});
