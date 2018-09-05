(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/components/Options/OptionJS.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f68b8bKtqdKzZB+uUCDXYlU', 'OptionJS', __filename);
// components/Options/OptionJS.js

"use strict";

var scDuration = 0.2;

cc.Class({
    extends: cc.Component,

    properties: {
        parent_node: cc.Node,
        canMove: false,
        exchangeParent: true,
        content: ""
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
        this.parent_node = this.parent_node.parent;
    },

    onCollisionEnter: function onCollisionEnter(other, self) {
        if (this.gameJS.tipsFinished || this.gameJS.tipsFormulaNode === other.node || this.gameJS.nowQuestionID !== 0) {
            var formulaItemJs = other.getComponent("FormulaItem");
            if (formulaItemJs && !formulaItemJs.content) {
                this.node.isCollisioned = true;
                this.sheepNode = other.node;
            } else if (formulaItemJs && formulaItemJs.content) {
                formulaItemJs.markNode && formulaItemJs.markNode.getComponent("OptionJS").reloadState();
                this.node.isCollisioned = true;
                this.sheepNode = other.node;
            }
        }
    },
    onCollisionStay: function onCollisionStay(other, self) {
        if (this.gameJS.tipsFinished || this.gameJS.tipsFormulaNode === other.node || this.gameJS.nowQuestionID !== 0) {
            var formulaItemJs = other.getComponent("FormulaItem");
            if (formulaItemJs) {
                formulaItemJs.markNode = self.node;
            }
        }
    },

    onCollisionExit: function onCollisionExit(other, self) {
        if (this.gameJS.tipsFinished || this.gameJS.tipsFormulaNode === other.node || this.gameJS.nowQuestionID !== 0) {
            // if (CONSOLE_LOG_OPEN) console.log('on collision exit');
            this.node.isCollisioned = false;
            var formulaItemJs = other.getComponent("FormulaItem");
            if (formulaItemJs) {
                formulaItemJs.content = null;
                formulaItemJs.markNode = null;
                this.sheepNode = null;
            }
        }
        // this.node.opacity = 255;  
    },

    init: function init(gameJS, option, optionLength) {
        this.node.opacity = 255;
        this.startx = this.node.x;
        this.starty = this.node.y;
        this.gameJS = gameJS;
        this.option = option; //选项（选项，选项答案）
        this.hideContent();
        // this.optionNo = option.optionNo;
        // this.node.getComponent(cc.Sprite).spriteFrame = this.gameJS.getSpriteFrame(this.option.optioncontimg);
    },
    hideContent: function hideContent() {
        this.node.getChildByName("bg").active = false;
        this.node.getChildByName("content").active = false;
    },
    displayContent: function displayContent() {
        this.node.getChildByName("bg").active = true;
        this.node.getChildByName("content").active = true;
    },
    setWhiteColor: function setWhiteColor() {
        this.node.getChildByName("bg").opacity = 0;
    },
    resetColor: function resetColor() {
        this.node.getChildByName("bg").opacity = 255;
    },
    cloneOption: function cloneOption(parent) {
        var option = cc.instantiate(this.node);
        option.tag = option.tag + 9;
        parent.addChild(option);
        if (!this.gameJS.tipsFinished) {
            this.gameJS.tipsOptionNode = option;
        }
        var optionJS = option.getComponent("OptionJS");
        if (optionJS) {
            optionJS.init(this.gameJS, {}, 4);
            optionJS.parent_node = this.parent_node;
            optionJS.canMove = true;
            optionJS.canMove = true;
            optionJS.content = this.content;
            optionJS.exchangeParent = this.exchangeParent;
            optionJS.updateState(true);
        }
    },

    touch_start: function touch_start(evt) {
        this.canMove = this.gameJS.changeMoveTag(this.node.tag);
        if (!this.canMove) {
            return;
        }
        if (!this.gameJS.tipsFinished) {
            this.gameJS.pauseTipsAnimation();
        }
        this.gameJS.playOptionAudio();
        this.dragX = this.node.x;
        this.dragY = this.node.y;
        // this.parent_node.zIndex = 1;
        this.displayContent();
        this.setWhiteColor();
        if ("option_node" === this.node.parent.name) {
            this.cloneOption(this.node.parent);
        }
        var nodePosition = this.node.convertToWorldSpaceAR(cc.p(0, 0));
        this.node.parent = this.gameJS.dragNode;
        var newPosition = this.node.parent.convertToNodeSpaceAR(nodePosition);
        this.node.setPosition(newPosition);
    },
    touch_end: function touch_end(evt) {
        if (!this.canMove) {
            return;
        }
        this.gameJS.playOptionOutAudio();
        var isTouch = this.check();
        if (isTouch) {
            this.optionClick();
        } else {
            this.reloadState();
        }
    },
    touch_move: function touch_move(evt) {
        if (!this.canMove) {
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
        if (!this.canMove) {
            return;
        }
        // this.reloadState();
    },

    check: function check() {
        if (CONSOLE_LOG_OPEN) cc.log('this.node.isCollisioned=' + this.node.isCollisioned);
        return this.node.isCollisioned;
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
            var newPosition = this.parent_node.convertToNodeSpaceAR(nodePosition);
            this.node.setPosition(newPosition);
            this.node.parent = this.parent_node;
            this.node.parent.zIndex = 1;
        }
        //复位add
        var moveAction = cc.moveTo(this.calculateAnimTime(), cc.p(this.startx, this.starty));
        this.node.runAction(cc.sequence(moveAction, cc.callFunc(function () {
            this.node.setPosition(this.startx, this.starty);
            this.node.parent.zIndex = 0;
            this.updateState(true);
            if (this.gameJS.moveOptionTag === this.node.tag) {
                this.gameJS.changeMoveTag(0);
                if (!this.gameJS.tipsFinished && this.gameJS.nowQuestionID === 0) {
                    this.gameJS.changeMoveTag(this.gameJS.tipsOptionNode.tag);
                }
            }
            this.hideContent();
            this.node.destroy();
            this.node.removeFromParent();
            if (!this.gameJS.tipsFinished && this.gameJS.nowQuestionID === 0) {
                this.gameJS.resumeTipsAnimation();
            }
        }, this)));
    },
    //计算复位动画执行时间
    calculateAnimTime: function calculateAnimTime() {
        var distance = cc.pDistance(this.node.position, cc.p(this.startx, this.starty));
        var s = distance / 1000;
        s = s > 1 ? 1 : s;
        return s * 0.2;
    },

    optionClick: function optionClick() {
        if (this.exchangeParent) {
            this.node.parent = this.sheepNode;
            this.node.setPosition(0, 0);
        }
        this.canMove = false;
        this.gameJS.changeMoveTag(0);
        if (!this.gameJS.tipsFinished && this.gameJS.nowQuestionID === 0) {
            this.gameJS.changeMoveTag(this.gameJS.tipsOptionNode.tag);
            this.gameJS.nextTipsAnimation();
        }
        this.sheepNode.getComponent("FormulaItem").content = this.content;
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
        