require=function s(c,a,h){function r(e,t){if(!a[e]){if(!c[e]){var i="function"==typeof require&&require;if(!t&&i)return i(e,!0);if(l)return l(e,!0);var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}var o=a[e]={exports:{}};c[e][0].call(o.exports,function(t){return r(c[e][1][t]||t)},o,o.exports,s,c,a,h)}return a[e].exports}for(var l="function"==typeof require&&require,t=0;t<h.length;t++)r(h[t]);return r}({BaseGameJS:[function(t,e,i){"use strict";cc._RF.push(e,"d5325ralz1KNpBY2dkj5IqD","BaseGameJS"),cc.Class({extends:cc.Component,properties:{timeLabel:cc.Label,paopao_node:cc.Node,feedback_node:cc.Node,loseTime_node:cc.Node,loseTime:0,time_node:cc.Node,question_node:cc.Node,quertionList_node:cc.Node,title_node:cc.Node},onLoad:function(){var t=this;document.addEventListener("resignActivePauseGame",function(){t.gotoBackground(),cc.director.pause(),cc.game.pause(),CONSOLE_LOG_OPEN&&console.log("app just resign active.")}),document.addEventListener("becomeActiveResumeGame",function(){cc.game.isPaused&&cc.game.resume(),cc.director.isPaused&&cc.director.resume(),t.gotoForeground(),CONSOLE_LOG_OPEN&&console.log("app just become active.")}),this.initFeedback(),this.answerTime=0,this.lastAnswerTime=0,this.answerContext="",this.countDown=300,this.timeCallback=this.timeCallbackFunc(),this.isShowLossTime=!1,this.nowQuestionID=0,this.questionArr=[],this.answerInfoArr=[],this.questionNumListJS=this.quertionList_node.getComponent("QuestionNumListJS"),this.quertionList_node.opacity=0,this.time_node.opacity=0,this.onLoadChild(),this.answerEnable=!1,this.network=this.node.getComponent("NetworkJS_Data"),this.network.sendXHR(this)},initFeedback:function(){var t=cc.instantiate(this.feedback_pref);this.feedback_node.addChild(t),this.feedbackJS=t.getChildByName("Fish").getComponent("FishFeedback")},onLoadChild:function(){},gotoBackground:function(){},gotoForeground:function(){},createPaopao:function(){for(var t=this.node.width,e=[120,40,160,80,200],i=1012/e.length,n=0;n<e.length;n++){(o=cc.instantiate(this.paopao_pref)).x=e[n],o.y=-i*n,this.paopao_node.addChild(o)}for(n=0;n<e.length;n++){var o;(o=cc.instantiate(this.paopao_pref)).x=t-e[n],o.y=-i*n,this.paopao_node.addChild(o)}},createAnswerInfo:function(t){var e=this.questionArr[this.nowQuestionID];if(e){var i={answerTime:this.answerTime-this.lastAnswerTime,leveLQuestionDetailNum:e.leveLQuestionDetailNum,levelQuestionDetailID:e.levelQuestionDetailID,answerStatus:t,answerContext:this.answerContext};this.answerInfoArr.push(i)}},showFeedback:function(t){0===this.nowQuestionID?this.feedbackJS.firstShowFeedback(this,t):this.feedbackJS.showFeedback(this,t)},firstFeedbackFinish:function(){},feedbackFinish:function(){!this.isIts&&(this.nowQuestionID+=1);var t=this.questionArr[0].interactiveJson.totalcd;if(this.nowQuestionID>=this.questionArr.length||this.countDown-this.answerTime<=0&&t){CONSOLE_LOG_OPEN&&console.log("答完了");for(var e=!!(this.countDown-this.answerTime<=0&&t),i=this.questionArr.length-this.nowQuestionID,n=0;n<i;n++)this.answerTime=0,this.lastAnswerTime=0,this.createAnswerInfo("2"),this.nowQuestionID+=1;e||this.gameOverSettlement(),this.scheduleOnce(function(){this.isIts&&this.settlementJs.reset(),this.network.gameOver(this.answerInfoArr)},2.5)}else this.network.gameLoadProgress(this.nowQuestionID+1,this.questionArr.length),!this.isIts&&this.deleteOption(),this.settlementJs.reset(),!this.isIts&&this.startloadOption()},showLossTime:function(){this.answerTime+=this.loseTime,this.isShowLossTime=!0,this.loseTime_node.opacity=255;var t=cc.callFunc(function(t){this.isShowLossTime=!1,this.loseTime_node.opacity=0},this);this.loseTime_node.runAction(cc.sequence(cc.fadeTo(1,0),t))},timeCallbackFunc:function(){return function(){this.answerTime+=1,this.scheduleTime+=1;var t=this.countDown-this.answerTime;t<=0?(CONSOLE_LOG_OPEN&&console.log("时间到"),this.timeout(),this.isShowFeed=!0,this.answerTime=this.countDown,this.timeLabel.string="00:00",this.createAnswerInfo("2"),this.showFeedback(3),this.answerTime>this.scheduleTime&&this.unschedule(this.timeCallback)):this.timeLabel.string=this.timeFormat(t)}},timeFormat:function(t){var e=Math.floor(t/60),i=t%60,n=i<10?"0"+i:i;return 59<t?(e<10?"0"+e:e)+":"+n:"00:"+n},timeout:function(){},showSchedule:function(){this.scheduleTime=0,this.schedule(this.timeCallback,1,this.countDown-1)},deleteOption:function(){},createOption:function(t){},selectedOption:function(t){this.nowQuestionID=t,this.deleteOption();var e=this;setTimeout(function(){e.startloadOption()},0)},startloadOption:function(){this.isIts&&this.questionNumListJS.changeOptionDisable();this.questionArr[this.nowQuestionID];this.timeLabel.string=this.timeFormat(this.countDown),this.answerTime=0,!this.isIts&&this.showSchedule(),this.isIts&&this.questionNumListJS.changeOptionEnable(),this.isShowFeed=!1},startLoadGame:function(t){this.questionArr=t,this.quertionList_node.opacity=this.isIts?255:0,this.time_node.opacity=this.isIts?0:255,this.isIts&&t&&0<t.length&&this.questionNumListJS.init(t.length,this.selectedOption.bind(this)),REQUEST_URL?this.requestAllUrls():this.startloadOption(),this.playBGMAudio(),this.playTimuAudio(),this.BasicAni()},requestAllUrls:function(){for(var t=[],e=0;e<this.questionArr.length;e++){if(this.questionArr[e].quescontimgAry instanceof Array)for(var i=0;i<this.questionArr[e].quescontimgAry.length;i++)t.push(this.questionArr[e].quescontimgAry[i]);if(this.questionArr[e].optionsArr instanceof Array)for(var n=0;n<this.questionArr[e].optionsArr.length;n++)this.questionArr[e].optionsArr[n].optioncontimg&&t.push(this.questionArr[e].optionsArr[n].optioncontimg)}var o=this;cc.loader.load(t,function(t,e){t?o.network.gameLoadFailed(1):(o.spriteMaps=e.map,o.startloadOption())})},getSpriteFrame:function(t){if(!t||0==t.length)return null;var e=this.spriteMaps[t].content;return e instanceof cc.Texture2D?new cc.SpriteFrame(e):null},selectAnswer:function(t,e){this.isShowFeed||this.isShowLossTime||(e?(CONSOLE_LOG_OPEN&&console.log("答对了"),this.rightSelect+=1,t.showParticle(),this.rightSelect>=this.count&&(this.unschedule(this.timeCallback),this.isShowFeed=!0,this.createAnswerInfo("1"),this.scheduleOnce(function(){this.showFeedback(1)},1))):(CONSOLE_LOG_OPEN&&console.log("答错了"),this.showLossTime()))},onDestroy:function(){document.removeEventListener("resignActivePauseGame"),document.removeEventListener("becomeActiveResumeGame")},setGameName:function(t){this.title_node.getComponent("TitleJS").init(t)},setPlatform:function(t){this.platform=t,this.isIts="its"==t;var e=this.isIts;this.quertionList_node.active=!!e,this.time_node.active=!e},resetOption:function(){0!=this.moveOptionTag&&(this.option_node.getChildByTag(this.moveOptionTag).getComponent("Option").reloadState(),this.moveOptionTag=0)},changeMoveTag:function(t){return!this.isShowFeed&&((0===this.moveOptionTag||this.moveOptionTag===t||0===t)&&(this.moveOptionTag=t,!0))}}),cc._RF.pop()},{}],ColliderListener:[function(t,e,i){"use strict";cc._RF.push(e,"b0b466dPFFI1ZCDMEewg3qk","ColliderListener"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){cc.director.getCollisionManager().enabled=!0},onCollisionEnter:function(t,e){this.node.isCollisioned=!0,this.node.opacity=100},onCollisionExit:function(t,e){CONSOLE_LOG_OPEN&&console.log("on collision exit"),this.node.isCollisioned=!1,this.node.opacity=255}}),cc._RF.pop()},{}],GameJS:[function(t,e,i){"use strict";cc._RF.push(e,"d92c8sRpIBMBKs/RzLIjTLN","GameJS");var n=t("BaseGameJS");cc.Class({extends:n,properties:{optionItem_pref:cc.Prefab,particle_pref:cc.Prefab,settlePrefab:cc.Prefab,resetBtnNSF:cc.SpriteFrame,commitBtnNSF:cc.SpriteFrame,winAudio:cc.AudioClip,loseAudio:cc.AudioClip,optionAudio:cc.AudioClip,option_wrongAudio:cc.AudioClip,option_correctAudio:cc.AudioClip,timuAudio:cc.AudioClip,zhuazhiAudio:cc.AudioClip,paopaoAudio:cc.AudioClip},onLoadChild:function(){this._super(),this.scaleNode=this.node.getChildByName("scale"),this.option_node=this.scaleNode.getChildByName("option_node"),this.tipsNode=this.node.getChildByName("TipsNode"),this.tipsNode&&(this.tipsNode.active=!0),this.answerItemPool=new cc.NodePool,this.prompt_nodeJS=this.scaleNode.getChildByName("prompt_node").getComponent("title"),this.clampNode=this.scaleNode.getChildByName("clamp"),this.hand=this.scaleNode.getChildByName("hand"),this.changeMoveTag(0),this.initToast(),this.node.getComponent("OptionJS1").init(this)},initToast:function(){var t=this.node.getChildByName("scale").getChildByName("efailed");this.efailedJs=t.getComponent("efailed"),this.efailedJs.game=this},tipsClick:function(){this.tipsNode&&this.tipsNode.removeFromParent(!0),this.tipsNode&&this.tipsNode.destroy(),!this.isIts&&this.showSchedule(),this.questionArr[0].interactiveJson.totalcd&&(this.lastAnswerTime=this.answerTime)},initFeedback:function(){this.settlement=cc.instantiate(this.settlePrefab),this.settlementJs=this.settlement.getComponent("settlement"),(this.settlementJs.game=this).node.getChildByName("feedback_node").addChild(this.settlement),this.settlement.active=!1},gotoBackground:function(){for(var t=this.option_node.children,e=0;e<t.length;e++){var i=t[e].getChildByName("button_bg");if(i.getComponent("OptionJS").canMove){i.stopAllActions(),i.opacity=255;break}}var n=this.node.getChildByName("button_node").getChildByName("commit"),o=this.node.getChildByName("button_node").getChildByName("cancel");n.setScale(1,1),o.setScale(1,1),n._pressed=!1,n._hovered=!1,o._pressed=!1,o._hovered=!1,n.normalSprite=this.commitBtnNSF,n.hoverSprite=this.commitBtnNSF,o.normalSprite=this.resetBtnNSF,o.hoverSprite=this.resetBtnNSF},timeout:function(){AUDIO_OPEN&&this.playLoseAudio(),this.settlementJs.playTimeUpAnim()},deleteOption:function(){for(var t=this.option_node.children,e=0;e<t.length;e++){(n=t[e]).destroy()}this.option_node.removeAllChildren(!0);var i=this.scaleNode.children;for(e=0;e<i.length;e++){var n;1e3<=(n=i[e]).tag&&n.tag<=1010&&n.destroy()}},creatQuestion:function(t){this.promptJS1=this.question_node.getChildByName("prompt_node1").getComponent("title"),this.promptJS2=this.question_node.getChildByName("prompt_node2").getComponent("title"),this.promptJS3=this.question_node.getChildByName("prompt_node3").getComponent("title"),this.promptJS4=this.question_node.getChildByName("prompt_node4").getComponent("title"),this.promptJS5=this.question_node.getChildByName("prompt_node5").getComponent("title"),this.promptJS6=this.question_node.getChildByName("prompt_node6").getComponent("title"),this.promptJS1.setTitle(0<t.length&&t[0],null),this.promptJS2.setTitle(1<t.length&&t[1],null),this.promptJS3.setTitle("?",null),this.promptJS4.setTitle("?",null),this.promptJS5.setTitle("10",null),this.promptJS6.setTitle("?",null),0==this.nowQuestionID?(this.isIts&&this.questionNumListJS.changeOptionEnable(),this.updateGameState(!0),this.PlayFuhaoAnim()):this.playParticle()},playParticle:function(){this.playPaopaoAudio(),this.question_node.children.forEach(function(t,e){var i=cc.instantiate(this.particle_pref);i.setPosition(cc.p(0,0)),i.parent=t,i.getComponent(cc.ParticleSystem).autoRemoveOnFinish=!0},this),this.scheduleOnce(function(){this.isIts&&this.questionNumListJS.changeOptionEnable(),this.updateGameState(!0),this.PlayFuhaoAnim()},3.5)},createOption:function(t){for(var e=0;e<t.length;++e){var i=null;(i=cc.instantiate(this.optionItem_pref)).setPosition(cc.p(-(t.length/2-.5-e)*(i.width+55),10)),this.option_node.addChild(i);var n=i.getChildByName("button_bg");n.tag=1e3+e;var o=n.getComponent("OptionJS");o.init(this,t[e],t.length),this.isIts&&o.updateState(!1);var s=n.getComponent("numSpineJs");cc.log("optionContent"+t[e].optionContent),s.init(t[e].optionContent)}},startloadOption:function(){this.updateGameState(!1),this.isIts&&this.questionNumListJS.changeOptionDisable();var t=this.questionArr[this.nowQuestionID];this.prompt_nodeJS.setTitle(t.qescont,null),this.questionBgNode=this.scaleNode.getChildByName("questionBg"),t.quescontimgAry[0]&&0<t.quescontimgAry[0].length?(this.questionBgNode.getChildByName("questionLabel").active=!1,this.questionBgNode.getChildByName("questionPic").active=!0):(this.questionBgNode.getChildByName("questionPic").active=!1,this.questionBgNode.getChildByName("questionLabel").active=!0),this.nownumber=0,this.rightOptionNo=t.rightOptionNo,this.rightArray=t.rightAry,this.createOption(t.optionsArr),this.creatQuestion(t.contentAry);var e=this.questionArr[0].interactiveJson.totalcd;if(0===this.nowQuestionID&&e||!e){this.answerTime=0;var i=parseInt(t.interactiveJson.countDown);0<i&&(this.countDown=i),this.timeLabel.string=this.timeFormat(this.countDown)}if(0<this.nowQuestionID&&(!this.isIts&&this.showSchedule(),e&&(this.lastAnswerTime=this.answerTime),this.hand.activeInHierarchy&&this.stopHandAction(!0)),this.isShowFeed=!1,this.changeMoveTag(0),0===this.nowQuestionID){var n=0<t.rightAry.length&&t.rightAry[0],o=-1;t.optionsArr.forEach(function(t,e){n==t.optionContent&&(o=e)},this);var s=this.option_node.children[o].convertToWorldSpaceAR(cc.p(0,0)),c=this.scaleNode.convertToNodeSpaceAR(s);this.handMove(c),this.changeMoveTag(1e3+o)}this.scheduleOnce(function(){!this.isIts&&this.optionShowAnim()},1.84)},selectAnswer:function(t){this.isShowFeed||this.isShowLossTime||(this.unschedule(this.timeCallback),this.isShowFeed=!0,this.updateGameState(!1),t?(CONSOLE_LOG_OPEN&&console.log("答对了"),this.createAnswerInfo("1"),this.showFeedback(1)):(CONSOLE_LOG_OPEN&&console.log("答错了"),this.createAnswerInfo("2"),this.showFeedback(2)))},showFeedback:function(t){this.scheduleOnce(function(){this.feedbackFinish(),!this.isIts&&this.optionDismissAnim()},.1)},optionDismissAnim:function(){var t=this,e=cc.sequence(cc.moveTo(1.14,-2048,-553),cc.callFunc(function(){t.option_node.setPosition(2048,-553)}));0===this.option_node.x&&(this.option_node.stopAllActions(),this.option_node.runAction(e))},gameOverSettlement:function(){AUDIO_OPEN&&this.playWinAudio(),this.settlementJs.playWinAnim()},optionShowAnim:function(){var t=cc.sequence(cc.moveTo(1.64,0,-553),cc.callFunc(function(){}));0!==this.option_node.x?(this.option_node.stopAllActions(),this.option_node.runAction(t)):this.option_node.setPosition(0,-553)},updateGameState:function(t){t?(this.question_node.resumeSystemEvents(!0),this.option_node.resumeSystemEvents(!0)):(this.question_node.pauseSystemEvents(!0),this.option_node.pauseSystemEvents(!0))},otherClicked:function(){this.playCancelAudio(),this.isShowFeed},resetClicked:function(){var t=this;this.playCancelAudio(),this.isShowFeed||this.isShowAnim||t.option_node.children.forEach(function(t,e){var i=t.getComponent("OptionJS");i&&i.reloadState()},t)},confirmClicked:function(){var t,n,o=this;(this.playCancelAudio(),this.isShowFeed||this.checkIsEmpty())||(t=o.option_node.children,n=!0,t.forEach(function(t,e){var i=t.getComponent("OptionJS");-1!=o.rightAry.indexOf(e.toString())?i&&2!=i.state&&(n=!1):i&&2==i.state&&(n=!1)},o),o.selectAnswer(n))},checkIsEmpty:function(){var t=this.option_node.children,n=!0;return t.forEach(function(t,e){var i=t.getComponent("OptionJS");i&&1<i.state&&(n=!1)},this),n},BasicAni:function(){this.unschedule(this.basinCallback),this.basinCallback=function(){this.isShowFeed||(CONSOLE_LOG_OPEN&&console.log("gagagagga"),this.playBasinAudio())};var t=this.questionArr[this.nowQuestionID];this.schedule(this.basinCallback,t.gap?parseInt(t.gap):40)},playWinAudio:function(){this.playAudio(this.winAudio)},playLoseAudio:function(){this.playAudio(this.loseAudio)},playCancelAudio:function(){},playOption_wrongAudio:function(){this.playAudio(this.option_wrongAudio)},playOption_correctAudio:function(){this.playAudio(this.option_correctAudio)},playOptionAudio:function(){this.playAudio(this.optionAudio)},playZhuazhiAudio:function(){this.playAudio(this.zhuazhiAudio)},playPaopaoAudio:function(){this.playAudio(this.paopaoAudio)},playOptionOutAudio:function(t){var e="vof_"+t;cc.loader.loadRes("audio/"+e,cc.AudioClip,function(t,e){t||cc.audioEngine.play(e,!1,1)})},playBasinAudio:function(){var t=this.questionArr[this.nowQuestionID];cc.loader.load(t.cndybasinAudio,function(t,e){t||(cc.audioEngine.play(e,!1,1),cc.loader.releaseAsset(e))})},playTimuAudio:function(){var t=this,e=cc.audioEngine.play(this.timuAudio,!1,1);cc.audioEngine.setFinishCallback(e,function(){cc.audioEngine.stop(e),t.playBasinAudio()})},playBGMAudio:function(){var t=this.questionArr[this.nowQuestionID];cc.loader.load(t.bgm_candyAudio,function(t,e){t||(cc.audioEngine.play(e,!0,1),cc.loader.releaseAsset(e))})},playAudio:function(t){AUDIO_OPEN&&cc.audioEngine.play(t,!1,1)},playClampSkeleton:function(t){var e=0==t?"put":"scratch";this.clampNode.getComponent("sp.Skeleton").setAnimation(0,e,!1)},showPromptSuccessTitle:function(t){0==this.nownumber?this.promptJS4.setTitle(t,null):1==this.nownumber?this.promptJS6.setTitle(t,null):this.promptJS3.setTitle(t,null)},playPromptWrongAnim:function(){var t=this.question_node.getChildByName("prompt_node4"),e=this.question_node.getChildByName("prompt_node6"),i=this.question_node.getChildByName("prompt_node3"),n=void 0;n=0==this.nownumber?t.getChildByName("wrong"):1==this.nownumber?e.getChildByName("wrong"):i.getChildByName("wrong");var o=.17,s=cc.sequence(cc.fadeTo(o,255),cc.fadeTo(o,0),cc.fadeTo(o,255),cc.fadeTo(o,0),cc.fadeTo(o,255),cc.fadeTo(o,0),cc.fadeTo(o,255),cc.fadeTo(o,0),cc.fadeTo(o,255),cc.fadeTo(o,0),cc.fadeTo(o,255),cc.fadeTo(o,0),cc.callFunc(function(){}));n.runAction(s)},PlayFuhaoAnim:function(){var t=cc.sequence(cc.spawn(cc.scaleTo(.5,1.1,1.1),cc.fadeTo(.5,255)),cc.delayTime(.2),cc.spawn(cc.scaleTo(.5,1,1),cc.fadeTo(.5,0))).repeatForever(),e=this.question_node.getChildByName("prompt_node4"),i=this.question_node.getChildByName("prompt_node6"),n=this.question_node.getChildByName("prompt_node3");(0==this.nownumber?e.getChildByName("label"):1==this.nownumber?i.getChildByName("label"):n.getChildByName("label")).runAction(t)},stopFuhaoAnim:function(t){var e=this.question_node.getChildByName("prompt_node4"),i=this.question_node.getChildByName("prompt_node6"),n=this.question_node.getChildByName("prompt_node3"),o=void 0;o=0==this.nownumber?e.getChildByName("label"):1==this.nownumber?i.getChildByName("label"):n.getChildByName("label"),"stop"==t?o.stopAllActions():"pause"==t?(o.pauseAllActions(),o.opacity=255):o.resumeAllActions()},stopHandAction:function(t){t?(this.hand.opacity=0,!this.isIts&&(this.hand.active=!1),this.hand.stopAllActions(),this.tipsClick()):(this.hand.opacity=255,this.hand.resumeAllActions())},handMove:function(t){var e=this;this.hand.opacity=255,this.hand.setPosition(t.x+200,t.y-200);var i=cc.sequence(cc.moveTo(1,t.x+50,t.y-100),cc.delayTime(.2),cc.callFunc(function(){e.hand.setPosition(t.x+200,t.y-200)},this)).repeatForever();this.hand.runAction(i)}}),cc._RF.pop()},{BaseGameJS:"BaseGameJS"}],LocalSaveJS:[function(t,e,i){"use strict";cc._RF.push(e,"f4c57nVhA1DEK8uDdBUQDFX","LocalSaveJS"),cc.Class({extends:cc.Component,properties:{},save:function(t,e){var i=cc.sys.localStorage;i?function(t,e,i){var n="";null!=i&&(n="; expires="+(n=new Date((new Date).getTime()+1e3*i)).toGMTString());n+="; path=/",document.cookie=t+"="+escape(e)+n}(t,e):i.setItem(t,e)},load:function(t){var e=cc.sys.localStorage;return e?function(t){var e="",i=t+"=";if(0<document.cookie.length){var n=document.cookie.indexOf(i);if(-1!=n){n+=i.length;var o=document.cookie.indexOf(";",n);-1==o&&(o=document.cookie.length),e=unescape(document.cookie.substring(n,o))}}return e}(t):e.getItem(t)}}),cc._RF.pop()},{}],NetworkJS_Data:[function(t,e,i){"use strict";cc._RF.push(e,"8febaBdc6ZNMK6NnHe3UpZb","NetworkJS_Data");var n=t("NetworkJS");cc.Class({extends:n,properties:{},analysisDict:function(t){var e=t.interactiveJson;if(e&&0!=e.length){"string"==typeof e&&(e=JSON.parse(e));for(var i=t.optionandanswers[0],n=i.options,o=[],s=0;s<n.length;++s){var c=n[s],a=c.optioncontent,h={optionNo:c.optionno,optionContent:this.removeSpan(a),optioncontimg:c.optioncontimg};o.push(h)}var r=t.quescontimg,l=t.qescontsound;if(e.rightAry&&e.contentAry&&e.countDown&&e.gap||this.gameLoadFailed(2),o||0<o.length)return{answerTime:"0",levelQuestionDetailID:t.questionid,leveLQuestionDetailNum:t.orderid,qescont:this.removeSpan(t.qescont),optionsArr:o,rightOptionNo:this.removeSpan(i.rightanswer),contentAry:e.contentAry,quescontimgAry:r,bgm_candyAudio:0<l.length&&l[0],cndybasinAudio:1<l.length&&l[1],rightAry:e.rightAry,gap:e.gap,interactiveJson:e};this.gameLoadFailed(2)}else this.gameLoadFailed(2)}}),cc._RF.pop()},{NetworkJS:"NetworkJS"}],NetworkJS:[function(t,e,i){"use strict";cc._RF.push(e,"cd804MyCfRHi4BLiy+Orkth","NetworkJS");cc.Class({extends:cc.Component,properties:{},GetQueryString:function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),i=window.location.search.substr(1).match(e);return null!=i?decodeURI(i[2]):null},sendXHR:function(t){this.racingjs=t;var e=cc.loader.getXMLHttpRequest();this.streamXHREventsToLabel(e,"GET");var i=this.GetQueryString("fileUrl");e.open("GET",i),cc.sys.isNative&&e.setRequestHeader("Accept-Encoding","gzip,deflate"),e.timeout=6e4,e.send()},streamXHREventsToLabel:function(t,e,i){var n=i||function(t){return e+" Response: "+t.substring(0,30)+"..."},o=this;t.onreadystatechange=function(){t.readyState===XMLHttpRequest.DONE&&(CONSOLE_LOG_OPEN&&console.log(n(t.responseText)),200===t.status?o.analysisData(t.responseText):(CONSOLE_LOG_OPEN&&console.log("There was a problem with the request."),o.gameLoadFailed(1)))}},analysisData:function(t){var e=JSON.parse(t);if(e||0<e.length){for(var i=[],n=0;n<e.length;++n){var o=this.analysisDict(e[n]);if(!o)break;i.push(o)}i&&0<i.length&&e.length==i.length?(this.racingjs.setPlatform(this.GetQueryString("platform")),this.racingjs.setGameName(this.GetQueryString("gameName")),this.racingjs.startLoadGame(i),this.gameLoadSuccess(i.length)):this.gameLoadFailed(2)}else this.gameLoadFailed(2)},analysisDict:function(t){var e=t.interactiveJson;if(e&&0!=e.length)return"string"==typeof e&&(e=JSON.parse(e)),{answerTime:"0",levelQuestionDetailID:t.questionid,leveLQuestionDetailNum:t.orderid,qescont:this.removeSpan(t.qescont),interactiveJson:e};this.gameLoadFailed(2)},removeSpan:function(t){var e=t.replace("<span>","");return e=e.replace("</span>","")},gameLoadFailed:function(t){if(1==t){var e=encodeURI("errcode=10001&errmsg=下载失败");window.location.href="optionBlank://gameLoadFailed?"+e}else{e=encodeURI("errcode=10002&errmsg=解析失败");window.location.href="optionBlank://gameLoadFailed?"+e}},gameLoadSuccess:function(t){var e=encodeURI("isShow=1&totalNumber="+t);window.location.href="optionBlank://gameLoadSuccess?"+e},gameOver:function(t){var e=encodeURI(JSON.stringify(t));window.location.href="optionBlank://gameOver?status=1&data="+e},gameLoadProgress:function(t,e){var i=encodeURI("nowNumber="+t+"&totalNumber="+e);window.location.href="optionBlank://gameLoadProgress?"+i}});cc._RF.pop()},{}],OptionJS1:[function(t,e,i){"use strict";cc._RF.push(e,"cec4fBlGJ1Nw5Qzjr1JzrRx","OptionJS1");cc.Class({extends:cc.Component,properties:{parent_node:cc.Node,canMove:!1},onLoad:function(){this.node.on(cc.Node.EventType.TOUCH_START,this.touch_start.bind(this),this.node),this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touch_move.bind(this),this.node),this.node.on(cc.Node.EventType.TOUCH_END,this.touch_end.bind(this),this.node),this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touch_cancel.bind(this),this.node),this.audioPool=[]},init:function(t){this.node.opacity=255,this.startx=this.node.x,this.starty=this.node.y,this.gameJS=t},touch_start:function(t){this.canMove=!0,this.canMove&&(this.pos=null)},touch_end:function(t){this.canMove&&this.reloadState()},update:function(t){var n=this;this.pos&&this.gameJS.option_node.children.forEach(function(t,e){var i=t.getChildByName("button_bg");i&&i.getComponent("numSpineJs").setEysePos(n.pos)},this)},touch_move:function(t){if(this.canMove){t.touch.getDelta();var e=t.getTouches();this.node.parent.convertTouchToNodeSpaceAR(e[0]);this.pos=t.getLocation()}},touch_cancel:function(t){this.canMove&&this.reloadState()},reloadState:function(){this.canMove=!1,this.pos=null,this.gameJS.option_node.children.forEach(function(t,e){var i=t.getChildByName("button_bg");i&&i.getComponent("numSpineJs").resetEyePos()},this)}}),cc._RF.pop()},{}],OptionJS:[function(t,e,i){"use strict";cc._RF.push(e,"ea4b5QR7YdFVKJuS8oyqW38","OptionJS");cc.Class({extends:cc.Component,properties:{parent_node:cc.Node,canMove:!1,exchangeParent:!0,balloonNode:cc.Node,kuangNode:cc.Node},onLoad:function(){this.node.on(cc.Node.EventType.TOUCH_START,this.touch_start.bind(this),this.node),this.node.on(cc.Node.EventType.TOUCH_END,this.touch_end.bind(this),this.node),this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touch_cancel.bind(this),this.node),this.audioPool=[];var t=this;document.addEventListener("resignActivePauseGame",function(){t.resetState()})},init:function(t,e,i){this.node.opacity=255,this.startx=this.node.x,this.starty=this.node.y,this.gameJS=t,this.optionNo=e.optionContent},touch_start:function(t){this.node.parent==this.parent_node&&(this.canMove=this.gameJS.changeMoveTag(this.node.tag),this.canMove&&(this.gameJS.playOptionAudio(),this.gameJS.BasicAni(),this.dragX=this.node.x,this.dragY=this.node.y,this.pos=null,this.gameJS.clampNode.zIndex=1,this.gameJS.stopFuhaoAnim("pause"),this.gameJS.hand.activeInHierarchy&&this.gameJS.stopHandAction(!0)))},touch_end:function(t){this.canMove&&this.node.parent==this.parent_node&&(this.showAnim||(this.showAnim=!0,this.gameJS.isIts&&this.gameJS.questionNumListJS.changeOptionDisable(),this.kuangAnim()))},touch_cancel:function(t){this.canMove&&(this.node.parent,this.option_node)},resetState:function(){},reloadState:function(){this.canMove=!1,this.gameJS.changeMoveTag(0),this.node.setPosition(this.startx,this.starty)},calculateAnimTime:function(){var t=cc.pDistance(this.node.position,cc.p(this.startx,this.starty))/1e3;return.3*(t=1<t?1:t)},kuangAnim:function(){var t=cc.sequence(cc.spawn(cc.scaleTo(.5,1.1,1.1),cc.fadeTo(.5,255)),cc.spawn(cc.scaleTo(.5,1.2,1.2),cc.fadeTo(.5,8)),cc.spawn(cc.scaleTo(.03,1,1),cc.fadeTo(.03,0)),cc.callFunc(this.clampAnim,this));this.kuangNode.runAction(t)},clampAnim:function(t){var e=this,i=this.gameJS.clampNode.getPosition(),n=this.node.parent.convertToWorldSpace(cc.p(0,0));n=this.gameJS.clampNode.parent.convertToNodeSpaceAR(n),n=cc.p(n.x+223,n.y+763+220);var o=[cc.p(-665,624),cc.p(52,723),cc.p(595,1109)],s=this.gameJS.rightArray,c=o[this.gameJS.nownumber],a=cc.p(n.x,i.y),h=Math.abs(n.x-i.x)/900,r=cc.p(n.x,n.y),l=Math.abs(n.y-i.y)/900,u=cc.p(n.x,c.y),d=Math.abs(n.y-i.y)/900,p=cc.p(c.x,c.y),m=Math.abs(c.x-n.x)/900,g=cc.p(c.x,i.y),f=Math.abs(i.y-c.y)/900,S=cc.p(i.x,i.y),y=Math.abs(i.x-c.x)/900,v=cc.sequence(cc.moveTo(h,a),cc.moveTo(l,r),cc.callFunc(function(){e.NodeTransfer(),e.gameJS.playClampSkeleton(1)}),cc.delayTime(1.5),cc.spawn(cc.moveTo(d,u),cc.callFunc(function(){e.node.getComponent("numSpineJs").showYinying(!1);var t=cc.sequence(cc.moveTo(d,cc.p(u.x,u.y-763-100)),cc.moveTo(m,cc.p(p.x,p.y-763-120)));e.node.runAction(t)})),cc.moveTo(m,p),cc.delayTime(.3),cc.callFunc(function(){e.gameJS.playClampSkeleton(0)}),cc.callFunc(function(){e.gameJS.showPromptSuccessTitle(""),0==e.gameJS.nownumber?(e.node.setScale(.8,.8),e.node.setPosition(e.node.x,e.node.y+30)):1==e.gameJS.nownumber&&(e.node.setScale(.55,.55),e.node.setPosition(e.node.x,e.node.y+50))}),cc.delayTime(1.5),cc.moveTo(f,g),cc.moveTo(y,S),cc.delayTime(.3),cc.callFunc(function(){e.gameJS.playOptionOutAudio(e.optionNo),e.optionNo===s[e.gameJS.nownumber]?(e.gameJS.playOption_correctAudio(),e.matchRightAnim()):(e.gameJS.playOption_wrongAudio(),e.matchWrongAnim())}));this.gameJS.playZhuazhiAudio(),this.gameJS.clampNode.stopAllActions(),this.gameJS.clampNode.runAction(v)},NodeTransfer:function(){var t=this.node.convertToWorldSpaceAR(cc.p(0,0)),e=this.gameJS.clampNode.parent.convertToNodeSpaceAR(t);this.node.setPosition(e),this.node.parent=this.gameJS.clampNode.parent,this.node.zIndex=1},playAnim:function(){var t=this.node.getChildByName("anim"),e=t.getComponent(cc.Animation);e.on("stop",function(){t.destroy()},this),e.play()},matchRightAnim:function(){var t,e=this;(t=e.node.getComponent("numSpineJs")).setStand("happy_coterie"),e.playBallonSketon(),e.scheduleOnce(function(){t.setStand("original_number"),this.gameJS.changeMoveTag(0),this.gameJS.clampNode.zIndex=1,this.node.zIndex=0,this.showAnim=!1,this.gameJS.isIts&&this.gameJS.questionNumListJS.changeOptionEnable(),this.gameJS.stopFuhaoAnim("stop"),this.gameJS.nownumber+=1,3==this.gameJS.nownumber?this.gameJS.selectAnswer(!0):this.gameJS.PlayFuhaoAnim()},2)},matchWrongAnim:function(){var n=this.node.getComponent("numSpineJs");this.gameJS.playPromptWrongAnim(),n.setStand("sad"),this.scheduleOnce(function(){this.node.setScale(1,1),n.setStand("stand"),this.gameJS.showPromptSuccessTitle("?");var t=this.node.convertToWorldSpaceAR(cc.p(0,0)),e=this.parent_node.convertToNodeSpaceAR(t);this.node.setPosition(e),this.parent_node.parent.zIndex=1,this.node.parent=this.parent_node;var i=cc.jumpTo(.67,cc.p(this.startx,this.starty),400,1);this.node.runAction(cc.sequence(i,cc.callFunc(function(){this.node.setPosition(this.startx,this.starty),this.node.getComponent("numSpineJs").showYinying(!0),this.gameJS.stopFuhaoAnim("resume"),this.parent_node.parent.zIndex=0,this.gameJS.clampNode.zIndex=1,this.gameJS.changeMoveTag(0),this.showAnim=!1,this.gameJS.isIts&&this.gameJS.questionNumListJS.changeOptionEnable()},this)))},2)},playBallonSketon:function(t){this.balloonNode.active=!0,this.balloonNode.getComponent("sp.Skeleton").setAnimation(0,"animation",!1)},updateState:function(t){t?this.gameJS.option_node.resumeSystemEvents(!0):this.gameJS.option_node.pauseSystemEvents(!0)}}),cc._RF.pop()},{}],QuestionNumJS:[function(t,e,i){"use strict";cc._RF.push(e,"511ccnUhPdEV5sMRHkmPNf2","QuestionNumJS"),cc.Class({extends:cc.Component,properties:{label:cc.Label,selected_node:cc.Node},onLoad:function(){this.isSelect=!1,this.sp=this.node.getComponent("cc.Sprite")},init:function(t,e){this.gameJS=t;var i=""+((this.idx=e)+1);this.label.string=i,this.selected_node.opacity=0},onClick:function(){this.gameJS.changQustion(this.idx)},setSelected:function(t){this.isSelect=t,this.selected_node.opacity=t?255:0}}),cc._RF.pop()},{}],QuestionNumListJS:[function(t,e,i){"use strict";cc._RF.push(e,"7a656I23ulAK7kDASga7f0X","QuestionNumListJS"),cc.Class({extends:cc.Component,properties:{lastBtn:cc.Node,nextBtn:cc.Node,quertionNum:cc.Prefab,questionNum_node:cc.Node},onLoad:function(){this.itemPool=new cc.NodePool,this.defaultLen=7,this.targetIdx=0,this.nowQuestionID=0,this.qusetionItemPool=new cc.NodePool,this.qusetionNumJSArr=[],this.selectedQusetionJS=null},init:function(t,e){this.maxlen=t,this.cb=e,t<this.defaultLen?(this.lastBtn.opacity=0,this.nextBtn.opacity=0):(this.lastBtn.opacity=255,this.nextBtn.opacity=255);for(var i=0;i<t;i++){var n=cc.instantiate(this.quertionNum),o=n.getComponent("QuestionNumJS");this.qusetionNumJSArr.push(n),o.init(this,i)}this.changeQustionList(),this.selectedQusetionJS=this.qusetionNumJSArr[this.nowQuestionID].getComponent("QuestionNumJS"),this.selectedQusetionJS.setSelected(!0)},clickLast:function(){this.targetIdx>=this.defaultLen&&(this.targetIdx-=this.defaultLen,this.changeQustionList())},clickNext:function(){this.targetIdx+this.defaultLen<this.maxlen&&(this.targetIdx+=this.defaultLen,this.changeQustionList())},changeQustionList:function(){this.questionNum_node.removeAllChildren();for(var t=this.targetIdx,e=Math.min(this.defaultLen,this.maxlen-t),i=0;i<e;i++){var n=this.qusetionNumJSArr[i+t];this.questionNum_node.addChild(n)}},changQustion:function(t){this.nowQuestionID=t,this.selectedQusetionJS.setSelected(!1),this.selectedQusetionJS=this.qusetionNumJSArr[t].getComponent("QuestionNumJS"),this.selectedQusetionJS.setSelected(!0);var e=this.cb;e&&e(t)},changeOptionEnable:function(){this.questionNum_node.resumeSystemEvents(!0)},changeOptionDisable:function(){this.questionNum_node.pauseSystemEvents(!0)}}),cc._RF.pop()},{}],TitleJS:[function(t,e,i){"use strict";cc._RF.push(e,"5b283IiR/BBgLkN+zazJigp","TitleJS"),cc.Class({extends:cc.Component,properties:{label:cc.Label},init:function(t){this.label.string=t}}),cc._RF.pop()},{}],config:[function(t,e,i){"use strict";cc._RF.push(e,"cf7e7Hjl8pBApNKVzaPXR0c","config"),window.CONSOLE_LOG_OPEN=!0,window.AUDIO_OPEN=!0,window.REQUEST_URL=!1,cc._RF.pop()},{}],efailed:[function(t,e,i){"use strict";cc._RF.push(e,"9b649czY5lPE5+Bb2VZOMm4","efailed"),cc.Class({extends:cc.Component,properties:{label:cc.Label},onLoad:function(){},showHint:function(){this.node.stopAllActions(),this.node.opacity=255,this.label.string="当前分类已经有了哦！";var t=cc.callFunc(function(t){this.node.opacity=0},this);this.node.runAction(cc.sequence(cc.delayTime(1.5),cc.fadeTo(.5,0),t))},showLimitHint:function(t){this.node.stopAllActions(),this.node.opacity=255,this.label.string="啊哦！本题最多只能选择"+t+"个瓶子哦！";var e=cc.callFunc(function(t){this.node.opacity=0},this);this.node.runAction(cc.sequence(cc.delayTime(1.5),cc.fadeTo(.5,0),e))},start:function(){}}),cc._RF.pop()},{}],numSpineJs:[function(t,e,i){"use strict";cc._RF.push(e,"afcf96cYgpP45hqtNCxA5Jy","numSpineJs");var s=["stand","grasp","happy","happy_coterie","sad","jump","original_number"];cc.Class({extends:cc.Component,properties:{spine0:cc.Prefab,spine1:cc.Prefab,spine2:cc.Prefab,spine3:cc.Prefab,spine4:cc.Prefab,spine5:cc.Prefab,spine6:cc.Prefab,spine7:cc.Prefab,spine8:cc.Prefab,spine9:cc.Prefab},onLoad:function(){this.stand=null,this.number=null},init:function(t){if(t=t.toString(),"string"==typeof(this.number=t))for(var e=0;e<t.length;e++){var i=t.charAt(e),n=cc.instantiate(this["spine"+i]);this.node.addChild(n),n.position=cc.p(-t.length/2*160+160*e+5+75,0),this["spine"+i+e]=n.getComponent("sp.Skeleton"),this["spineEyel"+i+e]=this["spine"+i+e].findBone("eye_l"),this["spineEyer"+i+e]=this["spine"+i+e].findBone("eye_r"),this["_Eyelx"+i+e]=this["spineEyel"+i+e].x,this["_Eyely"+i+e]=this["spineEyer"+i+e].y}this.setStand(0)},setStand:function(t){var e=null;if("string"==typeof t){for(var i=0;i<s.length;i++)if(s[i]==t){e=t;break}}else{if("number"!=typeof t)return;e=s[t]}if(e&&e!=this.stand){this.stand=e;for(var n=0;n<this.number.length;n++){var o=this.number.charAt(n);this["spineEyel"+o+n].x=this["_Eyelx"+o+n],this["spineEyel"+o+n].y=this["_Eyely"+o+n],this["spineEyer"+o+n].x=this["_Eyelx"+o+n],this["spineEyer"+o+n].y=this["_Eyely"+o+n],this["spine"+o+n].setAnimation(0,e,!0)}}},showYinying:function(i){this.node.children.forEach(function(t,e){t.getChildByName("yinying")&&(t.getChildByName("yinying").active=i)},this)},getStand:function(){return this.stand||""},getNumber:function(){return this.number||""},getEyseParent:function(){return this.node.convertToWorldSpaceAR(cc.p(0,0))},getEyseRotatePos:function(t,e){var i=cc.p(t.x-e.x,t.y-e.y),n=cc.pNormalize(i),o=cc.pDistance(e,cc.p(t.x,t.y)),s=Math.min(o/70*2,10);return cc.pAdd(cc.p(0,0),cc.pMult(n,s))},setEysePos:function(t){if("stand"===this.stand)for(var e=this.getEyseRotatePos(t,this.getEyseParent()),i=0;i<this.number.length;i++){var n=this.number.charAt(i);this["spineEyel"+n+i]&&this["spineEyer"+n+i]&&(this["spineEyel"+n+i].x=-e.y+this["_Eyelx"+n+i],this["spineEyel"+n+i].y=e.x+this["_Eyely"+n+i],this["spineEyer"+n+i].x=-e.y+this["_Eyelx"+n+i],this["spineEyer"+n+i].y=e.x+this["_Eyely"+n+i])}},resetEyePos:function(){for(var t=0;t<this.number.length;t++){var e=this.number.charAt(t);this["spineEyel"+e+t]&&this["spineEyer"+e+t]&&(this["spineEyel"+e+t].x=this["_Eyelx"+e+t],this["spineEyel"+e+t].y=this["_Eyely"+e+t],this["spineEyer"+e+t].x=this["_Eyelx"+e+t],this["spineEyer"+e+t].y=this["_Eyely"+e+t])}}}),cc._RF.pop()},{}],question_panel:[function(t,e,i){"use strict";cc._RF.push(e,"518c6EygmVF7aZ+N0GUpC9+","question_panel");var c=[];cc.Class({extends:cc.Component,properties:{oItemPrefab:cc.Prefab},onLoad:function(){this.oItemPool=new cc.NodePool},isEmpty:function(){return 0==c.length},copyAry:function(){var t=c.slice(0,c.length);return CONSOLE_LOG_OPEN&&console.log("questionAry.slice"+t+"  "+c),t},createOptions:function(){for(var t,e=0;e<c.length;e++){e==this.questionAry.length-1?(t=0<this.oItemPool.size()?this.oItemPool.get():cc.instantiate(this.oItemPrefab)).parent=this.node:t=this.node.children[e];var i=t.width,n=this.node.height,o=(e%3-1)*(i+15),s=e<3?n/3+10:e<6?30:-n/3+55;t.setPosition(cc.p(o,s))}},addOption:function(t){var e,i=this;e=t.slice(0,t.length),c.push(e.sort(_sortNumber)),i.createOptions(t),i.updateSum()},removeAllOption:function(){for(var t=0;t<this.node.children.length;t++){this.node.children[t].removeAllChildren(!0)}this.node.removeAllChildren(!0),c.splice(0,c.length),c=[],this.updateSum()},updateSum:function(){}}),cc._RF.pop()},{}],scalebg:[function(t,e,i){"use strict";cc._RF.push(e,"3093551zVpLp4AjCVzrt6iQ","scalebg"),cc.Class({extends:cc.Component,properties:{designSize:cc.Size,bg:cc.Node,lbg:cc.Node,rbg:cc.Node},onLoad:function(){cc.winSize.width,this.designSize.width;var t=Math.max(cc.winSize.width/this.designSize.width,cc.winSize.height/this.designSize.height);this.node.setScale(t,1)}}),cc._RF.pop()},{}],scale:[function(t,e,i){"use strict";cc._RF.push(e,"521434wupJHAqZevOCVOyWl","scale"),cc.Class({extends:cc.Component,properties:{designSize:cc.Size},onLoad:function(){var t=Math.min(cc.winSize.width/this.designSize.width,cc.winSize.height/this.designSize.height);this.node.setScale(t,t)}}),cc._RF.pop()},{}],settlement:[function(t,e,i){"use strict";cc._RF.push(e,"dd759DqBqVEVoLQFj9axoqs","settlement");cc.Class({extends:cc.Component,properties:{failSpine:cc.Node,successSpine:cc.Node,timeOutSpine:cc.Node},onLoad:function(){this.background=this.node.getChildByName("background"),this.scale=this.node.getChildByName("scale")},playWinAnim:function(t){this.node.active=!0,this.background.active=!0,this.successSpine.active=!0,this.successSpine.getComponent("sp.Skeleton").setAnimation(0,"animation",!1);var e=this;this.scheduleOnce(function(){t&&t.call(e.game)},2.5)},playLoseAnim:function(t){this.node.active=!0,this.background.active=!0,this.failSpine.active=!0,this.failSpine.getComponent("sp.Skeleton").setAnimation(0,"animation",!1);var e=this;this.scheduleOnce(function(){t&&t.call(e.game)},2.5)},playTimeUpAnim:function(t){this.node.active=!0,this.background.active=!0,this.timeOutSpine.active=!0,this.timeOutSpine.getComponent("sp.Skeleton").setAnimation(0,"animation",!1);var e=this;this.scheduleOnce(function(){t&&t.call(e.game)},1)},reset:function(){this.background.active=!1,this.failSpine.active=!1,this.successSpine.active=!1,this.timeOutSpine.active=!1,this.node.active=!1},log:function(t){CONSOLE_LOG_OPEN&&cc.log(t)}}),cc._RF.pop()},{}],title:[function(t,e,i){"use strict";cc._RF.push(e,"d58c4qtV15MNYbanwyOTHvL","title"),cc.Class({extends:cc.Component,properties:{label:cc.Label,img:cc.Sprite},onLoad:function(){},setTitle:function(t,e){if(e&&e instanceof Array&&1<e.length)this.img.enabled=!0,this.img.spriteFrame=this.game.getSpriteFrame(e[e.length-1]),this.label.string="";else if("string"==typeof t){var i=t.replace(/\+/g,",").replace(/\=/g,".").replace(/\?/g,"/");this.label.string=i,this.img.spriteFrame=null}this.label.font.spriteFrame.getTexture().setAliasTexParameters()},reset:function(){this.label.string="",this.img.spriteFrame=null,this.img.enabled=!1}}),cc._RF.pop()},{}]},{},["BaseGameJS","LocalSaveJS","NetworkJS","ColliderListener","OptionJS","OptionJS1","QuestionNumJS","QuestionNumListJS","TitleJS","efailed","title","question_panel","numSpineJs","settlement","GameJS","NetworkJS_Data","config","scale","scalebg"]);