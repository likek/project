var NetworkJS = require("NetworkJS");

cc.Class({
    extends: NetworkJS,

    properties: {
	},

    //解析转换每一条数据
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
			var temp = {
				no: option.optionno,//选项
				txt: this.removeSpan(option.optioncontent),//选项描述
				spriteUrl: this.removeSpan(option.optioncontimg)
			};
			optionsArr.push(temp);
		}

		//每一道小题内容
		var question = {
			answerTime: '0',//答题时间
			levelQuestionDetailID: questionDict.questionid,//IPS题目（小题） ID
			leveLQuestionDetailNum: questionDict.orderid,//IPS题目（小题）序号
			qescont: this.removeSpan(questionDict.qescont),//题干
			quescontimg: questionDict.quescontimg, //题干
			qescontsound: questionDict.qescontsound[0], //声音
			interactiveJson: interactiveJson,//格外配置json
			options: optionsArr
		};
		return question;
	},

	
});
