//log日志开关
window.CONSOLE_LOG_OPEN = true;
window.AUDIO_OPEN = true;
window.REQUEST_URL = true;


//从小到大排序
function _sortNumber(a, b) {
    return a - b;
}
//比较当前数组和大数组的子数组里的每个元素,判断是否重复
function _checkIsEqual(numAry, questionAry) {
    let newAry = numAry.slice(0, numAry.length);
    newAry.sort(this.sortNumber);
    let isEqual = false;
    questionAry.forEach((obj, idx) => {
        let count = 0;
        for (let i = 0; i < obj.length; i++) {
            if (obj[i] != newAry[i]) {
                break;
            }
            count++;
        }
        if (count == newAry.length) {
            isEqual = true;
        }
    }, this);
    return isEqual;
}

//移除尾部汉字 5辆
function _trimLastChar(str) {
    var str1 = str.slice(0, -1);
    return str1;
}
