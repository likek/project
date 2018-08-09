"use strict";
cc._RF.push(module, 'b0b466dPFFI1ZCDMEewg3qk', 'ColliderListener');
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