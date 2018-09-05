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

	sendXHR: function (racingjs) {
		this.racingjs = racingjs;
		var xhr = cc.loader.getXMLHttpRequest();
		this.streamXHREventsToLabel(xhr, 'GET');
		//题库
		var fileUrl = this.GetQueryString('fileUrl');
		xhr.open("GET", fileUrl);
		if (cc.sys.isNative) {
			xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
		}
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
			// try {
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
			// }
			// catch (e) {
				// if (CONSOLE_LOG_OPEN) console.log('Caught Exception: ' + e.description);
				//下载失败反馈结果
				// self.gameLoadFailed(1);
			// }
		};
	},

	//解析数据
	analysisData: function (responseText) {
		var questions = JSON.parse(responseText);
		if (questions || questions.length > 0) {
			var questionArr = [];
			for (var i = 0; i < questions.length; ++i) {
				var question = this.analysisDict(questions[i]);
				if (!question) {
					break;
				}
				questionArr.push(question);
			}
			if (questionArr && questionArr.length > 0 && questions.length == questionArr.length) {
				this.racingjs.setPlatform(this.GetQueryString('platform'));
				this.racingjs.setGameName(this.GetQueryString('gameName'));
				this.racingjs.startLoadGame(questionArr);
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
		//每一道小题内容
		var question = {
			answerTime: '0',//答题时间
			levelQuestionDetailID: questionDict.questionid,//IPS题目（小题） ID
			leveLQuestionDetailNum: questionDict.orderid,//IPS题目（小题）序号
			qescont: this.removeSpan(questionDict.qescont),//题干
			interactiveJson: interactiveJson,//格外配置json
		};

		return question;
	},

	//过滤标签
	removeSpan: function (spanString) {
		var newStr = spanString.replace('<span>', '');
		newStr = newStr.replace('</span>', '');
		return newStr;
	},
	//下载解析失败type:1.下载失败，2.解析失败
	gameLoadFailed: function (type) {
		if (type == 1) {
			var params = encodeURI('errcode=10001&errmsg=下载失败');
			window.location.href = 'optionBlank://gameLoadFailed?' + params;
		} else {
			var params = encodeURI('errcode=10002&errmsg=解析失败');
			window.location.href = 'optionBlank://gameLoadFailed?' + params;
		}
	},
	//通知游戏加载成功，开始游戏
	gameLoadSuccess: function (totalNumber) {
		var params = encodeURI('isShow=1&isHideNativeProgressBtn=0&isHideNativeBackBtn=0&totalNumber=' + totalNumber);
        window.location.href = 'optionBlank://gameLoadSuccess?' + params;
	},
	//通知游戏结束
	gameOver: function (answerInfoArr) {
		var data = encodeURI(JSON.stringify(answerInfoArr));
		window.location.href = 'optionBlank://gameOver?status=1&data=' + data;
	},
	//通知游戏加载成功，开始游戏
    gameLoadProgress: function (nowNumber, totalNumber) {
        var params = encodeURI('isShow=1&isHideNativeProgressBtn=0&isHideNativeBackBtn=0&nowNumber=' + nowNumber + '&totalNumber=' + totalNumber);
        window.location.href = 'optionBlank://gameLoadProgress?' + params;
    },

});
