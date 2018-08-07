require = function() {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }
        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function(r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }
      return n[i].exports;
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o;
  }
  return r;
}()({
  BaseGameJS: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d5325ralz1KNpBY2dkj5IqD", "BaseGameJS");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        timeLabel: cc.Label,
        paopao_node: cc.Node,
        feedback_node: cc.Node,
        loseTime_node: cc.Node,
        loseTime: 0,
        time_node: cc.Node,
        question_node: cc.Node,
        quertionList_node: cc.Node,
        title_node: cc.Node
      },
      onLoad: function onLoad() {
        var self = this;
        document.addEventListener("resignActivePauseGame", function() {
          self.gotoBackground();
          cc.director.pause();
          cc.game.pause();
          CONSOLE_LOG_OPEN && console.log("app just resign active.");
        });
        document.addEventListener("becomeActiveResumeGame", function() {
          cc.game.isPaused && cc.game.resume();
          cc.director.isPaused && cc.director.resume();
          self.gotoForeground();
          CONSOLE_LOG_OPEN && console.log("app just become active.");
        });
        this.initFeedback();
        this.answerTime = 0;
        this.lastAnswerTime = 0;
        this.answerContext = "";
        this.countDown = 300;
        this.timeCallback = this.timeCallbackFunc();
        this.isShowLossTime = false;
        this.nowQuestionID = 0;
        this.questionArr = [];
        this.answerInfoArr = [];
        this.questionNumListJS = this.quertionList_node.getComponent("QuestionNumListJS");
        this.quertionList_node.opacity = 0;
        this.time_node.opacity = 0;
        this.onLoadChild();
        this.answerEnable = false;
        this.network = this.node.getComponent("NetworkJS_Data");
        this.network.sendXHR(this);
      },
      initFeedback: function initFeedback() {
        var feedback = cc.instantiate(this.feedback_pref);
        this.feedback_node.addChild(feedback);
        this.feedbackJS = feedback.getChildByName("Fish").getComponent("FishFeedback");
      },
      onLoadChild: function onLoadChild() {},
      gotoBackground: function gotoBackground() {},
      gotoForeground: function gotoForeground() {},
      createPaopao: function createPaopao() {
        var width = this.node.width;
        var height = 1012;
        var paopaoX = [ 120, 40, 160, 80, 200 ];
        var posY = height / paopaoX.length;
        for (var index = 0; index < paopaoX.length; index++) {
          var paopao = cc.instantiate(this.paopao_pref);
          paopao.x = paopaoX[index];
          paopao.y = -posY * index;
          this.paopao_node.addChild(paopao);
        }
        for (var index = 0; index < paopaoX.length; index++) {
          var paopao = cc.instantiate(this.paopao_pref);
          paopao.x = width - paopaoX[index];
          paopao.y = -posY * index;
          this.paopao_node.addChild(paopao);
        }
      },
      createAnswerInfo: function createAnswerInfo(answerStatus) {
        var question = this.questionArr[this.nowQuestionID];
        if (!question) return;
        var answerInfo = {
          answerTime: this.answerTime - this.lastAnswerTime,
          leveLQuestionDetailNum: question.leveLQuestionDetailNum,
          levelQuestionDetailID: question.levelQuestionDetailID,
          answerStatus: answerStatus,
          answerContext: this.answerContext
        };
        this.answerInfoArr.push(answerInfo);
      },
      showFeedback: function showFeedback(feedbackType) {
        0 === this.nowQuestionID ? this.feedbackJS.firstShowFeedback(this, feedbackType) : this.feedbackJS.showFeedback(this, feedbackType);
      },
      firstFeedbackFinish: function firstFeedbackFinish() {},
      feedbackFinish: function feedbackFinish() {
        this.nowQuestionID += 1;
        var isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        if (this.nowQuestionID >= this.questionArr.length || this.countDown - this.answerTime <= 0 && isTotalCd) {
          CONSOLE_LOG_OPEN && console.log("答完了");
          var t = this.questionArr.length - this.nowQuestionID;
          for (var i = 0; i < t; i++) {
            this.answerTime = 0;
            this.lastAnswerTime = 0;
            this.createAnswerInfo("2");
            this.nowQuestionID += 1;
          }
          this.isIts && this.settlementJs.reset();
          this.network.gameOver(this.answerInfoArr);
        } else {
          this.network.gameLoadProgress(this.nowQuestionID + 1, this.questionArr.length);
          !this.isIts && this.deleteOption();
          this.settlementJs.reset();
          !this.isIts && this.startloadOption();
        }
      },
      showLossTime: function showLossTime() {
        this.answerTime += this.loseTime;
        this.isShowLossTime = true;
        this.loseTime_node.opacity = 255;
        var callFunc = cc.callFunc(function(target) {
          this.isShowLossTime = false;
          this.loseTime_node.opacity = 0;
        }, this);
        this.loseTime_node.runAction(cc.sequence(cc.fadeTo(1, 0), callFunc));
      },
      timeCallbackFunc: function timeCallbackFunc() {
        var timeCallback = function timeCallback() {
          this.answerTime += 1;
          this.scheduleTime += 1;
          var timeString = this.countDown - this.answerTime;
          if (timeString <= 0) {
            CONSOLE_LOG_OPEN && console.log("时间到");
            this.timeout();
            this.isShowFeed = true;
            this.answerTime = this.countDown;
            this.timeLabel.string = "00:00";
            this.createAnswerInfo("2");
            this.showFeedback(3);
            this.answerTime > this.scheduleTime && this.unschedule(this.timeCallback);
          } else this.timeLabel.string = this.timeFormat(timeString);
        };
        return timeCallback;
      },
      timeFormat: function timeFormat(time) {
        var min = Math.floor(time / 60), sec = time % 60, fMin = min < 10 ? "0" + min : min, fSec = sec < 10 ? "0" + sec : sec;
        return time > 59 ? fMin + ":" + fSec : "00:" + fSec;
      },
      timeout: function timeout() {},
      showSchedule: function showSchedule() {
        this.scheduleTime = 0;
        this.schedule(this.timeCallback, 1, this.countDown - 1);
      },
      deleteOption: function deleteOption() {},
      createOption: function createOption(interactiveJson) {},
      selectedOption: function selectedOption(questionID) {
        this.nowQuestionID = questionID;
        this.deleteOption();
        var self = this;
        setTimeout(function() {
          self.startloadOption();
        }, 0);
      },
      startloadOption: function startloadOption() {
        this.isIts && this.questionNumListJS.changeOptionDisable();
        var question = this.questionArr[this.nowQuestionID];
        this.timeLabel.string = this.timeFormat(this.countDown);
        this.answerTime = 0;
        !this.isIts && this.showSchedule();
        this.isIts && this.questionNumListJS.changeOptionEnable();
        this.isShowFeed = false;
      },
      startLoadGame: function startLoadGame(questionArr) {
        this.questionArr = questionArr;
        this.quertionList_node.opacity = this.isIts ? 255 : 0;
        this.time_node.opacity = this.isIts ? 0 : 255;
        this.isIts && questionArr && questionArr.length > 0 && this.questionNumListJS.init(questionArr.length, this.selectedOption.bind(this));
        REQUEST_URL ? this.requestAllUrls() : this.startloadOption();
      },
      requestAllUrls: function requestAllUrls() {
        var urls = [];
        for (var i = 0; i < this.questionArr.length; i++) {
          if (this.questionArr[i].quescontimgAry instanceof Array) for (var j = 0; j < this.questionArr[i].quescontimgAry.length; j++) urls.push(this.questionArr[i].quescontimgAry[j]);
          if (this.questionArr[i].optionsArr instanceof Array) for (var _j = 0; _j < this.questionArr[i].optionsArr.length; _j++) this.questionArr[i].optionsArr[_j].optioncontimg && urls.push(this.questionArr[i].optionsArr[_j].optioncontimg);
        }
        var self = this;
        cc.loader.load(urls, function(errors, texs) {
          if (errors) {
            self.network.gameLoadFailed(1);
            return;
          }
          self.spriteMaps = texs.map;
          self.startloadOption();
        });
      },
      getSpriteFrame: function getSpriteFrame(spriteUrl) {
        if (!spriteUrl || 0 == spriteUrl.length) return null;
        var r = this.spriteMaps[spriteUrl].content;
        if (r instanceof cc.Texture2D) return new cc.SpriteFrame(r);
        return null;
      },
      selectAnswer: function selectAnswer(target, isRight) {
        if (this.isShowFeed || this.isShowLossTime) return;
        if (isRight) {
          CONSOLE_LOG_OPEN && console.log("答对了");
          this.rightSelect += 1;
          target.showParticle();
          if (this.rightSelect >= this.count) {
            this.unschedule(this.timeCallback);
            this.isShowFeed = true;
            this.createAnswerInfo("1");
            this.scheduleOnce(function() {
              this.showFeedback(1);
            }, 1);
          }
        } else {
          CONSOLE_LOG_OPEN && console.log("答错了");
          this.showLossTime();
        }
      },
      onDestroy: function onDestroy() {
        document.removeEventListener("resignActivePauseGame");
        document.removeEventListener("becomeActiveResumeGame");
      },
      setGameName: function setGameName(val) {
        this.title_node.getComponent("TitleJS").init(val);
      },
      setPlatform: function setPlatform(val) {
        this.platform = val;
        this.isIts = "its" == val;
        var isIts = this.isIts;
        this.quertionList_node.active = !!isIts;
        this.time_node.active = !isIts;
      },
      resetOption: function resetOption() {
        if (0 != this.moveOptionTag) {
          var moveOption = this.option_node.getChildByTag(this.moveOptionTag);
          var optionJs = moveOption.getComponent("Option");
          optionJs.reloadState();
          this.moveOptionTag = 0;
        }
      },
      changeMoveTag: function changeMoveTag(tag) {
        if (this.isShowFeed) return false;
        if (0 === this.moveOptionTag || this.moveOptionTag === tag || 0 === tag) {
          this.moveOptionTag = tag;
          return true;
        }
        return false;
      }
    });
    cc._RF.pop();
  }, {} ],
  ColliderListener: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b0b466dPFFI1ZCDMEewg3qk", "ColliderListener");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        cc.director.getCollisionManager().enabled = true;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        this.node.isCollisioned = true;
        this.node.opacity = 100;
      },
      onCollisionExit: function onCollisionExit(other, self) {
        CONSOLE_LOG_OPEN && console.log("on collision exit");
        this.node.isCollisioned = false;
        this.node.opacity = 255;
      }
    });
    cc._RF.pop();
  }, {} ],
  GameJS: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d92c8sRpIBMBKs/RzLIjTLN", "GameJS");
    "use strict";
    var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var BaseGameJS = require("BaseGameJS");
    cc.Class({
      extends: BaseGameJS,
      properties: {
        optionItem_pref: cc.Prefab,
        settlePrefab: cc.Prefab,
        resetBtnNSF: cc.SpriteFrame,
        commitBtnNSF: cc.SpriteFrame,
        questionLabel: cc.Node,
        winAudio: cc.AudioClip,
        loseAudio: cc.AudioClip,
        resetAudio: cc.AudioClip,
        optionAudio: cc.AudioClip,
        option_outAudio: cc.AudioClip,
        option_foldAudio: cc.AudioClip
      },
      onLoadChild: function onLoadChild() {
        this._super();
        this.scaleNode = this.node.getChildByName("scale");
        this.option_node = this.scaleNode.getChildByName("option_node");
        this.tipsNode = this.node.getChildByName("TipsNode");
        this.tipsNode && (this.tipsNode.active = true);
        this.answerItemPool = new cc.NodePool();
        this.changeMoveTag(0);
        this.initToast();
        this.renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true
        });
        this.renderer.setClearColor(16777215, 0);
        this.renderer.domElement.style.position = "absolute";
        setRendererSize.call(this);
        this.box = new Box(this.renderer);
        document.body.appendChild(this.renderer.domElement);
        var self = this;
        window.addEventListener("resize", function() {
          setRendererSize.call(self);
        });
        function setRendererSize() {
          var scaleRatio = THREE.getScaleRatio();
          var height = 460 * scaleRatio, width = window.innerWidth;
          this.renderer.setSize(width, height);
          this.renderer.setPixelRatio(window.devicePixelRatio || 1);
          this.renderer.domElement.style.left = window.innerWidth / 2 - width / 2 + "px";
          this.renderer.domElement.style.top = window.innerHeight / 2 - height / 2 + "px";
          this.renderer.domElement.width = window.innerWidth;
          this.renderer.domElement.height = window.innerHeight;
          console.log("scaleRatio : " + scaleRatio);
          console.log("height : " + height);
          console.log("window.innerWidth : " + window.innerWidth);
          console.log("width : " + width);
          console.log("window.devicePixelRati: " + window.devicePixelRati);
          console.log("navigator.userAgent : " + navigator.userAgent);
          console.log("this.renderer.domElement.style.left : " + this.renderer.domElement.style.left);
          console.log("this.renderer.domElement.style.top : " + this.renderer.domElement.style.top);
        }
        console.log(navigator);
      },
      initToast: function initToast() {
        var efailed = this.node.getChildByName("scale").getChildByName("efailed");
        this.efailedJs = efailed.getComponent("efailed");
        this.efailedJs.game = this;
      },
      tipsClick: function tipsClick() {
        this.tipsNode.removeFromParent();
        this.tipsNode.destroy();
        !this.isIts && this.showSchedule();
        var isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        isTotalCd && (this.lastAnswerTime = this.answerTime);
        this.renderer.domElement.style.opacity = 1;
      },
      initFeedback: function initFeedback() {
        this.settlement = cc.instantiate(this.settlePrefab);
        this.settlementJs = this.settlement.getComponent("settlement");
        this.settlementJs.game = this;
        var feedbackNode = this.node.getChildByName("feedback_node");
        feedbackNode.addChild(this.settlement);
        this.settlement.active = false;
      },
      gotoBackground: function gotoBackground() {
        var submitButton = this.node.getChildByName("button_node").getChildByName("commit"), resetButton = this.node.getChildByName("button_node").getChildByName("cancel");
        submitButton.setScale(1, 1);
        resetButton.setScale(1, 1);
        submitButton._pressed = false;
        submitButton._hovered = false;
        resetButton._pressed = false;
        resetButton._hovered = false;
        submitButton.normalSprite = this.commitBtnNSF;
        submitButton.hoverSprite = this.commitBtnNSF;
        resetButton.normalSprite = this.resetBtnNSF;
        resetButton.hoverSprite = this.resetBtnNSF;
        this.box.pause();
      },
      gotoForeground: function gotoForeground() {
        this.box.start();
      },
      timeout: function timeout() {
        this.box.clearScene();
      },
      deleteOption: function deleteOption() {},
      createOption: function createOption(optionsArr) {
        for (var i = 0; i < optionsArr.length; ++i) {
          var optionItem = null;
          optionItem = this.answerItemPool.size() > 0 ? this.answerItemPool.get() : cc.instantiate(this.optionItem_pref);
          0 === i;
          optionItem.setPosition(cc.p(-(optionsArr.length / 2 - .5 - i) * (optionItem.width + 20), 10));
          var graph_btn = optionItem.getChildByName("button_bg");
          graph_btn.tag = 1e3 + i;
          var optionJS = graph_btn.getComponent("OptionJS");
          optionJS.init(this, optionsArr[i], optionsArr.length);
          optionJS.updateState(true);
          this.option_node.addChild(optionItem);
        }
      },
      startloadOption: function startloadOption() {
        this.updateGameState(true);
        this.isIts && this.questionNumListJS.changeOptionDisable();
        var question = this.questionArr[this.nowQuestionID];
        var questionLabel = this.questionLabel.getComponent("pinyin");
        var stringArray = question.qescont.split("_");
        questionLabel.setData(stringArray.length > 0 ? stringArray[0] : "", stringArray.length > 1 ? stringArray[1] : "");
        this.rightOptionNo = question.rightOptionNo;
        var isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        if (0 === this.nowQuestionID && isTotalCd || !isTotalCd) {
          this.answerTime = 0;
          var countDown = parseInt(question.interactiveJson["countDown"]);
          countDown > 0 && (this.countDown = countDown);
          this.timeLabel.string = this.timeFormat(this.countDown);
        }
        this.box.clearScene();
        this.box.setData(question);
        this.box.createPlanes();
        this.box.render();
        if (this.tipsNode && !this.tipsNode.activeInHierarchy) {
          !this.isIts && this.showSchedule();
          isTotalCd && (this.lastAnswerTime = this.answerTime);
          this.renderer.domElement.style.opacity = 1;
        } else this.renderer.domElement.style.opacity = .3;
        this.isIts && this.questionNumListJS.changeOptionEnable();
        this.isShowFeed = false;
        this.changeMoveTag(0);
        this.isShowAnim = false;
      },
      selectAnswer: function selectAnswer(isRight) {
        if (this.isShowFeed || this.isShowLossTime) return;
        this.unschedule(this.timeCallback);
        this.isShowFeed = true;
        this.updateGameState(false);
        if (isRight) {
          CONSOLE_LOG_OPEN && console.log("答对了");
          this.createAnswerInfo("1");
          this.showFeedback(1);
        } else {
          CONSOLE_LOG_OPEN && console.log("答错了");
          this.createAnswerInfo("2");
          this.showFeedback(2);
        }
      },
      showFeedback: function showFeedback(type) {
        if (1 === type) {
          AUDIO_OPEN && this.playWinAudio();
          this.settlementJs.playWinAnim(this.feedbackFinish);
        } else if (2 === type) {
          AUDIO_OPEN && this.playLoseAudio();
          this.settlementJs.playLoseAnim(this.feedbackFinish);
        } else if (3 === type) {
          AUDIO_OPEN && this.playLoseAudio();
          this.settlementJs.playTimeUpAnim(this.feedbackFinish);
        }
      },
      updateGameState: function updateGameState(interactable) {
        if (interactable) {
          this.question_node.resumeSystemEvents(true);
          this.option_node.resumeSystemEvents(true);
        } else {
          this.question_node.pauseSystemEvents(true);
          this.option_node.pauseSystemEvents(true);
        }
      },
      otherClicked: function otherClicked() {
        this.playCancelAudio();
        if (this.isShowFeed) return;
      },
      rightBtnClick: function rightBtnClick() {
        if (this.isShowFeed || this.isShowAnim) return;
        this.isShowAnim = true;
        this.playOptionAudio();
        var self = this;
        var question = this.questionArr[this.nowQuestionID];
        var foldable = question.foldable;
        this.startAnimation(function(box) {
          box.clearScene();
          self.selectAnswer(foldable);
        });
      },
      wrongBtnClick: function wrongBtnClick() {
        if (this.isShowFeed || this.isShowAnim) return;
        this.isShowAnim = true;
        this.playOptionAudio();
        var self = this;
        var question = this.questionArr[this.nowQuestionID];
        var foldable = question.foldable;
        this.startAnimation(function(box) {
          box.clearScene();
          self.selectAnswer(!foldable);
        });
      },
      checkIsEmpty: function checkIsEmpty() {
        var array = this.option_node.children;
        var isEmpty = true;
        array.forEach(function(obj, idx) {
          var optionJS = obj.getComponent("OptionJS");
          optionJS && optionJS.state > 1 && (isEmpty = false);
        }, this);
        return isEmpty;
      },
      playWinAudio: function playWinAudio() {
        this.playAudio(this.winAudio);
      },
      playLoseAudio: function playLoseAudio() {
        this.playAudio(this.loseAudio);
      },
      playCancelAudio: function playCancelAudio() {
        this.playAudio(this.resetAudio);
      },
      playOptionAudio: function playOptionAudio() {
        this.playAudio(this.optionAudio);
      },
      playOptionOutAudio: function playOptionOutAudio() {
        this.playAudio(this.option_outAudio);
      },
      playFoldAudio: function playFoldAudio() {
        this.playAudio(this.option_foldAudio);
      },
      playAudio: function playAudio(audio) {
        AUDIO_OPEN && cc.audioEngine.play(audio, false, 1);
      },
      startAnimation: function startAnimation(callback) {
        this.box.setAnimationHandler(animate.bind(this));
        function animate(data) {
          var boxObj = this.box.getBoxObject();
          if (boxObj.rotation.y <= .3) {
            boxObj.rotation.y += .01;
            boxObj.rotation.x -= .02;
          } else {
            this.playFoldAudio();
            this.box.setAnimationHandler(null);
            var self = this;
            this.box.fold(function() {
              setTimeout(function() {
                "function" === typeof callback && callback(self.box);
              }, 1e3);
            });
          }
          this.box.render();
        }
      },
      update: function update() {
        this.box && this.box.update();
      }
    });
    function Box(renderer) {
      var planesData, cameraConf, planeSize, planeRotateSpeed, controlsConf, transformConf;
      var scene = new THREE.Scene(), camera, controls;
      var planesGroup = new THREE.Object3D();
      var resume = true;
      this.planesData = [];
      this.eachAnimationHandler = null;
      this.setData = function(d) {
        planesData = d.planes.data;
        cameraConf = d.camera;
        planeSize = d.planes.planeSize;
        planeRotateSpeed = d.planes.rotateSpeed || .01;
        controlsConf = d.controls;
        transformConf = d.transform;
        camera = new THREE.PerspectiveCamera(cameraConf.frustum.fov, renderer.getSize().width / renderer.getSize().height, cameraConf.frustum.near, cameraConf.frustum.far);
        camera.position.set(cameraConf.position.x, cameraConf.position.y, cameraConf.position.z);
        camera.lookAt(new THREE.Vector3(cameraConf.lookAt.x, cameraConf.lookAt.y, cameraConf.lookAt.z));
        controls = new THREE.OrbitControls(camera);
      };
      this.createPlanes = function() {
        var plane;
        for (var i = 0; i < planesData.length; i++) {
          plane = createPlane(planesData[i]);
          planesGroup.add(plane);
        }
        var translate = transformConf && transformConf.translate, rotate = transformConf && transformConf.rotate, scale = transformConf && transformConf.scale;
        planesGroup.position.set(translate && translate.x || 0, translate && translate.y || 0, translate && translate.z || 0);
        planesGroup.rotation.set(rotate && rotate.x || 0, rotate && rotate.y || 0, rotate && rotate.z || 0);
        planesGroup.scale.set(scale && scale.x || 1, scale && scale.y || 1, scale && scale.z || 1);
        scene.add(planesGroup);
        if ("object" === ("undefined" === typeof controlsConf ? "undefined" : _typeof(controlsConf))) for (var item in controlsConf) controlsConf.hasOwnProperty(item) && (controls[item] = controlsConf[item]);
      };
      this.update = function() {
        if (resume && controls) {
          controls.update();
          "function" === typeof this.animationHandler && this.animationHandler(planesData);
          if ("function" === typeof this.eachAnimationHandler) {
            var data;
            for (var i = 0; i < this.planesData.length; i++) {
              data = this.planesData[i];
              this.eachAnimationHandler(data);
            }
          }
          renderer.render(scene, camera);
        }
      };
      this.setAnimationHandler = function(handler) {
        this.animationHandler = handler;
      }, this.setEachAnimationHandler = function(eachHandler) {
        this.eachAnimationHandler = eachHandler;
      }, this.fold = function(callback) {
        var self = this;
        var planesData1 = [], planesData2 = [];
        var planes2HasDone = false;
        var hasCall = false;
        function setAnimateData(planesData) {
          for (var i = 0; i < planesData.length; i++) if ("plane" === planesData[i].type) planesData[i].animationIndex && 1 !== planesData[i].animationIndex ? 2 === planesData[i].animationIndex && (planesData2[planesData2.length] = planesData[i]) : planesData1[planesData1.length] = planesData[i]; else if ("group" === planesData[i].type) {
            planesData[i].animationIndex && 1 !== planesData[i].animationIndex ? 2 === planesData[i].animationIndex && (planesData2[planesData2.length] = planesData[i]) : planesData1[planesData1.length] = planesData[i];
            setAnimateData(planesData[i].planes);
          }
        }
        setAnimateData(planesData);
        this.planesData = planesData1;
        this.setEachAnimationHandler(eachAnimationHandler);
        function eachAnimationHandler(data) {
          var plane = data.plane;
          if (data.axis) if (-1 === data.rotateDirection) if (plane.rotation[data.axis] > -.5 * Math.PI) plane.rotation[data.axis] -= planeRotateSpeed; else {
            plane.rotation[data.axis] = -.5 * Math.PI;
            if (1 !== data.animationIndex && data.animationIndex || planes2HasDone) {
              if (2 === data.animationIndex) {
                this.setEachAnimationHandler(null);
                if (!hasCall) {
                  hasCall = true;
                  "function" === typeof callback && callback(self);
                }
              }
            } else {
              planes2HasDone = true;
              this.planesData = planesData2;
              this.setEachAnimationHandler(eachAnimationHandler);
            }
          } else if (1 === data.rotateDirection) if (plane.rotation[data.axis] < .5 * Math.PI) plane.rotation[data.axis] += planeRotateSpeed; else {
            plane.rotation[data.axis] = .5 * Math.PI;
            if (1 !== data.animationIndex && data.animationIndex || planes2HasDone) {
              if (2 === data.animationIndex) {
                this.setEachAnimationHandler(null);
                if (!hasCall) {
                  hasCall = true;
                  "function" === typeof callback && callback(self);
                }
              }
            } else {
              planes2HasDone = true;
              this.planesData = planesData2;
              this.setEachAnimationHandler(eachAnimationHandler);
            }
          }
        }
      };
      this.unfold = function(callback) {
        var self = this;
        var planesData1 = [], planesData2 = [];
        var planes1HasDone = false;
        var hasCall = false;
        for (var i = 0; i < planesData.length; i++) if ("plane" === planesData[i].type) planesData[i].animationIndex && 1 !== planesData[i].animationIndex ? 2 === planesData[i].animationIndex && (planesData2[planesData2.length] = planesData[i]) : planesData1[planesData1.length] = planesData[i]; else if ("group" === planesData[i].type) {
          planesData[i].animationIndex && 1 !== planesData[i].animationIndex ? 2 === planesData[i].animationIndex && (planesData1[planesData1.length] = planesData[i]) : planesData2[planesData2.length] = planesData[i];
          var planes = planesData[i].planes || [];
          for (var j = 0; j < planes.length; j++) planes[j].animationIndex && 1 !== planes[j].animationIndex ? 2 === planes[j].animationIndex && (planesData2[planesData2.length] = planes[j]) : planesData1[planesData1.length] = planes[j];
        }
        this.planesData = planesData2;
        this.setEachAnimationHandler(eachAnimationHandler);
        function eachAnimationHandler(data, requestAnimate) {
          var plane = data.plane;
          if (data.axis) if (-1 === data.rotateDirection) if (plane.rotation[data.axis] < 0) plane.rotation[data.axis] += planeRotateSpeed; else {
            plane.rotation[data.axis] = 0;
            if (1 !== data.animationIndex && data.animationIndex) {
              if (2 === data.animationIndex && !planes1HasDone) {
                planes1HasDone = true;
                this.planesData = planesData1;
                this.setEachAnimationHandler(eachAnimationHandler);
              }
            } else {
              this.setEachAnimationHandler(null);
              if (!hasCall) {
                hasCall = true;
                "function" === typeof callback && callback(self);
              }
            }
          } else if (1 === data.rotateDirection) if (plane.rotation[data.axis] > 0) plane.rotation[data.axis] -= planeRotateSpeed; else {
            plane.rotation[data.axis] = 0;
            if (1 !== data.animationIndex && data.animationIndex) {
              if (2 === data.animationIndex && !planes1HasDone) {
                planes1HasDone = true;
                this.planesData = planesData1;
                this.setEachAnimationHandler(eachAnimationHandler);
              }
            } else {
              this.setEachAnimationHandler(null);
              if (!hasCall) {
                hasCall = true;
                "function" === typeof callback && callback(self);
              }
            }
          }
        }
      };
      this.render = function() {
        renderer.render(scene, camera);
      };
      this.clearScene = function() {
        while (planesGroup.children.length > 0) planesGroup.remove(planesGroup.children[0]);
        while (scene.children.length > 0) scene.remove(scene.children[0]);
      };
      this.getBoxObject = function() {
        return planesGroup;
      };
      this.getCamera = function() {
        return camera;
      };
      this.getScene = function() {
        return scene;
      };
      this.pause = function() {
        resume = false;
      };
      this.start = function() {
        resume = true;
      };
      function createPlane(data) {
        if ("plane" === data.type) {
          var geometry = new THREE.PlaneGeometry(planeSize, planeSize);
          geometry.applyMatrix(new THREE.Matrix4().makeTranslation(data.translate.x, data.translate.y, data.translate.z));
          var materialConf = {
            side: THREE.DoubleSide
          };
          "number" === typeof data.bgColor ? materialConf.color = data.bgColor : "object" === _typeof(data.bgColor) && (materialConf.map = new THREE.CanvasTexture(generateTexture(data.bgColor.colors, data.bgColor.startX, data.bgColor.startY, data.bgColor.endX, data.bgColor.endY)));
          var material = new THREE.MeshBasicMaterial(materialConf);
          var plane = new THREE.Mesh(geometry, material);
          plane.translateX(data.position.x);
          plane.translateY(data.position.y);
          plane.translateZ(data.position.z);
          scene.add(plane);
          data.plane = plane;
          "function" === typeof data.ondrawplane && data.ondrawplane(plane);
          return plane;
        }
        if ("group" === data.type) {
          var planes = data.planes;
          var objGroup = new THREE.Object3D();
          objGroup.applyMatrix(new THREE.Matrix4().makeTranslation(data.translate.x, data.translate.y, data.translate.z));
          objGroup.translateX(data.position.x);
          objGroup.translateY(data.position.y);
          objGroup.translateZ(data.position.z);
          data.plane = objGroup;
          "function" === typeof data.ondrawplane && data.ondrawplane(objGroup);
          if (Array.isArray(planes)) for (var i = 0; i < planes.length; i++) {
            var plane = createPlane(planes[i]);
            objGroup.add(plane);
            planes[i].plane = plane;
            "function" === typeof data.ondrawplane && data.ondrawplane(plane);
          }
          return objGroup;
        }
      }
      function generateTexture(colors, startX, startY, endX, endY) {
        var size = 64;
        var canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        var context = canvas.getContext("2d");
        context.rect(0, 0, size, size);
        var gradient = context.createLinearGradient(startX * size, startY * size, endX * size, endY * size);
        for (var i = 0; i < colors.length; i++) gradient.addColorStop(i / (colors.length - 1), colors[i]);
        context.fillStyle = gradient;
        context.fill();
        return canvas;
      }
    }
    cc._RF.pop();
  }, {
    BaseGameJS: "BaseGameJS"
  } ],
  LocalSaveJS: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f4c57nVhA1DEK8uDdBUQDFX", "LocalSaveJS");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      save: function save(key, data) {
        var localStorage = cc.sys.localStorage;
        localStorage ? writeCookie(key, data) : localStorage.setItem(key, data);
      },
      load: function load(key) {
        var localStorage = cc.sys.localStorage;
        return localStorage ? readCookie(key) : localStorage.getItem(key);
      }
    });
    function readCookie(name) {
      var cookieValue = "";
      var search = name + "=";
      if (document.cookie.length > 0) {
        var offset = document.cookie.indexOf(search);
        if (-1 != offset) {
          offset += search.length;
          var end = document.cookie.indexOf(";", offset);
          -1 == end && (end = document.cookie.length);
          cookieValue = unescape(document.cookie.substring(offset, end));
        }
      }
      return cookieValue;
    }
    function writeCookie(name, value, time) {
      var expire = "";
      if (null != time) {
        expire = new Date(new Date().getTime() + 1e3 * time);
        expire = "; expires=" + expire.toGMTString();
      }
      expire += "; path=/";
      document.cookie = name + "=" + escape(value) + expire;
    }
    cc._RF.pop();
  }, {} ],
  NetworkJS_Data: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8febaBdc6ZNMK6NnHe3UpZb", "NetworkJS_Data");
    "use strict";
    var NetworkJS = require("NetworkJS");
    cc.Class({
      extends: NetworkJS,
      properties: {},
      analysisDict: function analysisDict(questionDict) {
        var interactiveJson = questionDict.interactiveJson;
        if (!interactiveJson || 0 == interactiveJson.length) {
          this.gameLoadFailed(2);
          return;
        }
        "string" == typeof interactiveJson && (interactiveJson = JSON.parse(interactiveJson));
        var optionandanswer = questionDict.optionandanswers[0];
        var options = optionandanswer.options;
        var optionsArr = [];
        for (var i = 0; i < options.length; ++i) {
          var option = options[i];
          var optioncontent = option.optioncontent;
          var temp = {
            optionNo: option.optionno,
            optionContent: this.removeSpan(optioncontent),
            optioncontimg: option.optioncontimg,
            optionFlip: this.removeSpan(optioncontent)
          };
          optionsArr.push(temp);
        }
        var quescontimg = questionDict.quescontimg;
        interactiveJson.rightAry && interactiveJson.questionAry && interactiveJson.optionCount && interactiveJson.countDown || this.gameLoadFailed(2);
        if (optionsArr || optionsArr.length > 0) {
          var question = {
            answerTime: "0",
            levelQuestionDetailID: questionDict.questionid,
            leveLQuestionDetailNum: questionDict.orderid,
            qescont: this.removeSpan(questionDict.qescont),
            optionsArr: optionsArr,
            rightOptionNo: this.removeSpan(optionandanswer.rightanswer),
            questionPositon: interactiveJson.questionPositon,
            quescontimgAry: quescontimg,
            question_img: quescontimg.length > 0 && quescontimg[0],
            answer_img: quescontimg.length > 1 && quescontimg[1],
            answer_finish: quescontimg.length > 2 && quescontimg[2],
            interactiveJson: interactiveJson,
            foldable: interactiveJson.foldable,
            camera: interactiveJson.camera,
            controls: interactiveJson.controls,
            planes: interactiveJson.planes,
            transform: interactiveJson.transform
          };
          return question;
        }
        this.gameLoadFailed(2);
      }
    });
    cc._RF.pop();
  }, {
    NetworkJS: "NetworkJS"
  } ],
  NetworkJS: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cd804MyCfRHi4BLiy+Orkth", "NetworkJS");
    "use strict";
    var NetworkJS = cc.Class({
      extends: cc.Component,
      properties: {},
      GetQueryString: function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (null != r) return decodeURI(r[2]);
        return null;
      },
      sendXHR: function sendXHR(racingjs) {
        this.racingjs = racingjs;
        var xhr = cc.loader.getXMLHttpRequest();
        this.streamXHREventsToLabel(xhr, "GET");
        var fileUrl = this.GetQueryString("fileUrl");
        xhr.open("GET", fileUrl);
        cc.sys.isNative && xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        xhr.timeout = 6e4;
        xhr.send();
      },
      streamXHREventsToLabel: function streamXHREventsToLabel(xhr, method, responseHandler) {
        var handler = responseHandler || function(response) {
          return method + " Response: " + response.substring(0, 30) + "...";
        };
        var self = this;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            CONSOLE_LOG_OPEN && console.log(handler(xhr.responseText));
            if (200 === xhr.status) self.analysisData(xhr.responseText); else {
              CONSOLE_LOG_OPEN && console.log("There was a problem with the request.");
              self.gameLoadFailed(1);
            }
          }
        };
      },
      analysisData: function analysisData(responseText) {
        var questions = JSON.parse(responseText);
        if (questions || questions.length > 0) {
          var questionArr = [];
          for (var i = 0; i < questions.length; ++i) {
            var question = this.analysisDict(questions[i]);
            if (!question) break;
            questionArr.push(question);
          }
          if (questionArr && questionArr.length > 0 && questions.length == questionArr.length) {
            this.racingjs.setPlatform(this.GetQueryString("platform"));
            this.racingjs.setGameName(this.GetQueryString("gameName"));
            this.racingjs.startLoadGame(questionArr);
            this.gameLoadSuccess(questionArr.length);
          } else this.gameLoadFailed(2);
        } else this.gameLoadFailed(2);
      },
      analysisDict: function analysisDict(questionDict) {
        var interactiveJson = questionDict.interactiveJson;
        if (!interactiveJson || 0 == interactiveJson.length) {
          this.gameLoadFailed(2);
          return;
        }
        "string" == typeof interactiveJson && (interactiveJson = JSON.parse(interactiveJson));
        var question = {
          answerTime: "0",
          levelQuestionDetailID: questionDict.questionid,
          leveLQuestionDetailNum: questionDict.orderid,
          qescont: this.removeSpan(questionDict.qescont),
          interactiveJson: interactiveJson
        };
        return question;
      },
      removeSpan: function removeSpan(spanString) {
        var newStr = spanString.replace("<span>", "");
        newStr = newStr.replace("</span>", "");
        return newStr;
      },
      gameLoadFailed: function gameLoadFailed(type) {
        if (1 == type) {
          var params = encodeURI("errcode=10001&errmsg=下载失败");
          window.location.href = "optionBlank://gameLoadFailed?" + params;
        } else {
          var params = encodeURI("errcode=10002&errmsg=解析失败");
          window.location.href = "optionBlank://gameLoadFailed?" + params;
        }
      },
      gameLoadSuccess: function gameLoadSuccess(totalNumber) {
        var params = encodeURI("isShow=1&totalNumber=" + totalNumber);
        window.location.href = "optionBlank://gameLoadSuccess?" + params;
      },
      gameOver: function gameOver(answerInfoArr) {
        var data = encodeURI(JSON.stringify(answerInfoArr));
        window.location.href = "optionBlank://gameOver?status=1&data=" + data;
      },
      gameLoadProgress: function gameLoadProgress(nowNumber, totalNumber) {
        var params = encodeURI("nowNumber=" + nowNumber + "&totalNumber=" + totalNumber);
        window.location.href = "optionBlank://gameLoadProgress?" + params;
      }
    });
    cc._RF.pop();
  }, {} ],
  OptionJS1: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cec4fBlGJ1Nw5Qzjr1JzrRx", "OptionJS1");
    "use strict";
    var STATE = new cc.Enum({
      unable: 0,
      nomal: 1,
      right: 2,
      wrong: 3
    });
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.show = this.node.getChildByName("show");
        this.anim = this.node.getChildByName("anim");
        this.right = this.node.getChildByName("right");
        this.wrong = this.node.getChildByName("wrong");
        this.text = this.node.getChildByName("text");
        var self = this;
        document.addEventListener("resignActivePauseGame", function() {
          self.reloadState();
        });
      },
      reloadState: function reloadState() {},
      init: function init(gameJS, option, i, unabled) {
        this.gameJS = gameJS;
        var self = this;
        if (unabled) {
          this.text.active = true;
          this.text.getComponent(cc.Label).string = option;
          cc.loader.loadRes("texture", cc.SpriteAtlas, function(err, atlas) {
            var frame = atlas.getSpriteFrame("fang2");
            self.show.getComponent(cc.Sprite).spriteFrame = frame;
            cc.loader.releaseAsset("texture", cc.SpriteAtlas);
          });
          this.state = STATE.unable;
          this.show.opacity = 255;
          this.anim.opacity = 0;
          this.right.opacity = 0;
          this.wrong.opacity = 0;
          this.updateState(false);
        } else {
          this.text.active = false;
          this.text.getComponent(cc.Label).string = "";
          cc.loader.loadRes("texture", cc.SpriteAtlas, function(err, atlas) {
            var frame = atlas.getSpriteFrame("fang1");
            self.show.getComponent(cc.Sprite).spriteFrame = frame;
            cc.loader.releaseAsset("texture", cc.SpriteAtlas);
          });
          this.state = STATE.nomal;
          this.show.opacity = 255;
          this.anim.opacity = 0;
          this.right.opacity = 0;
          this.wrong.opacity = 0;
        }
      },
      optionClick: function optionClick() {
        var self = this;
        self.updateState(false);
        this.node.parent.pauseSystemEvents(true);
        this.gameJS.playOptionAudio();
      },
      updateState: function updateState(interactable) {
        var buttonCom = this.node.getComponent(cc.Button);
        buttonCom.interactable = interactable;
      },
      resetState: function resetState() {}
    });
    cc._RF.pop();
  }, {} ],
  OptionJS: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f68b8bKtqdKzZB+uUCDXYlU", "OptionJS");
    "use strict";
    var scDuration = .2;
    cc.Class({
      extends: cc.Component,
      properties: {
        parent_node: cc.Node,
        canMove: false,
        exchangeParent: false
      },
      onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touch_start.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touch_end.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touch_cancel.bind(this), this.node);
        this.audioPool = [];
        var self = this;
        document.addEventListener("resignActivePauseGame", function() {
          self.resetState();
        });
      },
      init: function init(gameJS, option, optionLength) {
        this.node.opacity = 255;
        this.startx = this.node.x;
        this.starty = this.node.y;
        this.gameJS = gameJS;
        this.option = option;
      },
      touch_start: function touch_start(evt) {
        this.canMove = this.gameJS.changeMoveTag(this.node.tag);
        if (!this.canMove) return;
        this.gameJS.playOptionAudio();
        this.dragX = this.node.x;
        this.dragY = this.node.y;
        this.parent_node.zIndex = 1;
      },
      touch_end: function touch_end(evt) {
        if (!this.canMove) return;
        this.gameJS.playOptionOutAudio();
        this.node.opacity = 255;
        var isTouch = this.check();
        isTouch ? this.optionClick() : this.reloadState();
      },
      touch_move: function touch_move(evt) {
        if (!this.canMove) return;
        var delta = evt.touch.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
        var touches = evt.getTouches();
        var parentNode = this.node.parent.parent.parent;
        var judgePos = parentNode.convertTouchToNodeSpaceAR(touches[0]);
        if (Math.abs(judgePos.x) < parentNode.width / 2 - 50 && Math.abs(judgePos.y) < parentNode.height / 2 - 30) ; else {
          CONSOLE_LOG_OPEN && cc.log("出屏了");
          this.reloadState();
        }
      },
      touch_cancel: function touch_cancel(evt) {
        if (!this.canMove) return;
        this.reloadState();
      },
      check: function check() {
        CONSOLE_LOG_OPEN && cc.log("this.node.isCollisioned=" + this.node.isCollisioned);
        return this.node.isCollisioned;
      },
      resetState: function resetState() {},
      reloadState: function reloadState() {
        this.canMove = false;
        if (this.exchangeParent) {
          var nodePosition = this.node.convertToWorldSpaceAR(cc.p(0, 0));
          this.node.parent = this.parent_node;
          var newPosition = this.node.parent.convertToNodeSpaceAR(nodePosition);
          this.node.setPosition(newPosition);
        }
        var moveAction = cc.moveTo(this.calculateAnimTime(), cc.p(this.startx, this.starty));
        this.node.runAction(cc.sequence(moveAction, cc.callFunc(function() {
          this.node.setPosition(this.startx, this.starty);
          this.parent_node.zIndex = 0;
          this.updateState(true);
          this.gameJS.changeMoveTag(0);
        }, this)));
      },
      calculateAnimTime: function calculateAnimTime() {
        var distance = cc.pDistance(this.node.position, cc.p(this.startx, this.starty));
        var s = distance / 1e3;
        s = s > 1 ? 1 : s;
        return .3 * s;
      },
      optionClick: function optionClick() {
        if (this.exchangeParent) {
          var nodePosition = this.node.convertToWorldSpaceAR(cc.p(0, 0));
          this.setZindex(this.node);
          this.node.parent = this.sheepNode;
          var newPosition = this.node.parent.convertToNodeSpaceAR(nodePosition);
          this.node.setPosition(newPosition);
        }
        this.node.parent.zIndex = 0;
        this.canMove = false;
        this.gameJS.changeMoveTag(0);
      },
      updateState: function updateState(interactable) {
        interactable ? this.node.resumeSystemEvents(true) : this.node.pauseSystemEvents(true);
      }
    });
    cc._RF.pop();
  }, {} ],
  QuestionNumJS: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "511ccnUhPdEV5sMRHkmPNf2", "QuestionNumJS");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        label: cc.Label,
        selected_node: cc.Node
      },
      onLoad: function onLoad() {
        this.isSelect = false;
        this.sp = this.node.getComponent("cc.Sprite");
      },
      init: function init(gameJS, idx) {
        this.gameJS = gameJS;
        this.idx = idx;
        var str = "" + (idx + 1);
        this.label.string = str;
        this.selected_node.opacity = 0;
      },
      onClick: function onClick() {
        this.gameJS.changQustion(this.idx);
      },
      setSelected: function setSelected(val) {
        this.isSelect = val;
        this.selected_node.opacity = val ? 255 : 0;
      }
    });
    cc._RF.pop();
  }, {} ],
  QuestionNumListJS: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7a656I23ulAK7kDASga7f0X", "QuestionNumListJS");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        lastBtn: cc.Node,
        nextBtn: cc.Node,
        quertionNum: cc.Prefab,
        questionNum_node: cc.Node
      },
      onLoad: function onLoad() {
        this.itemPool = new cc.NodePool();
        this.defaultLen = 7;
        this.targetIdx = 0;
        this.nowQuestionID = 0;
        this.qusetionItemPool = new cc.NodePool();
        this.qusetionNumJSArr = [];
        this.selectedQusetionJS = null;
      },
      init: function init(len, cb) {
        this.maxlen = len;
        this.cb = cb;
        if (len < this.defaultLen) {
          this.lastBtn.opacity = 0;
          this.nextBtn.opacity = 0;
        } else {
          this.lastBtn.opacity = 255;
          this.nextBtn.opacity = 255;
        }
        for (var idx = 0; idx < len; idx++) {
          var quertionNumPre = cc.instantiate(this.quertionNum);
          var quertionNumJS = quertionNumPre.getComponent("QuestionNumJS");
          this.qusetionNumJSArr.push(quertionNumPre);
          quertionNumJS.init(this, idx);
        }
        this.changeQustionList();
        this.selectedQusetionJS = this.qusetionNumJSArr[this.nowQuestionID].getComponent("QuestionNumJS");
        this.selectedQusetionJS.setSelected(true);
      },
      clickLast: function clickLast() {
        if (this.targetIdx >= this.defaultLen) {
          this.targetIdx -= this.defaultLen;
          this.changeQustionList();
        }
      },
      clickNext: function clickNext() {
        if (this.targetIdx + this.defaultLen < this.maxlen) {
          this.targetIdx += this.defaultLen;
          this.changeQustionList();
        }
      },
      changeQustionList: function changeQustionList() {
        this.questionNum_node.removeAllChildren();
        var targetIdx = this.targetIdx;
        var len = Math.min(this.defaultLen, this.maxlen - targetIdx);
        for (var idx = 0; idx < len; idx++) {
          var quertionNumPre = this.qusetionNumJSArr[idx + targetIdx];
          this.questionNum_node.addChild(quertionNumPre);
        }
      },
      changQustion: function changQustion(questionID) {
        this.nowQuestionID = questionID;
        this.selectedQusetionJS.setSelected(false);
        this.selectedQusetionJS = this.qusetionNumJSArr[questionID].getComponent("QuestionNumJS");
        this.selectedQusetionJS.setSelected(true);
        var cb = this.cb;
        cb && cb(questionID);
      },
      changeOptionEnable: function changeOptionEnable() {
        this.questionNum_node.resumeSystemEvents(true);
      },
      changeOptionDisable: function changeOptionDisable() {
        this.questionNum_node.pauseSystemEvents(true);
      }
    });
    cc._RF.pop();
  }, {} ],
  TitleJS: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5b283IiR/BBgLkN+zazJigp", "TitleJS");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        label: cc.Label
      },
      init: function init(title) {
        this.label.string = title;
      }
    });
    cc._RF.pop();
  }, {} ],
  config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cf7e7Hjl8pBApNKVzaPXR0c", "config");
    "use strict";
    window.CONSOLE_LOG_OPEN = true;
    window.AUDIO_OPEN = true;
    window.REQUEST_URL = false;
    function _sortNumber(a, b) {
      return a - b;
    }
    function _checkIsEqual(numAry, questionAry) {
      var newAry = numAry.slice(0, numAry.length);
      newAry.sort(this.sortNumber);
      var isEqual = false;
      questionAry.forEach(function(obj, idx) {
        var count = 0;
        for (var i = 0; i < obj.length; i++) {
          if (obj[i] != newAry[i]) break;
          count++;
        }
        count == newAry.length && (isEqual = true);
      }, this);
      return isEqual;
    }
    function _trimLastChar(str) {
      var str1 = str.slice(0, -1);
      return str1;
    }
    cc._RF.pop();
  }, {} ],
  efailed: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9b649czY5lPE5+Bb2VZOMm4", "efailed");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        label: cc.Label
      },
      onLoad: function onLoad() {},
      showHint: function showHint() {
        this.node.stopAllActions();
        this.node.opacity = 255;
        this.label.string = "当前分类已经有了哦！";
        var callFunc = cc.callFunc(function(target) {
          this.node.opacity = 0;
        }, this);
        this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.fadeTo(.5, 0), callFunc));
      },
      showLimitHint: function showLimitHint(num) {
        this.node.stopAllActions();
        this.node.opacity = 255;
        this.label.string = "啊哦！本题最多只能选择" + num + "个瓶子哦！";
        var callFunc = cc.callFunc(function(target) {
          this.node.opacity = 0;
        }, this);
        this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.fadeTo(.5, 0), callFunc));
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  pinyin: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "48d50di7W9Lj5ZqwBg6B4xZ", "pinyin");
    "use strict";
    var VALIGN = cc.Enum({
      TOP: 0,
      MIDDLE: 1,
      BOTTOM: 2
    });
    var HALIGN = cc.Enum({
      LEFT: 0,
      CENTER: 1,
      RIGHT: 2
    });
    cc.Class({
      extends: cc.Component,
      properties: {
        calpinyin: cc.Node,
        calhanzi: cc.Node,
        calcontainer: cc.Node,
        hanzi: "",
        pinyin: "",
        maxwidth: 1600,
        gap: 20,
        verticalAlign: {
          type: VALIGN,
          default: VALIGN.MIDDLE
        },
        textAlign: {
          type: HALIGN,
          default: HALIGN.CENTER
        }
      },
      onLoad: function onLoad() {
        this.plPool = new cc.NodePool();
        this.hlPool = new cc.NodePool();
        this.refresh();
      },
      setData: function setData(hanzi, pinyin) {
        this.hanzi = hanzi;
        this.pinyin = pinyin;
        this.refresh();
      },
      refresh: function refresh() {
        var hanziarr = this.splitCString(this.hanzi);
        var hanzimap = this.toLengthMap(hanziarr, this.calhanzi);
        var hanzigroup = this.toGroupHanzi(hanzimap);
        if (this.pinyin) {
          var pinyinarr = this.pinyin ? this.pinyin.split(" ") : [];
          var pinyinmap = this.toLengthMap(pinyinarr, this.calpinyin);
          var pinyingroup = this.toGrouppinyin(hanzigroup, pinyinmap);
          this.createLabels(hanzigroup, pinyingroup);
        } else this.createLabelsH(hanzigroup);
      },
      createLabels: function createLabels(hgroup, pgroup) {
        var _this = this;
        var sy = 0;
        this.verticalAlign === VALIGN.TOP ? sy = 0 : this.verticalAlign === VALIGN.MIDDLE ? sy = +hgroup.length / 2 * (this.calhanzi.height + this.calpinyin.height) : this.verticalAlign === VALIGN.BOTTOM && (sy = +hgroup.length * (this.calhanzi.height + this.calpinyin.height));
        for (var i = 0; i < this.calcontainer.childrenCount; ) 0 === this.calcontainer.children[0].tag ? this.hlPool.put(this.calcontainer.children[0]) : 1 === this.calcontainer.children[0].tag && this.plPool.put(this.calcontainer.children[0]);
        for (var i = 0, h, p; i < hgroup.length; i++) {
          hgroup[i].forEach(function(element, index) {
            h = _this.hlPool.size() > 0 ? _this.hlPool.get() : cc.instantiate(_this.calhanzi);
            h.position = cc.p(element.x, sy - i * (_this.calhanzi.height + _this.calpinyin.height) - _this.calpinyin.height);
            h.getComponent(cc.Label).string = element.data;
            h.opacity = 255;
            h.parent = _this.calcontainer;
            h.tag = 0;
          });
          pgroup[i].forEach(function(element, index) {
            p = _this.plPool.size() > 0 ? _this.plPool.get() : cc.instantiate(_this.calpinyin);
            p.position = cc.p(element.x, sy - i * (_this.calhanzi.height + _this.calpinyin.height));
            p.getComponent(cc.Label).string = element.data;
            p.opacity = 255;
            p.parent = _this.calcontainer;
            p.tag = 1;
          });
        }
      },
      createLabelsH: function createLabelsH(hgroup) {
        var _this2 = this;
        var sy = 0;
        this.verticalAlign === VALIGN.TOP ? sy = 0 : this.verticalAlign === VALIGN.MIDDLE ? sy = +hgroup.length / 2 * this.calhanzi.height : this.verticalAlign === VALIGN.BOTTOM && (sy = +hgroup.length * this.calhanzi.height);
        for (var i = 0; i < this.calcontainer.childrenCount; ) 0 === this.calcontainer.children[0].tag ? this.hlPool.put(this.calcontainer.children[0]) : 1 === this.calcontainer.children[0].tag && this.plPool.put(this.calcontainer.children[0]);
        for (var i = 0, h, p; i < hgroup.length; i++) hgroup[i].forEach(function(element, index) {
          h = _this2.hlPool.size() > 0 ? _this2.hlPool.get() : cc.instantiate(_this2.calhanzi);
          h.position = cc.p(element.x, sy - i * _this2.calhanzi.height);
          h.getComponent(cc.Label).string = element.data;
          h.opacity = 255;
          h.parent = _this2.calcontainer;
          h.tag = 0;
        });
      },
      toGrouppinyin: function toGrouppinyin(hgroup, lmap) {
        var r = [];
        r.count = lmap.count;
        for (var i = 0, c = 0, t = [], tl = 0, tlh = 0; i < hgroup.length; i++) {
          for (var j = 0; j < hgroup[i].length && c + j < lmap.count; j++) t.push({
            data: lmap[c + j]["data"],
            length: lmap[c + j]["length"],
            x: hgroup[i][j].x
          });
          r.push(t);
          t = [];
          tl = 0;
          tlh = 0;
          c += j;
        }
        return r;
      },
      toGroupHanzi: function toGroupHanzi(lmap) {
        var grounps = [];
        grounps.count = lmap.count;
        for (var i = 0, t = [], tl = 0; i < lmap.count; i++) if (tl + lmap[i]["length"] < this.maxwidth) {
          lmap[i]["x"] = tl + lmap[i]["length"] / 2;
          t.push(lmap[i]);
          tl += lmap[i]["length"] + this.gap;
        } else {
          t.glength = tl;
          grounps.push(t);
          t = [];
          tl = 0;
          lmap[i]["x"] = tl + lmap[i]["length"] / 2;
          t.push(lmap[i]);
          tl += lmap[i]["length"] + this.gap;
        }
        if (t) {
          t.glength = tl;
          grounps.push(t);
        }
        for (var i = 0, xs; i < grounps.length; i++) {
          this.textAlign === HALIGN.CENTER ? xs = grounps[i].glength / 2 : this.textAlign === HALIGN.LEFT ? xs = this.maxwidth / 2 : this.textAlign === HALIGN.RIGHT && (xs = grounps[i].glength - this.maxwidth / 2);
          grounps[i].forEach(function(element) {
            element.x = element.x - xs;
          });
        }
        return grounps;
      },
      toLengthMap: function toLengthMap(arr, calNode) {
        var r = {};
        r.count = arr instanceof Array ? arr.length : 0;
        for (var i = 0; arr instanceof Array && calNode instanceof cc.Node && i < arr.length; i++) {
          r[i] = {};
          r[i]["data"] = arr[i];
          calNode.getComponent(cc.Label).string = arr[i];
          r[i]["length"] = calNode.width;
        }
        return r;
      },
      splitCString: function splitCString(str) {
        var r = [];
        for (var i = 0; "string" === typeof str && i < str.length; i++) r.push(str.charAt(i));
        return r;
      }
    });
    cc._RF.pop();
  }, {} ],
  question_panel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "518c6EygmVF7aZ+N0GUpC9+", "question_panel");
    "use strict";
    var questionAry = [];
    cc.Class({
      extends: cc.Component,
      properties: {
        oItemPrefab: cc.Prefab
      },
      onLoad: function onLoad() {
        this.oItemPool = new cc.NodePool();
      },
      isEmpty: function isEmpty() {
        return 0 == questionAry.length;
      },
      copyAry: function copyAry() {
        var newAry = questionAry.slice(0, questionAry.length);
        CONSOLE_LOG_OPEN && console.log("questionAry.slice" + newAry + "  " + questionAry);
        return newAry;
      },
      createOptions: function createOptions() {
        for (var i = 0, option, optionJs; i < questionAry.length; i++) {
          if (i == this.questionAry.length - 1) {
            option = this.oItemPool.size() > 0 ? this.oItemPool.get() : cc.instantiate(this.oItemPrefab);
            option.parent = this.node;
          } else option = this.node.children[i];
          var width = option.width, height = this.node.height, paddingX = 15, paddingY = 10, wcount = 3, index = i % 3, x = (index - 1) * (width + paddingX), y = i < 3 ? height / 3 + paddingY : i < 6 ? 3 * paddingY : -height / 3 + 5.5 * paddingY;
          option.setPosition(cc.p(x, y));
        }
      },
      addOption: function addOption(contentAry) {
        var _this = this;
        var cb = function cb() {
          var newAry = contentAry.slice(0, contentAry.length);
          questionAry.push(newAry.sort(_sortNumber));
          _this.createOptions(contentAry);
          _this.updateSum();
        };
        cb();
      },
      removeAllOption: function removeAllOption() {
        for (var i = 0; i < this.node.children.length; i++) {
          var contentNode = this.node.children[i];
          contentNode.removeAllChildren(true);
        }
        this.node.removeAllChildren(true);
        questionAry.splice(0, questionAry.length);
        questionAry = [];
        this.updateSum();
      },
      updateSum: function updateSum() {}
    });
    cc._RF.pop();
  }, {} ],
  scalebg: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3093551zVpLp4AjCVzrt6iQ", "scalebg");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        designSize: cc.Size,
        bg: cc.Node,
        lbg: cc.Node,
        rbg: cc.Node
      },
      onLoad: function onLoad() {
        var w = (cc.winSize.width - this.designSize.width) / 2;
        if (w > 0) {
          this.lbg.width = Math.max(w, 512);
          this.rbg.width = Math.max(w, 512);
        } else {
          var scale = Math.min(cc.winSize.width / this.designSize.width, cc.winSize.height / this.designSize.height);
          this.node.setScale(scale, 1);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  scale: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "521434wupJHAqZevOCVOyWl", "scale");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        designSize: cc.Size
      },
      onLoad: function onLoad() {
        var scale = Math.min(cc.winSize.width / this.designSize.width, cc.winSize.height / this.designSize.height);
        this.node.setScale(scale, scale);
      }
    });
    cc._RF.pop();
  }, {} ],
  settlement: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dd759DqBqVEVoLQFj9axoqs", "settlement");
    "use strict";
    var DB_ANIM_ASSET = {
      win: "happy",
      lose: "sad"
    };
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.background = this.node.getChildByName("background");
        this.scale = this.node.getChildByName("scale");
        this.glow = this.scale.getChildByName("glow");
        this.glowDots = this.scale.getChildByName("glow_dots");
        this.title = this.scale.getChildByName("title");
        this.cutes = this.scale.getChildByName("cutes");
      },
      playWinAnim: function playWinAnim(callback) {
        this.node.active = true;
        var that = this;
        cc.loader.loadRes("win", cc.SpriteFrame, function(err, assets) {
          err ? that.log(err) : that.title.getComponent(cc.Sprite).spriteFrame = assets;
        });
        this.playDBAnim(DB_ANIM_ASSET["win"]);
        var anim = this.node.getComponent(cc.Animation);
        this.scheduleOnce(function() {
          callback.call(that.game);
        }, 1.5);
        anim.play("win");
      },
      playLoseAnim: function playLoseAnim(callback) {
        this.node.active = true;
        var that = this;
        cc.loader.loadRes("lose", cc.SpriteFrame, function(err, assets) {
          err ? that.log(err) : that.title.getComponent(cc.Sprite).spriteFrame = assets;
        });
        this.playDBAnim(DB_ANIM_ASSET["lose"]);
        var anim = this.node.getComponent(cc.Animation);
        this.scheduleOnce(function() {
          callback.call(that.game);
        }, 1.5);
        anim.play("lose");
      },
      playTimeUpAnim: function playTimeUpAnim(callback) {
        this.node.active = true;
        var that = this;
        cc.loader.loadRes("time_up", cc.SpriteFrame, function(err, assets) {
          err ? that.log(err) : that.title.getComponent(cc.Sprite).spriteFrame = assets;
        });
        this.playDBAnim(DB_ANIM_ASSET["lose"]);
        var anim = this.node.getComponent(cc.Animation);
        this.scheduleOnce(function() {
          callback.call(that.game);
        }, 1.5);
        anim.play("lose");
      },
      playDBAnim: function playDBAnim(name) {
        var children = this.cutes.children;
        for (var i = 0; i < children.length; i++) children[i].getChildByName("cute").getComponent(dragonBones.ArmatureDisplay).playAnimation(name, -1);
      },
      reset: function reset() {
        this.background.opacity = 0;
        this.background.active = false;
        this.glow.scaleX = 0;
        this.glow.scaleY = 0;
        this.glow.opacity = 255;
        this.glowDots.active = false;
        this.title.getComponent(cc.Sprite).spriteFrame = null;
        var children = this.cutes.children;
        for (var i = 0, dba; i < children.length; i++) {
          dba = children[i].getChildByName("cute").getComponent(dragonBones.ArmatureDisplay);
          dba.animationName = null;
        }
        this.node.active = false;
      },
      log: function log(msg) {
        CONSOLE_LOG_OPEN && cc.log(msg);
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "BaseGameJS", "LocalSaveJS", "NetworkJS", "ColliderListener", "OptionJS", "OptionJS1", "QuestionNumJS", "QuestionNumListJS", "TitleJS", "efailed", "question_panel", "settlement", "GameJS", "NetworkJS_Data", "config", "pinyin", "scale", "scalebg" ]);