"use strict";
cc._RF.push(module, '7a656I23ulAK7kDASga7f0X', 'QuestionNumListJS');
// components/QuestionList/QuestionNumListJS.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        lastBtn: cc.Node,
        nextBtn: cc.Node,
        quertionNum: cc.Prefab,
        questionNum_node: cc.Node
    },
    onLoad: function onLoad() {
        this.itemPool = new cc.NodePool();
        this.defaultLen = 7;
        this.targetIdx = 0;
        this.nowQuestionID = 0;
        //问题缓存
        this.qusetionItemPool = new cc.NodePool();
        //问题数组
        this.qusetionNumJSArr = [];
        //选中题目
        this.selectedQusetionJS = null;
    },
    init: function init(len, cb) {
        this.maxlen = len;
        this.cb = cb;
        if (len < this.defaultLen) {
            this.lastBtn.opacity = 0;
            this.nextBtn.opacity = 0;
        } else {
            this.lastBtn.opacity = 255;
            this.nextBtn.opacity = 255;
        }

        for (var idx = 0; idx < len; idx++) {
            var quertionNumPre = cc.instantiate(this.quertionNum);
            var quertionNumJS = quertionNumPre.getComponent("QuestionNumJS");
            //this.questionNum_node.addChild(quertionNumPre);  
            this.qusetionNumJSArr.push(quertionNumPre);
            quertionNumJS.init(this, idx);
        }

        this.changeQustionList();
        this.selectedQusetionJS = this.qusetionNumJSArr[this.nowQuestionID].getComponent("QuestionNumJS");;
        this.selectedQusetionJS.setSelected(true);
    },
    clickLast: function clickLast() {
        if (this.targetIdx >= this.defaultLen) {
            this.targetIdx -= this.defaultLen;
            this.changeQustionList();
        }
    },
    clickNext: function clickNext() {
        if (this.targetIdx + this.defaultLen < this.maxlen) {
            this.targetIdx += this.defaultLen;
            this.changeQustionList();
        }
    },
    changeQustionList: function changeQustionList() {
        this.questionNum_node.removeAllChildren();
        var targetIdx = this.targetIdx;
        var len = Math.min(this.defaultLen, this.maxlen - targetIdx);
        for (var idx = 0; idx < len; idx++) {
            var quertionNumPre = this.qusetionNumJSArr[idx + targetIdx];
            this.questionNum_node.addChild(quertionNumPre);
        }
    },
    //选题
    changQustion: function changQustion(questionID) {
        this.nowQuestionID = questionID;
        this.selectedQusetionJS.setSelected(false);
        this.selectedQusetionJS = this.qusetionNumJSArr[questionID].getComponent("QuestionNumJS");
        this.selectedQusetionJS.setSelected(true);
        //this.startloadOption();
        var cb = this.cb;
        cb && cb(questionID);
    },
    //选项按钮可用
    changeOptionEnable: function changeOptionEnable() {
        //暂停当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
        this.questionNum_node.resumeSystemEvents(true);
    },
    //选项按钮不可用
    changeOptionDisable: function changeOptionDisable() {
        //暂停当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
        this.questionNum_node.pauseSystemEvents(true);
    }
});

cc._RF.pop();