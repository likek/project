"use strict";
cc._RF.push(module, '3093551zVpLp4AjCVzrt6iQ', 'scalebg');
// scripts/scalebg.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        designSize: cc.Size,
        bg: cc.Node,
        lbg: cc.Node,
        rbg: cc.Node
    },
    // use this for initialization
    onLoad: function onLoad() {
        var w = (cc.winSize.width - this.designSize.width) / 2;

        //         if(w > 0){
        //             this.lbg.width = Math.max(w, 512);
        //             this.rbg.width = Math.max(w, 512);
        //         }else{
        //             let scale = Math.min(cc.winSize.width/this.designSize.width, cc.winSize.height/this.designSize.height);
        //             this.node.setScale(scale, 1);
        //         }
        var scale = Math.max(cc.winSize.width / this.designSize.width, cc.winSize.height / this.designSize.height);
        this.node.setScale(scale, 1);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
});

cc._RF.pop();