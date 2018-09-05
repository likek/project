(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/components/efailed/efailed.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9b649czY5lPE5+Bb2VZOMm4', 'efailed', __filename);
// components/efailed/efailed.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label
    },

    onLoad: function onLoad() {},

    /*      
     * 调用方式:this.efailedJs.showHint();
     */
    //显示提示
    showHint: function showHint() {
        this.node.stopAllActions();
        this.node.opacity = 255;

        this.label.string = '当前分类已经有了哦！';

        var callFunc = cc.callFunc(function (target) {
            this.node.opacity = 0;
        }, this);

        this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.fadeTo(0.5, 0), callFunc));
    },

    //显示限制提示
    showLimitHint: function showLimitHint(num) {
        this.node.stopAllActions();
        this.node.opacity = 255;

        this.label.string = '啊哦！本题最多只能选择' + num + '个瓶子哦！';

        var callFunc = cc.callFunc(function (target) {
            this.node.opacity = 0;
        }, this);

        this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.fadeTo(0.5, 0), callFunc));
    },

    start: function start() {}
});

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
        //# sourceMappingURL=efailed.js.map
        