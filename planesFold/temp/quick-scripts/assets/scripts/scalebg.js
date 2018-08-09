(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/scalebg.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3093551zVpLp4AjCVzrt6iQ', 'scalebg', __filename);
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
        var scale = Math.max(cc.winSize.width / this.designSize.width, cc.winSize.height / this.designSize.height);
        this.node.setScale(scale, 1);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=scalebg.js.map
        