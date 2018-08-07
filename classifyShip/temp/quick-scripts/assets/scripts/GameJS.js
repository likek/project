(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/GameJS.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd92c8sRpIBMBKs/RzLIjTLN', 'GameJS', __filename);
// scripts/GameJS.js

'use strict';

var _cc$Class;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BaseGameJS = require("BaseGameJS");

cc.Class((_cc$Class = {
    extends: BaseGameJS,

    properties: {
        optionItem_pref: cc.Prefab, //选项预制
        settlePrefab: cc.Prefab,
        resetBtnNSF: cc.SpriteFrame,
        commitBtnNSF: cc.SpriteFrame, //备选

        beltContainer: cc.Node,
        leafContainer: cc.Prefab,
        moveThing: cc.Node,
        progress: cc.Node,
        backBtn: cc.Node,
        tipsHand: cc.Node,

        giraffe: cc.Node,
        frog: cc.Node,
        monkey: cc.Node,
        bear: cc.Node,
        flowerAndWater: cc.Node,

        winAudio: cc.AudioClip,
        loseAudio: cc.AudioClip,
        resetAudio: cc.AudioClip,
        optionAudio: cc.AudioClip,
        option_outAudio: cc.AudioClip,
        carMoveAudio: cc.AudioClip,
        flyStarAudio: cc.AudioClip,
        wrongAudio: cc.AudioClip,
        rightAudio: cc.AudioClip
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

        this.beltNode = this.scaleNode.getChildByName('beltNode');
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },
    //初始化toast框
    initToast: function initToast() {
        var efailed = this.node.getChildByName('scale').getChildByName('efailed');
        this.efailedJs = efailed.getComponent('efailed');
        this.efailedJs.game = this;
    },
    tipsClick: function tipsClick() {},
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

        this.updateAble = false; //停止帧动画
        ;
        for (var i = 0; i < this.beltNode.children.length; i++) {
            var obj = this.beltNode.children[i];
            obj.getComponent('Thing').resetPosition();
        }
    },
    //转到前台
    gotoForeground: function gotoForeground() {
        if (!this.tipsNode) {
            //如果引导结束了
            this.updateAble = true;
        }
    },

    /*超时处理 
     */
    timeout: function timeout() {
        this.progress.getComponent("ProgressJs").setStarTypeByIndex(this.nowQuestionID, 2);
        this.settlementJs.playTimeUpAnim();
    },

    //移除当前所有选项
    deleteOption: function deleteOption() {
        var array = this.option_node.children;
        for (var i = 0; i < array.length;) {
            var tempOption = array[i];
            var graph_btn = tempOption.getChildByName('button_bg');
            graph_btn.opacity = 255;
            //放进对象池会自动调用removeFromParent
            this.answerItemPool.put(tempOption);
        }
        this.option_node.removeAllChildren(true);
        //移除question_node内容
    },

    //创建选项按钮
    createOption: function createOption(optionsArr) {},

    //开始加载选项
    startloadOption: function startloadOption() {
        this.updateGameState(true);
        this.isIts && this.questionNumListJS.changeOptionDisable();
        var question = this.questionArr[this.nowQuestionID];
        //启动业务初始化
        // this.prompt_nodeJS.setTitle(question.qescont, null);

        //正确答案
        this.rightOptionNo = question.rightOptionNo;
        // this.createOption(question.optionsArr);
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
        this.isIts && this.questionNumListJS.changeOptionEnable();
        this.isShowFeed = false;
        this.changeMoveTag(0);
        //出现走了选中isShowFeed=yes,reloadState还没走.
        this.initBeltContainer(question.belt, question.optionsArr); //传送带及选项初始化
        this.flowerAndWater.zIndex = this.time_node.zIndex = this.progress.zIndex = -2;
        //
        this.monkey.active = question.monkey.isShow;
        this.frog.active = question.frog.isShow;
        this.giraffe.active = question.giraffe.isShow;
        this.moveThing.opacity = 0; //touchEnd

        this.monkey.getChildByName("collisionNode").tag = question.monkey.isShow ? 3 : -1;
        this.frog.getChildByName("collisionNode").tag = question.frog.isShow ? 1 : -1;
        this.giraffe.getChildByName("collisionNode").tag = question.giraffe.isShow ? 2 : -1;
        this.monkey.getChildByName("collisionNode").active = this.frog.getChildByName("collisionNode").active = this.giraffe.getChildByName("collisionNode").active = true;
        this.runAnimation("in", 3000);
        this.flowerAndWater.getComponent("sp.Skeleton").setAnimation(0, "stand", true);

        if (!this.__progressHasInit) {
            this.progress.getComponent("ProgressJs").init(this.questionArr.length);
            this.__progressHasInit = true;
        }

        this.beltNode.removeAllChildren();
        this.collideAble = false;
        this.updateAble = true;
        this.currTouchOption = null;
        this.moveThing.opacity = 0;
        if (this.nowQuestionID > 0) {
            !this.isIts && this.showSchedule();
            isTotalCd && (this.lastAnswerTime = this.answerTime);
        } else {
            this.tipsHandAnimation();
        }
    },

    initBeltContainer: function initBeltContainer(beltData, things) {
        var self = this;
        var beltLeft = this.beltContainer.getChildByName("beltLeft");
        var beltRight = this.beltContainer.getChildByName("beltRight");
        beltLeft.removeAllChildren();
        beltRight.removeAllChildren();

        var minOffset = 10;
        var viewWidth = cc.winSize.width;
        var itemWidth = viewWidth / things.length;
        var leafWidth = this.leafContainer.data.width;
        var offset = itemWidth - leafWidth;
        var beltWidth = viewWidth;

        if (offset < minOffset) {
            itemWidth = minOffset * 2 + leafWidth;
            offset = minOffset;
            beltWidth = itemWidth * things.length;
            this.beltContainer.x = (beltWidth - viewWidth) / 2;
        }
        this.beltContainer.width = 2 * beltWidth;
        beltLeft.width = beltRight.width = beltWidth;
        beltLeft.x = 0;
        beltRight.x = beltWidth;
        for (var i = 0; i < things.length; i++) {
            (function (i) {
                var item = things[i];
                var leafContainer1 = cc.instantiate(self.leafContainer);
                var leafContainer2 = cc.instantiate(self.leafContainer);
                leafContainer1.setPosition(i * itemWidth + offset - beltWidth / 2 + leafWidth / 2, 0);
                leafContainer2.setPosition(i * itemWidth + offset - beltWidth / 2 + leafWidth / 2, 0);
                leafContainer1.tag = leafContainer2.tag = i;
                beltLeft.addChild(leafContainer1);
                beltRight.addChild(leafContainer2);
                cc.loader.load(item.optioncontimg, function (err, tex) {
                    if (!err) {
                        var spriteFrame = new cc.SpriteFrame(tex);
                        var thing1 = leafContainer1.getChildByName('thing'),
                            thing2 = leafContainer2.getChildByName("thing");
                        thing1.tag = thing2.tag = item.optionContent - 0;
                        thing1.__optionID = i + 100;
                        thing2.__optionID = (i + 100) * 2;
                        thing1.originParent = thing1.parent;
                        thing2.originParent = thing2.parent;
                        thing1.getComponent("Thing").gameJS = thing2.getComponent("Thing").gameJS = self;
                        thing1.getComponent(cc.Sprite).spriteFrame = thing2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        cc.loader.releaseAsset(tex);
                    }
                });
            })(i);
        }
    },
    runAnimation: function runAnimation(type, timeout, callback) {
        var monkey = this.monkey,
            bear = this.bear,
            giraffe = this.giraffe,
            frog = this.frog;
        bear.getComponent("sp.Skeleton").setAnimation(0, type, false);
        if (monkey.active && monkey.getChildByName("collisionNode").tag !== -1) {
            monkey.getComponent("sp.Skeleton").setAnimation(0, type, false);
        }
        if (giraffe.active && giraffe.getChildByName("collisionNode").tag !== -1) {
            giraffe.getComponent("sp.Skeleton").setAnimation(0, type, false);
        }
        if (frog.active && frog.getChildByName("collisionNode").tag !== -1) {
            frog.getComponent("sp.Skeleton").setAnimation(0, type, false);
        }
        setTimeout(function () {
            bear.getComponent("sp.Skeleton").setAnimation(0, "stand", true);
            if (giraffe.active && giraffe.getChildByName("collisionNode").tag !== -1) {
                giraffe.getComponent("sp.Skeleton").setAnimation(0, "stand", true);
            }
            if (frog.active && frog.getChildByName("collisionNode").tag !== -1) {
                frog.getComponent("sp.Skeleton").setAnimation(0, "stand", true);
            }
            if (monkey.active && monkey.getChildByName("collisionNode").tag !== -1) {
                monkey.getComponent("sp.Skeleton").setAnimation(0, "stand", true);
            }
            if (typeof callback === 'function') callback();
        }, timeout || 1800);
    },

    tipsHandAnimation: function tipsHandAnimation(timeOut) {
        var _this = this;

        var sourceNode = this.tipsSource = this.beltContainer.getChildByName("beltLeft").children[0];
        var handNode = this.tipsHand;
        handNode.opacity = 0;
        if (sourceNode) {
            this.collideAble = false; //是否可碰撞
            this.updateAble = false;
            var sourseThing = sourceNode.getChildByName('thing');
            setTimeout(function () {
                if (!handNode) return;
                handNode.opacity = 255;
                var targetNode = _this.monkey.getChildByName("collisionNode").tag === sourseThing.tag ? _this.monkey.getChildByName("collisionNode") : _this.frog.getChildByName("collisionNode").tag === sourseThing.tag ? _this.frog.getChildByName("collisionNode") : _this.giraffe.getChildByName("collisionNode");

                var nodePosition = sourceNode.convertToWorldSpaceAR(cc.v2(0, 0));
                nodePosition = _this.scaleNode.convertToNodeSpaceAR(nodePosition);
                var newPosition = targetNode.convertToWorldSpaceAR(cc.v2(0, 0));
                newPosition = _this.scaleNode.convertToNodeSpaceAR(newPosition);

                handNode.x = nodePosition.x + 120;
                handNode.y = nodePosition.y - 110;
                _this.moveThing.x = nodePosition.x;
                _this.moveThing.y = nodePosition.y;
                _this.moveThing.opacity = 255;
                sourseThing.opacity = 0;
                _this.moveThing.tag = sourseThing.tag;
                _this.moveThing.getComponent(cc.Sprite).spriteFrame = sourseThing.getComponent(cc.Sprite).spriteFrame;

                handNode.stopAllActions();
                _this.moveThing.stopAllActions();
                var runTime = 2;
                var move = cc.moveTo(runTime, newPosition.x + 120, newPosition.y - 110);
                handNode.runAction(cc.sequence(move, cc.callFunc(function () {
                    handNode.x = nodePosition.x + 120;
                    handNode.y = nodePosition.y - 110;
                })), _this).repeatForever();

                var move1 = cc.moveTo(runTime, newPosition.x, newPosition.y);
                _this.moveThing.runAction(cc.sequence(move1, cc.callFunc(function () {
                    _this.moveThing.x = nodePosition.x;
                    _this.moveThing.y = nodePosition.y;
                })), _this).repeatForever();
            }, timeOut || 3000);
        }
    },
    stopTipsAnimation: function stopTipsAnimation() {
        this.tipsHand.stopAllActions();
        this.moveThing.stopAllActions();
        this.tipsHand.removeFromParent();
        this.tipsHand = null;
        this.moveThing.opacity = 0;
        this.updateAble = true;
        this.collideAble = true; //是否可碰撞
        this.tipsNode.removeFromParent();
        this.tipsNode = null;
        !this.isIts && this.showSchedule();
        var isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        isTotalCd && (this.lastAnswerTime = this.answerTime);
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
        var _this2 = this;

        setTimeout(function () {
            _this2.feedbackFinish();
        }, 1000);
    },
    //游戏结束总反馈
    gameOverSettlement: function gameOverSettlement() {
        var totalNum = this.answerInfoArr.length;
        var rightNum = 0.0;
        this.answerInfoArr.forEach(function (obj, idx) {
            if (obj.answerStatus === '1') {
                rightNum += 1;
            }
        }, this);
        if (rightNum / totalNum >= 0.8) {
            if (CONSOLE_LOG_OPEN) cc.log('>=0.8');
            AUDIO_OPEN && this.playWinAudio();
            this.settlementJs.playWinAnim();
        } else if (rightNum / totalNum >= 0.6) {
            if (CONSOLE_LOG_OPEN) cc.log('>=0.6');
            AUDIO_OPEN && this.playLoseAudio();
            this.settlementJs.playTwoStarAnim();
        } else {
            if (CONSOLE_LOG_OPEN) cc.log('<0.6');
            AUDIO_OPEN && this.playLoseAudio();
            this.settlementJs.playLoseAnim();
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
    /* 再来一次 */
    resetClicked: function resetClicked() {
        var _this3 = this;

        var cb = function cb() {
            var array = _this3.option_node.children;
            array.forEach(function (obj, idx) {
                var optionJS = obj.getComponent('OptionJS');
                optionJS && optionJS.reloadState();
            }, _this3);
        };
        this.playCancelAudio();

        if (this.isShowFeed || this.isShowAnim) {
            return;
        }

        cb();
    },
    /* 确认 */
    confirmClicked: function confirmClicked() {
        var _this4 = this;

        var cb = function cb() {
            var array = _this4.option_node.children;
            var isEqual = true;
            array.forEach(function (obj, idx) {
                var optionJS = obj.getComponent('OptionJS');
                if (_this4.rightAry.indexOf(idx.toString()) != -1) {
                    if (optionJS && optionJS.state != 2) {
                        isEqual = false;
                    }
                } else {
                    //错误区为正确时
                    if (optionJS && optionJS.state == 2) {
                        isEqual = false;
                    }
                }
            }, _this4);

            _this4.selectAnswer(isEqual);
        };
        this.playCancelAudio();
        //this.isShowAnim
        if (this.isShowFeed || this.checkIsEmpty()) {
            return;
        }

        cb();
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
    playRightAudio: function playRightAudio() {
        this.playAudio(this.rightAudio);
    }
}, _defineProperty(_cc$Class, 'playRightAudio', function playRightAudio() {
    this.playAudio(this.wrongAudio);
}), _defineProperty(_cc$Class, 'playCarMoveAudio', function playCarMoveAudio() {
    this.playAudio(this.carMoveAudio);
}), _defineProperty(_cc$Class, 'playFlyStarAudio', function playFlyStarAudio() {
    this.playAudio(this.flyStarAudio);
}), _defineProperty(_cc$Class, 'BasicAni', function BasicAni() {
    //倒计时回调
    var BasinCallbackFunc = function BasinCallbackFunc() {
        var basincb = function basincb() {
            if (this.isShowFeed) {
                return;
            }
            if (CONSOLE_LOG_OPEN) console.log('gagagagga');
            this.playBasinAudio();
        };
        return basincb;
    };

    this.unschedule(this.basinCallback);
    this.basinCallback = BasinCallbackFunc();
    var question = this.questionArr[this.nowQuestionID];
    this.schedule(this.basinCallback, question.gap ? parseInt(question.gap) : 40);
}), _defineProperty(_cc$Class, 'playBasinAudio', function playBasinAudio() {
    //this.playAudio(this.basinAudio);
    var question = this.questionArr[this.nowQuestionID];

    question.cndybasinAudio && cc.loader.load(question.cndybasinAudio, function (err, audio) {
        if (!err) {
            cc.audioEngine.play(audio, false, 1);
            cc.loader.releaseAsset(audio);
        }
    });
}), _defineProperty(_cc$Class, 'playBGMAudio', function playBGMAudio() {
    var self = this;
    var question = this.questionArr[this.nowQuestionID];

    question.bgm_candyAudio && cc.loader.load(question.bgm_candyAudio, function (err, audio) {
        if (!err) {
            cc.audioEngine.play(audio, true, 1);
            cc.loader.releaseAsset(audio);
        }
    });
}), _defineProperty(_cc$Class, 'playAudio', function playAudio(audio) {
    if (AUDIO_OPEN) {
        cc.audioEngine.play(audio, false, 1);
    }
}), _defineProperty(_cc$Class, 'update', function update() {
    try {
        if (this.updateAble && this.questionArr.length > 0) {
            var question = this.questionArr[this.nowQuestionID];
            var viewWidth = cc.winSize.width;
            var beltLeft = this.beltContainer.getChildByName("beltLeft");
            var beltRight = this.beltContainer.getChildByName("beltRight");
            if (this.beltContainer.x > -3 * beltLeft.width / 2 + viewWidth / 2) {
                this.beltContainer.x -= question.belt.moveSpeed;
            } else {
                this.beltContainer.x = -(beltLeft.width - viewWidth) / 2 - question.belt.moveSpeed;
                var beltLeftPos = beltLeft.getPosition();
                beltLeft.x = beltRight.x;
                beltRight.x = beltLeftPos.x;
            }
        }
    } catch (e) {
        // console.warn(e);
    }
}), _cc$Class));

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GameJS.js.map
        