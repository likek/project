require=function o(c,a,h){function r(e,t){if(!a[e]){if(!c[e]){var i="function"==typeof require&&require;if(!t&&i)return i(e,!0);if(l)return l(e,!0);var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}var s=a[e]={exports:{}};c[e][0].call(s.exports,function(t){return r(c[e][1][t]||t)},s,s.exports,o,c,a,h)}return a[e].exports}for(var l="function"==typeof require&&require,t=0;t<h.length;t++)r(h[t]);return r}({AnswerContainer:[function(t,e,i){"use strict";cc._RF.push(e,"ca872iTmrBNz6Mbhd+BMS3O","AnswerContainer"),cc.Class({extends:cc.Component,properties:{answer:cc.Prefab,node2x2:cc.Prefab,node2x3:cc.Prefab,node3x3:cc.Prefab,gameJS:null,bottomNode:cc.Node},start:function(){},initData:function(t){if(this.node.removeAllChildren(),this.checkData(t)){var e="2x2"===(this.layoutType=t)?this.node2x2:"2x3"===t?this.node2x3:this.node3x3;e=cc.instantiate(e),this.node.addChild(e);for(var i=(t=t.split("x"))[0],n=t[1],s=e.width,o=e.height,c=s/i,a=o/n,h=0;h<n;h++)for(var r=0;r<i;r++){var l=cc.instantiate(this.answer);e.addChild(l),l.width=c,l.height=a,l.x=c*r+c/2-s/2,l.y=a*h+a/2-o/2,l.__optionId=n-1-h+"-"+r,l.getComponent(cc.CircleCollider).radius=.248*Math.min(l.height,l.width);var d=new cc.Node;d.addComponent(cc.Sprite),this.bottomNode.addChild(d),d.width=l.width,d.height=l.height,d.x=l.x,d.y=l.y;var u=this.getOptionByAnswer(l.__optionId);u&&(d.getComponent(cc.Sprite).spriteFrame=this.gameJS.getSpriteFrame(u.optioncontimg))}}},checkData:function(t){return"string"==typeof t&&/\d+x\d+/.test(t)},getOptionByAnswer:function(t){for(var e=this.gameJS.questionArr[this.gameJS.nowQuestionID].optionsArr,i=null,n=0;n<e.length;n++)if(e[n].optionContent===t){i=e[n];break}return i}}),cc._RF.pop()},{}],BaseGameJS:[function(t,e,i){"use strict";cc._RF.push(e,"d5325ralz1KNpBY2dkj5IqD","BaseGameJS"),cc.Class({extends:cc.Component,properties:{timeLabel:cc.Label,paopao_node:cc.Node,feedback_node:cc.Node,loseTime_node:cc.Node,loseTime:0,time_node:cc.Node,question_node:cc.Node,quertionList_node:cc.Node,title_node:cc.Node},onLoad:function(){var t=this;document.addEventListener("resignActivePauseGame",function(){t.gotoBackground(),cc.director.pause(),cc.game.pause(),CONSOLE_LOG_OPEN&&console.log("app just resign active.")}),document.addEventListener("becomeActiveResumeGame",function(){cc.game.isPaused&&cc.game.resume(),cc.director.isPaused&&cc.director.resume(),t.gotoForeground(),CONSOLE_LOG_OPEN&&console.log("app just become active.")}),this.initFeedback(),this.answerTime=0,this.lastAnswerTime=0,this.answerContext="",this.countDown=300,this.timeCallback=this.timeCallbackFunc(),this.isShowLossTime=!1,this.nowQuestionID=0,this.questionArr=[],this.answerInfoArr=[],this.questionNumListJS=this.quertionList_node.getComponent("QuestionNumListJS"),this.quertionList_node.opacity=0,this.time_node.opacity=0,this.onLoadChild(),this.answerEnable=!1,this.network=this.node.getComponent("NetworkJS_Data"),this.network.sendXHR(this)},initFeedback:function(){var t=cc.instantiate(this.feedback_pref);this.feedback_node.addChild(t),this.feedbackJS=t.getChildByName("Fish").getComponent("FishFeedback")},onLoadChild:function(){},gotoBackground:function(){},gotoForeground:function(){},createPaopao:function(){for(var t=this.node.width,e=[120,40,160,80,200],i=1012/e.length,n=0;n<e.length;n++){(s=cc.instantiate(this.paopao_pref)).x=e[n],s.y=-i*n,this.paopao_node.addChild(s)}for(n=0;n<e.length;n++){var s;(s=cc.instantiate(this.paopao_pref)).x=t-e[n],s.y=-i*n,this.paopao_node.addChild(s)}},createAnswerInfo:function(t){var e=this.questionArr[this.nowQuestionID];if(e){var i={answerTime:this.answerTime-this.lastAnswerTime,leveLQuestionDetailNum:e.leveLQuestionDetailNum,levelQuestionDetailID:e.levelQuestionDetailID,answerStatus:t,answerContext:this.answerContext};this.answerInfoArr.push(i)}},showFeedback:function(t){0===this.nowQuestionID?this.feedbackJS.firstShowFeedback(this,t):this.feedbackJS.showFeedback(this,t)},firstFeedbackFinish:function(){},feedbackFinish:function(){this.nowQuestionID+=1;var t=this.questionArr[0].interactiveJson.totalcd;if(this.nowQuestionID>=this.questionArr.length||this.countDown-this.answerTime<=0&&t){CONSOLE_LOG_OPEN&&console.log("答完了");for(var e=this.questionArr.length-this.nowQuestionID,i=0;i<e;i++)this.answerTime=0,this.lastAnswerTime=0,this.createAnswerInfo("2"),this.nowQuestionID+=1;this.isIts&&this.settlementJs.reset(),this.network.gameOver(this.answerInfoArr)}else this.network.gameLoadProgress(this.nowQuestionID+1,this.questionArr.length),!this.isIts&&this.deleteOption(),this.settlementJs.reset(),!this.isIts&&this.startloadOption()},showLossTime:function(){this.answerTime+=this.loseTime,this.isShowLossTime=!0,this.loseTime_node.opacity=255;var t=cc.callFunc(function(t){this.isShowLossTime=!1,this.loseTime_node.opacity=0},this);this.loseTime_node.runAction(cc.sequence(cc.fadeTo(1,0),t))},timeCallbackFunc:function(){return function(){this.answerTime+=1,this.scheduleTime+=1;var t=this.countDown-this.answerTime;t<=0?(CONSOLE_LOG_OPEN&&console.log("时间到"),this.timeout(),this.isShowFeed=!0,this.answerTime=this.countDown,this.timeLabel.string="00:00",this.createAnswerInfo("2"),this.showFeedback(3),this.answerTime>this.scheduleTime&&this.unschedule(this.timeCallback)):this.timeLabel.string=this.timeFormat(t)}},timeFormat:function(t){var e=Math.floor(t/60),i=t%60,n=i<10?"0"+i:i;return 59<t?(e<10?"0"+e:e)+":"+n:"00:"+n},timeout:function(){},showSchedule:function(){this.scheduleTime=0,this.schedule(this.timeCallback,1,this.countDown-1)},deleteOption:function(){},createOption:function(t){},selectedOption:function(t){this.nowQuestionID=t,this.deleteOption();var e=this;setTimeout(function(){e.startloadOption()},0)},startloadOption:function(){this.isIts&&this.questionNumListJS.changeOptionDisable();this.questionArr[this.nowQuestionID];this.timeLabel.string=this.timeFormat(this.countDown),this.answerTime=0,!this.isIts&&this.showSchedule(),this.isIts&&this.questionNumListJS.changeOptionEnable(),this.isShowFeed=!1},startLoadGame:function(t){this.questionArr=t,this.quertionList_node.opacity=this.isIts?255:0,this.time_node.opacity=this.isIts?0:255,this.isIts&&t&&0<t.length&&this.questionNumListJS.init(t.length,this.selectedOption.bind(this)),REQUEST_URL?this.requestAllUrls():this.startloadOption(),this.playBGMAudio(),this.playTimuAudio(),this.BasicAni()},requestAllUrls:function(){for(var t=[],e=0;e<this.questionArr.length;e++){if(this.questionArr[e].quescontimgAry instanceof Array)for(var i=0;i<this.questionArr[e].quescontimgAry.length;i++)t.push(this.questionArr[e].quescontimgAry[i]);if(this.questionArr[e].optionsArr instanceof Array)for(var n=0;n<this.questionArr[e].optionsArr.length;n++)this.questionArr[e].optionsArr[n].optioncontimg&&t.push(this.questionArr[e].optionsArr[n].optioncontimg)}var s=this;cc.loader.load(t,function(t,e){t?s.network.gameLoadFailed(1):(s.spriteMaps=e.map,s.startloadOption())})},getSpriteFrame:function(t){if(!t||0==t.length)return null;var e=this.spriteMaps[t].content;return e instanceof cc.Texture2D?new cc.SpriteFrame(e):null},selectAnswer:function(t,e){this.isShowFeed||this.isShowLossTime||(e?(CONSOLE_LOG_OPEN&&console.log("答对了"),this.rightSelect+=1,t.showParticle(),this.rightSelect>=this.count&&(this.unschedule(this.timeCallback),this.isShowFeed=!0,this.createAnswerInfo("1"),this.scheduleOnce(function(){this.showFeedback(1)},1))):(CONSOLE_LOG_OPEN&&console.log("答错了"),this.showLossTime()))},onDestroy:function(){document.removeEventListener("resignActivePauseGame"),document.removeEventListener("becomeActiveResumeGame")},setGameName:function(t){this.title_node.getComponent("TitleJS").init(t)},setPlatform:function(t){this.platform=t,this.isIts="its"==t;var e=this.isIts;this.quertionList_node.active=!!e,this.time_node.active=!e},resetOption:function(){0!=this.moveOptionTag&&(this.option_node.getChildByTag(this.moveOptionTag).getComponent("Option").reloadState(),this.moveOptionTag=0)},changeMoveTag:function(t){return!this.isShowFeed&&((0===this.moveOptionTag||this.moveOptionTag===t||0===t)&&(this.moveOptionTag=t,!0))}}),cc._RF.pop()},{}],ColliderListener:[function(t,e,i){"use strict";cc._RF.push(e,"b0b466dPFFI1ZCDMEewg3qk","ColliderListener"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){cc.director.getCollisionManager().enabled=!0},onCollisionEnter:function(t,e){this.node.isCollisioned=!0,this.node.opacity=100},onCollisionExit:function(t,e){CONSOLE_LOG_OPEN&&console.log("on collision exit"),this.node.isCollisioned=!1,this.node.opacity=255}}),cc._RF.pop()},{}],Flags:[function(t,e,i){"use strict";cc._RF.push(e,"49399pIZlFDJJbPpN1yTKBS","Flags"),cc.Class({extends:cc.Component,properties:{flagL:cc.Node,flagR:cc.Node,option:cc.Prefab},start:function(){},initData:function(t,e){if(this.flagL.removeAllChildren(),this.flagR.removeAllChildren(),this.checkInitData(t))for(var i=t.length/2,n=0;n<t.length;n++){var s=cc.instantiate(this.option),o=s.getChildByName("button_bg"),c=o.getChildByName("border");c.opacity=0,o.setScale(.7);var a=t[n],h=n<i?this.flagL:this.flagR;h.addChild(s);var r=.8*h.height,l=r/i;o.getComponent(cc.Sprite).spriteFrame=e.getSpriteFrame(a.optioncontimg),o.getComponent("OptionJS").init(e,a),o.tag=100+n,c.width=o.width+12,c.height=o.height+12,s.x=0,s.y=l*(n%i)+l/2-r/2-.046*h.height,o.getComponent(cc.CircleCollider).radius=.248*Math.min(o.height,o.width)*1/.7;var d=Math.random()<.5?1:-1,u=20*Math.random()*d;o.setRotation(u)}},checkInitData:function(t){return Array.isArray(t)}}),cc._RF.pop()},{}],GameJS:[function(t,e,i){"use strict";cc._RF.push(e,"d92c8sRpIBMBKs/RzLIjTLN","GameJS");var n=t("BaseGameJS");cc.Class({extends:n,properties:{settlePrefab:cc.Prefab,resetBtnNSF:cc.SpriteFrame,commitBtnNSF:cc.SpriteFrame,winAudio:cc.AudioClip,loseAudio:cc.AudioClip,resetAudio:cc.AudioClip,optionAudio:cc.AudioClip,option_outAudio:cc.AudioClip,rightAudio:cc.AudioClip,wrongAudio:cc.AudioClip,timuAudio:cc.AudioClip,flags:cc.Node,cattle:cc.Node,answerContainer:cc.Node,glow:cc.Node,colorStrip:cc.Node,tipsHand:cc.Node,progress:cc.Node,rightNum:0},onLoadChild:function(){this._super(),this.scaleNode=this.node.getChildByName("scale"),this.option_node=this.scaleNode.getChildByName("option_node"),this.tipsNode=this.node.getChildByName("TipsNode"),this.tipsNode&&(this.tipsNode.active=!0),this.answerItemPool=new cc.NodePool,this.prompt_nodeJS=this.scaleNode.getChildByName("prompt_node").getComponent("title"),this.changeMoveTag(0),this.initToast(),cc.director.getCollisionManager().enabled=!0,this.flagsJs=this.flags.getComponent("Flags"),this.answerContainerJS=this.answerContainer.getComponent("AnswerContainer"),(this.answerContainerJS.gameJS=this).progressJS=this.progress.getComponent("ProgressJs"),this.tipsHand.active=!1},initToast:function(){var t=this.node.getChildByName("scale").getChildByName("efailed");this.efailedJs=t.getComponent("efailed"),this.efailedJs.game=this},tipsClick:function(){this.tipsNode.removeFromParent(!0),this.tipsNode.destroy(),!this.isIts&&this.showSchedule(),this.questionArr[0].interactiveJson.totalcd&&(this.lastAnswerTime=this.answerTime)},initFeedback:function(){this.settlement=cc.instantiate(this.settlePrefab),this.settlementJs=this.settlement.getComponent("settlement"),(this.settlementJs.game=this).node.getChildByName("feedback_node").addChild(this.settlement),this.settlement.active=!1},gotoBackground:function(){for(var t=this.option_node.children,e=0;e<t.length;e++){var i=t[e].getChildByName("button_bg"),n=i.getComponent("OptionJS");if(n.canMove){i.stopAllActions(),n.reloadState(),i.opacity=255;break}}var s=this.node.getChildByName("button_node").getChildByName("commit"),o=this.node.getChildByName("button_node").getChildByName("cancel");s.setScale(1,1),o.setScale(1,1),s._pressed=!1,s._hovered=!1,o._pressed=!1,o._hovered=!1,s.normalSprite=this.commitBtnNSF,s.hoverSprite=this.commitBtnNSF,o.normalSprite=this.resetBtnNSF,o.hoverSprite=this.resetBtnNSF},timeout:function(){this.progress.getComponent("ProgressJs").playFlayStar(new cc.v2(0,0),this.nowQuestionID,2),this.progress.getComponent("ProgressJs").setStarTypeByIndex(this.nowQuestionID,2),this.tipsFinished=!0},deleteOption:function(){for(var t=this.option_node.children;0<t.length;){var e=t[0];e.getChildByName("button_bg").opacity=255,this.answerItemPool.put(e)}this.option_node.removeAllChildren(!0)},startloadOption:function(){this.updateGameState(!0),this.isIts&&this.questionNumListJS.changeOptionDisable();var t=this.questionArr[this.nowQuestionID];this.prompt_nodeJS.setTitle(t.qescont,null),this.rightOptionNo=t.rightOptionNo,this.createOption(t.optionsArr);var e=this.questionArr[0].interactiveJson.totalcd;if(0===this.nowQuestionID&&e||!e){this.answerTime=0;var i=parseInt(t.interactiveJson.countDown);0<i&&(this.countDown=i),this.timeLabel.string=this.timeFormat(this.countDown)}!this.isIts&&this.showSchedule(),e&&(this.lastAnswerTime=this.answerTime),this.isIts&&this.questionNumListJS.changeOptionEnable(),this.isShowFeed=!1,this.changeMoveTag(0);var n=t.matrixType;if(!n)switch(t.optionsArr.length){case 4:n="2x2";break;case 6:n="2x3";break;case 9:n="3x3"}this.matrixType=n,this.rightNum=0,this.flagsJs.initData(t.optionsArr,this),this.answerContainerJS.initData(n,this),this.setCattleAnimationOnce("stand"),this.progressJS.__hasInit||(this.progressJS.init(this.questionArr.length),this.progressJS.__hasInit=!0),0===this.nowQuestionID?(this.tipsHand.active=!0,this.tipsAnimation()):this.tipsHand.active=!1,this.progressJS.showStarFlag(this.progressJS.getStarPosByIndex(this.nowQuestionID))},selectAnswer:function(t){this.isShowFeed||this.isShowLossTime||(this.unschedule(this.timeCallback),this.isShowFeed=!0,this.updateGameState(!1),t?(CONSOLE_LOG_OPEN&&console.log("答对了"),this.createAnswerInfo("1"),this.showFeedback(1)):(CONSOLE_LOG_OPEN&&console.log("答错了"),this.createAnswerInfo("2"),this.showFeedback(2)))},showFeedback:function(t){var e=this;if(1===t){AUDIO_OPEN&&this.playWinAudio();for(var i=this.answerContainer.children[0].children,n=0;n<i.length;n++)i[n].getChildByName("button_bg").setScale(1);this.progress.getComponent("ProgressJs").setStarTypeByIndex(this.nowQuestionID,1),this.progress.getComponent("ProgressJs").playFlayStar(new cc.v2(0,0),this.nowQuestionID,1),this.scheduleOnce(function(){e.colorStrip.getComponent("sp.Skeleton").setAnimation(0,"in",!1),e.glow.getComponent("sp.Skeleton").setAnimation(0,"in",!1),e.setCattleAnimationOnce("happy"),e.scheduleOnce(function(){e.feedbackFinish()},1.7)},.3)}else 2===t?(AUDIO_OPEN&&this.playLoseAudio(),this.settlementJs.playLoseAnim(this.feedbackFinish)):3===t&&(AUDIO_OPEN&&this.playLoseAudio(),this.settlementJs.playTimeUpAnim(this.feedbackFinish))},updateGameState:function(t){t?(this.question_node.resumeSystemEvents(!0),this.option_node.resumeSystemEvents(!0)):(this.question_node.pauseSystemEvents(!0),this.option_node.pauseSystemEvents(!0))},otherClicked:function(){this.playCancelAudio(),this.isShowFeed},playWinAudio:function(){this.playAudio(this.winAudio)},playLoseAudio:function(){this.playAudio(this.loseAudio)},playCancelAudio:function(){this.playAudio(this.resetAudio)},playOptionAudio:function(){this.playAudio(this.optionAudio)},playOptionOutAudio:function(){this.playAudio(this.option_outAudio)},playRightAudio:function(){this.playAudio(this.rightAudio)},playWrongAudio:function(){this.playAudio(this.wrongAudio)},BasicAni:function(){this.unschedule(this.basinCallback),this.basinCallback=function(){this.isShowFeed||(CONSOLE_LOG_OPEN&&console.log("gagagagga"),this.playBasinAudio())};var t=this.questionArr[this.nowQuestionID];t&&this.schedule(this.basinCallback,t.gap?parseInt(t.gap):40)},playTimuAudio:function(){var t=this,e=cc.audioEngine.play(this.timuAudio,!1,1);cc.audioEngine.setFinishCallback(e,function(){cc.audioEngine.stop(e),t.playBasinAudio()})},playBasinAudio:function(){var t=this.questionArr[this.nowQuestionID];t.cndybasinAudio&&cc.loader.load(t.cndybasinAudio,function(t,e){t||(cc.audioEngine.play(e,!1,1),cc.loader.releaseAsset(e))})},playBGMAudio:function(){var t=this.questionArr[this.nowQuestionID];t.bgm_candyAudio&&cc.loader.load(t.bgm_candyAudio,function(t,e){t||(cc.audioEngine.play(e,!0,1),cc.loader.releaseAsset(e))})},playAudio:function(t){AUDIO_OPEN&&cc.audioEngine.play(t,!1,1)},isWin:function(){var t=this.matrixType.split("x");this.rightNum===t[0]*t[1]&&this.selectAnswer(!0)},setCattleAnimationOnce:function(t,e){var i=this;this.cattle.getComponent("sp.Skeleton").setAnimation(0,t,!1),setTimeout(function(){i.cattle.getComponent("sp.Skeleton").setAnimation(0,"stand",!0)},e||2600)},gameBackAction:function(){window.location.href="optionBlank://xmaGameBackAction?status=1"},tipsAnimation:function(){var t=this,e=this.flags.getChildByName("flagL").children[0];if(e){for(var i=e.getChildByName("button_bg").getComponent("OptionJS").option.optionContent,n=this.answerContainer.children[0].children,s=null,o=0;o<n.length;o++)n[o].__optionId===i&&(s=n[o]);if(s){var c=void 0,a=void 0;c=e.convertToWorldSpaceAR(cc.p(0,0)),(c=this.scaleNode.convertToNodeSpaceAR(c)).x+=this.tipsHand.width/3,c.y-=this.tipsHand.height/3,a=s.convertToWorldSpaceAR(cc.p(0,0)),(a=this.scaleNode.convertToNodeSpaceAR(a)).x+=this.tipsHand.width/3,a.y-=this.tipsHand.height/3,this.tipsHand.setPosition(c),this.tipsHand.stopAllActions(),this.tipsHand.runAction(cc.sequence(cc.delayTime(.3),cc.moveTo(1.6,a),cc.delayTime(.3),cc.callFunc(function(){t.tipsHand.setPosition(c)},this)),this).repeatForever(),this.changeMoveTag(e.getChildByName("button_bg").tag)}}}}),cc._RF.pop()},{BaseGameJS:"BaseGameJS"}],LocalSaveJS:[function(t,e,i){"use strict";cc._RF.push(e,"f4c57nVhA1DEK8uDdBUQDFX","LocalSaveJS"),cc.Class({extends:cc.Component,properties:{},save:function(t,e){var i=cc.sys.localStorage;i?function(t,e,i){var n="";null!=i&&(n="; expires="+(n=new Date((new Date).getTime()+1e3*i)).toGMTString());n+="; path=/",document.cookie=t+"="+escape(e)+n}(t,e):i.setItem(t,e)},load:function(t){var e=cc.sys.localStorage;return e?function(t){var e="",i=t+"=";if(0<document.cookie.length){var n=document.cookie.indexOf(i);if(-1!=n){n+=i.length;var s=document.cookie.indexOf(";",n);-1==s&&(s=document.cookie.length),e=unescape(document.cookie.substring(n,s))}}return e}(t):e.getItem(t)}}),cc._RF.pop()},{}],NetworkJS_Data:[function(t,e,i){"use strict";cc._RF.push(e,"8febaBdc6ZNMK6NnHe3UpZb","NetworkJS_Data");var n=t("NetworkJS");cc.Class({extends:n,properties:{},analysisDict:function(t){var e=t.interactiveJson;if(e&&0!=e.length){"string"==typeof e&&(e=JSON.parse(e));for(var i=t.optionandanswers[0],n=i.options,s=[],o=0;o<n.length;++o){var c=n[o],a=c.optioncontent,h={optionNo:c.optionno,optionContent:this.removeSpan(a),optioncontimg:c.optioncontimg,optionFlip:this.removeSpan(a)};s.push(h)}var r=t.quescontimg,l=t.qescontsound;if(e.rightAry&&e.questionAry&&e.optionCount&&e.countDown||this.gameLoadFailed(2),s||0<s.length)return{answerTime:"0",levelQuestionDetailID:t.questionid,leveLQuestionDetailNum:t.orderid,qescont:this.removeSpan(t.qescont),optionsArr:s,rightOptionNo:this.removeSpan(i.rightanswer),questionPositon:e.questionPositon,quescontimgAry:r,question_img:0<r.length&&r[0],answer_img:1<r.length&&r[1],answer_finish:2<r.length&&r[2],bgm_candyAudio:0<l.length&&l[0],cndybasinAudio:1<l.length&&l[1],interactiveJson:e,matrixType:e.matrixType};this.gameLoadFailed(2)}else this.gameLoadFailed(2)}}),cc._RF.pop()},{NetworkJS:"NetworkJS"}],NetworkJS:[function(t,e,i){"use strict";cc._RF.push(e,"cd804MyCfRHi4BLiy+Orkth","NetworkJS");cc.Class({extends:cc.Component,properties:{},GetQueryString:function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),i=window.location.search.substr(1).match(e);return null!=i?decodeURI(i[2]):null},sendXHR:function(t){this.racingjs=t;var e=cc.loader.getXMLHttpRequest();this.streamXHREventsToLabel(e,"GET");var i=this.GetQueryString("fileUrl");e.open("GET",i),cc.sys.isNative&&e.setRequestHeader("Accept-Encoding","gzip,deflate"),e.timeout=6e4,e.send()},streamXHREventsToLabel:function(t,e,i){var n=i||function(t){return e+" Response: "+t.substring(0,30)+"..."},s=this;t.onreadystatechange=function(){t.readyState===XMLHttpRequest.DONE&&(CONSOLE_LOG_OPEN&&console.log(n(t.responseText)),200===t.status?s.analysisData(t.responseText):(CONSOLE_LOG_OPEN&&console.log("There was a problem with the request."),s.gameLoadFailed(1)))}},analysisData:function(t){var e=JSON.parse(t);if(e||0<e.length){for(var i=[],n=0;n<e.length;++n){var s=this.analysisDict(e[n]);if(!s)break;i.push(s)}i&&0<i.length&&e.length==i.length?(this.racingjs.setPlatform(this.GetQueryString("platform")),this.racingjs.setGameName(this.GetQueryString("gameName")),this.racingjs.startLoadGame(i),this.gameLoadSuccess(i.length)):this.gameLoadFailed(2)}else this.gameLoadFailed(2)},analysisDict:function(t){var e=t.interactiveJson;if(e&&0!=e.length)return"string"==typeof e&&(e=JSON.parse(e)),{answerTime:"0",levelQuestionDetailID:t.questionid,leveLQuestionDetailNum:t.orderid,qescont:this.removeSpan(t.qescont),interactiveJson:e};this.gameLoadFailed(2)},removeSpan:function(t){var e=t.replace("<span>","");return e=e.replace("</span>","")},gameLoadFailed:function(t){if(1==t){var e=encodeURI("errcode=10001&errmsg=下载失败");window.location.href="optionBlank://gameLoadFailed?"+e}else{e=encodeURI("errcode=10002&errmsg=解析失败");window.location.href="optionBlank://gameLoadFailed?"+e}},gameLoadSuccess:function(t){var e=encodeURI("isShow=1&totalNumber="+t);window.location.href="optionBlank://gameLoadSuccess?"+e},gameOver:function(t){var e=encodeURI(JSON.stringify(t));window.location.href="optionBlank://gameOver?status=1&data="+e},gameLoadProgress:function(t,e){var i=encodeURI("nowNumber="+t+"&totalNumber="+e);window.location.href="optionBlank://gameLoadProgress?"+i}});cc._RF.pop()},{}],OptionJS1:[function(t,e,i){"use strict";cc._RF.push(e,"cec4fBlGJ1Nw5Qzjr1JzrRx","OptionJS1");var o=new cc.Enum({unable:0,nomal:1,right:2,wrong:3});cc.Class({extends:cc.Component,properties:{},onLoad:function(){this.show=this.node.getChildByName("show"),this.anim=this.node.getChildByName("anim"),this.right=this.node.getChildByName("right"),this.wrong=this.node.getChildByName("wrong"),this.text=this.node.getChildByName("text");var t=this;document.addEventListener("resignActivePauseGame",function(){t.reloadState()})},reloadState:function(){},init:function(t,e,i,n){this.gameJS=t;var s=this;n?(this.text.active=!0,this.text.getComponent(cc.Label).string=e,cc.loader.loadRes("texture",cc.SpriteAtlas,function(t,e){var i=e.getSpriteFrame("fang2");s.show.getComponent(cc.Sprite).spriteFrame=i,cc.loader.releaseAsset("texture",cc.SpriteAtlas)}),this.state=o.unable,this.show.opacity=255,this.anim.opacity=0,this.right.opacity=0,this.wrong.opacity=0,this.updateState(!1)):(this.text.active=!1,this.text.getComponent(cc.Label).string="",cc.loader.loadRes("texture",cc.SpriteAtlas,function(t,e){var i=e.getSpriteFrame("fang1");s.show.getComponent(cc.Sprite).spriteFrame=i,cc.loader.releaseAsset("texture",cc.SpriteAtlas)}),this.state=o.nomal,this.show.opacity=255,this.anim.opacity=0,this.right.opacity=0,this.wrong.opacity=0)},optionClick:function(){this.updateState(!1),this.node.parent.pauseSystemEvents(!0),this.gameJS.playOptionAudio()},updateState:function(t){this.node.getComponent(cc.Button).interactable=t},resetState:function(){}}),cc._RF.pop()},{}],OptionJS:[function(t,e,i){"use strict";cc._RF.push(e,"ea4b5QR7YdFVKJuS8oyqW38","OptionJS");cc.Class({extends:cc.Component,properties:{parent_node:cc.Node,canMove:!1},onLoad:function(){this.node.on(cc.Node.EventType.TOUCH_START,this.touch_start.bind(this),this.node),this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touch_move.bind(this),this.node),this.node.on(cc.Node.EventType.TOUCH_END,this.touch_end.bind(this),this.node),this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touch_cancel.bind(this),this.node),this.audioPool=[];var t=this;document.addEventListener("resignActivePauseGame",function(){t.resetState()})},onCollisionStay:function(t,e){this.isRight=t.node.__optionId===this.option.optionContent,this.sheepNode=t.node},onCollisionExit:function(t,e){this.isRight=!1,this.sheepNode=null},init:function(t,e,i){this.node.opacity=255,this.startx=this.node.x,this.starty=this.node.y,this.gameJS=t,this.option=e},touch_start:function(t){(this.gameJS.BasicAni(),this.gameJS.playOptionAudio(),this.node.parent===this.parent_node)&&(this.canMove=this.gameJS.changeMoveTag(this.node.tag),this.canMove&&(this.gameJS.tipsFinished||0!==this.gameJS.nowQuestionID||(this.gameJS.tipsHand.active=!1),this.node.getChildByName("border").opacity=255,this.gameJS.playOptionAudio(),this.dragX=this.node.x,this.dragY=this.node.y,this.parent_node.zIndex=1))},touch_end:function(t){this.node.getChildByName("border").opacity=0,this.canMove&&this.node.parent===this.parent_node&&(this.gameJS.playOptionOutAudio(),this.node.opacity=255,console.log("touchEnd"),this.isRightOrWrong())},touch_move:function(t){if(this.canMove&&this.node.parent===this.parent_node){var e=t.touch.getDelta();this.node.x+=e.x,this.node.y+=e.y;var i=t.getTouches(),n=this.gameJS.scaleNode.parent,s=n.convertTouchToNodeSpaceAR(i[0]);Math.abs(s.x)<n.width/2-50&&Math.abs(s.y)<n.height/2-30||(CONSOLE_LOG_OPEN&&cc.log("出屏了"),this.reloadState())}},touch_cancel:function(t){this.node.getChildByName("border").opacity=0,this.canMove&&this.node.parent===this.parent_node&&(console.log("touchcancel"),this.isRightOrWrong())},check:function(){return this.isRight},isRightOrWrong:function(){var t=this;if(this.check())CONSOLE_LOG_OPEN&&console.log("right"),this.gameJS.playRightAudio(),this.optionClick();else if(CONSOLE_LOG_OPEN&&console.log("wrong"),this.gameJS.playWrongAudio(),!this.sheepNode||this.sheepNode.getChildByName("button_bg"))this.reloadState();else{var e=cc.moveBy(.1,28,-35),i=cc.moveBy(.1,-38,4),n=cc.moveBy(.1,24,18),s=cc.moveBy(.1,-14,-10);this.gameJS.setCattleAnimationOnce("sad"),this.node.runAction(cc.sequence(cc.delayTime(.1),e,i,n,s,cc.delayTime(.1),cc.callFunc(function(){t.reloadState()})))}},resetState:function(){},reloadState:function(){if(this.canMove=!1,this.node.getChildByName("border").opacity=0,this.exchangeParent){var t=this.node.convertToWorldSpaceAR(cc.p(0,0));this.node.parent=this.parent_node;var e=this.node.parent.convertToNodeSpaceAR(t);this.node.setPosition(e)}var i=cc.moveTo(this.calculateAnimTime(),cc.p(this.startx,this.starty));this.node.runAction(cc.sequence(i,cc.callFunc(function(){this.node.setPosition(this.startx,this.starty),this.parent_node.zIndex=0,this.updateState(!0),this.gameJS.tipsFinished&&this.gameJS.changeMoveTag(0),this.gameJS.tipsFinished||0!==this.gameJS.nowQuestionID||(this.gameJS.tipsHand.active=!0)},this)))},calculateAnimTime:function(){var t=cc.pDistance(this.node.position,cc.p(this.startx,this.starty))/1e3;return.3*(t=1<t?1:t)},optionClick:function(){var t=this;0===this.gameJS.nowQuestionID&&(this.gameJS.tipsFinished=!0),this.gameJS.tipsHand&&(this.gameJS.tipsHand.active=!1),this.node.parent=this.sheepNode,this.node.setPosition(0,0),this.node.parent.zIndex=0,this.canMove=!1,this.gameJS.changeMoveTag(0),this.gameJS.rightNum++,this.node.setRotation(0);var e=cc.spawn(cc.rotateBy(.33,360),cc.scaleTo(.33,1));this.node.runAction(cc.sequence(e,cc.callFunc(function(){t.node.zIndex=-1,t.gameJS.isWin.call(t.gameJS)})))},updateState:function(t){t?this.node.resumeSystemEvents(!0):this.node.pauseSystemEvents(!0)}}),cc._RF.pop()},{}],ProgressJs:[function(t,e,i){"use strict";cc._RF.push(e,"bffa6tUYERD1rOxZB4r27oO","ProgressJs");var n={1:"rightSF",2:"errSF",3:"errSF"};cc.Class({extends:cc.Component,properties:{starPre:cc.Prefab,starPNode:cc.Node,rightSF:cc.SpriteFrame,errSF:cc.SpriteFrame,initSF:cc.SpriteFrame,blueStar:cc.Node,flayNode:cc.Node,rigthAction:cc.Node},onLoad:function(){this.starData=[],this.starFlagAction()},init:function(t){for(var e,i=0;i<t;i++)(e=cc.instantiate(this.starPre)).parent=this.node,e.position=cc.p(-t/2*102+102*i+10+41,710),this.starData||(thi.starData=[]),this.starData.push(e);var n=this.getStarPosByIndex(0);this.showStarFlag(n)},setStarTypeByIndex:function(e,i){this.hideStarFlag(),i=i.toString(),this.scheduleOnce(function(){if(this.starData[e]&&(this.starData[e].getComponent(cc.Sprite).spriteFrame=this[n[i]]),"1"==i){this.starData[e].opacity=0,this.starData[e].scaleX=.4,this.starData[e].scaleY=.4,this.rigthAction.position=this.starData[e].position,this.rigthAction.active=!0,this.rigthAction.getComponent(cc.Animation).play();var t=cc.callFunc(function(t){this.rigthAction.active=!1},this);this.starData[e].runAction(cc.sequence(cc.spawn(cc.scaleTo(.33,1.2),cc.fadeTo(.33,255)),cc.scaleTo(.16,1),t))}else this.starData[e].opacity=0,this.starData[e].scaleX=2,this.starData[e].scaleY=2,this.starData[e].runAction(cc.sequence(cc.spawn(cc.scaleTo(.33,.9),cc.fadeTo(.33,255)),cc.scaleTo(.16,1)));e+1<this.starData.length&&this.scheduleOnce(function(){var t=this.getStarPosByIndex(e+1);this.showStarFlag(t)},.55)},.34)},getStarPosByIndex:function(t){if(this.starData[t])return this.starData[t].position},showStarFlag:function(t){this.starPNode.position=t,this.starPNode.runAction(cc.spawn(cc.scaleTo(.33,1),cc.rotateTo(.33,0)))},hideStarFlag:function(){this.starPNode.runAction(cc.spawn(cc.scaleTo(.33,0),cc.rotateTo(.33,-90)))},starFlagAction:function(){this.starPNode.zIndex=100,this.starPNode.getChildByName("starAction").runAction(cc.repeatForever(cc.sequence(cc.spawn(cc.scaleTo(1,1.5),cc.fadeTo(1,255)),cc.spawn(cc.scaleTo(1,1),cc.fadeTo(1,200)))))},playFlayStar:function(t,e,i,n,s){this.flayNode.position=t,this.flayNode.active=!0;var o=this.getStarPosByIndex(e),c=cc.callFunc(function(t){this.flayNode.getChildByName("particlesystem").getComponent(cc.ParticleSystem).resetSystem(),this.flayNode.active=!1,this.setStarTypeByIndex(e,i),n&&n.call(s)},this),a=cc.pDistance(o,t),h=Math.min(a/1200,1.5);this.flayNode.runAction(cc.sequence(cc.moveTo(h,o),c)),this.blueStar.runAction(cc.rotateTo(h,1440))}}),cc._RF.pop()},{}],QuestionNumJS:[function(t,e,i){"use strict";cc._RF.push(e,"511ccnUhPdEV5sMRHkmPNf2","QuestionNumJS"),cc.Class({extends:cc.Component,properties:{label:cc.Label,selected_node:cc.Node},onLoad:function(){this.isSelect=!1,this.sp=this.node.getComponent("cc.Sprite")},init:function(t,e){this.gameJS=t;var i=""+((this.idx=e)+1);this.label.string=i,this.selected_node.opacity=0},onClick:function(){this.gameJS.changQustion(this.idx)},setSelected:function(t){this.isSelect=t,this.selected_node.opacity=t?255:0}}),cc._RF.pop()},{}],QuestionNumListJS:[function(t,e,i){"use strict";cc._RF.push(e,"7a656I23ulAK7kDASga7f0X","QuestionNumListJS"),cc.Class({extends:cc.Component,properties:{lastBtn:cc.Node,nextBtn:cc.Node,quertionNum:cc.Prefab,questionNum_node:cc.Node},onLoad:function(){this.itemPool=new cc.NodePool,this.defaultLen=7,this.targetIdx=0,this.nowQuestionID=0,this.qusetionItemPool=new cc.NodePool,this.qusetionNumJSArr=[],this.selectedQusetionJS=null},init:function(t,e){this.maxlen=t,this.cb=e,t<this.defaultLen?(this.lastBtn.opacity=0,this.nextBtn.opacity=0):(this.lastBtn.opacity=255,this.nextBtn.opacity=255);for(var i=0;i<t;i++){var n=cc.instantiate(this.quertionNum),s=n.getComponent("QuestionNumJS");this.qusetionNumJSArr.push(n),s.init(this,i)}this.changeQustionList(),this.selectedQusetionJS=this.qusetionNumJSArr[this.nowQuestionID].getComponent("QuestionNumJS"),this.selectedQusetionJS.setSelected(!0)},clickLast:function(){this.targetIdx>=this.defaultLen&&(this.targetIdx-=this.defaultLen,this.changeQustionList())},clickNext:function(){this.targetIdx+this.defaultLen<this.maxlen&&(this.targetIdx+=this.defaultLen,this.changeQustionList())},changeQustionList:function(){this.questionNum_node.removeAllChildren();for(var t=this.targetIdx,e=Math.min(this.defaultLen,this.maxlen-t),i=0;i<e;i++){var n=this.qusetionNumJSArr[i+t];this.questionNum_node.addChild(n)}},changQustion:function(t){this.nowQuestionID=t,this.selectedQusetionJS.setSelected(!1),this.selectedQusetionJS=this.qusetionNumJSArr[t].getComponent("QuestionNumJS"),this.selectedQusetionJS.setSelected(!0);var e=this.cb;e&&e(t)},changeOptionEnable:function(){this.questionNum_node.resumeSystemEvents(!0)},changeOptionDisable:function(){this.questionNum_node.pauseSystemEvents(!0)}}),cc._RF.pop()},{}],TitleJS:[function(t,e,i){"use strict";cc._RF.push(e,"5b283IiR/BBgLkN+zazJigp","TitleJS"),cc.Class({extends:cc.Component,properties:{label:cc.Label},init:function(t){this.label.string=t}}),cc._RF.pop()},{}],config:[function(t,e,i){"use strict";cc._RF.push(e,"cf7e7Hjl8pBApNKVzaPXR0c","config"),window.CONSOLE_LOG_OPEN=!0,window.AUDIO_OPEN=!0,window.REQUEST_URL=!0,cc._RF.pop()},{}],efailed:[function(t,e,i){"use strict";cc._RF.push(e,"9b649czY5lPE5+Bb2VZOMm4","efailed"),cc.Class({extends:cc.Component,properties:{label:cc.Label},onLoad:function(){},showHint:function(){this.node.stopAllActions(),this.node.opacity=255,this.label.string="当前分类已经有了哦！";var t=cc.callFunc(function(t){this.node.opacity=0},this);this.node.runAction(cc.sequence(cc.delayTime(1.5),cc.fadeTo(.5,0),t))},showLimitHint:function(t){this.node.stopAllActions(),this.node.opacity=255,this.label.string="啊哦！本题最多只能选择"+t+"个瓶子哦！";var e=cc.callFunc(function(t){this.node.opacity=0},this);this.node.runAction(cc.sequence(cc.delayTime(1.5),cc.fadeTo(.5,0),e))},start:function(){}}),cc._RF.pop()},{}],numSpineJs:[function(t,e,i){"use strict";cc._RF.push(e,"afcf96cYgpP45hqtNCxA5Jy","numSpineJs");var o=["stand","grasp","happy","happy_coterie","sad","jump","original_number"];cc.Class({extends:cc.Component,properties:{spine0:cc.Prefab,spine1:cc.Prefab,spine2:cc.Prefab,spine3:cc.Prefab,spine4:cc.Prefab,spine5:cc.Prefab,spine6:cc.Prefab,spine7:cc.Prefab,spine8:cc.Prefab,spine9:cc.Prefab},onLoad:function(){this.stand=null,this.number=null},init:function(t){if(t=t.toString(),"string"==typeof(this.number=t))for(var e=0;e<t.length;e++){var i=t.charAt(e),n=cc.instantiate(this["spine"+i]);this.node.addChild(n),n.position=cc.p(-t.length/2*160+160*e+5+75,0),this["spine"+i+e]=n.getComponent("sp.Skeleton"),this["spineEyel"+i+e]=this["spine"+i+e].findBone("eye_l"),this["spineEyer"+i+e]=this["spine"+i+e].findBone("eye_r"),this["_Eyelx"+i+e]=this["spineEyel"+i+e].x,this["_Eyely"+i+e]=this["spineEyer"+i+e].y}this.setStand(0)},setStand:function(t){var e=null;if("string"==typeof t){for(var i=0;i<o.length;i++)if(o[i]==t){e=t;break}}else{if("number"!=typeof t)return;e=o[t]}if(e&&e!=this.stand){this.stand=e;for(var n=0;n<this.number.length;n++){var s=this.number.charAt(n);this["spineEyel"+s+n].x=this["_Eyelx"+s+n],this["spineEyel"+s+n].y=this["_Eyely"+s+n],this["spineEyer"+s+n].x=this["_Eyelx"+s+n],this["spineEyer"+s+n].y=this["_Eyely"+s+n],this["spine"+s+n].setAnimation(0,e,!0)}}},showYinying:function(i){this.node.children.forEach(function(t,e){t.getChildByName("yinying")&&(t.getChildByName("yinying").active=i)},this)},getStand:function(){return this.stand||""},getNumber:function(){return this.number||""},getEyseParent:function(){return this.node.convertToWorldSpaceAR(cc.p(0,0))},getEyseRotatePos:function(t,e){var i=cc.p(t.x-e.x,t.y-e.y),n=cc.pNormalize(i),s=cc.pDistance(e,cc.p(t.x,t.y)),o=Math.min(s/70*2,10);return cc.pAdd(cc.p(0,0),cc.pMult(n,o))},setEysePos:function(t){if("stand"===this.stand)for(var e=this.getEyseRotatePos(t,this.getEyseParent()),i=0;i<this.number.length;i++){var n=this.number.charAt(i);this["spineEyel"+n+i]&&this["spineEyer"+n+i]&&(this["spineEyel"+n+i].x=-e.y+this["_Eyelx"+n+i],this["spineEyel"+n+i].y=e.x+this["_Eyely"+n+i],this["spineEyer"+n+i].x=-e.y+this["_Eyelx"+n+i],this["spineEyer"+n+i].y=e.x+this["_Eyely"+n+i])}},resetEyePos:function(){for(var t=0;t<this.number.length;t++){var e=this.number.charAt(t);this["spineEyel"+e+t]&&this["spineEyer"+e+t]&&(this["spineEyel"+e+t].x=this["_Eyelx"+e+t],this["spineEyel"+e+t].y=this["_Eyely"+e+t],this["spineEyer"+e+t].x=this["_Eyelx"+e+t],this["spineEyer"+e+t].y=this["_Eyely"+e+t])}}}),cc._RF.pop()},{}],question_panel:[function(t,e,i){"use strict";cc._RF.push(e,"518c6EygmVF7aZ+N0GUpC9+","question_panel");var c=[];cc.Class({extends:cc.Component,properties:{oItemPrefab:cc.Prefab},onLoad:function(){this.oItemPool=new cc.NodePool},isEmpty:function(){return 0==c.length},copyAry:function(){var t=c.slice(0,c.length);return CONSOLE_LOG_OPEN&&console.log("questionAry.slice"+t+"  "+c),t},createOptions:function(){for(var t,e=0;e<c.length;e++){e==this.questionAry.length-1?(t=0<this.oItemPool.size()?this.oItemPool.get():cc.instantiate(this.oItemPrefab)).parent=this.node:t=this.node.children[e];var i=t.width,n=this.node.height,s=(e%3-1)*(i+15),o=e<3?n/3+10:e<6?30:-n/3+55;t.setPosition(cc.p(s,o))}},addOption:function(t){var e,i=this;e=t.slice(0,t.length),c.push(e.sort(_sortNumber)),i.createOptions(t),i.updateSum()},removeAllOption:function(){for(var t=0;t<this.node.children.length;t++){this.node.children[t].removeAllChildren(!0)}this.node.removeAllChildren(!0),c.splice(0,c.length),c=[],this.updateSum()},updateSum:function(){}}),cc._RF.pop()},{}],scalebg:[function(t,e,i){"use strict";cc._RF.push(e,"3093551zVpLp4AjCVzrt6iQ","scalebg"),cc.Class({extends:cc.Component,properties:{designSize:cc.Size,bg:cc.Node,lbg:cc.Node,rbg:cc.Node},onLoad:function(){var t=(cc.winSize.width-this.designSize.width)/2;if(0<t)this.lbg.width=Math.max(t,512),this.rbg.width=Math.max(t,512);else{var e=Math.min(cc.winSize.width/this.designSize.width,cc.winSize.height/this.designSize.height);this.node.setScale(e,1)}}}),cc._RF.pop()},{}],scale:[function(t,e,i){"use strict";cc._RF.push(e,"521434wupJHAqZevOCVOyWl","scale"),cc.Class({extends:cc.Component,properties:{designSize:cc.Size},onLoad:function(){var t=Math.min(cc.winSize.width/this.designSize.width,cc.winSize.height/this.designSize.height);this.node.setScale(t,t)}}),cc._RF.pop()},{}],settlement:[function(t,e,i){"use strict";cc._RF.push(e,"0201eLFHyREVrR07BxW/6dN","settlement");cc.Class({extends:cc.Component,properties:{failSpine:cc.Node,successSpine:cc.Node,timeOutSpine:cc.Node},onLoad:function(){this.background=this.node.getChildByName("background"),this.scale=this.node.getChildByName("scale")},playWinAnim:function(t){this.node.active=!0,this.successSpine.active=!0,this.successSpine.getComponent("sp.Skeleton").setAnimation(0,"animation",!1);var e=this;this.scheduleOnce(function(){t.call(e.game)},2.5)},playLoseAnim:function(t){this.node.active=!0,this.failSpine.active=!0,this.failSpine.getComponent("sp.Skeleton").setAnimation(0,"animation",!1);var e=this;this.scheduleOnce(function(){t.call(e.game)},2.5)},playTimeUpAnim:function(t){this.node.active=!0,this.timeOutSpine.active=!0,this.timeOutSpine.getComponent("sp.Skeleton").setAnimation(0,"animation",!1);var e=this;this.scheduleOnce(function(){t.call(e.game)},1)},reset:function(){this.failSpine.active=!1,this.successSpine.active=!1,this.timeOutSpine.active=!1,this.node.active=!1},log:function(t){CONSOLE_LOG_OPEN&&cc.log(t)}}),cc._RF.pop()},{}],title:[function(t,e,i){"use strict";cc._RF.push(e,"d58c4qtV15MNYbanwyOTHvL","title"),cc.Class({extends:cc.Component,properties:{label:cc.Label,img:cc.Sprite},onLoad:function(){},setTitle:function(t,e){if(e&&e instanceof Array&&1<e.length)this.img.enabled=!0,this.img.spriteFrame=this.game.getSpriteFrame(e[e.length-1]),this.label.string="";else if("string"==typeof t){var i=t.replace(/\+/g,",").replace(/\=/g,".").replace(/\?/g,"/");this.label.string=i,this.img.spriteFrame=null}},reset:function(){this.label.string="",this.img.spriteFrame=null,this.img.enabled=!1}}),cc._RF.pop()},{}]},{},["BaseGameJS","LocalSaveJS","NetworkJS","ColliderListener","OptionJS","OptionJS1","QuestionNumJS","QuestionNumListJS","TitleJS","efailed","title","question_panel","numSpineJs","settlement","AnswerContainer","Flags","GameJS","NetworkJS_Data","ProgressJs","config","scale","scalebg"]);