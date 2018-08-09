(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/components/QuestionList/QuestionNum/QuestionNumJS.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '511ccnUhPdEV5sMRHkmPNf2', 'QuestionNumJS', __filename);
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
        //# sourceMappingURL=QuestionNumJS.js.map
        