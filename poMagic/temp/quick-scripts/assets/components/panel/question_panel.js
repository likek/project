(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/components/panel/question_panel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '518c6EygmVF7aZ+N0GUpC9+', 'question_panel', __filename);
// components/panel/question_panel.js

'use strict';

var questionAry = [];
//选项区域
cc.Class({
    extends: cc.Component,

    properties: {
        oItemPrefab: cc.Prefab //背景预制
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.oItemPool = new cc.NodePool();
    },
    isEmpty: function isEmpty() {
        return questionAry.length == 0;
    },
    copyAry: function copyAry() {
        //return Array.from(questionAry);//不支持9以下系统
        var newAry = questionAry.slice(0, questionAry.length);
        if (CONSOLE_LOG_OPEN) console.log('questionAry.slice' + newAry + '  ' + questionAry);

        return newAry;
    },
    //创建选项floor向下取整,ceil向上取整
    createOptions: function createOptions() {

        for (var i = 0, option, optionJs; i < questionAry.length; i++) {

            if (i == this.questionAry.length - 1) {
                if (this.oItemPool.size() > 0) {
                    option = this.oItemPool.get();
                } else {
                    option = cc.instantiate(this.oItemPrefab);
                }
                option.parent = this.node;
            } else {
                option = this.node.children[i];
            }
            var width = option.width,
                height = this.node.height,
                paddingX = 15,
                paddingY = 10,
                wcount = 3,
                index = i % 3,

            // x = (-wcount / 2 + index + 0.5) * (width + paddingX),
            x = (index - 1) * (width + paddingX),
                y = i < 3 ? height / 3 + paddingY : i < 6 ? paddingY * 3 : -height / 3 + paddingY * 5.5;
            option.setPosition(cc.p(x, y));
        }
    },

    addOption: function addOption(contentAry) {
        var _this = this;

        var cb = function cb() {
            //node.zIndex = this.num++; //不设置zIndex,数组里取值顺序错乱
            var newAry = contentAry.slice(0, contentAry.length);
            questionAry.push(newAry.sort(_sortNumber));
            _this.createOptions(contentAry);
            // this.numLabel.string = questionAry.length;
            _this.updateSum();
        };
        cb();
    },

    /* 还原所有状态 */
    removeAllOption: function removeAllOption() {

        for (var i = 0; i < this.node.children.length; i++) {
            var contentNode = this.node.children[i];
            contentNode.removeAllChildren(true);
        }
        this.node.removeAllChildren(true);

        questionAry.splice(0, questionAry.length);
        questionAry = [];
        this.updateSum();
    },
    //更新显示
    updateSum: function updateSum() {
        //this.textLabel.string = this.questionAry.length;
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
        //# sourceMappingURL=question_panel.js.map
        