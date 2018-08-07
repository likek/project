"use strict";
cc._RF.push(module, '64af7fqo+JH17aITx262Fhi', 'PaoPaoJS');
// components/Paopao/PaoPaoJS.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        paopao: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.paopao.scale = Math.random() * 0.7 + 0.3;
        // this.offsetX = (Math.random() * 2 - 1) * 0.1;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        // this.paopao.x += this.offsetX;
        this.paopao.y += 2.0;
        if (this.paopao.y >= 1012) {
            this.paopao.scale = Math.random() * 0.7 + 0.3;
            this.paopao.y = 0.0;
        }
    }
});

cc._RF.pop();