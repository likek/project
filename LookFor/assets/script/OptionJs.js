let blockWidth = 315;
let miWidth = 100;

cc.Class({
    extends: cc.Component,

    properties: {
        numOption: cc.Prefab,

    },

    // use this for initialization
    onLoad: function () {
        this.rightanswer = null
        this.numData = [] //存放骨骼js 

    },
    initNumSpine: function (option, no) {
        this.numData = []

        this.rightanswer = no
        this.game.touchHandlerJs.clear();
        for (let i = 0, optionSp; i < option.length; i++) {
            optionSp = cc.instantiate(this.numOption);
            optionSp.parent = this.node;
            optionSp.position = cc.p(-option.length / 2 * (blockWidth + miWidth) + i * (blockWidth + miWidth) + miWidth / 2 + blockWidth / 2, -1290)
            let optionSpJs = optionSp.getComponent('OptionNumJs')
            optionSpJs.setData(option[i].no)
            optionSpJs.game = this.game;
            if (!this.game.isTips) {
                this.game.touchHandlerJs.regist(optionSpJs);
            }
            this.numData.push(optionSp)
        }
        this.showOption()

    },

    showOption: function () {
        this.scheduleOnce(function () {
            for (let i = 0; i < this.numData.length; i++) {
                let element = this.numData[i];
                element.runAction(cc.moveBy(0.4 + i * 0.1, 0, 645).easing(cc.easeIn(0.4 + i * 0.1)))
            }
            this.game.isIts && this.game.questionNumListJS.changeOptionEnable();  
        }, 0.7);

    },

    hideOption: function () {
        for (let i = 0; i < this.numData.length; i++) {
            let element = this.numData[i];
            element.runAction(cc.moveBy(0.4 + i * 0.1, 0, -645).easing(cc.easeOut(0.4)))
        }
    },

    getTipsSp: function () {
        return this.tipsSp
    },
    //重置
    reset: function () {
        this.node.removeAllChildren(true);
        this.game.touchHandlerJs.clear();
        this.numData = []
    },


    setTipsHandlPos: function () {
        let pos = null
        for (let i = 0; i < this.numData.length; i++) {
            let element = this.numData[i];
            let optionSpJs = element.getComponent('OptionNumJs')
            if (optionSpJs.no == this.rightanswer) {
                optionSpJs.isTouch = true
                pos = element.position
            } else {
                optionSpJs.isTouch = false
            }

        }
        return pos
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

