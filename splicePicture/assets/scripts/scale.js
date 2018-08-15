cc.Class({
    extends: cc.Component,
    properties: {
       designSize: cc.Size
    },
    // use this for initialization
    onLoad: function () {
        let scale = Math.min(cc.winSize.width/this.designSize.width, cc.winSize.height/this.designSize.height);
        this.node.setScale(scale, scale);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
      
    // },
});