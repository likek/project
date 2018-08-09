var scDuration = 0.2;

cc.Class({
    extends: cc.Component,

    properties: {
        parent_node: cc.Node,
        canMove: false,
        exchangeParent: true,
        balloonNode:cc.Node,
        kuangNode:cc.Node,
    },
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touch_start.bind(this), this.node);
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touch_end.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touch_cancel.bind(this), this.node);
        this.audioPool = [];
        var self = this;
        //等同于切后台监听
        document.addEventListener('resignActivePauseGame', function () {
            self.resetState();
        });
    },

    init: function (gameJS, option, optionLength) {
        this.node.opacity = 255;
        this.startx = this.node.x;
        this.starty = this.node.y;
        this.gameJS = gameJS;
        this.optionNo = option.optionContent; //选项（选项，选项答案）
        // this.optionNo = option.optionNo;

    },
    touch_start: function (evt) {
        if(this.node.parent != this.parent_node){
            return;
        }
        this.canMove = this.gameJS.changeMoveTag(this.node.tag);
        if (!this.canMove) {
            return;
        }
        this.gameJS.playOptionAudio();
        this.gameJS.BasicAni();//重新计时
        this.dragX = this.node.x;
        this.dragY = this.node.y;
        this.pos = null;
        this.gameJS.clampNode.zIndex = 1;
        this.gameJS.stopFuhaoAnim('pause');
        if(this.gameJS.hand.activeInHierarchy){
            this.gameJS.stopHandAction(true);
        }
    },
    touch_end: function (evt) {
        if (!this.canMove) {
            return;
        }
        if(this.node.parent != this.parent_node){
            return;
        }
        if(this.showAnim)return;
        this.showAnim = true;
        this.gameJS.isIts && this.gameJS.questionNumListJS.changeOptionDisable();

        this.kuangAnim();
    },

    touch_cancel: function (evt) {
        if (!this.canMove) {
            return;
        }
        if(this.node.parent != this.option_node){
            return;
        }
    },
    /* 切换后台恢复位置 */
    resetState: function () {
        // this.node.getComponent(cc.Button)._pressed = false;

    },
    //废弃
    reloadState: function () {
        this.canMove = false; //防止超屏多次触发
        this.gameJS.changeMoveTag(0);
        this.node.setPosition(this.startx, this.starty);

    },
    //计算复位动画执行时间
    calculateAnimTime: function () {
        var distance = cc.pDistance(this.node.position, cc.p(this.startx, this.starty));
        var s = distance / 1000;
        s = s > 1 ? 1 : s;
        return s * 0.3;
    },

    kuangAnim: function() {
        let durTime = 0.03,
            self = this;
     var action = cc.sequence(
         cc.spawn(cc.scaleTo(0.5,1.1,1.1),cc.fadeTo(0.5,255)),
         cc.spawn(cc.scaleTo(0.5,1.2,1.2),cc.fadeTo(0.5,8)),
         cc.spawn(cc.scaleTo(durTime,1,1),cc.fadeTo(durTime,0)),
        //  cc.callFunc(() => {
        //      loseGame();
        //  }),
         cc.callFunc(this.clampAnim, this),
     );
     this.kuangNode.runAction(action);
   
    },
    
    clampAnim: function (obj) {
        /*  */
        let startPut = () => {
            this.NodeTransfer();//提前改变父类
            this.gameJS.playClampSkeleton(1);
        };
        let startScatch = () => {
            this.gameJS.playClampSkeleton(0);
        };
     
        
        //clampNode 爪子anim
        var orignalPostion = this.gameJS.clampNode.getPosition();
        let nodePosition = this.node.parent.convertToWorldSpace(cc.p(0, 0));
            nodePosition = this.gameJS.clampNode.parent.convertToNodeSpaceAR(nodePosition);
            nodePosition = cc.p(nodePosition.x+223,nodePosition.y+763+220);
        let posArray = [cc.p(-665,-139+763),cc.p(52,-40+763),cc.p(595,346+763)];
        let rightArray = this.gameJS.rightArray;//['3','2','12'];
        let endPos = posArray[this.gameJS.nownumber];
        let posRight = cc.p(nodePosition.x,orignalPostion.y),
            tRight    = Math.abs(nodePosition.x - orignalPostion.x)/900,

            posDown  = cc.p(nodePosition.x,nodePosition.y),
            tDown    = Math.abs(nodePosition.y - orignalPostion.y)/900,

            posUp    = cc.p(nodePosition.x,endPos.y),
            tUp    = Math.abs(nodePosition.y - orignalPostion.y)/900,

            posleft   = cc.p(endPos.x,endPos.y),
            tLeft    = Math.abs(endPos.x - nodePosition.x)/900,

            posTop   = cc.p(endPos.x,orignalPostion.y),
            tTop    = Math.abs(orignalPostion.y - endPos.y)/900,

            posOri   = cc.p(orignalPostion.x,orignalPostion.y),
            tOri    = Math.abs(orignalPostion.x - endPos.x)/900;

            let nodeUpAnim = ()=>{
                // this.NodeTransfer();
                this.node.getComponent('numSpineJs').showYinying(false);//隐藏阴影

                var action = cc.sequence(
                //   cc.moveTo(tUp,cc.p(posUp.x,posUp.y-763-100)),//+50
                //   cc.moveTo(tLeft,cc.p(posleft.x,posleft.y-763-120))
                cc.moveTo(tUp,cc.p(posUp.x,posUp.y-763-100)),// 偏上
                cc.moveTo(tLeft,cc.p(posleft.x,posleft.y-763-120))//120

              );
              this.node.runAction(action);
            };
         
        //向右向下向上向左向上还原
        var action = cc.sequence(
            cc.moveTo(tRight,posRight),
            cc.moveTo(tDown,posDown),
            cc.callFunc(startPut),//伸抓
            cc.delayTime(1.5),

           cc.spawn(cc.moveTo(tUp,posUp),cc.callFunc(nodeUpAnim)),
            cc.moveTo(tLeft,posleft),
            cc.delayTime(0.3),
            cc.callFunc(startScatch),//缩抓
            cc.callFunc(()=>{
                this.gameJS.showPromptSuccessTitle('');
                if(this.gameJS.nownumber==0){
                    this.node.setScale(0.8,0.8);
                    this.node.setPosition(this.node.x,this.node.y+30);
                    }else if(this.gameJS.nownumber==1){
                        this.node.setScale(0.55,0.55);
                        this.node.setPosition(this.node.x,this.node.y+50);
                    }
            }),
            cc.delayTime(1.5),
            cc.moveTo(tTop,posTop),
            cc.moveTo(tOri,posOri),

            cc.delayTime(0.3),//0/2 //0.13
            cc.callFunc(() => {
                this.gameJS.playOptionOutAudio(this.optionNo);
                if(this.optionNo === rightArray[this.gameJS.nownumber]){
                    this.gameJS.playOption_correctAudio();
                    this.matchRightAnim();
                }else{
                    this.gameJS.playOption_wrongAudio();
                    this.matchWrongAnim();
                }
            }),
        );
        this.gameJS.playZhuazhiAudio();
        this.gameJS.clampNode.stopAllActions();
        this.gameJS.clampNode.runAction(action);
    },
    //节点上移
    NodeTransfer: function() {
     
         let nodePosition = this.node.convertToWorldSpaceAR(cc.p(0, 0));
         let newPosition = this.gameJS.clampNode.parent.convertToNodeSpaceAR(nodePosition);
         this.node.setPosition(newPosition);
         this.node.parent = this.gameJS.clampNode.parent;
         this.node.zIndex = 1;
    },
    playAnim: function(){
       let animNode = this.node.getChildByName('anim');
       let anim = animNode.getComponent(cc.Animation);
       anim.on('stop', function(){
           animNode.destroy();
       }, this);
       anim.play();
    },
    
    //节点匹配成功动画
    matchRightAnim: function() {
      let cb = ()=>{
         let numSpineJs =  this.node.getComponent('numSpineJs');
         numSpineJs.setStand('happy_coterie');
         this.playBallonSketon();
         this.scheduleOnce(function(){
            numSpineJs.setStand('original_number');
            // if(this.gameJS.nownumber==0){
            // this.node.setScale(0.8,0.8);
            // this.node.setPosition(this.node.x,this.node.y+30);
            // }else if(this.gameJS.nownumber==1){
            //     this.node.setScale(0.55,0.55);
            //     this.node.setPosition(this.node.x,this.node.y+50);
            // }
            this.gameJS.changeMoveTag(0);
            this.gameJS.clampNode.zIndex = 1;
            this.node.zIndex = 0;
            this.showAnim = false;
            this.gameJS.isIts && this.gameJS.questionNumListJS.changeOptionEnable();

            this.gameJS.stopFuhaoAnim('stop');
            this.gameJS.nownumber +=1;
            if(this.gameJS.nownumber == 3){
                this.gameJS.selectAnswer(true);
            }else{
                this.gameJS.PlayFuhaoAnim();
            }
         },2);
      };
      cb();
    },
    //节点匹配失败动画
    matchWrongAnim: function () {
        let numSpineJs = this.node.getComponent('numSpineJs');
        this.gameJS.playPromptWrongAnim();
        numSpineJs.setStand('sad');
        this.scheduleOnce(function () {
            this.node.setScale(1,1);

            numSpineJs.setStand('stand');
            this.gameJS.showPromptSuccessTitle('?');
            let nodePosition = this.node.convertToWorldSpaceAR(cc.p(0, 0));
            let newPosition = this.parent_node.convertToNodeSpaceAR(nodePosition);
            this.node.setPosition(newPosition);
            this.parent_node.parent.zIndex = 1;
            this.node.parent = this.parent_node;

            var moveAction =
                cc.jumpTo(0.67, cc.p(this.startx, this.starty), 400, 1);
            this.node.runAction(cc.sequence(moveAction, cc.callFunc(function () {
                this.node.setPosition(this.startx, this.starty);
                this.node.getComponent('numSpineJs').showYinying(true);
                this.gameJS.stopFuhaoAnim('resume');
                this.parent_node.parent.zIndex = 0;
                this.gameJS.clampNode.zIndex = 1;
                this.gameJS.changeMoveTag(0);
                this.showAnim = false;
                this.gameJS.isIts && this.gameJS.questionNumListJS.changeOptionEnable();
            }, this)));
        }, 2);

    },
     //撒花
     playBallonSketon:function(state){
        this.balloonNode.active = true;
        var balloonSpine  = this.balloonNode.getComponent("sp.Skeleton");
        balloonSpine.setAnimation(0,'animation',false);
    },
    /*node禁止触摸事件 
     */
    updateState: function (interactable) {
        if (interactable) {
            this.gameJS.option_node.resumeSystemEvents(true);
        } else {
            this.gameJS.option_node.pauseSystemEvents(true);
        }
    },


});