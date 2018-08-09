(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/components/settlement/settlement.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dd759DqBqVEVoLQFj9axoqs', 'settlement', __filename);
// components/settlement/settlement.js

'use strict';

var DB_ANIM_ASSET = {
    'win': 'happy',
    'lose': 'sad'
};

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this.background = this.node.getChildByName('background');
        this.scale = this.node.getChildByName('scale');
        this.glow = this.scale.getChildByName('glow');
        this.glowDots = this.scale.getChildByName('glow_dots');
        this.title = this.scale.getChildByName('title');
        this.cutes = this.scale.getChildByName('cutes');
    },

    //播放获胜动画
    playWinAnim: function playWinAnim(callback) {
        this.node.active = true;
        var that = this;
        cc.loader.loadRes('win', cc.SpriteFrame, function (err, assets) {
            if (err) {
                that.log(err);
            } else {
                that.title.getComponent(cc.Sprite).spriteFrame = assets;
            }
        });
        this.playDBAnim(DB_ANIM_ASSET['win']);

        var anim = this.node.getComponent(cc.Animation);

        this.scheduleOnce(function () {
            callback.call(that.game);
        }, 1.5);

        anim.play('win');
    },

    //播放失败动画
    playLoseAnim: function playLoseAnim(callback) {
        this.node.active = true;
        var that = this;
        cc.loader.loadRes('lose', cc.SpriteFrame, function (err, assets) {
            if (err) {
                that.log(err);
            } else {
                that.title.getComponent(cc.Sprite).spriteFrame = assets;
            }
        });
        this.playDBAnim(DB_ANIM_ASSET['lose']);

        var anim = this.node.getComponent(cc.Animation);

        this.scheduleOnce(function () {
            callback.call(that.game);
        }, 1.5);

        anim.play('lose');
    },

    //播放失败动画
    playTimeUpAnim: function playTimeUpAnim(callback) {
        this.node.active = true;
        var that = this;
        cc.loader.loadRes('time_up', cc.SpriteFrame, function (err, assets) {
            if (err) {
                that.log(err);
            } else {
                that.title.getComponent(cc.Sprite).spriteFrame = assets;
            }
        });
        this.playDBAnim(DB_ANIM_ASSET['lose']);

        var anim = this.node.getComponent(cc.Animation);

        this.scheduleOnce(function () {
            callback.call(that.game);
        }, 1.5);

        anim.play('lose');
    },

    playDBAnim: function playDBAnim(name) {
        var children = this.cutes.children;
        for (var i = 0; i < children.length; i++) {
            children[i].getChildByName('cute').getComponent(dragonBones.ArmatureDisplay).playAnimation(name, -1);
        }
    },

    //重置
    reset: function reset() {
        this.background.opacity = 0;
        this.background.active = false;
        this.glow.scaleX = 0;
        this.glow.scaleY = 0;
        this.glow.opacity = 255;
        this.glowDots.active = false;
        this.title.getComponent(cc.Sprite).spriteFrame = null;
        var children = this.cutes.children;
        for (var i = 0, dba; i < children.length; i++) {
            dba = children[i].getChildByName('cute').getComponent(dragonBones.ArmatureDisplay);
            dba.animationName = null;
        }
        this.node.active = false;
    },

    log: function log(msg) {
        if (CONSOLE_LOG_OPEN) cc.log(msg);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
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
        //# sourceMappingURL=settlement.js.map
        