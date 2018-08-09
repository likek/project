"use strict";
cc._RF.push(module, '511ccnUhPdEV5sMRHkmPNf2', 'QuestionNumJS');
// components/QuestionList/QuestionNum/QuestionNumJS.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        selected_node: cc.Node
    },
    onLoad: function onLoad() {
        this.isSelect = false;
        this.sp = this.node.getComponent("cc.Sprite");
    },
    init: function init(gameJS, idx) {
        this.gameJS = gameJS;
        this.idx = idx;
        var str = "" + (idx + 1) + "";
        this.label.string = str;
        this.selected_node.opacity = 0;
    },

    onClick: function onClick() {
        this.gameJS.changQustion(this.idx);
    },

    setSelected: function setSelected(val) {
        this.isSelect = val;
        this.selected_node.opacity = val ? 255 : 0;
    }

});

cc._RF.pop();