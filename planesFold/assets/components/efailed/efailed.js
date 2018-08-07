

cc.Class({
    extends: cc.Component,

    properties: {
       label: cc.Label
    },

    onLoad () {

    },
/*      
 * 调用方式:this.efailedJs.showHint();
 */
    //显示提示
    showHint: function(){
        this.node.stopAllActions();
        this.node.opacity = 255;

        this.label.string = '当前分类已经有了哦！';

        var callFunc = cc.callFunc(function (target) {
            this.node.opacity = 0;
        }, this);

        this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.fadeTo(0.5, 0), callFunc));
    },

    //显示限制提示
    showLimitHint: function(num){
        this.node.stopAllActions();
        this.node.opacity = 255;

        this.label.string = '啊哦！本题最多只能选择'+num+'个瓶子哦！';

        var callFunc = cc.callFunc(function (target) {
            this.node.opacity = 0;
        }, this);

        this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.fadeTo(0.5, 0), callFunc));
    },

    start () {

    },

    // update (dt) {},
});
