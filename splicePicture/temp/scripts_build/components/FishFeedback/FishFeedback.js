"use strict";
cc._RF.push(module, '0ff94mXJf1DlrAO3t9YGlxy', 'FishFeedback');
// components/FishFeedback/FishFeedback.js

'use strict';

var FeedbackType = cc.Enum({
    First: 0,
    Congratulations: 1,
    Refuel: 2,
    TimeOver: 3,
    Default: 4

});

cc.Class({
    extends: cc.Component,

    properties: {
        fishFeedNode: cc.Node,
        rightBoard: cc.Node,
        wrongBoard: cc.Node,
        timeOverBoard: cc.Node,
        fish: cc.Node,
        starAnim: cc.Animation,
        fishSprite: cc.Sprite,
        defaultFish: cc.SpriteFrame,
        winFish: cc.SpriteFrame,
        lostFish: cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.feedbackType = FeedbackType.First;

        this.fishAnim = this.fish.getComponent(cc.Animation);
    },

    //入场
    firstShowFeedback: function firstShowFeedback(target, feedbackType) {
        this.target = target;
        this.feedbackType = feedbackType;

        this.fishAnim.play('fishOnLoad');
    },

    //入场结束
    firstFeedbackFinish: function firstFeedbackFinish() {
        this.showFeedback(this.target, this.feedbackType);

        if (this.target) {
            this.target.firstFeedbackFinish();
        }
    },

    //开始动画
    showFeedback: function showFeedback(target, feedbackType) {
        this.target = target;
        this.feedbackType = feedbackType;

        if (feedbackType === FeedbackType.Congratulations) {
            //答对了
            this.fishSprite.spriteFrame = this.winFish;

            this.fishAnim.play('fishCongratulations');

            this.starAnim.play();

            this.rightBoard.getComponent(cc.Animation).play();
        } else if (feedbackType === FeedbackType.Refuel) {
            //答错了
            this.fishSprite.spriteFrame = this.lostFish;

            this.fishAnim.play('fishRefuel');

            this.wrongBoard.getComponent(cc.Animation).play();
        } else if (feedbackType === FeedbackType.Default) {
            //default
            this.fishSprite.spriteFrame = this.defaultFish;

            this.fishAnim.play('fishdefault');
        } else if (feedbackType === FeedbackType.TimeOver) {
            //时间到
            this.fishSprite.spriteFrame = this.lostFish;

            this.fishAnim.play('fishRefuel');
            this.timeOverBoard.getComponent(cc.Animation).play();
        }
    },

    //动画结束
    feedbackFinish: function feedbackFinish() {
        //播放漂浮动画
        this.showFeedback(this.target, FeedbackType.Default);

        if (this.target) {
            this.target.feedbackFinish();
        }
    }

});

cc._RF.pop();