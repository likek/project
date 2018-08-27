"use strict";
cc._RF.push(module, 'bffa6tUYERD1rOxZB4r27oO', 'ProgressJs');
// scripts/ProgressJs.js

"use strict";

//星星2种纹理
var showType = {
    "1": "rightSF",
    "2": "errSF",
    "3": "errSF"

};
var blockWidth = 82;
var miWidth = 20;

var speed = 1200;
cc.Class({
    extends: cc.Component,

    properties: {
        starPre: cc.Prefab,
        starPNode: cc.Node, //当前题目标记星星
        rightSF: cc.SpriteFrame,
        errSF: cc.SpriteFrame,
        initSF: cc.SpriteFrame,
        blueStar: cc.Node,
        flayNode: cc.Node, //飞行管理node
        rigthAction: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.starData = [];
        this.starFlagAction();
    },
    //题目总数
    init: function init(numCount) {
        for (var i = 0, starPre; i < numCount; i++) {
            starPre = cc.instantiate(this.starPre);
            starPre.parent = this.node;
            starPre.position = cc.p(-numCount / 2 * (blockWidth + miWidth) + i * (blockWidth + miWidth) + miWidth / 2 + blockWidth / 2, 710);
            if (!this.starData) {
                this.starData = [];
            }
            this.starData.push(starPre);
        }
        var startPos = this.getStarPosByIndex(0);
        this.showStarFlag(startPos);
    },
    //设置星星状态  index 题号 ，type 1 对 2 错  isMoveFalg 是否移动标记星
    setStarTypeByIndex: function setStarTypeByIndex(index, type) {
        this.hideStarFlag();
        type = type.toString();
        this.scheduleOnce(function () {
            if (this.starData[index]) {
                this.starData[index].getComponent(cc.Sprite).spriteFrame = this[showType[type]];
            }
            //正确的星星 错误星星出现动画
            if (type == "1") {
                this.starData[index].opacity = 0;
                this.starData[index].scaleX = 0.4;
                this.starData[index].scaleY = 0.4;
                this.rigthAction.position = this.starData[index].position;
                this.rigthAction.active = true;
                this.rigthAction.getComponent(cc.Animation).play();
                var callFunc = cc.callFunc(function (target) {
                    this.rigthAction.active = false;
                }, this);
                this.starData[index].runAction(cc.sequence(cc.spawn(cc.scaleTo(0.33, 1.2), cc.fadeTo(0.33, 255)), cc.scaleTo(0.16, 1), callFunc));
            } else {
                this.starData[index].opacity = 0;
                this.starData[index].scaleX = 2;
                this.starData[index].scaleY = 2;
                this.starData[index].runAction(cc.sequence(cc.spawn(cc.scaleTo(0.33, 0.9), cc.fadeTo(0.33, 255)), cc.scaleTo(0.16, 1)));
            }
            if (index + 1 < this.starData.length) {
                this.scheduleOnce(function () {
                    var startPos = this.getStarPosByIndex(index + 1);
                    this.showStarFlag(startPos);
                }, 0.55);
            }
        }, 0.34);
    },
    //返回星星的坐标
    getStarPosByIndex: function getStarPosByIndex(index) {
        if (this.starData[index]) {
            return this.starData[index].position;
        }
    },
    //显示标记星星
    showStarFlag: function showStarFlag(pos) {
        this.starPNode.position = pos;
        this.starPNode.runAction(cc.spawn(cc.scaleTo(0.33, 1), cc.rotateTo(0.33, 0)));
    },
    //隐藏标记星
    hideStarFlag: function hideStarFlag() {
        this.starPNode.runAction(cc.spawn(cc.scaleTo(0.33, 0), cc.rotateTo(0.33, -90)));
    },
    //标记星星 闪光动画
    starFlagAction: function starFlagAction() {
        this.starPNode.zIndex = 100;
        var actionNode = this.starPNode.getChildByName("starAction");
        actionNode.runAction(cc.repeatForever(cc.sequence(cc.spawn(cc.scaleTo(1, 1.5), cc.fadeTo(1, 255)), cc.spawn(cc.scaleTo(1, 1), cc.fadeTo(1, 200)))));
    },
    //设置飞星动画 startPos 星星起始位置  flagIndex 题目题号 callback 附加方法    type 1 是对 2是错 
    //callback 可不传  object  调用方法的对象
    playFlayStar: function playFlayStar(startPos, flagIndex, type, callback, object) {
        this.flayNode.position = startPos;
        this.flayNode.active = true;
        var pos = this.getStarPosByIndex(flagIndex);
        var callFunc = cc.callFunc(function (target) {
            var lizi = this.flayNode.getChildByName("particlesystem").getComponent(cc.ParticleSystem);
            lizi.resetSystem();
            this.flayNode.active = false;
            this.setStarTypeByIndex(flagIndex, type);
            if (callback) {
                callback.call(object);
            }
        }, this);
        var distance = cc.pDistance(pos, startPos);
        var time = Math.min(distance / speed, 1.5);
        this.flayNode.runAction(cc.sequence(cc.moveTo(time, pos), callFunc));
        this.blueStar.runAction(cc.rotateTo(time, 1440));
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();