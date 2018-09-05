cc.Class({
    extends: cc.Component,

    properties: {
        // ...
    },

    // use this for initialization
    onLoad: function () {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    },
    
    onCollisionEnter: function (other, self) {
        this.node.isCollisioned = true;
        this.node.opacity = 100;
    },
    
    onCollisionExit: function (other, self) {
        if (CONSOLE_LOG_OPEN) console.log('on collision exit');
        this.node.isCollisioned = false;
        this.node.opacity = 255;  
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
