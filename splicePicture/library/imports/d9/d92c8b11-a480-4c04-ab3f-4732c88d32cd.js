"use strict";
cc._RF.push(module, 'd92c8sRpIBMBKs/RzLIjTLN', 'GameJS');
// scripts/GameJS.js

'use strict';

var BaseGameJS = require("BaseGameJS");

cc.Class({
    extends: BaseGameJS,

    properties: {
        settlePrefab: cc.Prefab,
        resetBtnNSF: cc.SpriteFrame,
        commitBtnNSF: cc.SpriteFrame, //备选

        winAudio: cc.AudioClip,
        loseAudio: cc.AudioClip,
        resetAudio: cc.AudioClip,
        optionAudio: cc.AudioClip,
        option_outAudio: cc.AudioClip,
        rightAudio: cc.AudioClip,
        wrongAudio: cc.AudioClip,
        timuAudio: cc.AudioClip,

        flags: cc.Node, //旗子
        cattle: cc.Node, //牛
        answerContainer: cc.Node, //框框
        glow: cc.Node, //闪动龙骨
        colorStrip: cc.Node, // 彩带
        tipsHand: cc.Node,

        progress: cc.Node, //进度条

        rightNum: 0 //答对数量(用来判断是否答完))
    },

    onLoadChild: function onLoadChild() {
        this._super();
        this.scaleNode = this.node.getChildByName('scale');
        this.option_node = this.scaleNode.getChildByName('option_node');
        this.tipsNode = this.node.getChildByName('TipsNode');
        this.tipsNode && (this.tipsNode.active = true);
        this.answerItemPool = new cc.NodePool();
        this.prompt_nodeJS = this.scaleNode.getChildByName('prompt_node').getComponent('title');
        this.changeMoveTag(0);
        this.initToast();

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;

        this.flagsJs = this.flags.getComponent("Flags"); //旗子
        this.answerContainerJS = this.answerContainer.getComponent("AnswerContainer"); //可碰撞区
        this.answerContainerJS.gameJS = this;
        this.progressJS = this.progress.getComponent("ProgressJs");
        this.tipsHand.active = false;
    },
    //初始化toast框
    initToast: function initToast() {
        var efailed = this.node.getChildByName('scale').getChildByName('efailed');
        this.efailedJs = efailed.getComponent('efailed');
        this.efailedJs.game = this;
    },

    tipsClick: function tipsClick() {
        this.tipsNode.removeFromParent(true);
        this.tipsNode.destroy();
        !this.isIts && this.showSchedule();
        var isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        isTotalCd && (this.lastAnswerTime = this.answerTime);
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
        var array = this.option_node.children;
        for (var i = 0; i < array.length; i++) {
            var tempOption = array[i];
            var graph_btn = tempOption.getChildByName('button_bg');
            var optionJS = graph_btn.getComponent('OptionJS');
            if (optionJS.canMove) {
                graph_btn.stopAllActions();
                optionJS.reloadState();
                graph_btn.opacity = 255;
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
    timeout: function timeout() {
        this.progress.getComponent("ProgressJs").playFlayStar(new cc.v2(0, 0), this.nowQuestionID, 2);
        this.progress.getComponent("ProgressJs").setStarTypeByIndex(this.nowQuestionID, 2);
    },

    //移除当前所有选项
    deleteOption: function deleteOption() {
        var array = this.option_node.children;
        for (var i = 0; i < array.length;) {
            var tempOption = array[i];
            var graph_btn = tempOption.getChildByName('button_bg');
            graph_btn.opacity = 255;
            //放进对象池会自动调用removeFromParent
            this.answerItemPool.put(tempOption);
        }
        this.option_node.removeAllChildren(true);
        //移除question_node内容
    },

    //创建选项按钮
    // createOption: function (optionsArr) {

    // },

    //开始加载选项
    startloadOption: function startloadOption() {
        this.updateGameState(true);
        this.isIts && this.questionNumListJS.changeOptionDisable();
        var question = this.questionArr[this.nowQuestionID];
        //启动业务初始化
        this.prompt_nodeJS.setTitle(question.qescont, null);

        //正确答案
        this.rightOptionNo = question.rightOptionNo;
        this.createOption(question.optionsArr);
        //倒计时
        var isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        if (this.nowQuestionID === 0 && isTotalCd || !isTotalCd) {
            this.answerTime = 0;
            var countDown = parseInt(question.interactiveJson['countDown']);
            if (countDown > 0) {
                this.countDown = countDown;
            }

            this.timeLabel.string = this.timeFormat(this.countDown);
        }
        // if (this.nowQuestionID > 0) {
        !this.isIts && this.showSchedule();
        isTotalCd && (this.lastAnswerTime = this.answerTime);
        // }
        this.isIts && this.questionNumListJS.changeOptionEnable();
        this.isShowFeed = false;
        this.changeMoveTag(0);
        //出现走了选中isShowFeed=yes,reloadState还没走.

        var matrixType = question.matrixType;
        if (!matrixType) {
            switch (question.optionsArr.length) {
                case 4:
                    matrixType = "2x2";break;
                case 6:
                    matrixType = "2x3";break;
                case 9:
                    matrixType = "3x3";break;
            }
        }
        this.rightNum = 0;
        this.flagsJs.initData(question.optionsArr, this);
        this.answerContainerJS.initData(matrixType, this);
        this.setCattleAnimationOnce("stand");

        if (!this.progressJS.__hasInit) {
            this.progressJS.init(this.questionArr.length);
            this.progressJS.__hasInit = true;
        }
        if (this.nowQuestionID === 0) {
            this.tipsHand.active = true;
            this.tipsAnimation();
        } else {
            this.tipsHand.active = false;
        }
        this.progressJS.showStarFlag(this.progressJS.getStarPosByIndex(this.nowQuestionID));
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
            this.showFeedback(1);
        } else {
            if (CONSOLE_LOG_OPEN) console.log('答错了');
            this.createAnswerInfo('2');
            this.showFeedback(2);
        }
    },
    //反馈
    showFeedback: function showFeedback(type) {
        var _this = this;

        if (type === 1) {
            //出发
            AUDIO_OPEN && this.playWinAudio();
            // this.settlementJs.playWinAnim(this.feedbackFinish);
            var answers = this.answerContainer.children[0].children;
            for (var i = 0; i < answers.length; i++) {
                answers[i].getChildByName("button_bg").setScale(1);
            }
            this.progress.getComponent("ProgressJs").setStarTypeByIndex(this.nowQuestionID, 1);
            this.progress.getComponent("ProgressJs").playFlayStar(new cc.v2(0, 0), this.nowQuestionID, 1);
            this.scheduleOnce(function () {
                _this.colorStrip.getComponent("sp.Skeleton").setAnimation(0, "in", false);
                _this.glow.getComponent("sp.Skeleton").setAnimation(0, "in", false);
                _this.setCattleAnimationOnce("happy");
                _this.scheduleOnce(function () {
                    _this.feedbackFinish();
                }, 1.7);
            }, 0.3);
        } else if (type === 2) {
            //出发
            AUDIO_OPEN && this.playLoseAudio();
            this.settlementJs.playLoseAnim(this.feedbackFinish);
        } else if (type === 3) {
            //时间到逻辑
            //出发
            AUDIO_OPEN && this.playLoseAudio();
            this.settlementJs.playTimeUpAnim(this.feedbackFinish);
        }
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
    playRightAudio: function playRightAudio() {
        this.playAudio(this.rightAudio);
    },
    playWrongAudio: function playWrongAudio() {
        this.playAudio(this.wrongAudio);
    },

    /* 循环规则音,点击后重置 */
    BasicAni: function BasicAni() {
        //倒计时回调
        var BasinCallbackFunc = function BasinCallbackFunc() {
            var basincb = function basincb() {
                if (this.isShowFeed) {
                    return;
                }
                if (CONSOLE_LOG_OPEN) console.log('gagagagga');
                this.playBasinAudio();
            };
            return basincb;
        };

        this.unschedule(this.basinCallback);
        this.basinCallback = BasinCallbackFunc();
        var question = this.questionArr[this.nowQuestionID];
        question && this.schedule(this.basinCallback, question.gap ? parseInt(question.gap) : 40);
    },
    playTimuAudio: function playTimuAudio() {
        var self = this;
        var audio = cc.audioEngine.play(this.timuAudio, false, 1);
        cc.audioEngine.setFinishCallback(audio, function () {
            cc.audioEngine.stop(audio);
            self.playBasinAudio();
        });
    },
    playBasinAudio: function playBasinAudio() {
        //this.playAudio(this.basinAudio);
        var question = this.questionArr[this.nowQuestionID];

        question.cndybasinAudio && cc.loader.load(question.cndybasinAudio, function (err, audio) {
            if (!err) {
                cc.audioEngine.play(audio, false, 1);
                cc.loader.releaseAsset(audio);
            }
        });
    },
    playBGMAudio: function playBGMAudio() {
        var self = this;
        var question = this.questionArr[this.nowQuestionID];

        question.bgm_candyAudio && cc.loader.load(question.bgm_candyAudio, function (err, audio) {
            if (!err) {
                cc.audioEngine.play(audio, true, 1);
                cc.loader.releaseAsset(audio);
            }
        });
    },
    //播放音效
    playAudio: function playAudio(audio) {
        if (AUDIO_OPEN) {
            cc.audioEngine.play(audio, false, 1);
        }
    },

    isWin: function isWin() {
        var question = this.questionArr[this.nowQuestionID];
        if (this.rightNum === question.optionsArr.length) {
            this.selectAnswer(true);
        }
    },
    setCattleAnimationOnce: function setCattleAnimationOnce(animation, timeOut) {
        var _this2 = this;

        this.cattle.getComponent("sp.Skeleton").setAnimation(0, animation, false);
        setTimeout(function () {
            _this2.cattle.getComponent("sp.Skeleton").setAnimation(0, "stand", true);
        }, timeOut || 2600);
    },

    gameBackAction: function gameBackAction() {
        window.location.href = 'optionBlank://xmaGameBackAction?status=1';
    },

    tipsAnimation: function tipsAnimation() {
        var _this3 = this;

        var flagL = this.flags.getChildByName("flagL");
        var optionNode = flagL.children[0];
        if (!optionNode) return;
        var optionJS = optionNode.getChildByName("button_bg").getComponent("OptionJS");
        var optionID = optionJS.option.optionContent;

        var answers = this.answerContainer.children[0].children;
        var rightAnswerNode = null;
        for (var i = 0; i < answers.length; i++) {
            if (answers[i].__optionId === optionID) {
                rightAnswerNode = answers[i];
            }
        }
        if (!rightAnswerNode) return;

        var startPos = void 0,
            endPos = void 0;
        startPos = optionNode.convertToWorldSpaceAR(cc.p(0, 0));
        startPos = this.scaleNode.convertToNodeSpaceAR(startPos);
        startPos.x += this.tipsHand.width / 3; //手向右下移一点点
        startPos.y -= this.tipsHand.height / 3;
        endPos = rightAnswerNode.convertToWorldSpaceAR(cc.p(0, 0));
        endPos = this.scaleNode.convertToNodeSpaceAR(endPos);
        endPos.x += this.tipsHand.width / 3; //手向右下移一点点
        endPos.y -= this.tipsHand.height / 3;

        this.tipsHand.setPosition(startPos);

        var tipsAction = cc.moveTo(1.6, endPos);
        this.tipsHand.stopAllActions();
        this.tipsHand.runAction(cc.sequence(tipsAction, cc.callFunc(function () {
            _this3.tipsHand.setPosition(startPos);
        }, this)), this).repeatForever();

        this.changeMoveTag(optionNode.getChildByName("button_bg").tag);
    }
});

cc._RF.pop();