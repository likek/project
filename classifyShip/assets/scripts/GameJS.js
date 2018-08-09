var BaseGameJS = require("BaseGameJS");

cc.Class({
    extends: BaseGameJS,

    properties: {
        optionItem_pref: cc.Prefab, //选项预制
        settlePrefab: cc.Prefab,
        resetBtnNSF: cc.SpriteFrame,
        commitBtnNSF: cc.SpriteFrame, //备选

        beltContainer:cc.Node,
        leafContainer:cc.Prefab,
        progress:cc.Node,
        backBtn:cc.Node,
        tipsHand:cc.Node,

        giraffe:cc.Node,
        frog:cc.Node,
        monkey:cc.Node,
        bear:cc.Node,
        flowerAndWater:cc.Node,

        winAudio: cc.AudioClip,
        loseAudio: cc.AudioClip,
        resetAudio: cc.AudioClip,
        optionAudio: cc.AudioClip,
        option_outAudio: cc.AudioClip,
        carMoveAudio: cc.AudioClip,
        flyStarAudio: cc.AudioClip,
        timeUpAudio: cc.AudioClip,
        oneStarAudio: cc.AudioClip,
        twoStarAudio:cc.AudioClip,
        threeStarAudio: cc.AudioClip,
        timuAudio: cc.AudioClip,
    },
    onLoadChild: function () {
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
    initToast: function () {
        var efailed = this.node.getChildByName('scale').getChildByName('efailed');
        this.efailedJs = efailed.getComponent('efailed');
        this.efailedJs.game = this;
    },
    tipsClick: function () {
        
    },
    initFeedback: function () {
        this.settlement = cc.instantiate(this.settlePrefab);
        this.settlementJs = this.settlement.getComponent('settlement');
        this.settlementJs.game = this;
        var feedbackNode = this.node.getChildByName('feedback_node');
        feedbackNode.addChild(this.settlement);
        this.settlement.active = false;
    },
    //转到后台
    gotoBackground: function () {
        let submitButton = this.node.getChildByName('button_node').getChildByName('commit'),
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

        this.updateAble = false;//停止帧动画
        ;
        for(let i = 0; i<this.beltNode.children.length;i++){
            let obj = this.beltNode.children[i];
            obj.getComponent('Thing').resetPosition();
        }

    },
    //转到前台
    gotoForeground: function(){
        if(!this.tipsNode){//如果引导结束了
            this.updateAble = true;
        }
    },

    /*超时处理 
     */
    timeout: function () {
        this.progress.getComponent("ProgressJs").setStarTypeByIndex(this.nowQuestionID,2);
        this.settlementJs.playTimeUpAnim();
        this.playTimeUpAudio();
    },

    //移除当前所有选项
    deleteOption: function () {
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
    createOption: function (optionsArr) {
       
    },

    //开始加载选项
    startloadOption: function () {
        this.updateGameState(true);
        this.isIts && this.questionNumListJS.changeOptionDisable();
        var question = this.questionArr[this.nowQuestionID];
        //启动业务初始化
        // this.prompt_nodeJS.setTitle(question.qescont, null);

        //正确答案
        this.rightOptionNo = question.rightOptionNo;
        // this.createOption(question.optionsArr);
        //倒计时
        let isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        if (this.nowQuestionID === 0 && isTotalCd || !isTotalCd) {
            this.answerTime = 0;
            let countDown = parseInt(question.interactiveJson['countDown']);
            if (countDown > 0) {
                this.countDown = countDown;
            }

            this.timeLabel.string = this.timeFormat(this.countDown);
        }
        this.isIts && this.questionNumListJS.changeOptionEnable();
        this.isShowFeed = false;
        this.changeMoveTag(0);
        //出现走了选中isShowFeed=yes,reloadState还没走.
        this.initBeltContainer(question.belt,question.optionsArr);//传送带及选项初始化
        this.flowerAndWater.zIndex = this.time_node.zIndex = this.progress.zIndex  = -2;
        //
        this.monkey.active = question.monkey.isShow;
        this.frog.active = question.frog.isShow;
        this.giraffe.active = question.giraffe.isShow;
        // this.moveThing.opacity = 0;//touchEnd

        this.monkey.getChildByName("collisionNode").tag = question.monkey.isShow ? 3:-1;
        this.frog.getChildByName("collisionNode").tag = question.frog.isShow ? 1 : -1;
        this.giraffe.getChildByName("collisionNode").tag = question.giraffe.isShow ? 2:-1;
        this.monkey.getChildByName("collisionNode").active = this.frog.getChildByName("collisionNode").active = this.giraffe.getChildByName("collisionNode").active = true;
        this.runAnimation("in",3000);
        this.flowerAndWater.getComponent("sp.Skeleton").setAnimation(0,"stand",true);

        if(!this.__progressHasInit){
            this.progress.getComponent("ProgressJs").init(this.questionArr.length);
            this.__progressHasInit = true;
        }

        this.beltNode.removeAllChildren();
        this.collideAble = false;
        this.updateAble = true;
        this.currTouchOption = null;
        // this.moveThing.opacity = 0;
        if (this.nowQuestionID > 0) {
            !this.isIts && this.showSchedule();
            isTotalCd && (this.lastAnswerTime = this.answerTime);
        }else{
            this.tipsHandAnimation();
        }
    },

    initBeltContainer:function(beltData,things){
        var self = this;
        var beltLeft = this.beltContainer.getChildByName("beltLeft");
        var beltRight = this.beltContainer.getChildByName("beltRight");
        beltLeft.removeAllChildren();
        beltRight.removeAllChildren();
        
        var minOffset = 10;
        var viewWidth = cc.winSize.width;
        var itemWidth = viewWidth/things.length;
        var leafWidth = this.leafContainer.data.width;
        var offset = itemWidth - leafWidth;
        var beltWidth = viewWidth;

        if(offset < minOffset){
            itemWidth = minOffset*2 + leafWidth;
            offset = minOffset;
            beltWidth = itemWidth * things.length;
            this.beltContainer.x = (beltWidth - viewWidth)/2;
        }
        this.beltContainer.width = 2*beltWidth;
        beltLeft.width = beltRight.width = beltWidth;
        beltLeft.x = 0;
        beltRight.x = beltWidth;
        for(var i = 0;i<things.length;i++){
            (function(i){
                var item = things[i];
                var leafContainer1 = cc.instantiate(self.leafContainer);
                var leafContainer2 = cc.instantiate(self.leafContainer);
                leafContainer1.setPosition(i*itemWidth + offset - beltWidth/2 + leafWidth/2,0);
                leafContainer2.setPosition(i*itemWidth + offset - beltWidth/2 + leafWidth/2,0);
                leafContainer1.tag = leafContainer2.tag = i;
                beltLeft.addChild(leafContainer1);            
                beltRight.addChild(leafContainer2);  
                cc.loader.load(item.optioncontimg,function(err,tex){
                    if(!err){
                        var spriteFrame = new cc.SpriteFrame(tex);
                        var thing1 = leafContainer1.getChildByName('thing'),thing2 = leafContainer2.getChildByName("thing");
                        thing1.tag = thing2.tag = item.optionContent - 0;
                        thing1.__optionID = i+100;
                        thing2.__optionID = (i + 100)*2;
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
    runAnimation(type,timeout,callback){
        var monkey = this.monkey,bear = this.bear,giraffe = this.giraffe,frog = this.frog;
        bear.getComponent("sp.Skeleton").setAnimation(0,type,false);
        if(monkey.active && monkey.getChildByName("collisionNode").tag !==-1){
            monkey.getComponent("sp.Skeleton").setAnimation(0,type,false);
        }
        if(giraffe.active && giraffe.getChildByName("collisionNode").tag !==-1){
            giraffe.getComponent("sp.Skeleton").setAnimation(0,type,false);
        }
        if(frog.active && frog.getChildByName("collisionNode").tag !==-1){
            frog.getComponent("sp.Skeleton").setAnimation(0,type,false);
        }
        setTimeout(function(){
            bear.getComponent("sp.Skeleton").setAnimation(0,"stand",true);
            if(giraffe.active && giraffe.getChildByName("collisionNode").tag !==-1){
                giraffe.getComponent("sp.Skeleton").setAnimation(0,"stand",true);
            }
            if(frog.active && frog.getChildByName("collisionNode").tag !==-1){
                frog.getComponent("sp.Skeleton").setAnimation(0,"stand",true);
            }
            if(monkey.active && monkey.getChildByName("collisionNode").tag !==-1){
                monkey.getComponent("sp.Skeleton").setAnimation(0,"stand",true);
            }
            if(typeof callback === 'function')callback();
        },timeout||1800);
    },
    tipsHandAnimation:function(timeOut){
        var sourceNode = this.tipsSource = this.beltContainer.getChildByName("beltLeft").children[0];
        let handNode = this.tipsHand;
        handNode.opacity = 0;
        if(sourceNode){
            this.collideAble = false;//是否可碰撞
            this.updateAble = false;
            var sourseThing = sourceNode.getChildByName('thing');
            setTimeout(()=>{
                if(!handNode)return;
                handNode.opacity = 255;
                let targetNode = this.monkey.getChildByName("collisionNode").tag === sourseThing.tag ? this.monkey.getChildByName("collisionNode") : (this.frog.getChildByName("collisionNode").tag === sourseThing.tag? this.frog.getChildByName("collisionNode") : this.giraffe.getChildByName("collisionNode"));

                var nodePosition = sourceNode.convertToWorldSpaceAR(cc.v2(0, 0));
                nodePosition = this.scaleNode.convertToNodeSpaceAR(nodePosition);
                var newPosition = targetNode.convertToWorldSpaceAR(cc.v2(0,0));
                newPosition = this.scaleNode.convertToNodeSpaceAR(newPosition);

                handNode.x = nodePosition.x + 120;
                handNode.y = nodePosition.y - 110;

                handNode.stopAllActions();
                var runTime = 2;
                var move = cc.moveTo(runTime,newPosition.x + 120,newPosition.y - 110);
                handNode.runAction(cc.sequence(move,cc.callFunc(()=>{
                    handNode.x = nodePosition.x + 120;
                    handNode.y = nodePosition.y - 110;
                })),this).repeatForever();
            },timeOut||3000);
        }
    },
    stopTipsAnimation: function(){
        this.tipsHand.stopAllActions();
        this.tipsHand.removeFromParent();
        this.tipsHand = null;
        this.updateAble = true;
        this.collideAble = true;//是否可碰撞
        this.tipsNode.removeFromParent();
        this.tipsNode = null;
        !this.isIts && this.showSchedule();
        let isTotalCd = this.questionArr[0].interactiveJson.totalcd;
        isTotalCd && (this.lastAnswerTime = this.answerTime); 
    },
    //选中答案
    selectAnswer: function (isRight) {
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
    showFeedback: function (type) {
        setTimeout(()=>{
            this.feedbackFinish();
        },1000);
    },
    //游戏结束总反馈
    gameOverSettlement: function() {
        let totalNum = this.answerInfoArr.length;
        let rightNum = 0.0;
        this.answerInfoArr.forEach((obj, idx)=> {
           if (obj.answerStatus === '1'){
                rightNum+= 1;
           }
        },this);
        if(rightNum/totalNum >=0.8){
            if (CONSOLE_LOG_OPEN) cc.log('>=0.8');
            AUDIO_OPEN && this.playThreeStarAudio();
            this.settlementJs.playWinAnim();
        }else if (rightNum/totalNum >=0.6){
            if (CONSOLE_LOG_OPEN) cc.log('>=0.6');
            AUDIO_OPEN && this.playTwoStarAudio();
            this.settlementJs.playTwoStarAnim();

        }else{
            if (CONSOLE_LOG_OPEN) cc.log('<0.6');
            AUDIO_OPEN && this.playOneStarAudio();
            this.settlementJs.playLoseAnim();

        }
    },
    updateGameState: function (interactable) {
        if (interactable) {
            this.question_node.resumeSystemEvents(true);
            this.option_node.resumeSystemEvents(true);
        } else {
            this.question_node.pauseSystemEvents(true);
            this.option_node.pauseSystemEvents(true);

        }
    },
    
    otherClicked: function () {
        this.playCancelAudio();
        if (this.isShowFeed) {
            return;
        }
    },
    /* 再来一次 */
    resetClicked: function () {
        let cb = () => {
            let array = this.option_node.children;
            array.forEach((obj, idx) => {
                let optionJS = obj.getComponent('OptionJS');
                optionJS && optionJS.reloadState();
            }, this);

        };
        this.playCancelAudio();

        if (this.isShowFeed || this.isShowAnim) {
            return;
        }

        cb();
    },
    /* 确认 */
    confirmClicked: function () {

        let cb = () => {
            let array = this.option_node.children;
            let isEqual = true;
            array.forEach((obj, idx) => {
                let optionJS = obj.getComponent('OptionJS');
                if (this.rightAry.indexOf(idx.toString()) != -1) {
                    if (optionJS && optionJS.state != 2) {
                        isEqual = false;
                    }
                } else { //错误区为正确时
                    if (optionJS && optionJS.state == 2) {
                        isEqual = false;
                    }
                }
            }, this);

            this.selectAnswer(isEqual);
        };
       this.playCancelAudio();
        //this.isShowAnim
        if (this.isShowFeed || this.checkIsEmpty()) {
            return;
        }

        cb();
    },
    checkIsEmpty: function () {
        let array = this.option_node.children;
        let isEmpty = true;
        array.forEach((obj, idx) => {
            let optionJS = obj.getComponent('OptionJS');
            //正确区不为正确时
            if (optionJS && optionJS.state > 1) {
                isEmpty = false;
            }
        }, this);
        return isEmpty;
    },
    playWinAudio: function () {
        this.playAudio(this.winAudio);
    },
    playLoseAudio: function () {
        this.playAudio(this.loseAudio);
    },
    playCancelAudio: function () {
        this.playAudio(this.resetAudio);
    },
    playOptionAudio: function () {
        this.playAudio(this.optionAudio);
    },
    playOptionOutAudio: function () {
        this.playAudio(this.option_outAudio);
    },
    playCarMoveAudio:function(){
        this.playAudio(this.carMoveAudio);
    },
    playFlyStarAudio:function(){
        this.playAudio(this.flyStarAudio);
    },
    playTimeUpAudio:function(){
        this.playAudio(this.timeUpAudio);
    },
    playOneStarAudio:function(){
        this.playAudio(this.oneStarAudio);
    },
    playTwoStarAudio:function(){
        this.playAudio(this.twoStarAudio);
    },
    playThreeStarAudio:function(){
        this.playAudio(this.threeStarAudio);
    },
     /* 循环规则音,点击后重置 */
     BasicAni: function () {
        //倒计时回调
        let BasinCallbackFunc = function () {
            var basincb = function () {
                if (this.isShowFeed) {
                    return;
                }
                if (CONSOLE_LOG_OPEN) console.log('gagagagga');
                this.playBasinAudio();
            }
            return basincb;
        }

        this.unschedule(this.basinCallback);
        this.basinCallback = BasinCallbackFunc();
        var question = this.questionArr[this.nowQuestionID];
        this.schedule(this.basinCallback, question.gap?parseInt(question.gap):40);
    },
    playTimuAudio: function () {
        var self = this;
        let audio = cc.audioEngine.play(this.timuAudio, false, 1);
        cc.audioEngine.setFinishCallback(audio, function () {
            cc.audioEngine.stop(audio);
            self.playBasinAudio();
        })
    },
    playBasinAudio: function () {
        //this.playAudio(this.basinAudio);
        var question = this.questionArr[this.nowQuestionID];

        question.cndybasinAudio && cc.loader.load(question.cndybasinAudio, function (err, audio) {
            if (!err) {
                cc.audioEngine.play(audio, false, 1);
                cc.loader.releaseAsset(audio);
            }
        });
    },
    playBGMAudio: function () {
        var self = this;
        var question = this.questionArr[this.nowQuestionID];

        question.bgm_candyAudio && cc.loader.load(question.bgm_candyAudio, function (err, audio) {
            if (!err) {
                cc.audioEngine.play(audio, true, 1);
                cc.loader.releaseAsset(audio);
            }
        });
    }, //播放音效
    //播放音效
    playAudio: function (audio) {
        if (AUDIO_OPEN) {
            cc.audioEngine.play(audio, false, 1);
        }
    },

    update:function(){
        try{
            if(this.updateAble && this.questionArr.length>0){
                var question = this.questionArr[this.nowQuestionID];
                var viewWidth = cc.winSize.width;
                var beltLeft = this.beltContainer.getChildByName("beltLeft");
                var beltRight = this.beltContainer.getChildByName("beltRight");
                if(this.beltContainer.x > -3 * beltLeft.width/2 + viewWidth/2){
                    this.beltContainer.x -= question.belt.moveSpeed;
                }else{
                    this.beltContainer.x = -(beltLeft.width - viewWidth)/2  - question.belt.moveSpeed;
                    var beltLeftPos = beltLeft.getPosition();
                    beltLeft.x = beltRight.x;
                    beltRight.x = beltLeftPos.x;
                }
            }
        }catch(e){
            // console.warn(e);
        }
    }

});