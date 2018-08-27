var BaseGameJS = require("BaseGameJS");
let TIME_TYPE_COUNTUP = 'countUp';
let TIME_TYPE_COUNTDOWN = 'countDown';
let TIME_TYPE_TOTAL_COUNTDOWN = 'totalCountDown';
cc.Class({
    extends: BaseGameJS,

    properties: {
        settlePrefab: cc.Prefab,
        tipsPrefab: cc.Prefab,
    
        btnAudio: {
            url: cc.AudioClip,
            default: null
        },
        failAudio: {
            url: cc.AudioClip,
            default: null
        },
        winAudio: {
            url: cc.AudioClip,
            default: null
        },
        touchB: {
            url: cc.AudioClip,
            default: null
        },
        touchC: {
            url: cc.AudioClip,
            default: null
        },
        bgAudio: {
            url: cc.AudioClip,
            default: null
        },
        titleAudio: {
            url: cc.AudioClip,
            default: null
        },
        timeOutAudio: {
            url: cc.AudioClip,
            default: null
        },

        juiceAudio: {
            url: cc.AudioClip,
            default: null
        },
        queAudio: {
            url: cc.AudioClip,
            default: null
        },

        progressAudio: {
            url: cc.AudioClip,
            default: null
        },
        star1: {
            url: cc.AudioClip,
            default: null
        },

        star2: {
            url: cc.AudioClip,
            default: null
        },

        star3: {
            url: cc.AudioClip,
            default: null
        },

        
        playAudioKey: true,
    },

    // use this for initialization
    onLoadChild: function () {
        this._super();


        this.touchHandlerJs = this.node.getComponent('touchHandler');
        this.tipsNode = this.node.getChildByName('tips_node');


        // 选项 
        this.optionNode = this.node.getChildByName('option_node');
        this.questionNode = this.node.getChildByName('question_node');
        
        this.optionsJs =  this.optionNode.getChildByName('options').getComponent('OptionJs');
        this.optionsJs.game = this;
        this.touchHandlerJs = this.node.getComponent('touchHandler');
        this.touchHandlerJs.game = this ;
        // 
        this.QuestionJs = this.questionNode.getComponent('QuestionJs');
        this.QuestionJs.game = this;

        this.progress = this.node.getChildByName('progressNode');
        this.ProgressJs = this.progress.getComponent('ProgressJs');
        this.ProgressJs.game = this;
        
        this.commitBtn = this.node.getChildByName('commitBtn')
        this.isFinishTips = false  //是否完成引导 
        this.AudioArray = {
            "failAudio" : this.failAudio, //单题对
            "winAudio" : this.winAudio, //单体错
            "touchB" : this.touchB,
            "touchC" : this.touchC,                                                               
            "timeOutAudio" : this.timeOutAudio,
            "juice" : this.juiceAudio,    
            "titleAudio" : this.titleAudio,    
            "queAudio" : this.queAudio,    
            "btnAudio" : this.btnAudio,    
            "progressAudio" : this.progressAudio,    //飞行音效
            "star1" : this.star1,    //飞行音效
            "star2" : this.star2,    //飞行音效
            "star3" : this.star3,    //飞行音效

        }


        cc.game.on(cc.game.EVENT_HIDE, function(event){
            this.gotoBackground();
            cc.director.pause();
            cc.game.pause();

            console.log('app just resign active.');
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, function(event){
            if (cc.game.isPaused) {
                cc.game.resume();
            }
            if (cc.director.isPaused) {
                cc.director.resume();
            }
            this.gotoForeground();
            console.log('app just become active.');
        }, this);
        //tips 事件处理
        this.node.on('tipsCommit', function(){
            this.commitBtn.active = true 
            this.tipsNode.active = true 
            if (this.tipsJs) {
                this.tipsJs.setBtnHands(this.commitBtn.position)
            }
        }, this);
        this.isPlayAudio = true // 20秒后是否播放音效
        // 20秒没操作播放一次题目音效
        //答案存储
        this.rightData = []
    
    },


    //加载成功后回调
    playAudioEvent:function () {

        this.scheduleOnce(function(){
            var question = this.questionArr[this.nowQuestionID];
            if (question!= null && question!= "") {
                cc.loader.load(question.qescontsound, function (err, audio) {
                    if (!err) {
                         cc.audioEngine.play(audio, true, 1);
                         cc.loader.releaseAsset(audio);
                    }
                 });
            }
    
            this.titleAudioId = this.playAudioById("titleAudio")
            let self = this
            cc.audioEngine.setFinishCallback(this.titleAudioId, function () {
                if (!self.noPlayQueAudio) {
                    self.queAudio =  self.playAudioById("queAudio")
                }
                
            });
        },2,this);

    },


    playQueAudio:function () {
        this.playAudioById("queAudio")
    },

    initFeedback: function() {
        this.settlement = cc.instantiate(this.settlePrefab);
        this.settlementJs = this.settlement.getComponent('settlement');
        this.settlementJs.game = this;
        this.feedbackNode = this.node.getChildByName('feedback_node');
        this.feedbackNode.addChild(this.settlement);
        this.feedbackNode.Zindex = 1000
        this.settlement.active = false;
    },

    startLoadGame: function (questionArr) {
        this.questionArr = questionArr;
        this.title_node.opacity = this.isIts ? 255 : 0;
        this.quertionList_node.opacity = this.isIts ? 255 : 0;
        this.time_node.opacity = this.isIts ? 0 : 255;
        this.progress.active = !this.isIts        
        //its
        if(this.isIts && questionArr && questionArr.length > 0 ){
            this.questionNumListJS.init(questionArr.length, this.selectedOption.bind(this));
        }
   
        var question = this.questionArr[this.nowQuestionID];
   

        let urls = [];
        //提取所有的图片地址
        for(let i = 0; i < this.questionArr.length; i++){
            //获取题干图片
            let question = this.questionArr[i]
            // if (question.quescontimg.length <= 0 ) {
            //     this.network.gameLoadFailed(1);
            //     return
            // }
            if ( question.quescontimg && question.quescontimg instanceof Array) {
                for (let i = 0; i < question.quescontimg.length; i++) {
                    let element = question.quescontimg[i];
                    urls.push(element);
                }

            }

        }
        //开始加载
        let self = this;
        cc.loader.load(urls, function (errors, texs) {
            if (errors) {
                self.network.gameLoadFailed(1);
                return;
            }
            //设置图片映射集合
            self.spriteMaps = texs.map;
            self.startloadOption();
            !self.isIts && self.ProgressJs.init(questionArr.length)
            if (self.isTips) {
                var tips = cc.instantiate(self.tipsPrefab);
                tips.parent = self.tipsNode;
                self.tipsJs = tips.getComponent('tips');
                self.tipsJs.game = self;
                self.setTips();
            }
        });

   


    },

    setTips:function () {
        // //获取选项位置 和题目位置
        let pos  = this.optionsJs.setTipsHandlPos();
        this.scheduleOnce(function(){
            if (this.tipsJs) {
                this.tipsJs.setData(pos);                   
            }
            this.isIts && this.questionNumListJS.changeOptionDisable();
        },1.7);     
    },
    //获取下载的图片
    getSpriteFrame: function(spriteUrl){
        let r = this.spriteMaps[spriteUrl].content;
        if(r instanceof cc.Texture2D){
            return new cc.SpriteFrame(r);
        }
        return null;
    },
        //创建选项按钮
    createOption: function () {
        var question = this.questionArr[this.nowQuestionID];
        // 选项
        this.optionsJs.initNumSpine( question.options, question.interactiveJson.rightanswer)        
        this.QuestionJs.setData(question.interactiveJson.rightanswer,question.interactiveJson.flagData)
        // this.titleJs.setTitle(question.qescont);
        this.touchHandlerJs.enable();
    },
    
    //开始加载选项
    startloadOption: function () {
        this.isIts && this.questionNumListJS.changeOptionDisable();
        this.isTips = this.nowQuestionID == 0 && !this.isFinishTips 
        // this.isTips = false 

        this.tipsNode.active = this.isTips
        var question = this.questionArr[this.nowQuestionID];
        if(!this.isIts){//非its，运行计时系统
            if(this.nowQuestionID===0){//确定计时类型
                var isTotalCd = this.questionArr[0].interactiveJson.totalcd;
                var countDownExist = this.questionArr[0].interactiveJson.countDown;
                if(!countDownExist){//正计时类型
                    this.timeType = TIME_TYPE_COUNTUP;
                    this.scheduleTime = 0;
                }else if(isTotalCd){//总倒计时类型
                    this.timeType = TIME_TYPE_TOTAL_COUNTDOWN;
                    this.scheduleTime = 0;
                }else{//倒计时类型
                    this.timeType = TIME_TYPE_COUNTDOWN;
                    this.scheduleTime = 0;
                }
            }
            //解析CountDown字段
            if(this.timeType===TIME_TYPE_COUNTDOWN){//倒计时
                let countDown = parseInt(question.interactiveJson['countDown']);
                if (countDown > 0) {
                    this.countDown = countDown;
                }else{
                    this.countDown  = 120;
                }
            }else if(this.timeType===TIME_TYPE_COUNTUP){//正计时
                this.countDown = 0;
            }else if(this.timeType===TIME_TYPE_TOTAL_COUNTDOWN){//总倒计时
                if(this.nowQuestionID === 0){
                    let countDown = parseInt(question.interactiveJson['countDown']);
                    if (countDown > 0) {
                        this.countDown = countDown;
                    }else{
                        this.countDown  = 120;
                    }
                }
            }
            if(this.timeType===TIME_TYPE_COUNTDOWN){//倒计时
                this.scheduleTime = 0;
                this.answerTime = 0;
                this.timeLabel.string = this.timeFormat(this.countDown - this.scheduleTime);
                if(this.nowQuestionID>0){
                    this.showSchedule();
                }
            }else if(this.timeType===TIME_TYPE_COUNTUP){//正计时
                this.answerTime = 0;
                this.timeLabel.string = this.timeFormat(this.scheduleTime);
                if(this.nowQuestionID>0){
                    this.showSchedule();
                }
            }else if(this.timeType===TIME_TYPE_TOTAL_COUNTDOWN){//总倒计时
                this.answerTime = 0;
                this.timeLabel.string = this.timeFormat(this.countDown - this.scheduleTime);
                if(this.nowQuestionID>0){
                    this.showSchedule();
                }
            }
        }
        this.createOption();
        this.isShowFeed = false;
    },

    //反馈
    showFeedback: function (type) {
        //停止所有音效
        if (this.titleAudioId) {
            cc.audioEngine.stop(this.titleAudioId)
            
        }
        if (this.queAudio) {
            cc.audioEngine.stop(this.queAudio)
            this.noPlayQueAudio = true 
        }else{
            this.noPlayQueAudio = true 
        }

        if(type===1){
            //只记录首次答案
            if (!this.rightData[this.nowQuestionID] && !this.isIts) {
                this.rightData[this.nowQuestionID] = type 
            }
            this.playAudioById('winAudio')  
            this.QuestionJs.showWin(this.feedbackFinish)
            this.isIts && this.optionsJs.hideOption()
            this.createAnswerInfo('1');                
            // }
        }else if(type===2){
            this.playAudioById('failAudio')
            this.QuestionJs.showLose(function () {
                this.isShowFeed = false 
            })
        }else if(type===3){//时间到逻辑
            //只记录首次答案
            if (!this.rightData[this.nowQuestionID] && !this.isIts) {
                this.rightData[this.nowQuestionID] = type 
            }
            // cc.audioEngine.stopAll()
            this.unschedule(this.playQueAudio)
            this.playAudioById('timeOutAudio')   
            this.QuestionJs.showTimeOut(this.feedbackFinish)
            this.settlementJs.playTimeUpAnim()
            this.ProgressJs.setStarTypeByIndex(this.nowQuestionID,2) 
            this.optionsJs.hideOption()

            if(this.timeType === TIME_TYPE_COUNTUP){
                for(; this.nowQuestionID < this.questionArr.length; this.nowQuestionID ++) {
                    this.createAnswerInfo('2');
                    this.answerTime = 0;
                }
            }else if(this.timeType === TIME_TYPE_COUNTDOWN){
                this.createAnswerInfo('2');
            }else if(this.timeType === TIME_TYPE_TOTAL_COUNTDOWN){
                for(; this.nowQuestionID < this.questionArr.length; this.nowQuestionID ++) {
                    this.createAnswerInfo('2');
                    this.answerTime = 0;
                }
            }
        }
    },
       //移除当前所有选项
    deleteOption: function () {
        var question = this.questionArr[this.nowQuestionID];
        //清空数据
        // this.titleJs.reset();
        this.QuestionJs.reset(question.qescont);
        this.optionsJs.reset();
    },
    //反馈完成
    feedbackFinish: function () {
        if(!this.isIts){
            this.nowQuestionID += 1;
        }
    
        if (this.nowQuestionID >= this.questionArr.length) {
            if (CONSOLE_LOG_OPEN) console.log('答完了');
            //区分正常答题和时间结束
            this.unschedule(this.playQueAudio)
            if (this.isTimeOut) {
                this.network.gameOver(this.answerInfoArr);
            }else{
                cc.audioEngine.stopAll()
                this.showFinalResult()
            }
            
        } else {
            //显示进度
            this.network.gameLoadProgress(this.nowQuestionID+1, this.questionArr.length);
            //移除当前所有选项
            !this.isIts && this.deleteOption();
            //清除反馈
            this.settlementJs.reset();
            //开始下一题
            !this.isIts && this.startloadOption();
        }
    },
    //重写组装数据逻辑
    createAnswerInfo: function (answerStatus) {
        var question = this.questionArr[this.nowQuestionID];
        //组装数据
        var answerInfo = {
            answerTime: this.answerTime,
            leveLQuestionDetailNum: question.leveLQuestionDetailNum,
            levelQuestionDetailID: question.levelQuestionDetailID,
            answerStatus: answerStatus,
            answerContext: this.answerContext,
        };
        this.answerInfoArr.push(answerInfo);
    },
    //时间到的逻辑
    timeout: function(){
        if(this.timeType === TIME_TYPE_COUNTUP){
            this.isShowFeed = true;
            this.showFeedback(3);
        }else if(this.timeType === TIME_TYPE_COUNTDOWN){
            this.isShowFeed = true;
            this.showFeedback(3);
        }else if(this.timeType === TIME_TYPE_TOTAL_COUNTDOWN){
            this.isShowFeed = true;
            this.showFeedback(3);
        }
    },
    //倒计时回调
    timeCallbackFunc: function () {
        var timeCallback = function () {
            //用户答题时间
            this.answerTime += 1;
            //计时次数
            this.scheduleTime += 1;
            if(this.timeType === TIME_TYPE_COUNTUP){
                if(this.scheduleTime >= 60*60){
                    //时间到
                    if (CONSOLE_LOG_OPEN) console.log('时间到');
                    //取消定时器
                    this.unschedule(this.timeCallback);
                    this.timeout();
                    this.timeLabel.string = this.timeFormat(this.scheduleTime);
                    return;
                }
                this.timeLabel.string = this.timeFormat(this.scheduleTime);
            }else if(this.timeType === TIME_TYPE_COUNTDOWN){
                if(this.scheduleTime >= this.countDown){
                    //时间到
                    if (CONSOLE_LOG_OPEN) console.log('时间到');
                    //取消定时器
                    this.unschedule(this.timeCallback);
                    this.timeout();
                    this.timeLabel.string = this.timeFormat(this.countDown - this.scheduleTime);
                    return;
                }
                this.timeLabel.string = this.timeFormat(this.countDown - this.scheduleTime);
            }else if(this.timeType === TIME_TYPE_TOTAL_COUNTDOWN){
                if(this.scheduleTime >= this.countDown){
                    //时间到
                    if (CONSOLE_LOG_OPEN) console.log('时间到');
                    //取消定时器
                    this.unschedule(this.timeCallback);
                    this.timeout();
                    this.timeLabel.string = this.timeFormat(this.countDown - this.scheduleTime);
                    return;
                }
                this.timeLabel.string = this.timeFormat(this.countDown - this.scheduleTime);
            }
        }
        return timeCallback;
    },
    //显示倒计时
    showSchedule: function () {
        this.schedule(this.timeCallback, 1.0);
    },

    //切换到后台
    gotoBackground: function(){
        cc.log('gotoBackground')
        this.touchHandlerJs.reset();
    },

    commitEvent : function (no,pos) {
        this.playAudioById("btnAudio")    
        //未提交答案
        if (!this.isShowFeed) {
            if ( this.QuestionJs.isRight(no)) {
                    //tips处理
                    if (this.isTips) {
                        this.isTips = false 
                        this.isFinishTips = true 
                        this.tipsNode.removeAllChildren();
                        this.tipsNode.active = false;
                        this.tipsJs = null;
                        this.isIts && this.questionNumListJS.changeOptionEnable();
                    }
                    //取消定时器
                    !this.isIts&&this.unschedule(this.timeCallback);
                    this.isShowFeed = true      
                    this.showFeedback(1)     
                    //延迟一秒播放飞星动画     
                    if (!this.isIts) {
                        this.scheduleOnce(function(){
                            this.ProgressJs.playFlayStar(pos,this.nowQuestionID,1,this.optionsJs.hideOption,this.optionsJs) 
                        },0.2);          
                    }

            }else{
                this.isShowFeed = true       
                this.showFeedback(2)        
            }
        }

   

    },


    //播放音效
    playAudioById: function(id){
        if(this.playAudioKey && this.AudioArray[id]){
           return cc.audioEngine.play(this.AudioArray[id], false, 1);
        }
    },
    //显示最终结果 答对百分之50以上为对，向上取整，比如3到题要答对2道 4道题也答对2道
    showFinalResult :function () {
        let rightCount = 0
        for (let index = 0; index < this.rightData.length; index++) {
            let  type = this.rightData[index];
            if (type == 1) {
                rightCount +=1
            }
        }
        let Percentage = rightCount/this.questionArr.length
        if (Percentage >= 0.8) {
            this.settlementJs.playWinAnim(function () {
                this.network.gameOver(this.answerInfoArr);
                
            });
        }else if (Percentage >= 0.6 && Percentage < 0.8){
            this.settlementJs.playTwoStarAnim(function () {
                this.network.gameOver(this.answerInfoArr);
                
            })
        }else if (Percentage < 0.6){
        
            this.settlementJs.playLoseAnim(function () {
                this.network.gameOver(this.answerInfoArr);
                
            })
        }
    },

    gameBack:function () {
        this.network.gameBackAction()
    }

    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
