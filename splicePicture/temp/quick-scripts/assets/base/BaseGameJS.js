(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/base/BaseGameJS.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd5325ralz1KNpBY2dkj5IqD', 'BaseGameJS', __filename);
// base/BaseGameJS.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel: cc.Label,
        paopao_node: cc.Node, //泡泡背景
        //paopao_pref: cc.Prefab,//泡泡预制
        feedback_node: cc.Node, //龙虾反馈
        //feedback_pref: cc.Prefab,//龙虾预制        
        loseTime_node: cc.Node, //减时间
        loseTime: 0, //减时间3秒
        time_node: cc.Node,
        question_node: cc.Node,
        quertionList_node: cc.Node,
        title_node: cc.Node

    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        //注册监听home键事件
        document.addEventListener('resignActivePauseGame', function () {
            self.gotoBackground();
            cc.director.pause();
            cc.game.pause();

            if (CONSOLE_LOG_OPEN) console.log('app just resign active.');
        });
        document.addEventListener('becomeActiveResumeGame', function () {
            if (cc.game.isPaused) {
                cc.game.resume();
            }
            if (cc.director.isPaused) {
                cc.director.resume();
            }
            self.gotoForeground();
            if (CONSOLE_LOG_OPEN) console.log('app just become active.');
        });
        this.initFeedback();
        //气泡
        //this.createPaopao();
        //答题时间
        this.answerTime = 0;
        this.lastAnswerTime = 0;

        //'A/B/C/D',用户答案选项
        this.answerContext = '';
        //倒计时
        this.countDown = 300;
        //倒计时回调
        this.timeCallback = this.timeCallbackFunc();
        //是否在显示减时间
        this.isShowLossTime = false;
        //当前题目序号
        this.nowQuestionID = 0;
        //题目列表
        this.questionArr = [];
        //收集数据
        this.answerInfoArr = [];
        //列表js
        this.questionNumListJS = this.quertionList_node.getComponent("QuestionNumListJS");
        this.quertionList_node.opacity = 0;
        //this.title_node.opacity = 0;
        this.time_node.opacity = 0;
        //子类初始化
        this.onLoadChild();
        //答完题
        this.answerEnable = false;
        //请求数据
        this.network = this.node.getComponent('NetworkJS_Data');
        this.network.sendXHR(this);
    },
    initFeedback: function initFeedback() {
        //创建龙虾
        var feedback = cc.instantiate(this.feedback_pref);
        this.feedback_node.addChild(feedback);
        //反馈
        //this.feedbackJS = feedback.getComponent('ShowFeedback');
        //反馈JS
        this.feedbackJS = feedback.getChildByName('Fish').getComponent('FishFeedback');
    },
    //子类初始化
    onLoadChild: function onLoadChild() {},
    //转到后台
    gotoBackground: function gotoBackground() {},
    //转到前台
    gotoForeground: function gotoForeground() {},

    //加载泡泡
    createPaopao: function createPaopao() {
        //左边
        var width = this.node.width;
        var height = 1012.0;
        var paopaoX = [120, 40, 160, 80, 200];
        var posY = height / paopaoX.length;
        for (var index = 0; index < paopaoX.length; index++) {
            var paopao = cc.instantiate(this.paopao_pref);
            paopao.x = paopaoX[index];
            paopao.y = -posY * index;
            this.paopao_node.addChild(paopao);
        }
        //右边
        for (var index = 0; index < paopaoX.length; index++) {
            var paopao = cc.instantiate(this.paopao_pref);
            paopao.x = width - paopaoX[index];
            paopao.y = -posY * index;
            this.paopao_node.addChild(paopao);
        }
    },

    // answerInfo['answerTime'] = '用时多少';
    // answerInfo['leveLQuestionDetailNum'] = 'IPS题目（小题）序号';
    // answerInfo['levelQuestionDetailID'] = 'IPS题目（小题） ID';
    // answerInfo['answerStatus'] = '答题状态 1：正确 2：错误';
    // answerInfo['answerContext'] = 'A/B/C/D';//用户答案选项
    createAnswerInfo: function createAnswerInfo(answerStatus) {
        var question = this.questionArr[this.nowQuestionID];
        if (!question) {
            return;
        }
        //组装数据
        var answerInfo = {
            answerTime: this.answerTime - this.lastAnswerTime,
            leveLQuestionDetailNum: question.leveLQuestionDetailNum,
            levelQuestionDetailID: question.levelQuestionDetailID,
            answerStatus: answerStatus,
            answerContext: this.answerContext
        };

        this.answerInfoArr.push(answerInfo);
    },
    //龙虾反馈
    showFeedback: function showFeedback(feedbackType) {
        if (this.nowQuestionID === 0) {
            //龙虾入场
            this.feedbackJS.firstShowFeedback(this, feedbackType);
        } else {
            //龙虾反馈
            this.feedbackJS.showFeedback(this, feedbackType);
        }
        //显示进度
        //this.network.gameLoadProgress(this.nowQuestionID, this.questionArr.length);
    },

    //龙虾入场完成-自动执行反馈
    firstFeedbackFinish: function firstFeedbackFinish() {},

    //龙虾反馈完成
    feedbackFinish: function feedbackFinish() {
        this.nowQuestionID += 1;
        //答题条数大于总条数  或者  时间用完
        var isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        if (this.nowQuestionID >= this.questionArr.length || this.countDown - this.answerTime <= 0 && isTotalCd) {
            if (CONSOLE_LOG_OPEN) console.log('答完了');
            var t = this.questionArr.length - this.nowQuestionID;
            for (var i = 0; i < t; i++) {
                this.answerTime = 0;
                this.lastAnswerTime = 0;
                this.createAnswerInfo('2');
                this.nowQuestionID += 1;
            }
            //清除反馈
            this.isIts && this.settlementJs.reset();

            this.network.gameOver(this.answerInfoArr);
        } else {
            //显示进度
            this.network.gameLoadProgress(this.nowQuestionID + 1, this.questionArr.length);
            //移除当前所有选项
            !this.isIts && this.deleteOption();
            //清除反馈
            this.settlementJs.reset();
            //开始下一题
            !this.isIts && this.startloadOption();
        }
    },
    // //龙虾反馈
    // showFeedback: function (type) {
    //     //龙虾反馈
    //     this.feedbackJS.showFeedback(type);

    //     this.nowQuestionID += 1;
    //     //显示进度
    //     //this.network.gameLoadProgress(this.nowQuestionID, this.questionArr.length);

    //     this.scheduleOnce(function () {
    //         if (this.nowQuestionID >= this.questionArr.length) {
    //             if (CONSOLE_LOG_OPEN) console.log('答完了');

    //             this.network.gameOver(this.answerInfoArr);
    //         } else {
    //             this.feedbackJS.animationStop();
    //             //移除当前所有选项
    //             this.deleteOption();
    //             //开始下一题
    //             !this.isIts && this.startloadOption();
    //         }
    //     }, 2.0);
    // },

    //显示减时间
    showLossTime: function showLossTime() {
        this.answerTime += this.loseTime;

        this.isShowLossTime = true;
        //透明度渐变
        this.loseTime_node.opacity = 255;

        var callFunc = cc.callFunc(function (target) {
            this.isShowLossTime = false;
            this.loseTime_node.opacity = 0;
        }, this);

        this.loseTime_node.runAction(cc.sequence(cc.fadeTo(1.0, 0), callFunc));
    },

    //倒计时回调
    timeCallbackFunc: function timeCallbackFunc() {
        var timeCallback = function timeCallback() {
            //用户答题时间
            this.answerTime += 1;
            //倒计时次数
            this.scheduleTime += 1;

            var timeString = this.countDown - this.answerTime;

            if (timeString <= 0) {
                //时间到
                if (CONSOLE_LOG_OPEN) console.log('时间到');
                this.timeout();
                this.isShowFeed = true;

                this.answerTime = this.countDown;
                this.timeLabel.string = '00:00';

                this.createAnswerInfo('2');

                this.showFeedback(3);

                //是减时间，取消定时器,放在showFeedback，要不然会不执行scheduleOnce
                if (this.answerTime > this.scheduleTime) {
                    //取消定时器
                    this.unschedule(this.timeCallback);
                }
            } else {
                this.timeLabel.string = this.timeFormat(timeString);
            }
        };
        return timeCallback;
    },
    timeFormat: function timeFormat(time) {
        var min = Math.floor(time / 60),
            sec = time % 60,
            fMin = min < 10 ? '0' + min : min,
            fSec = sec < 10 ? '0' + sec : sec;
        if (time > 59) {
            return fMin + ":" + fSec;
        } else {
            return '00:' + fSec;
        }
    },

    timeout: function timeout() {},
    //显示倒计时
    showSchedule: function showSchedule() {
        this.scheduleTime = 0;
        this.schedule(this.timeCallback, 1.0, this.countDown - 1);
    },

    //移除当前所有选项
    deleteOption: function deleteOption() {},

    //创建选项按钮
    createOption: function createOption(interactiveJson) {},
    //选择指定题目
    selectedOption: function selectedOption(questionID) {
        this.nowQuestionID = questionID;
        //移除当前所有选项
        this.deleteOption();
        var self = this;
        setTimeout(function () {
            self.startloadOption();
        }, 0);
    },
    //开始加载选项
    startloadOption: function startloadOption() {
        this.isIts && this.questionNumListJS.changeOptionDisable();

        var question = this.questionArr[this.nowQuestionID];

        // this.titlelabel.string = question.qescont;

        // this.createOption(question.interactiveJson);

        // //倒计时
        // let countDown = parseInt(question.interactiveJson['countDown']);
        // if (countDown > 0) {
        //     this.countDown = countDown;

        this.timeLabel.string = this.timeFormat(this.countDown);

        this.answerTime = 0;

        !this.isIts && this.showSchedule();
        this.isIts && this.questionNumListJS.changeOptionEnable();
        this.isShowFeed = false;
    },

    //题目下载完成，开始游戏
    startLoadGame: function startLoadGame(questionArr) {
        this.questionArr = questionArr;
        // this.title_node.opacity = this.isIts ? 255 : 0;
        this.quertionList_node.opacity = this.isIts ? 255 : 0;
        this.time_node.opacity = this.isIts ? 0 : 255;
        //its
        if (this.isIts && questionArr && questionArr.length > 0) {
            this.questionNumListJS.init(questionArr.length, this.selectedOption.bind(this));
        }
        if (REQUEST_URL) {
            this.requestAllUrls();
        } else {
            this.startloadOption();
        }
        this.playBGMAudio();
        this.playTimuAudio();
        this.BasicAni();
    },
    requestAllUrls: function requestAllUrls() {
        var urls = [];
        //提取所有的图片地址
        for (var i = 0; i < this.questionArr.length; i++) {
            //获取题干图片
            if (this.questionArr[i].quescontimgAry instanceof Array) {
                for (var j = 0; j < this.questionArr[i].quescontimgAry.length; j++) {
                    urls.push(this.questionArr[i].quescontimgAry[j]);
                }
            }
            if (this.questionArr[i].optionsArr instanceof Array) {
                for (var _j = 0; _j < this.questionArr[i].optionsArr.length; _j++) {
                    if (this.questionArr[i].optionsArr[_j].optioncontimg) {
                        urls.push(this.questionArr[i].optionsArr[_j].optioncontimg);
                    }
                }
            }
        }
        //开始加载
        var self = this;
        cc.loader.load(urls, function (errors, texs) {
            if (errors) {
                self.network.gameLoadFailed(1);
                return;
            }
            //设置图片映射集合
            self.spriteMaps = texs.map;
            self.startloadOption();
        });
    },
    //获取下载的图片例如:this.node.getComponent(cc.Sprite).spriteFrame = this.gameJS.getSpriteFrame(this.option.optioncontimg);
    getSpriteFrame: function getSpriteFrame(spriteUrl) {
        if (!spriteUrl || spriteUrl.length == 0) return null;
        var r = this.spriteMaps[spriteUrl].content;
        if (r instanceof cc.Texture2D) {
            return new cc.SpriteFrame(r);
        }
        return null;
    },
    //选中答案
    selectAnswer: function selectAnswer(target, isRight) {
        //显示状态过程中不接收事件
        if (this.isShowFeed || this.isShowLossTime) {
            return;
        }

        if (isRight) {
            if (CONSOLE_LOG_OPEN) console.log('答对了');

            this.rightSelect += 1;

            target.showParticle();

            //题打完了
            if (this.rightSelect >= this.count) {
                //取消定时器
                this.unschedule(this.timeCallback);

                this.isShowFeed = true;

                this.createAnswerInfo('1');

                this.scheduleOnce(function () {
                    this.showFeedback(1);
                }, 1.0);
            }
        } else {
            if (CONSOLE_LOG_OPEN) console.log('答错了');

            this.showLossTime();
        }
    },

    onDestroy: function onDestroy() {
        document.removeEventListener('resignActivePauseGame');
        document.removeEventListener('becomeActiveResumeGame');
    },
    //设置游戏标题名
    setGameName: function setGameName(val) {
        this.title_node.getComponent("TitleJS").init(val);
    },

    //its 兼容
    setPlatform: function setPlatform(val) {
        this.platform = val;
        this.isIts = val == "its";
        var isIts = this.isIts;
        this.quertionList_node.active = isIts ? true : false;
        //this.title_node.active = isIts ? true : false;
        this.time_node.active = isIts ? false : true;
    },

    //复位
    resetOption: function resetOption() {
        if (this.moveOptionTag != 0) {
            var moveOption = this.option_node.getChildByTag(this.moveOptionTag);
            var optionJs = moveOption.getComponent('Option');
            optionJs.reloadState();
            this.moveOptionTag = 0;
        }
    },

    //moveTag
    changeMoveTag: function changeMoveTag(tag) {
        // if (!this.answerEnable || this.isShowFeed || this.isShowLossTime) {
        //     return false;
        // }
        if (this.isShowFeed) {
            return false;
        }
        if (this.moveOptionTag === 0 || this.moveOptionTag === tag || tag === 0) {
            this.moveOptionTag = tag;
            return true;
        } else {
            return false;
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
        //# sourceMappingURL=BaseGameJS.js.map
        