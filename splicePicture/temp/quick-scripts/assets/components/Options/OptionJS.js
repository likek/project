(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/components/Options/OptionJS.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ea4b5QR7YdFVKJuS8oyqW38', 'OptionJS', __filename);
// components/Options/OptionJS.js

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
        document.addEventListener('resignActivePauseGame', function () {
            self.resetState();
        });
    },

    onCollisionEnter: function onCollisionEnter(other, self) {
        this.isRight = other.node.__optionId === this.option.optionContent;
        this.sheepNode = other.node;
        console.log(other.node.__optionId + "   " + this.option.optionContent);
    },

    onCollisionExit: function onCollisionExit(other, self) {
        this.isRight = false;
        this.sheepNode = null;
    },

    init: function init(gameJS, option, optionLength) {
        this.node.opacity = 255;
        this.startx = this.node.x;
        this.starty = this.node.y;
        this.gameJS = gameJS;
        this.option = option; //选项（选项，选项答案）
        // this.optionNo = option.optionNo;
        // this.node.getComponent(cc.Sprite).spriteFrame = this.gameJS.getSpriteFrame(this.option.optioncontimg);
    },
    touch_start: function touch_start(evt) {
        var border = this.node.getChildByName('border');
        border.opacity = 255;
        this.canMove = this.gameJS.changeMoveTag(this.node.tag);
        if (!this.canMove || this.node.parent !== this.parent_node) {
            return;
        }
        this.gameJS.playOptionAudio();
        this.dragX = this.node.x;
        this.dragY = this.node.y;
        this.parent_node.zIndex = 1;
    },
    touch_end: function touch_end(evt) {
        var _this = this;

        var border = this.node.getChildByName('border');
        border.opacity = 0;
        if (!this.canMove || this.node.parent !== this.parent_node) {
            return;
        }
        this.gameJS.playOptionOutAudio();
        this.node.opacity = 255;
        var isRight = this.check();
        if (isRight) {
            console.log("right");
            this.optionClick();
        } else {
            console.log("wrong");
            if (!this.sheepNode || this.sheepNode.getChildByName("button_bg")) {
                this.reloadState();
            } else {
                var move1 = cc.moveBy(0.1, 28, -35);
                var move2 = cc.moveBy(0.1, -38, 4);
                var move3 = cc.moveBy(0.1, 24, 18);
                var move4 = cc.moveBy(0.1, -14, -10);
                this.node.runAction(cc.sequence(cc.delayTime(0.1), move1, move2, move3, move4, cc.delayTime(0.1), cc.callFunc(function () {
                    _this.reloadState();
                })));
            }
        }
    },
    touch_move: function touch_move(evt) {
        if (!this.canMove || this.node.parent !== this.parent_node) {
            return;
        }
        var delta = evt.touch.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;

        //出屏还原
        var touches = evt.getTouches();
        var parentNode = this.gameJS.scaleNode.parent;
        var judgePos = parentNode.convertTouchToNodeSpaceAR(touches[0]);
        if (Math.abs(judgePos.x) < parentNode.width / 2 - 50 && Math.abs(judgePos.y) < parentNode.height / 2 - 30) {
            //cc.log("触屏校验" + judgePos.x + "  " + judgePos.y);
        } else {
            if (CONSOLE_LOG_OPEN) cc.log('出屏了');
            this.reloadState();
        }
    },
    touch_cancel: function touch_cancel(evt) {
        var border = this.node.getChildByName('border');
        border.opacity = 0;
        if (!this.canMove || this.node.parent !== this.parent_node) {
            return;
        }
        this.reloadState();
    },

    check: function check() {
        return this.isRight;
    },

    /* 切换后台恢复位置 */
    resetState: function resetState() {
        //this.node.getComponent(cc.Button)._pressed = false;

    },
    reloadState: function reloadState() {
        this.canMove = false; //防止超屏多次触发
        //父类变换时还原父类使用
        if (this.exchangeParent) {
            var nodePosition = this.node.convertToWorldSpaceAR(cc.p(0, 0));
            this.node.parent = this.parent_node;
            var newPosition = this.node.parent.convertToNodeSpaceAR(nodePosition);
            this.node.setPosition(newPosition);
        }
        //复位add
        var moveAction = cc.moveTo(this.calculateAnimTime(), cc.p(this.startx, this.starty));
        this.node.runAction(cc.sequence(moveAction, cc.callFunc(function () {
            this.node.setPosition(this.startx, this.starty);
            this.parent_node.zIndex = 0;
            this.updateState(true);
            this.gameJS.changeMoveTag(0);
        }, this)));
    },
    //计算复位动画执行时间
    calculateAnimTime: function calculateAnimTime() {
        var distance = cc.pDistance(this.node.position, cc.p(this.startx, this.starty));
        var s = distance / 1000;
        s = s > 1 ? 1 : s;
        return s * 0.3;
    },

    optionClick: function optionClick() {
        var _this2 = this;

        this.node.parent = this.sheepNode;
        this.node.setPosition(0, 0);
        this.node.parent.zIndex = 0;
        this.canMove = false;
        this.gameJS.changeMoveTag(0);
        this.gameJS.rightNum++;

        var action = cc.spawn(cc.rotateBy(0.33, 360), cc.scaleTo(0.33, 0.978));
        this.node.runAction(cc.sequence(action, cc.callFunc(function () {
            _this2.node.zIndex = -1;
            _this2.gameJS.isWin.call(_this2.gameJS);
        })));
    },
    /*node禁止触摸事件 
     */
    updateState: function updateState(interactable) {
        if (interactable) {
            this.node.resumeSystemEvents(true);
        } else {
            this.node.pauseSystemEvents(true);
        }
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
        //# sourceMappingURL=OptionJS.js.map
        