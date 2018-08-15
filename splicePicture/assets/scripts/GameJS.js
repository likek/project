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

        flags: cc.Node,//旗子
        cattle: cc.Node,//牛

    },

    onLoadChild: function () {
        this._super();
        this.scaleNode = this.node.getChildByName('scale');
        this.option_node = this.scaleNode.getChildByName('option_node');
        this.tipsNode = this.node.getChildByName('TipsNode');
        this.tipsNode && (this.tipsNode.active = true);
        this.answerItemPool = new cc.NodePool();
        this.prompt_nodeJS = this.scaleNode.getChildByName('prompt_node').getComponent('title');
        this.changeMoveTag(0);
        this.initToast();

        this.flagsJs = this.flags.getComponent("Flags");
        this.cattleJS = this.cattle.getComponent("Cattle");
    },
    //初始化toast框
    initToast: function () {
        var efailed = this.node.getChildByName('scale').getChildByName('efailed');
        this.efailedJs = efailed.getComponent('efailed');
        this.efailedJs.game = this;

    },

    tipsClick: function () {
        this.tipsNode.removeFromParent(true);
        this.tipsNode.destroy();
        !this.isIts && this.showSchedule();
        let isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        isTotalCd && (this.lastAnswerTime = this.answerTime);

    },
    initFeedback: function () {
        this.settlement = cc.instantiate(this.settlePrefab);
        this.settlementJs = this.settlement.getComponent('settlement');
        this.settlementJs.game = this;
        var feedbackNode = this.node.getChildByName('feedback_node');
        feedbackNode.addChild(this.settlement);
        this.settlement.active = false;
    },
    //转到后台
    gotoBackground: function () {
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
        let submitButton = this.node.getChildByName('button_node').getChildByName('commit'),
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
    timeout: function () {

    },

    //移除当前所有选项
    deleteOption: function () {
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
    startloadOption: function () {
        this.updateGameState(true);
        this.isIts && this.questionNumListJS.changeOptionDisable();
        var question = this.questionArr[this.nowQuestionID];
        //启动业务初始化
        this.prompt_nodeJS.setTitle(question.qescont, null);

        //正确答案
        this.rightOptionNo = question.rightOptionNo;
        this.createOption(question.optionsArr);
        //倒计时
        let isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        if (this.nowQuestionID === 0 && isTotalCd || !isTotalCd) {
            this.answerTime = 0;
            let countDown = parseInt(question.interactiveJson['countDown']);
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

        let matrixType = question.matrixType;
        if(!matrixType){
            switch(question.optionsArr.length){
                case 4:matrixType = "2x2";break;
                case 6:matrixType = "2x3";break;
                case 9: matrixType = "3x3";break;
            }
        }
        this.flagsJs.initData(question.optionsArr,this);
        this.cattleJS.initData(matrixType,this);
    },

    //选中答案
    selectAnswer: function (isRight) {
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
    showFeedback: function (type) {
        if (type === 1) {
            //出发
            AUDIO_OPEN && this.playWinAudio();
            this.settlementJs.playWinAnim(this.feedbackFinish);
        } else if (type === 2) {
            //出发
            AUDIO_OPEN && this.playLoseAudio();
            this.settlementJs.playLoseAnim(this.feedbackFinish);
        } else if (type === 3) { //时间到逻辑

            //出发
            AUDIO_OPEN && this.playLoseAudio();
            this.settlementJs.playTimeUpAnim(this.feedbackFinish);
        }
    },
    updateGameState: function (interactable) {
        if (interactable) {
            this.question_node.resumeSystemEvents(true);
            this.option_node.resumeSystemEvents(true);
        } else {
            this.question_node.pauseSystemEvents(true);
            this.option_node.pauseSystemEvents(true);

        }
    },
    
    otherClicked: function () {
        this.playCancelAudio();
        if (this.isShowFeed) {
            return;
        }
    },
    /* 再来一次 */
    resetClicked: function () {
        let cb = () => {
            let array = this.option_node.children;
            array.forEach((obj, idx) => {
                let optionJS = obj.getComponent('OptionJS');
                optionJS && optionJS.reloadState();
            }, this);

        };
        this.playCancelAudio();

        if (this.isShowFeed || this.isShowAnim) {
            return;
        }

        cb();
    },
    /* 确认 */
    confirmClicked: function () {

        let cb = () => {
            let array = this.option_node.children;
            let isEqual = true;
            array.forEach((obj, idx) => {
                let optionJS = obj.getComponent('OptionJS');
                if (this.rightAry.indexOf(idx.toString()) != -1) {
                    if (optionJS && optionJS.state != 2) {
                        isEqual = false;
                    }
                } else { //错误区为正确时
                    if (optionJS && optionJS.state == 2) {
                        isEqual = false;
                    }
                }
            }, this);

            this.selectAnswer(isEqual);
        };
       this.playCancelAudio();
        //this.isShowAnim
        if (this.isShowFeed || this.checkIsEmpty()) {
            return;
        }

        cb();
    },
    checkIsEmpty: function () {
        let array = this.option_node.children;
        let isEmpty = true;
        array.forEach((obj, idx) => {
            let optionJS = obj.getComponent('OptionJS');
            //正确区不为正确时
            if (optionJS && optionJS.state > 1) {
                isEmpty = false;
            }
        }, this);
        return isEmpty;
    },
    playWinAudio: function () {
        this.playAudio(this.winAudio);
    },

    playLoseAudio: function () {
        this.playAudio(this.loseAudio);
    },
    playCancelAudio: function () {
        this.playAudio(this.resetAudio);
    },
    playOptionAudio: function () {
        this.playAudio(this.optionAudio);
    },
    playOptionOutAudio: function () {
        this.playAudio(this.option_outAudio);
    },

    //播放音效
    playAudio: function (audio) {
        if (AUDIO_OPEN) {
            cc.audioEngine.play(audio, false, 1);
        }
    },


});