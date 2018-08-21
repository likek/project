(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/config.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cf7e7Hjl8pBApNKVzaPXR0c', 'config', __filename);
// scripts/config.js

"use strict";

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
    var newAry = numAry.slice(0, numAry.length);
    newAry.sort(this.sortNumber);
    var isEqual = false;
    questionAry.forEach(function (obj, idx) {
        var count = 0;
        for (var i = 0; i < obj.length; i++) {
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

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=config.js.map
        