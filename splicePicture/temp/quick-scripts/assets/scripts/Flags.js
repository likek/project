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
        var _this = this;

        if (!this.checkInitData(data)) return;
        var len = data.length / 2;
        for (var i = 0; i < data.length; i++) {
            (function (i) {
                var option = cc.instantiate(_this.option);
                var imgNode = option.getChildByName("button_bg");
                var item = data[i];
                var parent = i <= len - 1 ? _this.flagL : _this.flagR;
                var sizeY = parent.height * 0.8; //放图片所需要的位置长度
                var offset = sizeY / len;
                cc.loader.load(item.optioncontimg, function (err, res) {
                    if (!err) {
                        var spriteFrame = new cc.SpriteFrame(res);
                        imgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        imgNode.getComponent("OptionJS").init(gameJS, item);
                        cc.loader.releaseAsset(res);
                        parent.addChild(option);
                        option.x = 0;
                        option.y = offset * (i % 3) + offset / 2 - sizeY / 2;
                        console.log(option.y);
                    }
                });
            })(i);
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
        