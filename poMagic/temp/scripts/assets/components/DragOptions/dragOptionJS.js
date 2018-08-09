"use strict";
cc._RF.push(module, 'fa5adP1FHZPDLRNaX+1i0Ag', 'dragOptionJS');
// components/DragOptions/dragOptionJS.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        option_node: cc.Node,
        label: cc.Label,
        canMove: false
    },
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touch_start.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touch_end.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touch_cancel.bind(this), this.node);
    },
    init: function init(gameJS, option, optionLength) {
        this.node.opacity = 255;
        this.gameJS = gameJS;
        this.option = option; //选项（选项，选项答案）
        this.label.string = option.optionContent; //读取选项答案
        this.optionNo = option.optionNo;

        this.startx = this.node.x;
        this.starty = this.node.y;
    },
    touch_start: function touch_start(evt) {
        this.canMove = this.gameJS.changeMoveTag(this.node.tag);
        if (!this.canMove) {
            return;
        }
        this.opacity = 150;
    },
    touch_end: function touch_end(evt) {
        if (!this.canMove) {
            return;
        }
        this.node.opacity = 255;
        var isTouch = this.check();
        isTouch && this.optionClick();
        this.reloadState();
    },
    touch_move: function touch_move(evt) {
        if (!this.canMove) {
            return;
        }
        var touches = evt.getTouches();
        var parentNode = this.node.parent.parent;
        var judgePos = parentNode.convertTouchToNodeSpaceAR(touches[0]);
        if (Math.abs(judgePos.x) < parentNode.width / 2 - 50 && Math.abs(judgePos.y) < parentNode.height / 2 - 30) {
            var moveToPos = this.node.parent.convertTouchToNodeSpaceAR(touches[0]);
            this.node.position = moveToPos;
        } else {
            this.reloadState();
        }
    },
    touch_cancel: function touch_cancel(evt) {
        this.reloadState();
    },
    reloadState: function reloadState() {
        this.node.x = this.startx;
        this.node.y = this.starty;

        this.canMove = false;

        this.gameJS.changeMoveTag(0);
    },
    check: function check() {
        var qNode = this.questionNode;
        if (qNode) {
            var self = this.node;
            var nodePosition = qNode.convertToWorldSpaceAR(cc.p(0, 0));
            var selfPosition = this.node.convertToWorldSpaceAR(cc.p(0, 0));
            if (Math.abs(nodePosition.x - selfPosition.x) < (qNode.width + self.width) / 2 && Math.abs(nodePosition.y - selfPosition.y) < (qNode.height + self.height) / 2) {
                return true;
            }
        }
        return false;
    },
    optionClick: function optionClick() {
        this.node.opacity = 0;
        var self = this;
        self.updateState(false);
        this.scheduleOnce(function () {
            self.gameJS.selectAnswer(self.option);
        }, 0.2);
    },
    //按钮是否可点击
    updateState: function updateState(interactable) {
        var buttonCom = this.option_node.getComponent(cc.Button);
        buttonCom.interactable = interactable;
    },
    setQuestionNode: function setQuestionNode(questionNode) {
        this.questionNode = questionNode;
    }
});

cc._RF.pop();