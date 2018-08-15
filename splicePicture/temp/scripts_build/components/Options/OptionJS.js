"use strict";
cc._RF.push(module, 'cec4fBlGJ1Nw5Qzjr1JzrRx', 'OptionJS');
// components/Options/OptionJS.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        option_node: cc.Node,
        label: cc.Label
    },

    init: function init(gameJS, option, optionLength) {
        this.gameJS = gameJS;
        this.option = option; //选项（选项，选项答案）
        this.label.string = option.optionContent; //读取选项答案
        this.optionNo = option.optionNo;
    },

    optionClick: function optionClick() {
        var self = this;
        self.updateState(false);
        this.scheduleOnce(function () {
            self.gameJS.selectAnswer(self.option);
        }, 0.2);
    },
    //按钮是否可点击
    updateState: function updateState(interactable) {
        var buttonCom = this.option_node.getComponent(cc.Button);
        buttonCom.interactable = interactable;
    }
});

cc._RF.pop();