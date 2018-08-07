"use strict";
cc._RF.push(module, 'afcf96cYgpP45hqtNCxA5Jy', 'numSpineJs');
// components/script/numSpineJs.js

"use strict";

// // 类型 0为骨骼 1为纹理
// let numType = cc.Enum({
//     SPINE   : 0,
//     SPRITE   : 1,

// });
//骨骼状态
var spineWidth = 150;
var miWidth = 10;

var stateArray = ["stand", //常态 站立
"grasp", //拖拽状态
"happy", //开心
"happy_coterie", //开心定制
"sad", // 悲哀
"jump", // 跳跃
"original_number" // 数字形态
];
cc.Class({
    extends: cc.Component,

    properties: {
        // 数字骨骼预制
        spine0: cc.Prefab,
        spine1: cc.Prefab,
        spine2: cc.Prefab,
        spine3: cc.Prefab,
        spine4: cc.Prefab,
        spine5: cc.Prefab,
        spine6: cc.Prefab,
        spine7: cc.Prefab,
        spine8: cc.Prefab,
        spine9: cc.Prefab
    },
    // stand 用于记录骨骼状态， type 用于记录类型， 显示骨骼还是精灵
    onLoad: function onLoad() {
        //状态
        this.stand = null;
        this.number = null;
    },
    // num  type string  传入数字
    init: function init(num) {
        num = num.toString();
        this.number = num;
        if (typeof num == "string") {
            for (var i = 0; i < num.length; i++) {
                var number = num.charAt(i);
                var spinePre = cc.instantiate(this["spine" + number]);
                this.node.addChild(spinePre);
                spinePre.position = cc.p(-num.length / 2 * (spineWidth + miWidth) + i * (spineWidth + miWidth) + miWidth / 2 + spineWidth / 2, 0);
                this["spine" + number + i] = spinePre.getComponent("sp.Skeleton");
                this["spineEyel" + number + i] = this["spine" + number + i].findBone("eye_l");
                this["spineEyer" + number + i] = this["spine" + number + i].findBone("eye_r");
                this["_Eyelx" + number + i] = this["spineEyel" + number + i].x;
                this["_Eyely" + number + i] = this["spineEyer" + number + i].y;
            }
        }
        this.setStand(0);
    },
    // 设置状态动画  支持字符串 和下标  例子 setStand(1) setStand("happy")
    setStand: function setStand(state) {
        var numState = null;
        if (typeof state == "string") {
            for (var index = 0; index < stateArray.length; index++) {
                if (stateArray[index] == state) {
                    numState = state;
                    break;
                }
            }
        } else if (typeof state == "number") {
            numState = stateArray[state];
        } else {
            return;
        }
        if (numState && numState != this.stand) {
            this.stand = numState;
            for (var i = 0; i < this.number.length; i++) {
                var number = this.number.charAt(i);
                this["spineEyel" + number + i].x = this["_Eyelx" + number + i];
                this["spineEyel" + number + i].y = this["_Eyely" + number + i];
                this["spineEyer" + number + i].x = this["_Eyelx" + number + i];
                this["spineEyer" + number + i].y = this["_Eyely" + number + i];
                this["spine" + number + i].setAnimation(0, numState, true);
            }
        }
        // this.node.children.forEach((obj, idx)=> {
        //     obj.getChildByName('yinying').active = this.stand !== "grasp" && this.stand !== "original_number"
        // },this);

        // this.yySp.active = this.stand !== "grasp" && this.stand !== "original_number"
    },
    //是否显示阴影
    showYinying: function showYinying(isShow) {

        this.node.children.forEach(function (obj, idx) {
            obj.getChildByName('yinying') && (obj.getChildByName('yinying').active = isShow);
        }, this);
    },

    getStand: function getStand() {
        return this.stand || "";
    },

    getNumber: function getNumber() {
        return this.number || "";
    },

    //获取父类 世界坐标
    getEyseParent: function getEyseParent() {
        return this.node.convertToWorldSpaceAR(cc.p(0, 0));
    },
    // 获取偏移位置点
    getEyseRotatePos: function getEyseRotatePos(pos, Epos) {
        var shootVector = cc.p(pos.x - Epos.x, pos.y - Epos.y);
        // //向量标准化(即向量长度为1)  
        var normalizedVector = cc.pNormalize(shootVector);

        var distance = cc.pDistance(Epos, cc.p(pos.x, pos.y));
        var scale = Math.min(2 * (distance / 70), 10);
        var tpos = cc.pAdd(cc.p(0, 0), cc.pMult(normalizedVector, scale));
        return tpos;
    },
    // 眼睛跟随手指位置
    setEysePos: function setEysePos(pos) {
        // 不是站立状态不执行
        if (this.stand !== "stand") {
            return;
        }
        var lpos = this.getEyseRotatePos(pos, this.getEyseParent());
        for (var i = 0; i < this.number.length; i++) {
            var number = this.number.charAt(i);
            if (this["spineEyel" + number + i] && this["spineEyer" + number + i]) {
                this["spineEyel" + number + i].x = -lpos.y + this["_Eyelx" + number + i];
                this["spineEyel" + number + i].y = lpos.x + this["_Eyely" + number + i];
                this["spineEyer" + number + i].x = -lpos.y + this["_Eyelx" + number + i];
                this["spineEyer" + number + i].y = lpos.x + this["_Eyely" + number + i];
            }
        }
    },
    resetEyePos: function resetEyePos() {
        for (var i = 0; i < this.number.length; i++) {
            var number = this.number.charAt(i);
            if (this["spineEyel" + number + i] && this["spineEyer" + number + i]) {
                this["spineEyel" + number + i].x = this["_Eyelx" + number + i];
                this["spineEyel" + number + i].y = this["_Eyely" + number + i];
                this["spineEyer" + number + i].x = this["_Eyelx" + number + i];
                this["spineEyer" + number + i].y = this["_Eyely" + number + i];
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
});

cc._RF.pop();