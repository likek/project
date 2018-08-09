(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/scale.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '521434wupJHAqZevOCVOyWl', 'scale', __filename);
// scripts/scale.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        designSize: cc.Size
    },
    // use this for initialization
    onLoad: function onLoad() {
        var scale = Math.min(cc.winSize.width / this.designSize.width, cc.winSize.height / this.designSize.height);
        this.node.setScale(scale, scale);
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
        //# sourceMappingURL=scale.js.map
        