"use strict";
cc._RF.push(module, '49399pIZlFDJJbPpN1yTKBS', 'Flags');
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

        this.flagL.removeAllChildren();
        this.flagR.removeAllChildren();
        if (!this.checkInitData(data)) return;
        var len = data.length / 2;
        for (var i = 0; i < data.length; i++) {
            (function (i) {
                var option = cc.instantiate(_this.option);
                var imgNode = option.getChildByName("button_bg");
                var border = imgNode.getChildByName('border');
                border.opacity = 0;
                imgNode.setScale(0.7);
                var item = data[i];
                var parent = i < len ? _this.flagL : _this.flagR;
                parent.addChild(option);
                console.log(i < len ? "this.flagL" : "this.flagR");
                var sizeY = parent.height * 0.8; //放图片所需要的位置长度
                var offset = sizeY / len;
                cc.loader.load(item.optioncontimg, function (err, res) {
                    if (!err) {
                        var spriteFrame = new cc.SpriteFrame(res);
                        imgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        imgNode.getComponent("OptionJS").init(gameJS, item);
                        border.width = imgNode.width + 12;
                        border.height = imgNode.height + 12;
                        cc.loader.releaseAsset(res);
                        option.x = 0;
                        option.y = offset * (i % len) + offset / 2 - sizeY / 2;
                        imgNode.getComponent(cc.CircleCollider).radius = Math.min(imgNode.height, imgNode.width) * 0.248 * 1 / 0.7;
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