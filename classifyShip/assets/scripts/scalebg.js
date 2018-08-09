cc.Class({
    extends: cc.Component,
    properties: {
        designSize: cc.Size,
        bg: cc.Node,
        lbg: cc.Node,
        rbg: cc.Node,
    },
    // use this for initialization
    onLoad: function () {
        let scale = Math.max( cc.winSize.width/this.designSize.width,cc.winSize.height/this.designSize.height);
        this.node.setScale(scale, 1);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
});