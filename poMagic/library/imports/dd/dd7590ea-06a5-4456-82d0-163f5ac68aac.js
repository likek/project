"use strict";
cc._RF.push(module, 'dd759DqBqVEVoLQFj9axoqs', 'settlement');
// components/settlement/settlement.js

'use strict';

var DB_ANIM_ASSET = {
    'win': 'happy',
    'lose': 'tear'
};

cc.Class({
    extends: cc.Component,

    properties: {
        failSpine: cc.Node,
        successSpine: cc.Node,
        timeOutSpine: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.background = this.node.getChildByName('background');
        this.scale = this.node.getChildByName('scale');
    },

    //播放获胜动画
    playWinAnim: function playWinAnim(callback) {
        this.node.active = true;
        this.background.active = true;
        this.successSpine.active = true;
        this.successSpine.getComponent("sp.Skeleton").setAnimation(0, "animation", false);
        var that = this;
        this.scheduleOnce(function () {
            callback && callback.call(that.game);
        }, 2.5);
    },

    //播放失败动画
    playLoseAnim: function playLoseAnim(callback) {

        this.node.active = true;
        this.background.active = true;
        this.failSpine.active = true;
        this.failSpine.getComponent("sp.Skeleton").setAnimation(0, "animation", false);
        var that = this;

        this.scheduleOnce(function () {
            callback && callback.call(that.game);
        }, 2.5);
    },

    //播放失败动画
    playTimeUpAnim: function playTimeUpAnim(callback) {

        this.node.active = true;
        this.background.active = true;
        this.timeOutSpine.active = true;
        this.timeOutSpine.getComponent("sp.Skeleton").setAnimation(0, "animation", false);
        var that = this;

        this.scheduleOnce(function () {
            callback && callback.call(that.game);
        }, 1);
    },

    //重置
    reset: function reset() {
        this.background.active = false;
        this.failSpine.active = false;
        this.successSpine.active = false;
        this.timeOutSpine.active = false;
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