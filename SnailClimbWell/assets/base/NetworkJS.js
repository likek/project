var NetworkJS = cc.Class({
	extends: cc.Component,

	properties: {
	},

	//解析url参数
	GetQueryString: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURI(r[2]); return null;
	},

	sendXHR: function (gameJs) {
		this.gameJs = gameJs;

		var xhr = cc.loader.getXMLHttpRequest();
		this.streamXHREventsToLabel(xhr, 'GET');

		//题库
		var fileUrl = this.GetQueryString('fileUrl');

		if (!fileUrl || fileUrl.length == 0) {
			// fileUrl = 'http://10.4.9.53/resources/snailwall.json';
		}
		xhr.open("GET", fileUrl);

		if (cc.sys.isNative) {
			xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
		}

		// note: In Internet Explorer, the timeout property may be set only after calling the open()
		// method and before calling the send() method.
		xhr.timeout = 60000;//timeout

		xhr.send();
	},

	streamXHREventsToLabel: function (xhr, method, responseHandler) {
		var handler = responseHandler || function (response) {
			return method + " Response: " + response.substring(0, 30) + '...';
		};

		var self = this;
		// Special event
		xhr.onreadystatechange = function () {
			try {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (CONSOLE_LOG_OPEN) console.log(handler(xhr.responseText));
					if (xhr.status === 200) {
						// self.hideProgressBar();
						self.analysisData(xhr.responseText);
					} else {
						if (CONSOLE_LOG_OPEN) console.log('There was a problem with the request.');
						//下载失败反馈结果
						self.gameLoadFailed(1);
					}
				}
			}
			catch (e) {
				if (CONSOLE_LOG_OPEN) console.log('Caught Exception: ' + e.description);
				//下载失败反馈结果
				self.gameLoadFailed(1);
			}
		};
	},

	//解析数据
	analysisData: function (responseText) {
		var questions = JSON.parse(responseText);

		if (questions || questions.length > 0) {
			var questionArr = [];
			for (var i = 0; i < questions.length; ++i) {

				var question = this.analysisDict(questions[i]);

				questionArr.push(question);
			}
			if (questionArr && questionArr.length > 0) {
				this.gameJs.setPlatform(this.GetQueryString('platform'));
				this.gameJs.setGameName(this.GetQueryString('gameName'));
				this.gameJs.startLoadGame(questionArr);
				//通知游戏加载成功，开始游戏
				this.gameLoadSuccess(questionArr.length);
			} else {
				this.gameLoadFailed(2);
			}
		} else {
			this.gameLoadFailed(2);
		}
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
		//解析选项
		var optionandanswer = questionDict.optionandanswers[0];
		var optionsArr = [];
		var options = optionandanswer.options;
		for (var i = 0; i < options.length; ++i) {
			var option = options[i];
			var temp = {
				optionNo: option.optionno,//选项
				optionContent: this.removeSpan(option.optioncontent),//选项答案
			};
			optionsArr.push(temp);
		}
		if (!optionsArr || optionsArr.length == 0) {
			this.gameLoadFailed(2);
			return;
		}
		//每一道小题内容
		var question = {
			levelQuestionDetailID: questionDict.questionid,//IPS题目（小题） ID
			leveLQuestionDetailNum: questionDict.orderid,//IPS题目（小题）序号
			qescont: this.removeSpan(questionDict.qescont),//题干
			interactiveJson: interactiveJson,//格外配置json
			optionsArr: optionsArr,//选项
			rightOptionNo: this.removeSpan(optionandanswer.rightanswer),//正确选项
		};

		return question;
	},

	//过滤标签
	removeSpan: function (spanString) {
		var newStr = spanString.replace(/<span>/g, '');
		newStr = newStr.replace(/<\/span>/g, '');

		return newStr;
	},

	//下载解析失败type:1.下载失败，2.解析失败
	gameLoadFailed: function (type) {
		if (OPTION_BLANK) {
			if (type == 1) {
				var params = encodeURI('errcode=10001&errmsg=下载失败');
				window.location.href = 'optionBlank://gameLoadFailed?' + params;
			} else {
				var params = encodeURI('errcode=10002&errmsg=解析失败');
				window.location.href = 'optionBlank://gameLoadFailed?' + params;
			}
		}
	},

	//通知游戏加载成功，开始游戏
	gameLoadSuccess: function (totalNumber) {
		if (OPTION_BLANK) {
			setTimeout(function () {
				var params = encodeURI('isShow=1&totalNumber=' + totalNumber);
				window.location.href = 'optionBlank://gameLoadSuccess?' + params;
			}, 30);//为了解决个别pad进入游戏闪黑瓶的问题，增加等待时间
		}
	},

	//通知游戏结束
	gameOver: function (answerInfoArr) {
		var data = encodeURI(JSON.stringify(answerInfoArr));

		if (CONSOLE_LOG_OPEN) console.log('dataJson=' + JSON.stringify(answerInfoArr));

		if (OPTION_BLANK) {
			window.location.href = 'optionBlank://gameOver?status=1&data=' + data;
		}
	},
	//通知游戏加载成功，开始游戏
	gameLoadProgress: function (nowNumber, totalNumber) {
		if (OPTION_BLANK) {
			var params = encodeURI('nowNumber=' + nowNumber + '&totalNumber=' + totalNumber);
			window.location.href = 'optionBlank://gameLoadProgress?' + params;
		}
	},

});