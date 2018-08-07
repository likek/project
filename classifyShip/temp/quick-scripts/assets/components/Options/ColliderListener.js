(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/components/Options/ColliderListener.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b0b466dPFFI1ZCDMEewg3qk', 'ColliderListener', __filename);
// components/Options/ColliderListener.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    },

    onCollisionEnter: function onCollisionEnter(other, self) {
        this.node.isCollisioned = true;
        this.node.opacity = 100;
    },

    onCollisionExit: function onCollisionExit(other, self) {
        if (CONSOLE_LOG_OPEN) console.log('on collision exit');
        this.node.isCollisioned = false;
        this.node.opacity = 255;
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
        //# sourceMappingURL=ColliderListener.js.map
        