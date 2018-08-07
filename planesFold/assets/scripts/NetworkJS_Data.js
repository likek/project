var NetworkJS = require("NetworkJS");

cc.Class({
    extends: NetworkJS,

    properties: {
	},
	/* 
	** foldable: 是否可以折叠成正方体
	** camera：相机(人眼)相关设置
	** camera.position：相机所处位置
	** camera.lookAt: 相机朝向哪个点(即眼睛往哪儿看)
	** camera.frustum: 相机拍摄的视野(视锥体)相关设置
	** camera.frustum.fov: 相机离地面的距离
	** camera.frustum.near: 视锥体近平面离相机的距离
	** camera.frustum.far: 视锥体远平面离相机的距离
	** controls：鼠标和手指对空间的控制相关设置(默认情况下可旋转、可缩放)
	** transform：设置盒子的位置(默认情况下(0,0,)的纸片为中心位置)、缩放（默认不缩放）
	** transform.scale: 盒子的缩放设置(默认为原始大小)
	** transform.translate: 调整位置
	** transform.rotate: 旋转盒子(单位为弧度)
	** plane: 六张纸片的相关设置(可以不是六张)
	** plane.planeSize: 每张纸片的大小
	** plane.rotateSpeed: 纸片旋转速度(单位为弧度，应小于1.57)
	** plane.data: 六张纸片的细节设置
	** plane[i].position: 纸片的位置
	** plane[i].type: 指定类型("分组"和“普通纸片”两种)
	** plane[i].bgColor: 纸片的颜色(可以为一个16进制数字，也可以为一个渐变色的配置对象)
	** plane[i].colors: 渐变颜色(可以多于两个，各个颜色的开始渐变位置为所设置的两端位置等分后按顺序排列)
	** plane[i].axis: 纸片旋转时的旋转轴
	** planes[i].rotateDirection: 纸片旋转时的旋转方向
	** planes[i].animationIndex: 纸片属于第几组动画(目前只支持两组，第一组动画会先执行，之后会立即开始第二组)
	** translate：调整纸片“旋转中心”的位置(默认“旋转中心”为纸片的中心点，但是对于纸盒折叠演示一定是绕某一个边旋转)
	*/

	// camera:interactiveJson.camera,
	// controls:interactiveJson.controls,
	// planes:interactiveJson.planes,
	// transform:interactiveJson.transform,
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
				interactiveJson: interactiveJson,//格外配置json

				foldable:interactiveJson.foldable,
				camera:interactiveJson.camera,
				controls:interactiveJson.controls,
				planes:interactiveJson.planes,
				transform:interactiveJson.transform,
			};

			return question;
		} else {
			this.gameLoadFailed(2);
		}
	},

});
