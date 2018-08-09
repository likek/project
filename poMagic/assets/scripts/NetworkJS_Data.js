var NetworkJS = require("NetworkJS");

cc.Class({
    extends: NetworkJS,

    properties: {
	},
	/* 
	** 	** qescont: 题干,本题为?+?=10
	** qescontsound:题干音频,配置两个,第一个为背景音bgm_candy,第二个为规则音vof_cndybasin.
	** gap: 提醒时间,多少s不操作轮播一次规则音,推荐37.
	**optioncontent:对应选项内容
	** rightAry: 按拖拽顺序5,4,3位置对应值,如["3","2","12"].从上到下两排位置为1,2,3,4,5,6.
	** contentAry:1,2位置对应值,如["5","7"].
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
			};
			//optionContent:53 optionNo:A
			optionsArr.push(temp);
		}
		var quescontimg = questionDict.quescontimg;
		var qescontsound = questionDict.qescontsound;

		if(!interactiveJson.rightAry || !interactiveJson.contentAry || !interactiveJson.countDown || !interactiveJson.gap){
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
				contentAry:interactiveJson.contentAry,//内容集合
				quescontimgAry:quescontimg,
				bgm_candyAudio : qescontsound.length>0&&qescontsound[0],
				cndybasinAudio : qescontsound.length>1&&qescontsound[1],
				rightAry : interactiveJson.rightAry,
				gap:interactiveJson.gap,
				interactiveJson: interactiveJson,//格外配置json	
			};

			return question;
		} else {
			this.gameLoadFailed(2);
		}
	},

});
