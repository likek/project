(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/components/numTitlePre/js/title.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd58c4qtV15MNYbanwyOTHvL', 'title', __filename);
// components/numTitlePre/js/title.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        img: cc.Sprite
    },

    // use this for initialization
    onLoad: function onLoad() {},

    setTitle: function setTitle(title, img) {
        if (img && img instanceof Array && img.length > 1) {
            this.img.enabled = true;
            this.img.spriteFrame = this.game.getSpriteFrame(img[img.length - 1]);
            this.label.string = '';
        } else if (typeof title === 'string') {
            //替换加减= ？为可显示字符串  取值为 0之前的ascall 值  , - . /
            var newTitle = title.replace(/\+/g, ',').replace(/\=/g, '.').replace(/\?/g, '/');
            // /g全局搜索
            this.label.string = newTitle;
            this.img.spriteFrame = null;
        }
    },

    reset: function reset() {
        this.label.string = '';
        this.img.spriteFrame = null;
        this.img.enabled = false;
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
        //# sourceMappingURL=title.js.map
        