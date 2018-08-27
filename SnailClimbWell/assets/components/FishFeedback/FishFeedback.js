var FeedbackType = cc.Enum({
    First: 0,
    Congratulations: 1,
    Refuel: 2,
    TimeOver: 3,
    Default: 4,

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
        lostFish: cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
        this.feedbackType = FeedbackType.First;

        this.fishAnim = this.fish.getComponent(cc.Animation);
    },

    //入场
    firstShowFeedback: function (target, feedbackType) {
        this.target = target;
        this.feedbackType = feedbackType;

        this.fishAnim.play('fishOnLoad');
    },

    //入场结束
    firstFeedbackFinish: function () {
        this.showFeedback(this.target, this.feedbackType);

        if (this.target) {
            this.target.firstFeedbackFinish();
        }
    },

    //开始动画
    showFeedback: function (target, feedbackType) {
        this.target = target;
        this.feedbackType = feedbackType;

        if (feedbackType === FeedbackType.Congratulations) {
            //答对了
            this.fishSprite.spriteFrame = this.winFish;

            this.rightBoard.active = true;
            this.starAnim.node.active = true;

            this.fishAnim.play('fishCongratulations');

            this.starAnim.play();

            this.rightBoard.getComponent(cc.Animation).play();
        } else if (feedbackType === FeedbackType.Refuel) {
            //答错了
            this.fishSprite.spriteFrame = this.lostFish;

            this.timeOverBoard.active = false;

            this.wrongBoard.active = true;

            this.fishAnim.play('fishRefuel');

            this.wrongBoard.getComponent(cc.Animation).play();
        } else if (feedbackType === FeedbackType.Default) {
            //default
            this.fishSprite.spriteFrame = this.defaultFish;

            this.fishAnim.play('fishdefault');
        } else if (feedbackType === FeedbackType.TimeOver) {
            //时间到
            this.fishSprite.spriteFrame = this.lostFish;

            this.wrongBoard.active = false;

            this.timeOverBoard.active = true;

            this.fishAnim.play('fishRefuel');
            this.timeOverBoard.getComponent(cc.Animation).play();
        }
    },

    //动画结束
    feedbackFinish: function () {
        this.rightBoard.active = false;
        this.wrongBoard.active = false;
        this.timeOverBoard.active = false;
        this.starAnim.node.active = false;
        //播放漂浮动画
        this.showFeedback(this.target, FeedbackType.Default);

        if (this.target) {
            this.target.feedbackFinish();
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
