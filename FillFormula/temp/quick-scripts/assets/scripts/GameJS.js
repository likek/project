(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/GameJS.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd92c8sRpIBMBKs/RzLIjTLN', 'GameJS', __filename);
// scripts/GameJS.js

'use strict';

var BaseGameJS = require("BaseGameJS");

cc.Class({
    extends: BaseGameJS,

    properties: {
        optionItem_pref: cc.Prefab, //选项预制
        settlePrefab: cc.Prefab,
        resetBtn: cc.Node,
        commitBtn: cc.Node, //备选

        winAudio: cc.AudioClip,
        loseAudio: cc.AudioClip,
        resetAudio: cc.AudioClip,
        optionAudio: cc.AudioClip,
        option_outAudio: cc.AudioClip,

        formulaItem: cc.Prefab,
        formulaContainer: cc.Node,
        optionsPrefab: cc.Prefab,
        optionsBgNode: cc.Node,
        questionBg: cc.Node,
        dragNode: cc.Node
    },

    onLoadChild: function onLoadChild() {
        this._super();
        this.scaleNode = this.node.getChildByName('scale');
        this.option_node = this.scaleNode.getChildByName('option_node');
        this.tipsNode = this.node.getChildByName('TipsNode');
        this.rightFeedbackNode = this.scaleNode.getChildByName("rightFeedback");
        this.tipsNode && (this.tipsNode.active = true);
        this.answerItemPool = new cc.NodePool();
        this.changeMoveTag(0);
        this.initToast();
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        this.tipsFinished = false;
        this.tipsIndex = 0;
        this.tipsCount = 0;
        // collisionManager.enabledDebugDraw = true;
    },
    //初始化toast框
    initToast: function initToast() {
        var efailed = this.node.getChildByName('scale').getChildByName('efailed');
        this.efailedJs = efailed.getComponent('efailed');
        this.efailedJs.game = this;
    },

    tipsFinishedCall: function tipsFinishedCall() {
        this.tipsNode.removeFromParent(true);
        this.tipsNode.destroy();
        this.tipsOptionNode = null;
        this.tipsFormulaNode = null;
        this.tipsFinished = true;
    },
    initFeedback: function initFeedback() {
        this.settlement = cc.instantiate(this.settlePrefab);
        this.settlementJs = this.settlement.getComponent('settlement');
        this.settlementJs.game = this;
        var feedbackNode = this.node.getChildByName('feedback_node');
        feedbackNode.addChild(this.settlement);
        this.settlement.active = false;
    },
    //转到后台
    gotoBackground: function gotoBackground() {
        var array = this.option_node.children[0].children;
        for (var i = 0; i < array.length; i++) {
            var tempOption = array[i];
            var optionJS = tempOption.getComponent('OptionJS');
            if (optionJS.canMove) {
                tempOption.stopAllActions();
                optionJS.reloadState();
                break;
            }
        }
        var submitButton = this.node.getChildByName('button_node').getChildByName('commit'),
            resetButton = this.node.getChildByName('button_node').getChildByName('cancel');
        submitButton.setScale(1, 1);
        resetButton.setScale(1, 1);
        submitButton._pressed = false;
        submitButton._hovered = false;
        resetButton._pressed = false;
        resetButton._hovered = false;
        submitButton.normalSprite = this.commitBtnNSF;
        submitButton.hoverSprite = this.commitBtnNSF;
        resetButton.normalSprite = this.resetBtnNSF;
        resetButton.hoverSprite = this.resetBtnNSF;
    },

    /*超时处理 
     */
    timeout: function timeout() {},

    //移除当前所有选项
    deleteOption: function deleteOption() {
        // var array = this.option_node.children;
        // for (var i = 0; i < array.length;) {
        //     var tempOption = array[i];
        //     var graph_btn = tempOption.getChildByName('button_bg');
        //     graph_btn.opacity = 255;
        //     //放进对象池会自动调用removeFromParent
        //     this.answerItemPool.put(tempOption);
        // }
        // this.option_node.removeAllChildren(true);  
        //移除question_node内容
    },

    //创建选项按钮
    createOption: function createOption(optionsArr) {
        this.option_node.removeAllChildren();
        if (optionsArr && optionsArr.length) {//如果选项走配置
            //...
        } else {
            this.option_node.addChild(cc.instantiate(this.optionsPrefab));
            var options = this.option_node.children[0].children;
            var option = void 0,
                optionJS = void 0;
            for (var i = 0; i < options.length; i++) {
                option = options[i];
                option.tag = 100 + i;
                optionJS = option.getComponent("OptionJS");
                if (optionJS) {
                    optionJS.init(this, {}, 4);
                    optionJS.updateState(true);
                }
            }
        }
    },
    createFormulaItem: function createFormulaItem(formulaStr) {
        this.formulaContainer.removeAllChildren();
        var spliceReg = /\(\d+|\d+\)|\d+|\_|\+|\-|\*|\/|\=/g; //用来拆分算式的每一项(空项为下划线)
        var formulaItems = formulaStr.match(spliceReg); //得到算式的每一项
        for (var i = 0, item, itemNode, itemJS; i < formulaItems.length; i++) {
            item = formulaItems[i];
            itemNode = cc.instantiate(this.formulaItem);
            this.formulaContainer.addChild(itemNode);
            itemJS = itemNode.getComponent("FormulaItem");
            if (item === "_") {
                //空项
                itemNode.getChildByName("bg").active = true;
                itemNode.getChildByName("content").getComponent(cc.Label).string = "";
                itemJS.content = null;
            } else {
                itemNode.getChildByName("bg").active = false;
                itemNode.getChildByName("content").getComponent(cc.Label).string = item.replace("*", "×").replace("/", "÷");
                itemJS.content = item;
                itemNode.getComponent(cc.BoxCollider).destroy();
            }
            itemNode.x = itemNode.width * i - itemNode.width * formulaItems.length / 2 + itemNode.width / 2;
            itemNode.y = 40;
        }
    },

    //开始加载选项
    startloadOption: function startloadOption() {
        this.updateGameState(true);
        this.isShowFeed = false;
        var question = this.currQuestion = this.questionArr[this.nowQuestionID];
        //启动业务初始化
        //this.question_node.getChildByName('question_label').getComponent(cc.Label).string = question.qescont;
        this.questionBgNode = this.scaleNode.getChildByName('questionBg');
        this.questionBgNode.getChildByName('questionLabel').getComponent(cc.Label).string = question.qescont;
        // this.questionBgNode.getChildByName('questionPic').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrame(question.quescontimgAry[0]);
        if (question.quescontimgAry[0] && question.quescontimgAry[0].length > 0) {
            this.questionBgNode.getChildByName('questionLabel').active = false;
            this.questionBgNode.getChildByName('questionPic').active = true;
        } else {
            this.questionBgNode.getChildByName('questionPic').active = false;
            this.questionBgNode.getChildByName('questionLabel').active = true;
        }
        //正确答案
        // this.rightOptionNo = question.rightOptionNo;
        this.createOption(question.optionsArr);
        if (this.checkFormulaStr(question.formula)) {
            this.createFormulaItem(question.formula);
        } else {
            CONSOLE_LOG_OPEN && console.warn("不是等式:" + this.nowQuestionID);
        }
        //倒计时
        var isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        if (this.nowQuestionID === 0 && !this.tipsFinished) {
            this.resetBtn.getComponent(cc.Button).interactable = this.tipsFinished;
            this.commitBtn.getComponent(cc.Button).interactable = this.tipsFinished;
        } else {
            this.resetBtn.getComponent(cc.Button).interactable = true;
            this.commitBtn.getComponent(cc.Button).interactable = true;
            this.tipsFormulaNode = null;
        }
        if (this.nowQuestionID === 0 && isTotalCd || !isTotalCd) {
            this.answerTime = 0;
            var countDown = parseInt(question.interactiveJson['countDown']);
            if (countDown > 0) {
                this.countDown = countDown;
            }
            this.timeLabel.string = this.timeFormat(this.countDown);
            this.tipsCount = question.formula.match(/\_/g).length;
        }
        if (this.tipsFinished) {
            !this.isIts && this.showSchedule();
            isTotalCd && (this.lastAnswerTime = this.answerTime);
            this.changeMoveTag(0);
        } else if (this.nowQuestionID === 0) {
            this.tipsIndex = 0;
            this.checkFormulaStr(question.formula) && this.nextTipsAnimation(question.formula);
        } else {
            this.pauseTipsAnimation();
            this.changeMoveTag(0);
        }
        this.isIts && this.questionNumListJS.changeOptionEnable();

        //入场龙骨
        this.optionsBgNode.getComponent(sp.Skeleton).setAnimation(0, "in", false);
        //入场渐显
        this.questionBg.opacity = 0;
        this.questionBg.stopAllActions();
        this.questionBg.runAction(cc.sequence(cc.delayTime(0.6), cc.fadeIn(1)));
        this.formulaContainer.opacity = 0;
        this.formulaContainer.stopAllActions();
        this.formulaContainer.runAction(cc.sequence(cc.delayTime(0.6), cc.fadeIn(1)));
        this.time_node.opacity = 0;
        this.time_node.stopAllActions();
        this.time_node.runAction(cc.sequence(cc.delayTime(0.6), cc.fadeIn(1)));
        //入场掉落和升起
        // this.resetBtn.stopAllActions();
        this.resetBtn.setPosition(this.resetBtn.position.x, this.resetBtn.y - this.resetBtn.height);
        this.resetBtn.runAction(cc.sequence(cc.delayTime(0), cc.moveBy(0.5, 0, this.resetBtn.height)));
        // this.commitBtn.stopAllActions();
        this.commitBtn.setPosition(this.commitBtn.position.x, this.commitBtn.y - this.commitBtn.height);
        this.commitBtn.runAction(cc.sequence(cc.delayTime(0), cc.moveBy(0.5, 0, this.commitBtn.height)));
        // this.title_node.stopAllActions();
        this.title_node.setPosition(this.title_node.position.x, this.title_node.y + 280);
        this.title_node.runAction(cc.sequence(cc.delayTime(0), cc.moveBy(0.5, 0, -280)));
    },
    //校验是否为合法的等式字符串
    checkFormulaStr: function checkFormulaStr(formula) {
        var formulaReg = /^((\d+|\(\d+|\d+\))[\+\-\*\/\_])*(\d+|\(\d+|\d+\))\=\d+$/;
        return formulaReg.test(formula) && (formula.match(/\(/g) && formula.match(/\(/g).length) === (formula.match(/\)/g) && formula.match(/\)/g).length);
    },

    //选中答案
    selectAnswer: function selectAnswer(isRight) {
        //显示状态过程中不接收事件
        if (this.isShowFeed || this.isShowLossTime) {
            return;
        }
        this.unschedule(this.timeCallback);
        this.isShowFeed = true;
        this.updateGameState(false);
        if (isRight) {
            if (CONSOLE_LOG_OPEN) console.log('答对了');
            this.createAnswerInfo('1');
        } else {
            if (CONSOLE_LOG_OPEN) console.log('答错了');
            this.createAnswerInfo('2');
        }
        this.showFeedback(isRight ? 1 : 2);
    },
    //反馈
    showFeedback: function showFeedback(type) {
        var _this = this;

        if (type === 1) {
            //出发
            AUDIO_OPEN && this.playWinAudio();
            this.rightFeedbackNode.getComponent(sp.Skeleton).setAnimation(0, "right_atmosphere", false);
        } else if (type === 2) {
            //出发
            AUDIO_OPEN && this.playLoseAudio();
        } else if (type === 3) {
            //时间到逻辑
            //出发
            AUDIO_OPEN && this.playLoseAudio();
        }
        if (type === 1 || type === 2) {
            var formulaAni = type === 1 ? "right" : "error";
            var formulaItems = this.formulaContainer.children;
            var item = null,
                itemjs = void 0;
            for (var i = 0; i < formulaItems.length; i++) {
                item = formulaItems[i];
                itemjs = item.getComponent("FormulaItem");
                if (itemjs && itemjs.markNode instanceof cc.Node) {
                    itemjs.markNode.getComponent("OptionJS").resetColor();
                    itemjs.markNode.getChildByName("bg").getComponent(sp.Skeleton).setAnimation(0, formulaAni, false);
                }
            }
        }
        this.scheduleOnce(function () {
            switch (type) {
                case 1:
                    _this.settlementJs.playWinAnim(_this.feedbackFinish);
                    break;
                case 2:
                    _this.settlementJs.playLoseAnim(_this.feedbackFinish);
                    break;
                case 3:
                    _this.settlementJs.playTimeUpAnim(_this.feedbackFinish);
                    break;
            }
            setTimeout(function () {
                _this.isShowFeed = false;
            }, 1100);
        }, 1);
    },
    updateGameState: function updateGameState(interactable) {
        if (interactable) {
            this.question_node.resumeSystemEvents(true);
            this.option_node.resumeSystemEvents(true);
        } else {
            this.question_node.pauseSystemEvents(true);
            this.option_node.pauseSystemEvents(true);
        }
    },

    otherClicked: function otherClicked() {
        this.playCancelAudio();
        if (this.isShowFeed) {
            return;
        }
    },
    /* 再来一次 */
    resetClicked: function resetClicked() {
        var _this2 = this;

        var cb = function cb() {
            var array = _this2.formulaContainer.children;
            for (var i = 0, item, itemJS; i < array.length; i++) {
                item = array[i];
                itemJS = item.getComponent("FormulaItem");
                if (itemJS.markNode instanceof cc.Node) {
                    itemJS.markNode.getComponent("OptionJS").reloadState();
                }
            }
            _this2.changeMoveTag(0);
            _this2.resetBtn.getComponent(cc.Button).interactable = true;
            _this2.commitBtn.getComponent(cc.Button).interactable = true;
            _this2.updateGameState(true);
        };
        // this.playCancelAudio();
        if (this.isShowFeed || this.isShowAnim) {
            return;
        }
        cb();
    },
    /* 确认 */
    confirmClicked: function confirmClicked() {
        var _this3 = this;

        var cb = function cb() {
            var array = _this3.formulaContainer.children;
            var isEqual = true;
            var formulaStr = "";
            for (var i = 0, item, itemJS; i < array.length; i++) {
                item = array[i];
                itemJS = item.getComponent("FormulaItem");
                if (!itemJS.content) {
                    return _this3.selectAnswer(false);
                } else {
                    formulaStr += itemJS.content.replace("=", "===");
                }
            }
            isEqual = eval(formulaStr);
            _this3.selectAnswer(isEqual);
            if (!_this3.tipsFinished && _this3.nowQuestionID === 0) {
                _this3.tipsFinishedCall();
            }
            setTimeout(function () {
                _this3.resetBtn.getComponent(cc.Button).interactable = true;
                _this3.commitBtn.getComponent(cc.Button).interactable = false;
            }, 0);
        };
        //    this.playCancelAudio();
        //this.isShowAnim
        if (this.isShowFeed) {
            return;
        }
        cb();
    },
    playWinAudio: function playWinAudio() {
        this.playAudio(this.winAudio);
    },

    playLoseAudio: function playLoseAudio() {
        this.playAudio(this.loseAudio);
    },
    playCancelAudio: function playCancelAudio() {
        this.playAudio(this.resetAudio);
    },
    playOptionAudio: function playOptionAudio() {
        this.playAudio(this.optionAudio);
    },
    playOptionOutAudio: function playOptionOutAudio() {
        this.playAudio(this.option_outAudio);
    },

    //播放音效
    playAudio: function playAudio(audio) {
        if (AUDIO_OPEN) {
            cc.audioEngine.play(audio, false, 1);
        }
    },
    pauseTipsAnimation: function pauseTipsAnimation() {
        this.tipsNode.pauseAllActions();
        var startPos = this.tipsOptionNode.convertToWorldSpaceAR(cc.p(0, 0));
        startPos = this.tipsNode.parent.convertToNodeSpaceAR(startPos);
        startPos.x += this.tipsNode.width / 3;
        startPos.y -= this.tipsNode.height / 3;
        this.tipsNode.setPosition(startPos);
        this.tipsNode.active = false;
    },
    resumeTipsAnimation: function resumeTipsAnimation() {
        this.tipsNode.resumeAllActions();
        this.tipsNode.active = true;
    },
    nextTipsAnimation: function nextTipsAnimation() {
        var _this4 = this;

        this.tipsNode.stopAllActions();
        this.tipsNode.active = true;
        if (this.tipsIndex === this.tipsCount) {
            //最后一步引导
            var commitBtn = this.commitBtn;
            commitBtn.getComponent(cc.Button).interactable = true;

            var endPos = commitBtn.convertToWorldSpaceAR(cc.p(0, 0));
            endPos = this.tipsNode.parent.convertToNodeSpaceAR(endPos);
            endPos.x += this.tipsNode.width / 3;
            endPos.y -= this.tipsNode.height / 3 - commitBtn.height / 2;

            this.tipsNode.setPosition(endPos);
            this.tipsNode.runAction(cc.sequence(cc.scaleTo(0.6, 0.87), cc.scaleTo(0.2, 1.2), cc.callFunc(function () {}))).repeatForever();
            this.changeMoveTag(0);
            this.changeMoveTag(999);
        } else {
            var formula = this.currQuestion.formula;
            if (!formula.match(/\_/g)) {
                this.tipsFinishedCall();
                return;
            }
            var ansower = this.getAnsower(formula);
            if (!ansower) {
                CONSOLE_LOG_OPEN && console.warn("此等式没有答案");
                return;
            };
            var tipsOptionNode = this.getOptionNodeByMark(ansower[this.tipsIndex].value);
            var tipsFormulaNode = this.getEmptyFormulaNodeByIndex(this.tipsIndex);
            this.changeMoveTag(0);
            this.changeMoveTag(tipsOptionNode.tag);
            this.tipsOptionNode = tipsOptionNode;
            this.tipsFormulaNode = tipsFormulaNode;

            var startPos = tipsOptionNode.convertToWorldSpaceAR(cc.p(0, 0));
            startPos = this.tipsNode.parent.convertToNodeSpaceAR(startPos);
            startPos.x += this.tipsNode.width / 3;
            startPos.y -= this.tipsNode.height / 3;

            var _endPos = tipsFormulaNode.convertToWorldSpaceAR(cc.p(0, 0));
            _endPos = this.tipsNode.parent.convertToNodeSpaceAR(_endPos);
            _endPos.x += this.tipsNode.width / 3;
            _endPos.y -= this.tipsNode.height / 3;

            this.tipsNode.setPosition(startPos);
            this.tipsNode.runAction(cc.sequence(cc.delayTime(0.3), cc.moveTo(1, _endPos), cc.callFunc(function () {
                _this4.tipsNode.setPosition(startPos);
            }))).repeatForever();
        }
        this.tipsIndex++;
    },
    //获取某一个空项节点
    getEmptyFormulaNodeByIndex: function getEmptyFormulaNodeByIndex(tipsIndex) {
        var formulaNodes = this.formulaContainer.children;
        var count = 0;
        for (var i = 0; i < formulaNodes.length; i++) {
            if (!formulaNodes[i].getComponent("FormulaItem").content) {
                if (tipsIndex === 0) {
                    return formulaNodes[i];
                } else {
                    if (count === tipsIndex) {
                        return formulaNodes[i];
                    } else {
                        count++;
                    }
                }
            }
        }
    },

    //获取某一个选项
    getOptionNodeByMark: function getOptionNodeByMark(mark) {
        var options = this.option_node.children[0].children;
        for (var i = 0; i < options.length; i++) {
            if (options[i].getComponent("OptionJS").content === mark) {
                return options[i];
            }
        }
    },

    //获取答案(仅获取一种)
    getAnsower: function getAnsower(formula) {
        var spliceReg = /\(\d+|\d+\)|\d+|\_|\+|\-|\*|\/|\=/g; //用来拆分算式的每一项(空项为下划线)
        var formulaItems = formula.match(spliceReg);
        var marks = ["+", "-", "*", "/"];
        if (formulaItems.indexOf("_") === formulaItems.lastIndexOf("_")) {
            //只有一个空项
            for (var i = 0; i < marks.length; i++) {
                if (window.eval(formulaItems.join("").replace("_", marks[i]).replace("=", "==="))) {
                    return [{
                        index: formulaItems.indexOf("_"),
                        value: marks[i]
                    }];
                }
            }
        } else {
            //两个空项
            var itemsCopy = null,
                firstIdx = void 0,
                secIdx = void 0;
            firstIdx = formulaItems.indexOf("_");
            secIdx = formulaItems.lastIndexOf("_");
            for (var _i = 0; _i < marks.length; _i++) {
                itemsCopy = formulaItems.slice();
                itemsCopy[firstIdx] = marks[_i]; //替换第1个下划线
                for (var j = 0; j < marks.length; j++) {
                    itemsCopy[secIdx] = marks[j]; //替换第2个下划线
                    if (window.eval(itemsCopy.join("").replace("=", "==="))) {
                        return [{
                            index: firstIdx,
                            value: marks[_i]
                        }, {
                            index: secIdx,
                            value: marks[j]
                        }];
                    }
                }
            }
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
        //# sourceMappingURL=GameJS.js.map
        