var BaseGameJS = require("BaseGameJS");

cc.Class({
    extends: BaseGameJS,

    properties: {
        grasslandSprite: cc.Sprite,//草地
        nightBG: cc.Node,//晚景
        lightSprite: cc.Sprite,//灯
        Lamplight: cc.Node,//灯光
        questionSprite: cc.Sprite,//题框

        sources: cc.Node,//背景资源

        questionLabel: cc.Label,

        ruler: cc.Node,
        scalePref: cc.Prefab,

        showProgress: cc.Node,

        optionNode: cc.Node,

        frog: cc.Node,

        snail: cc.Node,
    },

    // use this for initialization
    onLoadChild: function () {
        this.isShowFeed = true;

        this.snailStartY = this.snail.y;
        this.snailStartX = this.snail.x;//add

        this.sourcesJs = this.sources.getComponent('Sources');
    },

    //刻度展示
    createScale: function (scale) {
        var scaleInt = parseInt(scale);

        if (this.ruler.childrenCount > 0) {
            if (this.ruler.childrenCount != scaleInt + 1) {
                this.ruler.removeAllChildren();
            } else {
                return;
            }
        }

        var spacingY = this.ruler.getComponent(cc.Layout).spacingY;
        if (scaleInt > 0) {
            spacingY = (this.ruler.height - 10 * (scaleInt + 1)) / scaleInt;
            this.ruler.getComponent(cc.Layout).spacingY = spacingY;
        }

        for (var index = 0; index <= scaleInt; index++) {
            var scale = cc.instantiate(this.scalePref);
            scale.tag = index + 100;
            scale.getChildByName('Number').getComponent(cc.Label).string = index + 'm';
            this.ruler.addChild(scale);
        }
    },

    //改变刻度颜色
    changeScaleColor: function (startInt) {
        for (var index = 0; index < this.ruler.childrenCount; index++) {
            var scale = this.ruler.getChildByTag(index + 100);
            if (index <= startInt) {
                scale.getChildByName('Number').color = new cc.Color(0, 255, 48);
            } else {
                scale.getChildByName('Number').color = new cc.Color(188, 214, 243);
            }
        }
    },

    setStepLength: function (startInt) {
        this.stepLength = this.ruler.getComponent(cc.Layout).spacingY + 10;
        this.showProgress.height = 10 + startInt * this.stepLength;

        if (startInt >= 0) {
            this.snail.y = this.snailStartY + this.showProgress.height;
            this.snail.x = this.snailStartX;//add

        }
    },

    //移除当前所有选项
    deleteOption: function () {
    },

    //创建选项按钮
    createOption: function (optionsArr) {
        var type = this.nowQuestionID % 2;
        var spriteFrame = this.sourcesJs.chong1;
        if (type == 1) {
            spriteFrame = this.sourcesJs.chong2;
        }
        for (var index = 0; index < this.optionNode.childrenCount; index++) {
            var element = this.optionNode.children[index];

            element.getComponent('OptionClick').init(this, optionsArr[index], spriteFrame);
        }
    },

    //选项走
    goOption: function () {
        for (var index = 0; index < this.optionNode.childrenCount; index++) {
            var element = this.optionNode.children[index];

            element.getComponent('OptionClick').goAnim();
        }
    },

    //开始加载选项
    startloadOption: function () {
        this.changeBGAnim(false);

        this.frog.getComponent(cc.Animation).stop();

        this.frog.getComponent(cc.Sprite).spriteFrame = this.sourcesJs.frogNomal;

        // this.frog.getChildByName('yan_you').scale = 0;
        // this.frog.getChildByName('yan_zuo').scale = 0;
        // this.frog.getChildByName('yan_zhong').scale = 0;

        this.answerTime = 0;

        this.answerContext = '';

        this.isIts && this.questionNumListJS.changeOptionDisable();

        var question = this.questionArr[this.nowQuestionID];

        this.questionLabel.string = question.qescont;

        this.rightOptionNo = question.rightOptionNo;

        var interactiveJson = question.interactiveJson;
        //蜗牛爬行动作集
        this.snailAnimArr = interactiveJson.snail;

        this.createScale(interactiveJson.scale);

        var startInt = parseInt(interactiveJson.start);
        this.changeScaleColor(startInt);

        this.setStepLength(startInt);

        this.createOption(question.optionsArr);

        this.snail.getComponent(cc.Animation).play('SnailStart');

        //倒计时
        var countDown = interactiveJson.countDown;

        this.setCountDown(countDown);        

        this.scheduleOnce(function () {
            !this.isIts && this.showSchedule(countDown);
            this.isIts && this.questionNumListJS.changeOptionEnable();
            this.isShowFeed = false;
        }, 1.72);
    },

    //选中答案
    selectAnswer: function (answer) {
        //显示状态过程中不接收事件
        if (this.isShowFeed || this.isShowLossTime) {
            return 0;
        }
        this.isShowFeed = true;

        //取消定时器
        this.unschedule(this.timeCallback);

        this.answerContext = answer;

        var animName = 'Tongue_' + answer;

        //张嘴、伸舌头动画
        this.frog.getComponent(cc.Animation).play();
        this.frog.getChildByName('tongue').getComponent(cc.Animation).play(animName);

        var isRight = (this.rightOptionNo === answer);

        if (isRight) {
            if (CONSOLE_LOG_OPEN) console.log('答对了');

            if (this.sourcesJs.rightAudio) {
                cc.audioEngine.play(this.sourcesJs.rightAudio, false, 1);
            }
            //选项跑了
            this.goOption();

            this.createAnswerInfo('1');

            this.scheduleOnce(function () {
                this.feedbackRunAnim(1, 1);
            }, 0.6);

            return 1;
        } else {
            if (CONSOLE_LOG_OPEN) console.log('答错了');

            if (this.sourcesJs.wrongAudio) {
                cc.audioEngine.play(this.sourcesJs.wrongAudio, false, 1);
            }

            this.createAnswerInfo('2');

            this.scheduleOnce(function () {
                this.feedbackRunAnim(2, 2);
            }, 0.6);

            return 2;
        }
    },

    //时间到
    noticeTimeOver: function () {
        this.createAnswerInfo('2');

        this.feedbackRunAnim(3, 2);
    },

    //show反馈与动画反馈
    feedbackRunAnim: function (feedbackType, runType) {
        this.runType = runType;
        //如果不是第一次同步执行龟动画，如果是第一次，则先执行小鱼入场动画，小鱼入场完成后执行龟动画
        if (this.nowQuestionID != 0) {
            //执行同步动画
            this.changeFrogAnim();
        }
        this.showFeedback(feedbackType);
    },

    //小鱼入场完成-自动执行反馈
    firstFeedbackFinish: function () {
        //第一次进场完成后执行同步动画
        this.changeFrogAnim();
    },

    //切换青蛙动画
    changeFrogAnim: function () {
        if (this.runType == 1) {
            this.frog.getComponent(cc.Sprite).spriteFrame = this.sourcesJs.frogRight;
            this.snailOutClimbAnim();
        } else {
            // this.frog.getComponent(cc.Sprite).spriteFrame = this.sourcesJs.frogWrong;
            this.frog.getComponent(cc.Animation).play('FrogWrong');

            this.snailInAnim();
        }
    },
    //蜗牛出壳
    snailOutClimbAnim: function () {
        this.snail.getComponent(cc.Animation).play('SnailOut');
        this.scheduleOnce(function () {
            this.snailClimbAnim();
        }, 0.76);
    },
    //蜗牛进壳
    snailInAnim: function () {
        // this.snail.getComponent(cc.Animation).play('SnailIn');
        // this.frog.getChildByName('yan_you').runAction(cc.sequence(
        //     cc.scaleTo(0.24, 1.3),
        //     cc.scaleTo(0.12, 1)
        // ));
        // this.frog.getChildByName('yan_zuo').runAction(cc.sequence(
        //     cc.scaleTo(0.24, 1.3),
        //     cc.scaleTo(0.12, 1)
        // ));
        // this.frog.getChildByName('yan_zhong').runAction(cc.sequence(
        //     cc.scaleTo(0.24, 1.3),
        //     cc.scaleTo(0.12, 1)
        // ));

        this.scheduleOnce(function () {
            this.snail.y = this.snailStartY;

            this.showProgress.height = 10;
            this.changeScaleColor(0);
        }, 0.84);

        this.scheduleOnce(function () {
            this.nowQuestionFinish();
        }, 2.12);
    },
    //爬行动画
    snailClimbAnim: function () {
        this.snail.getComponent(cc.Animation).play('SnailClimb');
        //爬行动作
        this.snailClimbAction(0);
    },
    //蜗牛爬行动作
    snailClimbAction: function (number) {
        this.startChangeProgress = false;

        if (this.snailAnimArr.length > number) {
            var snailAnim = this.snailAnimArr[number].split(',');

            this.startChangeProgress = true;

            var callFunc = cc.callFunc(function () {
                this.snailClimbAction(number + 1);
            }, this);
            this.snailRunAction(snailAnim[0], snailAnim[1], callFunc);
        } else {
            this.snail.getComponent(cc.Animation).stop();

            this.scheduleOnce(function () {
                this.nowQuestionFinish();
            }, 1.5);
        }
    },
    //蜗牛执行动作
    snailRunAction: function (style, step, callFunc) {
        if (style == 1) {
            this.changeBGAnim(false);

            this.snail.runAction(cc.sequence(
                cc.moveBy(step * 1, cc.p(0, this.stepLength * step)),
                callFunc,
            ));
        } else if (style == 2) {
            this.changeBGAnim(true);

            this.snail.runAction(cc.sequence(
                cc.moveBy(step * 1, cc.p(0, - this.stepLength * step)),
                callFunc,
            ));
        } else {
            this.snail.runAction(cc.sequence(
                cc.moveTo(1, cc.p(this.snail.x, 100)),
                cc.rotateTo(0.01, -90),
                cc.moveTo(2, cc.p(this.snail.x - 200, 100)),
                callFunc,
            ));
            this.frog.getComponent(cc.Sprite).spriteFrame = this.sourcesJs.fronBody;

            this.frog.getChildByName('Hand_L').getComponent(cc.Animation).play();
            this.frog.getChildByName('Hand_R').getComponent(cc.Animation).play();
        }
    },

    //切换白天黑夜
    changeBGAnim: function (toNight) {
        if (toNight) {
            this.nightBG.runAction(cc.sequence(
                cc.fadeTo(0.5, 255),
                cc.callFunc(function () {
                    this.changeBG(toNight);
                }, this),
            ));
        } else {
            this.nightBG.runAction(cc.sequence(
                cc.callFunc(function () {
                    this.changeBG(toNight);
                }, this),
                cc.fadeTo(0.5, 0),
            ));
        }
    },

    //切换背景
    changeBG: function (toNight) {
        if (toNight) {
            this.grasslandSprite.spriteFrame = this.sourcesJs.lawnNightTex;

            this.lightSprite.spriteFrame = this.sourcesJs.lightNightTex;
            this.Lamplight.active = true;

            this.questionSprite.spriteFrame = this.sourcesJs.questionNightTex;
        } else {
            this.grasslandSprite.spriteFrame = this.sourcesJs.lawnTex;

            this.lightSprite.spriteFrame = this.sourcesJs.lightTex;
            this.Lamplight.active = false;

            this.questionSprite.spriteFrame = this.sourcesJs.questionTex;
        }
    },

    update: function () {
        if (this.startChangeProgress) {
            var height = Math.abs(this.snailStartY - this.snail.y);

            if (height === 0) {
                this.showProgress.height = 0;
                this.changeScaleColor(0);
            } else if (height <= 640) {
                this.showProgress.height = height;
                this.changeScaleColor(Math.round(this.showProgress.height / this.stepLength));
            }
        }
    },

    onDestroy: function () {
        cc.audioEngine.uncacheAll();
    },
});