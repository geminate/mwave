/* Created By liuhuihao 2018/6/1 16:53  */
export const parseTime = (time) => {
    const source = parseInt(time);
    if (source) {
        let min = parseInt(source / 60);
        let sec = source % 60;
        if (min < 10) {
            min = "0" + min
        }
        if (sec < 10) {
            sec = "0" + sec
        }
        return min + ":" + sec;
    } else {
        return '00:00';
    }
};