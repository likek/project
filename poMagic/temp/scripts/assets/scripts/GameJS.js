"use strict";
cc._RF.push(module, 'd92c8sRpIBMBKs/RzLIjTLN', 'GameJS');
// scripts/GameJS.js

'use strict';

var BaseGameJS = require("BaseGameJS");

cc.Class({
    extends: BaseGameJS,

    properties: {},

    onLoadChild: function onLoadChild() {
        this._super();
        //cc.director.setDisplayStats(true);
    },

    //移除当前所有选项
    deleteOption: function deleteOption() {},

    //创建选项按钮
    createOption: function createOption(interactiveJson) {},

    //开始加载选项
    startloadOption: function startloadOption() {
        this.isIts && this.questionNumListJS.changeOptionDisable();

        var question = this.questionArr[this.nowQuestionID];
        //启动业务初始化


        this.timeLabel.string = this.timeFormat(this.countDown);
        this.answerTime = 0;

        !this.isIts && this.showSchedule();
        this.isIts && this.questionNumListJS.changeOptionEnable();
        this.isShowFeed = false;
    },

    //选中答案
    selectAnswer: function selectAnswer(isRight) {
        //显示状态过程中不接收事件
        if (this.isShowFeed || this.isShowLossTime) {
            return;
        }
        this.unschedule(this.timeCallback);
        this.isShowFeed = true;

        if (isRight) {
            if (CONSOLE_LOG_OPEN) console.log('答对了');
            this.createAnswerInfo('1');
            this.scheduleOnce(function () {
                this.showFeedback(1);
            }, 1.0);
        } else {
            if (CONSOLE_LOG_OPEN) console.log('答错了');
            this.createAnswerInfo('2');
            this.showFeedback(2);
        }
    }

});

cc._RF.pop();