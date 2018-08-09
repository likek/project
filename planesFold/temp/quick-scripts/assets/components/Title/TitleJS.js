(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/components/Title/TitleJS.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5b283IiR/BBgLkN+zazJigp', 'TitleJS', __filename);
// components/Title/TitleJS.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label
    },

    init: function init(title) {
        this.label.string = title;
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
        //# sourceMappingURL=TitleJS.js.map
        