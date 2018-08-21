(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/AnswerContainer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ca872iTmrBNz6Mbhd+BMS3O', 'AnswerContainer', __filename);
// scripts/AnswerContainer.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        answer: cc.Prefab,
        node2x2: cc.Prefab,
        node2x3: cc.Prefab,
        node3x3: cc.Prefab,

        gameJS: null,
        bottomNode: cc.Node
    },
    start: function start() {},


    // update (dt) {},

    initData: function initData(data) {
        this.node.removeAllChildren();
        if (!this.checkData(data)) return;
        this.layoutType = data;
        var parent = data === "2x2" ? this.node2x2 : data === "2x3" ? this.node2x3 : this.node3x3;
        parent = cc.instantiate(parent);
        this.node.addChild(parent);
        data = data.split("x");
        var col = data[0];
        var row = data[1];
        var avaliWidth = parent.width;
        var availHeight = parent.height;
        var itemWidth = avaliWidth / col;
        var itemHeight = availHeight / row;
        for (var r = 0; r < row; r++) {
            for (var c = 0; c < col; c++) {
                var answer = cc.instantiate(this.answer);
                parent.addChild(answer);
                answer.width = itemWidth;
                answer.height = itemHeight;
                answer.x = itemWidth * c + itemWidth / 2 - avaliWidth / 2;
                answer.y = itemHeight * r + itemHeight / 2 - availHeight / 2;
                answer.__optionId = row - 1 - r + "-" + c;
                answer.getComponent(cc.CircleCollider).radius = Math.min(answer.height, answer.width) * 0.248;

                var answerCopy = new cc.Node();
                answerCopy.addComponent(cc.Sprite);
                this.bottomNode.addChild(answerCopy);
                answerCopy.width = answer.width;
                answerCopy.height = answer.height;
                answerCopy.x = answer.x;
                answerCopy.y = answer.y;

                var option = this.getOptionByAnswer(answer.__optionId);
                option && (answerCopy.getComponent(cc.Sprite).spriteFrame = this.gameJS.getSpriteFrame(option.optioncontimg));
            }
        }
    },
    checkData: function checkData(data) {
        return typeof data === "string" && /\d+x\d+/.test(data);
    },
    getOptionByAnswer: function getOptionByAnswer(optionID) {
        var question = this.gameJS.questionArr[this.gameJS.nowQuestionID];
        var options = question.optionsArr;
        var res = null;
        for (var i = 0; i < options.length; i++) {
            if (options[i].optionContent === optionID) {
                res = options[i];
                break;
            }
        }
        return res;
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
        //# sourceMappingURL=AnswerContainer.js.map
        