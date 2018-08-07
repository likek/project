(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/NetworkJS_Data.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8febaBdc6ZNMK6NnHe3UpZb', 'NetworkJS_Data', __filename);
// scripts/NetworkJS_Data.js

'use strict';

var NetworkJS = require("NetworkJS");

cc.Class({
	extends: NetworkJS,

	properties: {},
	/*
 *************************配置示例*********************
  "interactiveJson": {
 	"monkey":{
 		"isShow": true
 	},
 	"frog":{
 		"isShow": true
 	},
 	"giraffe":{
 		"isShow": true
 	},
 	"belt":{
 		"moveSpeed": true
 	}
 },
  "optionandanswers": [
 	 {
 		"options": [
 			{
 				"optioncontent": "<span>1</span>",
 				"optioncontimg": "http://127.0.0.1:3000/other/classifyShipImgs/apple.png"
 			},
 			{
 				"optioncontent": "<span>2</span>",
 				"optioncontimg": "http://127.0.0.1:3000/other/classifyShipImgs/ball1.png"
 			},
 		],
 	 }
  ]
 **************************配置说明************************
 ** monkey: 猴子相关配置
 ** monkey.isShow: 布尔类型，猴子是否显示，true表示显示，false表示不显示
 	** frog: 青蛙相关配置
 ** frog.isShow: 布尔类型，青蛙是否显示，true表示显示，false表示不显示
 	** giraffe: 长颈鹿相关配置
 ** giraffe.isShow: 布尔类型，长颈鹿是否显示，true表示显示，false表示不显示
 	** belt：传送带相关设置
 ** belt.moveSpeed: 数字类型，传送带移动速度（每一帧移动的距离)，推荐设置为3
 	** options：数组类型，选项配置(传送带上的所有物品)
 ** 每一个选项(传送带上的每一个物品): 
 ** { 
 ** 	optioncontent：数字类型(只能是1或2或3)，表示该物品的类型，1代表水果类，2代表球类，3代表饼干类
 **	optioncontimg: 该物品的图片地址
 ** }
 */
	analysisDict: function analysisDict(questionDict) {
		var interactiveJson = questionDict.interactiveJson;
		if (!interactiveJson || interactiveJson.length == 0) {
			//容错不录json的情况
			this.gameLoadFailed(2);
			return;
		} else if (typeof interactiveJson == 'string') {
			interactiveJson = JSON.parse(interactiveJson);
		}

		var optionandanswer = questionDict.optionandanswers[0];

		var options = optionandanswer.options;

		var optionsArr = [];
		for (var i = 0; i < options.length; ++i) {
			var option = options[i];
			var optioncontent = option.optioncontent;
			var temp = {
				optionNo: option.optionno, //选项
				optionContent: this.removeSpan(optioncontent), //选项答案
				optioncontimg: option.optioncontimg,
				optionFlip: this.removeSpan(optioncontent)
			};
			//optionContent:53 optionNo:A
			optionsArr.push(temp);
		}
		var quescontimg = questionDict.quescontimg;
		var qescontsound = questionDict.qescontsound;

		if (!interactiveJson.rightAry || !interactiveJson.questionAry || !interactiveJson.optionCount || !interactiveJson.countDown) {
			this.gameLoadFailed(2);
		}

		if (optionsArr || optionsArr.length > 0) {
			//每一道小题内容
			var question = {
				answerTime: '0', //答题时间
				levelQuestionDetailID: questionDict.questionid, //IPS题目（小题） ID
				leveLQuestionDetailNum: questionDict.orderid, //IPS题目（小题）序号
				qescont: this.removeSpan(questionDict.qescont), //题干
				optionsArr: optionsArr, //选项
				rightOptionNo: this.removeSpan(optionandanswer.rightanswer), //正确选项
				questionPositon: interactiveJson.questionPositon, //放置位置
				quescontimgAry: quescontimg,
				question_img: quescontimg.length > 0 && quescontimg[0],
				answer_img: quescontimg.length > 1 && quescontimg[1],
				answer_finish: quescontimg.length > 2 && quescontimg[2],
				bgm_candyAudio: qescontsound.length > 0 && qescontsound[0],
				cndybasinAudio: qescontsound.length > 1 && qescontsound[1],

				interactiveJson: interactiveJson, //格外配置json	
				belt: interactiveJson.belt,
				frog: interactiveJson.frog,
				giraffe: interactiveJson.giraffe,
				monkey: interactiveJson.monkey
			};

			return question;
		} else {
			this.gameLoadFailed(2);
		}
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
        //# sourceMappingURL=NetworkJS_Data.js.map
        