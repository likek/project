"use strict";
cc._RF.push(module, '8febaBdc6ZNMK6NnHe3UpZb', 'NetworkJS_Data');
// scripts/NetworkJS_Data.js

'use strict';

var NetworkJS = require("NetworkJS");

cc.Class({
	extends: NetworkJS,

	properties: {},
	/* 
 ** optioncontent: 该图片的正确位置标号，位置标号规则如下
 ** quescontimg: 该图片链接
 */
	/* 3x3位置标号规则(2x2和2x3同理)：
  0-0 | 0-1 | 0-2
  1-0 | 1-1 | 1-2
  2-0 | 2-1 | 2-2
 */
	/* 其他说明：
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
				matrixType: interactiveJson.matrixType //备用(可选)字段,阵列形式(2X3,3x3等)
			};

			return question;
		} else {
			this.gameLoadFailed(2);
		}
	}

});

cc._RF.pop();