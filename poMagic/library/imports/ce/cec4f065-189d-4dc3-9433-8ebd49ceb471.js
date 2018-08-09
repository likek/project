"use strict";
cc._RF.push(module, 'cec4fBlGJ1Nw5Qzjr1JzrRx', 'OptionJS1');
// components/Options/OptionJS1.js

'use strict';

var scDuration = 0.2;

cc.Class({
    extends: cc.Component,

    properties: {
        parent_node: cc.Node,
        canMove: false
    },
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touch_start.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touch_end.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touch_cancel.bind(this), this.node);
        this.audioPool = [];
        var self = this;
        //等同于切后台监听
    },

    init: function init(gameJS) {
        this.node.opacity = 255;
        this.startx = this.node.x;
        this.starty = this.node.y;
        this.gameJS = gameJS;
    },
    touch_start: function touch_start(evt) {
        this.canMove = true; //this.gameJS.changeMoveTag(this.node.tag);
        if (!this.canMove) {
            return;
        }
        this.pos = null;
    },
    touch_end: function touch_end(evt) {
        if (!this.canMove) {
            return;
        }
        this.reloadState();
    },
    update: function update(dt) {
        var _this = this;

        //this.canMove &&
        if (this.pos) {
            // cc.log('this.pos1='+this.pos);
            this.gameJS.option_node.children.forEach(function (obj, idx) {
                var button = obj.getChildByName('button_bg');
                button && button.getComponent('numSpineJs').setEysePos(_this.pos);
            }, this);
        }
    },

    touch_move: function touch_move(evt) {
        if (!this.canMove) {
            return;
        }
        var delta = evt.touch.getDelta();
        //出屏还原
        var touches = evt.getTouches();
        var parentNode = this.node.parent;
        var judgePos = parentNode.convertTouchToNodeSpaceAR(touches[0]);
        this.pos = evt.getLocation(); //以0,0为起点的坐标
    },
    touch_cancel: function touch_cancel(evt) {
        if (!this.canMove) {
            return;
        }
        this.reloadState();
    },
    reloadState: function reloadState() {
        this.canMove = false; //防止超屏多次触发
        // this.gameJS.changeMoveTag(0);
        this.pos = null;
        this.gameJS.option_node.children.forEach(function (obj, idx) {
            var button = obj.getChildByName('button_bg');
            button && button.getComponent('numSpineJs').resetEyePos();
        }, this);
    }

});

cc._RF.pop();