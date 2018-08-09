"use strict";
cc._RF.push(module, 'd92c8sRpIBMBKs/RzLIjTLN', 'GameJS');
// scripts/GameJS.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var BaseGameJS = require("BaseGameJS");

cc.Class({
    extends: BaseGameJS,

    properties: {
        optionItem_pref: cc.Prefab, //选项预制
        settlePrefab: cc.Prefab,
        resetBtnNSF: cc.SpriteFrame,
        commitBtnNSF: cc.SpriteFrame, //备选
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
        this.scaleNode = this.node.getChildByName('scale');
        this.option_node = this.scaleNode.getChildByName('option_node');
        this.tipsNode = this.node.getChildByName('TipsNode');
        this.tipsNode && (this.tipsNode.active = true);
        this.answerItemPool = new cc.NodePool();
        this.changeMoveTag(0);
        this.initToast();

        //初始化threeJS的Randerer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setClearColor(0xFFFFFF, 0);
        this.renderer.domElement.style.position = "absolute";
        // this.renderer.domElement.style.borderRadius = "50%";
        setRendererSize.call(this);
        this.box = new Box(this.renderer);
        document.body.appendChild(this.renderer.domElement);
        var self = this;
        window.addEventListener('resize', function () {
            setRendererSize.call(self);
        });
        function setRendererSize() {
            var scaleRatio = THREE.getScaleRatio();
            var height = 460 * scaleRatio,
                width = window.innerWidth;
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.domElement.style.left = window.innerWidth / 2 - width / 2 + "px";
            this.renderer.domElement.style.top = window.innerHeight / 2 - height / 2 + "px";
        }
    },
    //初始化toast框
    initToast: function initToast() {
        var efailed = this.node.getChildByName('scale').getChildByName('efailed');
        this.efailedJs = efailed.getComponent('efailed');
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
        this.settlementJs = this.settlement.getComponent('settlement');
        this.settlementJs.game = this;
        var feedbackNode = this.node.getChildByName('feedback_node');
        feedbackNode.addChild(this.settlement);
        this.settlement.active = false;
    },
    //转到后台
    gotoBackground: function gotoBackground() {
        var submitButton = this.node.getChildByName('button_node').getChildByName('commit'),
            resetButton = this.node.getChildByName('button_node').getChildByName('cancel');
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
    //转到前台
    gotoForeground: function gotoForeground() {
        this.box.start();
    },
    /*超时处理 
     */
    timeout: function timeout() {
        this.box.clearScene();
    },

    //移除当前所有选项
    deleteOption: function deleteOption() {},

    //创建选项按钮
    createOption: function createOption(optionsArr) {
        for (var i = 0; i < optionsArr.length; ++i) {
            var optionItem = null;

            if (this.answerItemPool.size() > 0) {
                optionItem = this.answerItemPool.get();
            } else {
                optionItem = cc.instantiate(this.optionItem_pref);
            }
            if (i === 0) {
                //this.option_node.width = optionsArr.length * optionItem.width + (optionsArr.length + 2) * 20;
            }
            optionItem.setPosition(cc.p(-(optionsArr.length / 2 - 0.5 - i) * (optionItem.width + 20), 10));
            var graph_btn = optionItem.getChildByName('button_bg');
            graph_btn.tag = 1000 + i;
            var optionJS = graph_btn.getComponent('OptionJS');
            optionJS.init(this, optionsArr[i], optionsArr.length);
            optionJS.updateState(true);
            this.option_node.addChild(optionItem);
        }
    },

    //开始加载选项
    startloadOption: function startloadOption() {
        this.updateGameState(true);
        this.isIts && this.questionNumListJS.changeOptionDisable();
        var question = this.questionArr[this.nowQuestionID];
        //启动业务初始化
        // this.question_node.getChildByName('question_label').getComponent(cc.Label).string = question.qescont;
        // this.questionBgNode = this.scaleNode.getChildByName('questionBg');

        //题目
        var questionLabel = this.questionLabel.getComponent("pinyin");
        var stringArray = question.qescont.split('_');
        questionLabel.setData(stringArray.length > 0 ? stringArray[0] : "", stringArray.length > 1 ? stringArray[1] : "");

        //正确答案
        this.rightOptionNo = question.rightOptionNo;
        //倒计时
        var isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        if (this.nowQuestionID === 0 && isTotalCd || !isTotalCd) {
            this.answerTime = 0;
            var countDown = parseInt(question.interactiveJson['countDown']);
            if (countDown > 0) {
                this.countDown = countDown;
            }
            this.timeLabel.string = this.timeFormat(this.countDown);
        }
        //纸片
        this.box.clearScene();
        this.box.setData(question);
        this.box.createPlanes();
        this.box.render();
        if (this.tipsNode && !this.tipsNode.activeInHierarchy) {
            !this.isIts && this.showSchedule();
            isTotalCd && (this.lastAnswerTime = this.answerTime);
            this.renderer.domElement.style.opacity = 1;
        } else {
            this.renderer.domElement.style.opacity = 0.3;
        }
        this.isIts && this.questionNumListJS.changeOptionEnable();
        this.isShowFeed = false;
        this.changeMoveTag(0);
        //出现走了选中isShowFeed=yes,reloadState还没走
        this.isShowAnim = false;
    },

    //选中答案
    selectAnswer: function selectAnswer(isRight) {
        //显示状态过程中不接收事件
        if (this.isShowFeed || this.isShowLossTime) {
            return;
        }
        this.unschedule(this.timeCallback);
        this.isShowFeed = true;
        this.updateGameState(false);
        if (isRight) {
            if (CONSOLE_LOG_OPEN) console.log('答对了');
            this.createAnswerInfo('1');
            this.showFeedback(1);
        } else {
            if (CONSOLE_LOG_OPEN) console.log('答错了');
            this.createAnswerInfo('2');
            this.showFeedback(2);
        }
    },
    //反馈
    showFeedback: function showFeedback(type) {
        if (type === 1) {
            //出发
            AUDIO_OPEN && this.playWinAudio();
            this.settlementJs.playWinAnim(this.feedbackFinish);
        } else if (type === 2) {
            //出发
            AUDIO_OPEN && this.playLoseAudio();
            this.settlementJs.playLoseAnim(this.feedbackFinish);
        } else if (type === 3) {
            //时间到逻辑

            //出发
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
        if (this.isShowFeed) {
            return;
        }
    },

    rightBtnClick: function rightBtnClick() {
        if (this.isShowFeed || this.isShowAnim) {
            return;
        }
        this.isShowAnim = true;
        this.playOptionAudio();
        var self = this;
        var question = this.questionArr[this.nowQuestionID];
        var foldable = question.foldable;
        this.startAnimation(function (box) {
            // setTimeout(()=>{
            box.clearScene();
            self.selectAnswer(foldable);
            // },1000)
        });
    },
    wrongBtnClick: function wrongBtnClick() {
        if (this.isShowFeed || this.isShowAnim) {
            return;
        }
        this.isShowAnim = true;
        this.playOptionAudio();
        var self = this;
        var question = this.questionArr[this.nowQuestionID];
        var foldable = question.foldable;
        this.startAnimation(function (box) {
            // setTimeout(()=>{
            box.clearScene();
            self.selectAnswer(!foldable);
            // },1000)
        });
    },
    checkIsEmpty: function checkIsEmpty() {
        var array = this.option_node.children;
        var isEmpty = true;
        array.forEach(function (obj, idx) {
            var optionJS = obj.getComponent('OptionJS');
            //正确区不为正确时
            if (optionJS && optionJS.state > 1) {
                isEmpty = false;
            }
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
    //播放音效
    playAudio: function playAudio(audio) {
        if (AUDIO_OPEN) {
            cc.audioEngine.play(audio, false, 1);
        }
    },
    startAnimation: function startAnimation(callback) {
        this.box.setAnimationHandler(animate.bind(this));
        function animate(data) {
            var boxObj = this.box.getBoxObject();
            if (boxObj.rotation.y <= 0.3) {
                boxObj.rotation.y += 0.01;
                boxObj.rotation.x -= 0.02;
            } else {
                this.playFoldAudio();
                this.box.setAnimationHandler(null);
                var self = this;
                this.box.fold(function () {
                    setTimeout(function () {
                        if (typeof callback === "function") callback(self.box);
                    }, 1000);
                });
            }
            this.box.render();
        }
    },
    update: function update() {
        this.box && this.box.update();
    }
});

//////////////ThreeJS折叠盒子演示类/////////////////
function Box(renderer) {
    var planesData, cameraConf, planeSize, planeRotateSpeed, controlsConf, transformConf;
    //场景，相机
    var scene = new THREE.Scene(),
        camera,
        controls;
    var planesGroup = new THREE.Object3D();
    var resume = true;
    this.planesData = [];this.eachAnimationHandler = null;
    this.setData = function (d) {
        planesData = d.planes.data; //六个卡片(正方形)的数据
        cameraConf = d.camera;
        planeSize = d.planes.planeSize; //卡片的尺寸
        planeRotateSpeed = d.planes.rotateSpeed || 0.01;
        controlsConf = d.controls;
        transformConf = d.transform;

        camera = new THREE.PerspectiveCamera(cameraConf.frustum.fov, renderer.getSize().width / renderer.getSize().height, cameraConf.frustum.near, cameraConf.frustum.far);
        camera.position.set(cameraConf.position.x, cameraConf.position.y, cameraConf.position.z);
        camera.lookAt(new THREE.Vector3(cameraConf.lookAt.x, cameraConf.lookAt.y, cameraConf.lookAt.z));
        controls = new THREE.OrbitControls(camera); //手势控制
    };
    this.createPlanes = function () {
        var plane;
        for (var i = 0; i < planesData.length; i++) {
            plane = createPlane(planesData[i]);
            planesGroup.add(plane);
        }
        var translate = transformConf && transformConf.translate,
            rotate = transformConf && transformConf.rotate,
            scale = transformConf && transformConf.scale;

        planesGroup.position.set(translate && translate.x || 0, translate && translate.y || 0, translate && translate.z || 0);
        planesGroup.rotation.set(rotate && rotate.x || 0, rotate && rotate.y || 0, rotate && rotate.z || 0);
        planesGroup.scale.set(scale && scale.x || 1, scale && scale.y || 1, scale && scale.z || 1);
        scene.add(planesGroup);

        if ((typeof controlsConf === 'undefined' ? 'undefined' : _typeof(controlsConf)) === "object") {
            for (var item in controlsConf) {
                if (controlsConf.hasOwnProperty(item)) {
                    controls[item] = controlsConf[item];
                }
            }
        }
        controls["enableZoom"] = false;
        controls["enablePan"] = false;
    };
    this.update = function () {
        if (resume && controls) {
            controls.update();
            if (typeof this.animationHandler === "function") {
                this.animationHandler(planesData);
            }
            if (typeof this.eachAnimationHandler === "function") {
                var data;
                for (var i = 0; i < this.planesData.length; i++) {
                    data = this.planesData[i];
                    this.eachAnimationHandler(data);
                }
            }
            renderer.render(scene, camera);
        }
    };
    this.setAnimationHandler = function (handler) {
        this.animationHandler = handler;
    }, this.setEachAnimationHandler = function (eachHandler) {
        this.eachAnimationHandler = eachHandler;
    }, this.fold = function (callback) {
        var self = this;
        var planesData1 = [],
            planesData2 = [];
        var planes2HasDone = false;
        var hasCall = false;
        function setAnimateData(planesData) {
            for (var i = 0; i < planesData.length; i++) {
                if (planesData[i].type === "plane") {
                    if (!planesData[i].animationIndex || planesData[i].animationIndex === 1) {
                        planesData1[planesData1.length] = planesData[i];
                    } else if (planesData[i].animationIndex === 2) {
                        planesData2[planesData2.length] = planesData[i];
                    }
                } else if (planesData[i].type === "group") {
                    if (!planesData[i].animationIndex || planesData[i].animationIndex === 1) {
                        planesData1[planesData1.length] = planesData[i];
                    } else if (planesData[i].animationIndex === 2) {
                        planesData2[planesData2.length] = planesData[i];
                    }
                    setAnimateData(planesData[i].planes);
                }
            }
        }
        setAnimateData(planesData);

        this.planesData = planesData1;
        this.setEachAnimationHandler(eachAnimationHandler);
        function eachAnimationHandler(data) {
            var plane = data.plane;
            if (data.axis) {
                if (data.rotateDirection === -1) {
                    //逆时针合起，顺时针展开
                    if (plane.rotation[data.axis] > -0.5 * Math.PI) {
                        plane.rotation[data.axis] -= planeRotateSpeed;
                    } else {
                        plane.rotation[data.axis] = -0.5 * Math.PI;
                        if ((data.animationIndex === 1 || !data.animationIndex) && !planes2HasDone) {
                            planes2HasDone = true;
                            this.planesData = planesData2;
                            this.setEachAnimationHandler(eachAnimationHandler);
                        } else if (data.animationIndex === 2) {
                            this.setEachAnimationHandler(null);
                            if (!hasCall) {
                                hasCall = true;
                                if (typeof callback === "function") callback(self);
                            }
                        }
                    }
                } else if (data.rotateDirection === 1) {
                    //顺时针合起，逆时针展开
                    if (plane.rotation[data.axis] < 0.5 * Math.PI) {
                        plane.rotation[data.axis] += planeRotateSpeed;
                    } else {
                        plane.rotation[data.axis] = 0.5 * Math.PI;
                        if ((data.animationIndex === 1 || !data.animationIndex) && !planes2HasDone) {
                            planes2HasDone = true;
                            this.planesData = planesData2;
                            this.setEachAnimationHandler(eachAnimationHandler);
                        } else if (data.animationIndex === 2) {
                            this.setEachAnimationHandler(null);
                            if (!hasCall) {
                                hasCall = true;
                                if (typeof callback === "function") callback(self);
                            }
                        }
                    }
                }
            }
        }
    };

    this.unfold = function (callback) {
        var self = this;
        var planesData1 = [],
            planesData2 = [];
        var planes1HasDone = false;
        var hasCall = false;
        for (var i = 0; i < planesData.length; i++) {
            if (planesData[i].type === "plane") {
                if (!planesData[i].animationIndex || planesData[i].animationIndex === 1) {
                    planesData1[planesData1.length] = planesData[i];
                } else if (planesData[i].animationIndex === 2) {
                    planesData2[planesData2.length] = planesData[i];
                }
            } else if (planesData[i].type === "group") {
                if (!planesData[i].animationIndex || planesData[i].animationIndex === 1) {
                    planesData2[planesData2.length] = planesData[i];
                } else if (planesData[i].animationIndex === 2) {
                    planesData1[planesData1.length] = planesData[i];
                }
                var planes = planesData[i].planes || [];
                for (var j = 0; j < planes.length; j++) {
                    if (!planes[j].animationIndex || planes[j].animationIndex === 1) {
                        planesData1[planesData1.length] = planes[j];
                    } else if (planes[j].animationIndex === 2) {
                        planesData2[planesData2.length] = planes[j];
                    }
                }
            }
        }
        this.planesData = planesData2;
        this.setEachAnimationHandler(eachAnimationHandler);
        function eachAnimationHandler(data, requestAnimate) {
            var plane = data.plane;
            if (data.axis) {
                if (data.rotateDirection === -1) {
                    //逆时针合起，顺时针展开
                    if (plane.rotation[data.axis] < 0) {
                        plane.rotation[data.axis] += planeRotateSpeed;
                    } else {
                        plane.rotation[data.axis] = 0;
                        if (data.animationIndex === 1 || !data.animationIndex) {
                            this.setEachAnimationHandler(null);
                            if (!hasCall) {
                                hasCall = true;
                                if (typeof callback === "function") callback(self);
                            }
                        } else if (data.animationIndex === 2 && !planes1HasDone) {
                            planes1HasDone = true;
                            this.planesData = planesData1;
                            this.setEachAnimationHandler(eachAnimationHandler);
                        }
                    }
                } else if (data.rotateDirection === 1) {
                    //顺时针合起，逆时针展开
                    if (plane.rotation[data.axis] > 0) {
                        plane.rotation[data.axis] -= planeRotateSpeed;
                    } else {
                        plane.rotation[data.axis] = 0;
                        if (data.animationIndex === 1 || !data.animationIndex) {
                            this.setEachAnimationHandler(null);
                            if (!hasCall) {
                                hasCall = true;
                                if (typeof callback === "function") callback(self);
                            }
                        } else if (data.animationIndex === 2 && !planes1HasDone) {
                            planes1HasDone = true;
                            this.planesData = planesData1;
                            this.setEachAnimationHandler(eachAnimationHandler);
                        }
                    }
                }
            }
        }
    };
    this.render = function () {
        renderer.render(scene, camera);
    };
    //清除场景中所有内容
    this.clearScene = function () {
        while (planesGroup.children.length > 0) {
            planesGroup.remove(planesGroup.children[0]);
        }
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    };
    this.getBoxObject = function () {
        return planesGroup;
    };
    this.getCamera = function () {
        return camera;
    };
    this.getScene = function () {
        return scene;
    };
    this.pause = function () {
        resume = false;
    };
    this.start = function () {
        resume = true;
    };
    //创建一个卡片或一个组
    function createPlane(data) {
        if (data.type === "plane") {
            var geometry = new THREE.PlaneGeometry(planeSize, planeSize);
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(data.translate.x, data.translate.y, data.translate.z)); //移动物体
            var materialConf = {
                side: THREE.DoubleSide
            };
            if (typeof data.bgColor === "number") {
                materialConf.color = data.bgColor;
            } else if (_typeof(data.bgColor) === "object") {
                materialConf.map = new THREE.CanvasTexture(generateTexture(data.bgColor.colors, data.bgColor.startX, data.bgColor.startY, data.bgColor.endX, data.bgColor.endY));
            }
            var material = new THREE.MeshBasicMaterial(materialConf);
            var plane = new THREE.Mesh(geometry, material);
            plane.translateX(data.position.x); //移动坐标
            plane.translateY(data.position.y);
            plane.translateZ(data.position.z);
            scene.add(plane);
            data.plane = plane;
            if (typeof data.ondrawplane === 'function') data.ondrawplane(plane);
            return plane;
        } else if (data.type === "group") {
            var planes = data.planes;
            var objGroup = new THREE.Object3D();
            objGroup.applyMatrix(new THREE.Matrix4().makeTranslation(data.translate.x, data.translate.y, data.translate.z));
            objGroup.translateX(data.position.x);
            objGroup.translateY(data.position.y);
            objGroup.translateZ(data.position.z);
            data.plane = objGroup;
            if (typeof data.ondrawplane === 'function') data.ondrawplane(objGroup);
            if (Array.isArray(planes)) {
                for (var i = 0; i < planes.length; i++) {
                    var plane = createPlane(planes[i]);
                    objGroup.add(plane);
                    planes[i].plane = plane;
                    if (typeof data.ondrawplane === 'function') data.ondrawplane(plane);
                }
            }
            return objGroup;
        }
    }
    //自定义canvas渐变色Texture
    function generateTexture(colors, startX, startY, endX, endY) {
        var size = 64;
        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        var context = canvas.getContext('2d');
        context.rect(0, 0, size, size);
        var gradient = context.createLinearGradient(startX * size, startY * size, endX * size, endY * size);
        for (var i = 0; i < colors.length; i++) {
            gradient.addColorStop(i / (colors.length - 1), colors[i]);
        }
        context.fillStyle = gradient;
        context.fill();
        return canvas;
    }
}

cc._RF.pop();