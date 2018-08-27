cc.Class({
    extends: cc.Component,

    properties: {
        paopao: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.paopao.scale = Math.random() * 0.7 + 0.3;
        // this.offsetX = (Math.random() * 2 - 1) * 0.1;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // this.paopao.x += this.offsetX;
        this.paopao.y += 2.0;
        if (this.paopao.y >= 1012) {
            this.paopao.scale = Math.random() * 0.7 + 0.3;
            this.paopao.y = 0.0;
        }
    },
});
