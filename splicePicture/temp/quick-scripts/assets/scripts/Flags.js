(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Flags.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '49399pIZlFDJJbPpN1yTKBS', 'Flags', __filename);
// scripts/Flags.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        flagL: cc.Node, //左边旗子
        flagR: cc.Node,
        option: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},


    // update (dt) {},

    initData: function initData(data, gameJS) {
        this.flagL.removeAllChildren();
        this.flagR.removeAllChildren();
        if (!this.checkInitData(data)) return;
        var len = data.length / 2;
        for (var i = 0; i < data.length; i++) {
            var option = cc.instantiate(this.option);
            var imgNode = option.getChildByName("button_bg");
            var border = imgNode.getChildByName('border');
            border.opacity = 0;
            imgNode.setScale(0.7);
            var item = data[i];
            var parent = i < len ? this.flagL : this.flagR;
            parent.addChild(option);
            var sizeY = parent.height * 0.8; //放图片所需要的位置长度
            var offset = sizeY / len;
            imgNode.getComponent(cc.Sprite).spriteFrame = gameJS.getSpriteFrame(item.optioncontimg);
            imgNode.getComponent("OptionJS").init(gameJS, item);
            imgNode.tag = 100 + i;
            border.width = imgNode.width + 12;
            border.height = imgNode.height + 12;
            option.x = 0;
            option.y = offset * (i % len) + offset / 2 - sizeY / 2;
            imgNode.getComponent(cc.CircleCollider).radius = Math.min(imgNode.height, imgNode.width) * 0.248 * 1 / 0.7;
            var rotateDirection = Math.random() < 0.5 ? 1 : -1;
            var rotateDegree = Math.random() * 20 * rotateDirection;
            imgNode.setRotation(rotateDegree);
        }
    },
    checkInitData: function checkInitData(initData) {
        return Array.isArray(initData);
    }
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
        //# sourceMappingURL=Flags.js.map
        