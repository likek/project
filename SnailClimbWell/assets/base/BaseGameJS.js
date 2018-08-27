cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel: cc.Label,

        quertionListNode: cc.Node,
        titleNode: cc.Node,

        bubbleNode: cc.Node,//泡泡背景
        bubblePref: cc.Prefab,//泡泡预制

        feedbackNode: cc.Node,//反馈节点
        feedbackPref: cc.Prefab,//反馈预制

        loseTimeNode: cc.Node,//减时间
        loseTime: 0,//减时间3秒
    },

    // use this for initialization
    onLoad: function () {
        //设置常驻节点
        cc.game.addPersistRootNode(this.node);
        //是否开启Retina
        // cc.view.enableRetina(false);
        //气泡
        this.createBubble();
        //答题时间
        this.answerTime = 0;
        //'A/B/C/D',用户答案选项
        this.answerContext = '';
        //倒计时
        this.countDown = 10;
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
        this.questionNumListJS = this.quertionListNode.getComponent("QuestionNumListJS");
        //请求数据
        this.network = this.node.getComponent('NetworkJS');
        this.network.sendXHR(this);
        //子类初始化
        this.onLoadChild();
    },

    //子类初始化
    onLoadChild: function () { },

    //加载泡泡
    createBubble: function () {
        //左边
        let width = this.node.width;
        let height = 1012.0;
        // let bubbleX = [120, 40, 160, 80, 200];
        let bubbleX = [120, 40, 80];
        let posY = height / (bubbleX.length);
        for (var index = 0; index < bubbleX.length; index++) {
            var bubble = cc.instantiate(this.bubblePref);
            bubble.x = bubbleX[index];
            bubble.y = - posY * index;
            this.bubbleNode.addChild(bubble);
        }
        //右边
        for (var index = 0; index < bubbleX.length; index++) {
            var bubble = cc.instantiate(this.bubblePref);
            bubble.x = width - bubbleX[index];
            bubble.y = - posY * index;
            this.bubbleNode.addChild(bubble);
        }
    },

    // answerInfo['answerTime'] = '用时多少';
    // answerInfo['leveLQuestionDetailNum'] = 'IPS题目（小题）序号';
    // answerInfo['levelQuestionDetailID'] = 'IPS题目（小题） ID';
    // answerInfo['answerStatus'] = '答题状态 1：正确 2：错误';
    // answerInfo['answerContext'] = 'A/B/C/D';//用户答案选项
    createAnswerInfo: function (answerStatus) {
        var question = this.questionArr[this.nowQuestionID];

        //组装数据
        var answerInfo = {
            answerTime: this.answerTime,
            leveLQuestionDetailNum: question.leveLQuestionDetailNum,
            levelQuestionDetailID: question.levelQuestionDetailID,
            answerStatus: answerStatus,
            answerContext: this.answerContext,
        };

        this.answerInfoArr.push(answerInfo);
    },

    //小鱼反馈
    showFeedback: function (feedbackType) {
        if (!this.feedbackJS) {
            this.feedbackNode.active = true;
            //创建龙虾
            var feedback = cc.instantiate(this.feedbackPref);
            this.feedbackNode.addChild(feedback);
            //反馈
            this.feedbackJS = feedback.getChildByName('Fish').getComponent('FishFeedback');
        }

        if (this.nowQuestionID === 0) {
            //龙虾入场
            this.feedbackJS.firstShowFeedback(this, feedbackType);
        } else {
            //龙虾反馈
            this.feedbackJS.showFeedback(this, feedbackType);
        }
    },

    //龙虾入场完成-自动执行反馈
    firstFeedbackFinish: function () {

    },

    //龙虾反馈完成
    feedbackFinish: function () {

    },

    nowQuestionFinish: function () {
        this.nowQuestionID += 1;

        if (this.nowQuestionID >= this.questionArr.length) {
            if (CONSOLE_LOG_OPEN) console.log('答完了');

            this.network.gameOver(this.answerInfoArr);
        } else {
            //显示进度
            this.network.gameLoadProgress(this.nowQuestionID + 1, this.questionArr.length);
            //移除当前所有选项
            this.deleteOption();
            //开始下一题
            !this.isIts && this.startloadOption();
        }
    },

    //显示减时间
    showLossTime: function () {
        this.answerTime += this.loseTime;

        this.isShowLossTime = true;
        //透明度渐变
        this.loseTimeNode.opacity = 255;

        var callFunc = cc.callFunc(function (target) {
            this.isShowLossTime = false;
            this.loseTimeNode.opacity = 0;
        }, this);

        this.loseTimeNode.runAction(cc.sequence(cc.fadeTo(1.0, 0), callFunc));
    },

    //倒计时回调
    timeCallbackFunc: function () {
        var timeCallback = function () {
            //用户答题时间
            this.answerTime += 1;
            //倒计时次数
            this.scheduleTime += 1;

            var timeString = this.countDown - this.answerTime;

            if (timeString <= 0) {
                //时间到
                if (CONSOLE_LOG_OPEN) console.log('时间到');

                this.isShowFeed = true;

                this.answerTime = this.countDown;
                this.timeLabel.string = '00:00';

                this.noticeTimeOver();

                //是减时间，取消定时器,放在showFeedback，要不然会不执行scheduleOnce
                if (this.answerTime > this.scheduleTime) {
                    //取消定时器
                    this.unschedule(this.timeCallback);
                }
            } else {
                this.setCountDown(timeString);
            }
        }
        return timeCallback;
    },

    //设置倒计时时间
    setCountDown: function (timeString) {
        if (timeString > 60) {
            var minute = parseInt(timeString / 60);
            var second = timeString % 60;

            var time = '';
            if (minute >= 10) {
                time = minute + ':';
            } else {
                time = '0' + minute + ':';
            }
            if (second >= 10) {
                time = time + second;
            } else {
                time = time + '0' + second;
            }
            this.timeLabel.string = time;
        } else if (timeString < 10) {
            this.timeLabel.string = '00:0' + timeString;
        } else {
            this.timeLabel.string = '00:' + timeString;
        }
    },

    //显示倒计时
    showSchedule: function (countDown) {
        this.countDown = countDown;
        this.scheduleTime = 0;

        this.schedule(this.timeCallback, 1.0, countDown - 1);
    },

    //时间到
    noticeTimeOver: function () {
    },

    //题目下载完成，开始游戏
    startLoadGame: function (questionArr) {
        this.questionArr = questionArr;
        this.titleNode.active = this.isIts ? true : false;
        this.quertionListNode.active = this.isIts ? true : false;
        this.timeLabel.node.parent.active = this.isIts ? false : true;
        //its
        this.isIts && questionArr && (questionArr.length > 0)
            && this.questionNumListJS.init(questionArr.length, this.selectedOption.bind(this));
        //开始加载题目
        this.startloadOption();
    },

    //选择指定题目
    selectedOption: function (questionID) {
        this.nowQuestionID = questionID;
        //移除当前所有选项
        this.deleteOption();
        var self = this;
        setTimeout(function () {
            self.startloadOption();
        }, 0);
    },

    //移除当前所有选项
    deleteOption: function () {
    },

    //创建选项按钮
    createOption: function () {
    },

    //开始加载选项
    startloadOption: function () {
    },

    //设置游戏标题名
    setGameName: function (val) {
        this.titleNode.getComponent("TitleJS").init(val);
    },

    //its 兼容
    setPlatform: function (val) {
        this.platform = val;
        this.isIts = val == "its";
    },

});