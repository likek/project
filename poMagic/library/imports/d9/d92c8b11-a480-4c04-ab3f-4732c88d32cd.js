"use strict";
cc._RF.push(module, 'd92c8sRpIBMBKs/RzLIjTLN', 'GameJS');
// scripts/GameJS.js

'use strict';

var BaseGameJS = require("BaseGameJS");

cc.Class({
    extends: BaseGameJS,

    properties: {
        optionItem_pref: cc.Prefab, //选项预制
        particle_pref: cc.Prefab,
        settlePrefab: cc.Prefab,
        resetBtnNSF: cc.SpriteFrame,
        commitBtnNSF: cc.SpriteFrame, //备选

        winAudio: cc.AudioClip,
        loseAudio: cc.AudioClip, //超时
        optionAudio: cc.AudioClip,
        // bgmAudio: cc.AudioClip,
        option_wrongAudio: cc.AudioClip,
        option_correctAudio: cc.AudioClip,
        // basinAudio:cc.AudioClip,//规则音
        timuAudio: cc.AudioClip,
        zhuazhiAudio: cc.AudioClip, //爪子
        paopaoAudio: cc.AudioClip //泡泡
    },

    onLoadChild: function onLoadChild() {
        this._super();
        this.scaleNode = this.node.getChildByName('scale');
        this.option_node = this.scaleNode.getChildByName('option_node');
        this.tipsNode = this.node.getChildByName('TipsNode');
        this.tipsNode && (this.tipsNode.active = true);
        this.answerItemPool = new cc.NodePool();
        this.prompt_nodeJS = this.scaleNode.getChildByName('prompt_node').getComponent('title');
        this.clampNode = this.scaleNode.getChildByName('clamp');
        this.hand = this.scaleNode.getChildByName('hand');
        this.changeMoveTag(0);
        this.initToast();
        this.node.getComponent('OptionJS1').init(this);
    },
    //初始化toast框
    initToast: function initToast() {
        var efailed = this.node.getChildByName('scale').getChildByName('efailed');
        this.efailedJs = efailed.getComponent('efailed');
        this.efailedJs.game = this;
    },

    tipsClick: function tipsClick() {
        this.tipsNode && this.tipsNode.removeFromParent(true);
        this.tipsNode && this.tipsNode.destroy();
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
                //optionJS.reloadState();
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
        AUDIO_OPEN && this.playLoseAudio();
        this.settlementJs.playTimeUpAnim();
    },

    //移除当前所有选项
    deleteOption: function deleteOption() {
        var array = this.option_node.children;
        for (var i = 0; i < array.length; i++) {
            var tempOption = array[i];
            //放进对象池会自动调用removeFromParent
            tempOption.destroy();
            // this.answerItemPool.put(tempOption);
        }
        this.option_node.removeAllChildren(true);
        //移除question_node内容
        var ary = this.scaleNode.children;
        for (var i = 0; i < ary.length; i++) {
            var tempOption = ary[i];
            if (tempOption.tag >= 1000 && tempOption.tag <= 1010) {
                tempOption.destroy();
            }
        }
    },
    creatQuestion: function creatQuestion(contentAry) {
        this.promptJS1 = this.question_node.getChildByName('prompt_node1').getComponent('title');
        this.promptJS2 = this.question_node.getChildByName('prompt_node2').getComponent('title');
        this.promptJS3 = this.question_node.getChildByName('prompt_node3').getComponent('title');
        this.promptJS4 = this.question_node.getChildByName('prompt_node4').getComponent('title');
        this.promptJS5 = this.question_node.getChildByName('prompt_node5').getComponent('title');
        this.promptJS6 = this.question_node.getChildByName('prompt_node6').getComponent('title');
        this.promptJS1.setTitle(contentAry.length > 0 && contentAry[0], null);
        this.promptJS2.setTitle(contentAry.length > 1 && contentAry[1], null);
        this.promptJS3.setTitle('?', null);
        this.promptJS4.setTitle('?', null);
        this.promptJS5.setTitle('10', null);

        this.promptJS6.setTitle('?', null);

        if (this.nowQuestionID == 0) {
            this.isIts && this.questionNumListJS.changeOptionEnable();
            this.updateGameState(true);
            this.PlayFuhaoAnim(); //烟雾消失播放?号闪动
        } else {
            this.playParticle();
        }
    },
    playParticle: function playParticle() {
        this.playPaopaoAudio();
        this.question_node.children.forEach(function (obj, idx) {
            var particle = cc.instantiate(this.particle_pref);
            particle.setPosition(cc.p(0, 0));
            particle.parent = obj;
            var ParticleSystem = particle.getComponent(cc.ParticleSystem);
            ParticleSystem.autoRemoveOnFinish = true;
        }, this);
        this.scheduleOnce(function () {
            this.isIts && this.questionNumListJS.changeOptionEnable();
            this.updateGameState(true);
            this.PlayFuhaoAnim(); //烟雾消失播放?号闪动
        }, 3.5);
    },

    //创建选项按钮
    createOption: function createOption(optionsArr) {
        // let numAry = ['12','3','7','2'];
        for (var i = 0; i < optionsArr.length; ++i) {
            var optionItem = null;

            // if (this.answerItemPool.size() > 0) {
            //     optionItem = this.answerItemPool.get();
            // } else {
            optionItem = cc.instantiate(this.optionItem_pref);
            //}
            optionItem.setPosition(cc.p(-(optionsArr.length / 2 - 0.5 - i) * (optionItem.width + 55), 10));
            this.option_node.addChild(optionItem);
            var graph_btn = optionItem.getChildByName('button_bg');
            graph_btn.tag = 1000 + i;
            var optionJS = graph_btn.getComponent('OptionJS');
            optionJS.init(this, optionsArr[i], optionsArr.length);
            this.isIts && optionJS.updateState(false);
            var numSpineJs = graph_btn.getComponent('numSpineJs');
            cc.log('optionContent' + optionsArr[i].optionContent);
            numSpineJs.init(optionsArr[i].optionContent);
        }
    },

    //开始加载选项
    startloadOption: function startloadOption() {
        this.updateGameState(false);
        this.isIts && this.questionNumListJS.changeOptionDisable();
        var question = this.questionArr[this.nowQuestionID];
        this.prompt_nodeJS.setTitle(question.qescont, null);
        //启动业务初始化
        this.questionBgNode = this.scaleNode.getChildByName('questionBg');
        //this.questionBgNode.getChildByName('questionLabel').getComponent(cc.Label).string = question.qescont;
        // this.questionBgNode.getChildByName('questionPic').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrame(question.quescontimgAry[0]);
        if (question.quescontimgAry[0] && question.quescontimgAry[0].length > 0) {
            this.questionBgNode.getChildByName('questionLabel').active = false;
            this.questionBgNode.getChildByName('questionPic').active = true;
        } else {
            this.questionBgNode.getChildByName('questionPic').active = false;
            this.questionBgNode.getChildByName('questionLabel').active = true;
        }

        this.nownumber = 0; //当前碰撞第几个
        //正确答案
        this.rightOptionNo = question.rightOptionNo;
        this.rightArray = question.rightAry;
        this.createOption(question.optionsArr);
        this.creatQuestion(question.contentAry);
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
        // if (this.tipsNode && !this.tipsNode.activeInHierarchy) {
        if (this.nowQuestionID > 0) {
            !this.isIts && this.showSchedule();
            isTotalCd && (this.lastAnswerTime = this.answerTime);
            this.hand.activeInHierarchy && this.stopHandAction(true);
        }
        this.isShowFeed = false;
        this.changeMoveTag(0);
        //出现走了选中isShowFeed=yes,reloadState还没走.
        if (this.nowQuestionID === 0) {
            var yindaoNum = question.rightAry.length > 0 && question.rightAry[0];
            var index = -1;
            question.optionsArr.forEach(function (obj, idx) {
                if (yindaoNum == obj.optionContent) {
                    index = idx;
                }
            }, this);
            var handNode = this.option_node.children[index];
            var nodePosition = handNode.convertToWorldSpaceAR(cc.p(0, 0));
            var newPosition = this.scaleNode.convertToNodeSpaceAR(nodePosition);
            this.handMove(newPosition);
            this.changeMoveTag(1000 + index);
        }
        this.scheduleOnce(function () {
            !this.isIts && this.optionShowAnim();
        }, 1.84);
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
        // if (type === 1) {
        //     //出发
        //     AUDIO_OPEN && this.playWinAudio();
        //     this.settlementJs.playWinAnim(this.feedbackFinish);

        // } else if (type === 2) {
        //     //出发
        //     AUDIO_OPEN && this.playLoseAudio();
        //     this.settlementJs.playLoseAnim(this.feedbackFinish);
        // } else if (type === 3) { //时间到逻辑

        //     //出发
        //     AUDIO_OPEN && this.playLoseAudio();
        //     this.settlementJs.playTimeUpAnim(this.feedbackFinish);
        // }
        this.scheduleOnce(function () {
            this.feedbackFinish();
            !this.isIts && this.optionDismissAnim();
        }, 0.1);
    },
    //选项动画
    optionDismissAnim: function optionDismissAnim() {
        var _this = this;

        var durTime = 1.14,
            self = this;
        var action = cc.sequence(cc.moveTo(durTime, -2048, -553), cc.callFunc(function () {
            _this.option_node.setPosition(2048, -553);
        }));
        // if (this.option_node.x > -1 && this.option_node.x < 1) {
        if (this.option_node.x === 0) {
            this.option_node.stopAllActions();
            this.option_node.runAction(action);
        }
    },
    gameOverSettlement: function gameOverSettlement() {
        //出发
        AUDIO_OPEN && this.playWinAudio();
        this.settlementJs.playWinAnim();
    },

    optionShowAnim: function optionShowAnim() {
        var _this2 = this;

        var durTime = 1.64,
            self = this;
        var action = cc.sequence(cc.moveTo(durTime, 0, -553), cc.callFunc(function () {
            _this2.option_node.setPosition(0, -553);
        }));
        if (this.option_node.x !== 0) {
            this.option_node.stopAllActions();
            this.option_node.runAction(action);
        } else {
            this.option_node.setPosition(0, -553);
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
    /* 再来一次 */
    resetClicked: function resetClicked() {
        var _this3 = this;

        var cb = function cb() {
            var array = _this3.option_node.children;
            array.forEach(function (obj, idx) {
                var optionJS = obj.getComponent('OptionJS');
                optionJS && optionJS.reloadState();
            }, _this3);
        };
        this.playCancelAudio();

        if (this.isShowFeed || this.isShowAnim) {
            return;
        }

        cb();
    },
    /* 确认 */
    confirmClicked: function confirmClicked() {
        var _this4 = this;

        var cb = function cb() {
            var array = _this4.option_node.children;
            var isEqual = true;
            array.forEach(function (obj, idx) {
                var optionJS = obj.getComponent('OptionJS');
                if (_this4.rightAry.indexOf(idx.toString()) != -1) {
                    if (optionJS && optionJS.state != 2) {
                        isEqual = false;
                    }
                } else {
                    //错误区为正确时
                    if (optionJS && optionJS.state == 2) {
                        isEqual = false;
                    }
                }
            }, _this4);

            _this4.selectAnswer(isEqual);
        };
        this.playCancelAudio();
        //this.isShowAnim
        if (this.isShowFeed || this.checkIsEmpty()) {
            return;
        }

        cb();
    },
    checkIsEmpty: function checkIsEmpty() {
        var array = this.option_node.children;
        var isEmpty = true;
        array.forEach(function (obj, idx) {
            var optionJS = obj.getComponent('OptionJS');
            //正确区不为正确时
            if (optionJS && optionJS.state > 1) {
                isEmpty = false;
            }
        }, this);
        return isEmpty;
    },
    /* 晃动效果 */
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
        this.schedule(this.basinCallback, question.gap ? parseInt(question.gap) : 40); //27
    },

    playWinAudio: function playWinAudio() {
        this.playAudio(this.winAudio);
    },

    playLoseAudio: function playLoseAudio() {
        this.playAudio(this.loseAudio);
    },
    playCancelAudio: function playCancelAudio() {
        //this.playAudio(this.resetAudio);
    },
    playOption_wrongAudio: function playOption_wrongAudio() {
        this.playAudio(this.option_wrongAudio);
    },
    playOption_correctAudio: function playOption_correctAudio() {
        this.playAudio(this.option_correctAudio);
    },
    playOptionAudio: function playOptionAudio() {
        this.playAudio(this.optionAudio);
    },
    playZhuazhiAudio: function playZhuazhiAudio() {
        this.playAudio(this.zhuazhiAudio);
    },
    playPaopaoAudio: function playPaopaoAudio() {
        this.playAudio(this.paopaoAudio);
    },
    playOptionOutAudio: function playOptionOutAudio(optionNo) {
        var audioName = 'vof_' + optionNo;
        cc.loader.loadRes('audio/' + audioName, cc.AudioClip, function (error, audio) {
            if (!error) {
                cc.audioEngine.play(audio, false, 1);
            }
        });
    },
    playBasinAudio: function playBasinAudio() {
        //this.playAudio(this.basinAudio);
        var question = this.questionArr[this.nowQuestionID];

        cc.loader.load(question.cndybasinAudio, function (err, audio) {
            if (!err) {
                cc.audioEngine.play(audio, false, 1);
                cc.loader.releaseAsset(audio);
            }
        });
    },
    playTimuAudio: function playTimuAudio() {
        var self = this;
        var audio = cc.audioEngine.play(this.timuAudio, false, 1);
        cc.audioEngine.setFinishCallback(audio, function () {
            cc.audioEngine.stop(audio);
            self.playBasinAudio();
        });
    },
    playBGMAudio: function playBGMAudio() {
        var self = this;
        var question = this.questionArr[this.nowQuestionID];

        cc.loader.load(question.bgm_candyAudio, function (err, audio) {
            if (!err) {
                cc.audioEngine.play(audio, true, 1);
                cc.loader.releaseAsset(audio);
            }
        });
    }, //播放音效
    playAudio: function playAudio(audio) {
        if (AUDIO_OPEN) {
            cc.audioEngine.play(audio, false, 1);
        }
    },
    playClampSkeleton: function playClampSkeleton(state) {
        var numState = state == 0 ? 'put' : 'scratch';
        this.clampNode.getComponent('sp.Skeleton').setAnimation(0, numState, false);
    },
    //成功隐藏问号
    showPromptSuccessTitle: function showPromptSuccessTitle(content) {
        if (this.nownumber == 0) {
            this.promptJS4.setTitle(content, null);
        } else if (this.nownumber == 1) {
            this.promptJS6.setTitle(content, null);
        } else {
            this.promptJS3.setTitle(content, null);
        }
    },
    //红圈动画
    playPromptWrongAnim: function playPromptWrongAnim() {
        var prompt_node4 = this.question_node.getChildByName('prompt_node4');
        var prompt_node6 = this.question_node.getChildByName('prompt_node6');
        var prompt_node3 = this.question_node.getChildByName('prompt_node3');
        var wrongNode = undefined;
        if (this.nownumber == 0) {
            wrongNode = prompt_node4.getChildByName('wrong');
        } else if (this.nownumber == 1) {
            wrongNode = prompt_node6.getChildByName('wrong');
        } else {
            wrongNode = prompt_node3.getChildByName('wrong');
        }
        var durTime = 0.17,
            self = this;
        var action = cc.sequence(cc.fadeTo(durTime, 255), cc.fadeTo(durTime, 0), cc.fadeTo(durTime, 255), cc.fadeTo(durTime, 0), cc.fadeTo(durTime, 255), cc.fadeTo(durTime, 0), cc.fadeTo(durTime, 255), cc.fadeTo(durTime, 0), cc.fadeTo(durTime, 255), cc.fadeTo(durTime, 0), cc.fadeTo(durTime, 255), cc.fadeTo(durTime, 0), cc.callFunc(function () {}));
        wrongNode.runAction(action);
    },
    //问号播放动效
    PlayFuhaoAnim: function PlayFuhaoAnim() {
        var durTime = 0.25,
            //0.03
        self = this;
        var action = cc.sequence(cc.spawn(cc.scaleTo(0.5, 1.1, 1.1), cc.fadeTo(0.5, 255)), cc.delayTime(0.2), cc.spawn(cc.scaleTo(0.5, 1, 1), cc.fadeTo(0.5, 0))
        //  cc.callFunc(() => {
        //      loseGame();
        //  }),
        ).repeatForever(); //463展示
        var prompt_node4 = this.question_node.getChildByName('prompt_node4');
        var prompt_node6 = this.question_node.getChildByName('prompt_node6');
        var prompt_node3 = this.question_node.getChildByName('prompt_node3');
        var animNode = undefined;
        if (this.nownumber == 0) {
            //0,1,2
            animNode = prompt_node4.getChildByName('label');
        } else if (this.nownumber == 1) {
            animNode = prompt_node6.getChildByName('label');
        } else {
            animNode = prompt_node3.getChildByName('label');
        }
        animNode.runAction(action);
    },
    stopFuhaoAnim: function stopFuhaoAnim(state) {
        var prompt_node4 = this.question_node.getChildByName('prompt_node4');
        var prompt_node6 = this.question_node.getChildByName('prompt_node6');
        var prompt_node3 = this.question_node.getChildByName('prompt_node3');
        var animNode = undefined;
        if (this.nownumber == 0) {
            animNode = prompt_node4.getChildByName('label');
        } else if (this.nownumber == 1) {
            animNode = prompt_node6.getChildByName('label');
        } else {
            animNode = prompt_node3.getChildByName('label');
        }
        if (state == 'stop') {
            animNode.stopAllActions();
        } else if (state == 'pause') {
            animNode.pauseAllActions();
            animNode.opacity = 255;
        } else {
            animNode.resumeAllActions();
        }
    },
    ///引导相关
    stopHandAction: function stopHandAction(stop) {
        if (stop) {
            this.hand.opacity = 0;
            !this.isIts && (this.hand.active = false);
            this.hand.stopAllActions();
            this.tipsClick();
        } else {
            this.hand.opacity = 255;
            this.hand.resumeAllActions();
        }
    },
    //引导手动画
    handMove: function handMove(endPositon) {
        var _this5 = this;

        this.hand.opacity = 255;
        this.hand.setPosition(endPositon.x + 200, endPositon.y - 200); //右边

        var action = cc.sequence(cc.moveTo(1, endPositon.x + 50, endPositon.y - 100), cc.delayTime(0.2), cc.callFunc(function () {
            _this5.hand.setPosition(endPositon.x + 200, endPositon.y - 200);
        }, this)).repeatForever();
        this.hand.runAction(action);
    }

});

cc._RF.pop();