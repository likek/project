cc.Class({
    extends: cc.Component,

    properties: {
        textLabel: cc.Label,
    },

    // use this for initialization
    init: function (target, option, spriteFrame) {
        this.target = target;

        this.optionNo = '';
        this.textLabel.string = '';

        this.node.getChildByName('Firefly').getChildByName('Sprite').getComponent(cc.Sprite).spriteFrame = spriteFrame;

        this.node.getChildByName('Firefly').opacity = 0;
        this.node.getChildByName('Firefly').scale = 1;

        this.node.getChildByName('Firefly').getComponent(cc.Animation).play();

        if (option) {
            this.optionNo = option.optionNo;
            this.textLabel.string = option.optionContent;
        }
    },

    buttonClick: function () {
        var isRight = this.target.selectAnswer(this.optionNo);
        if (isRight == 1) {
            this.node.getChildByName('Firefly').runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.scaleTo(0.12, 1.3),
                cc.scaleTo(0.16, 0),
            ));
        } else if (isRight == 2) {
            this.node.getChildByName('Firefly').runAction(cc.sequence(
                cc.delayTime(0.08),
                cc.moveBy(0.2, cc.p(123, 0)),
                cc.moveBy(0.08, cc.p(-123, 0)),
            ));
        }
    },

    goAnim: function () {
        var animName = 'Go_' + this.optionNo;
        this.node.getChildByName('Firefly').getComponent(cc.Animation).play(animName);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
