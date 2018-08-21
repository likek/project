var NetworkJS = require("NetworkJS");

cc.Class({
    extends: NetworkJS,

    properties: {
	},
	/* 
	** questionPositon: 右边题目位置四种情况:leftTop,rightTop,leftBottom,rightBottom  左上,右上,左下,右下.
	** optioncontent: 配置偏移度,没有则null. 四种.flipX,flipY,flip90,-flip90 水平翻转,垂直翻转,右翻90度,左翻90度. 
	** quescontimg: 3张图片链接,分别为左边整图,右边题目图,拼接完成图
		
	*/
    analysisDict: function (questionDict) {
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
				optionNo: option.optionno,//选项
				optionContent: this.removeSpan(optioncontent),//选项答案
				optioncontimg:option.optioncontimg,
				optionFlip : this.removeSpan(optioncontent),
			};
			//optionContent:53 optionNo:A
			optionsArr.push(temp);
		}
		var quescontimg = questionDict.quescontimg;
		var qescontsound = questionDict.qescontsound;
			
		if(!interactiveJson.rightAry || !interactiveJson.questionAry || !interactiveJson.optionCount || !interactiveJson.countDown){
			this.gameLoadFailed(2);			
		}

		if (optionsArr || optionsArr.length > 0) {
			//每一道小题内容
			var question = {
				answerTime: '0',//答题时间
				levelQuestionDetailID: questionDict.questionid,//IPS题目（小题） ID
				leveLQuestionDetailNum: questionDict.orderid,//IPS题目（小题）序号
				qescont: this.removeSpan(questionDict.qescont),//题干
				optionsArr: optionsArr,//选项
				rightOptionNo: this.removeSpan(optionandanswer.rightanswer),//正确选项
				questionPositon:interactiveJson.questionPositon,//放置位置
				quescontimgAry:quescontimg,
				question_img : quescontimg.length>0&&quescontimg[0],
				answer_img : quescontimg.length>1&&quescontimg[1],
				answer_finish : quescontimg.length>2&&quescontimg[2],
				bgm_candyAudio : qescontsound.length>0&&qescontsound[0],
				cndybasinAudio : qescontsound.length>1&&qescontsound[1],

				interactiveJson: interactiveJson,//格外配置json	
				matrixType: interactiveJson.matrixType,//备用(可选)字段,阵列形式(2X3,3x3等)
			};

			return question;
		} else {
			this.gameLoadFailed(2);
		}
	},

});
