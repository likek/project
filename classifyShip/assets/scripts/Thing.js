cc.Class({
    extends: cc.Component,

    properties: {
        // gameJS:null,
        moveAble:false,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.thingTouchStart.bind(this), this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.moveThingTouchMove.bind(this), this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.moveThingTouchEnd.bind(this), this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.moveThingTouchCanCel.bind(this), this);
        this.startx = this.node.x;
        this.starty = this.node.y;

    },
    start () {

    },
    onCollisionEnter:function(other,self){
        if (CONSOLE_LOG_OPEN) console.log('on collision enter');
        if(other.node.tag === self.node.tag){ //答对了
            this.node.isCollisioned = true;
            this.node.iswrong = false;
            this.othercollider = other;
        }else{
            this.node.isCollisioned = false;
            this.node.iswrong = true;//碰进并答错了维持到松手后的状态
        }
    },     
    onCollisionExit: function (other, self) {
        if (CONSOLE_LOG_OPEN) console.log('on collision exit');
        this.node.isCollisioned = false;
        this.node.iswrong = false;
    },

    removeThingByContainerTag:function(tag){
        var beltLeft = this.gameJS.beltContainer.getChildByName("beltLeft");
        var beltRight = this.gameJS.beltContainer.getChildByName("beltRight");
        var leftThing = beltLeft.getChildByTag(tag).getChildByName("thing");
        var rightThing = beltRight.getChildByTag(tag).getChildByName("thing");
        if(leftThing)leftThing.removeFromParent();
        if(rightThing)rightThing.removeFromParent();    
    },
    thingTouchStart:function(event){
        if(this.gameJS.tipsNode && this.node.parent === this.gameJS.tipsSource){
            this.gameJS.tipsHand.opacity = 0;
            this.gameJS.moveThing.opacity = 0;
            this.gameJS.tipsHand.pauseAllActions();
            this.gameJS.moveThing.pauseAllActions();
            this.node.opacity = 255;
            touchStart.call(this);
        }else if(!this.gameJS.tipsNode){
            touchStart.call(this);
        }
        function touchStart(){
            this.gameJS.BasicAni();//重新计时
            this.moveAble = this.getMoveAble(this.node.__optionID);
            if(!this.moveAble)return;
    
            AUDIO_OPEN && this.gameJS.playOptionAudio();
            var touchPos = this.node.convertToWorldSpaceAR(cc.p(0,0));
            touchPos = this.gameJS.beltNode.convertToNodeSpaceAR(touchPos);
    
            this.node.parent = this.gameJS.beltNode;
            this.node.x = touchPos.x;
            this.node.y = touchPos.y//0;
            this.node.parent.zIndex = 1;
        }
    },
    moveThingTouchMove:function(event){
        if(!this.moveAble)return;
        var delta = event.touch.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
        //出屏还原
        var touches = event.getTouches();
        var parentNode = this.gameJS.scaleNode;
        var judgePos = parentNode.convertTouchToNodeSpaceAR(touches[0]);
        if (Math.abs(judgePos.x) < (parentNode.width / 2 - 50) &&
            Math.abs(judgePos.y) < (parentNode.height / 2 - 20)) {
        } else {
            if (CONSOLE_LOG_OPEN) cc.log('出屏了');
            this.resetPosition();
        }
    },
    moveThingTouchEnd:function(event){
        if(!this.moveAble)return;
        var isTouch = this.check();
        this.updateState(false);
        if (isTouch) {
            AUDIO_OPEN && this.gameJS.playWinAudio();
            this.optionClick();
        }else if(!isTouch && this.node.iswrong){
            AUDIO_OPEN && this.gameJS.playLoseAudio();
            this.resetPosition(); 
            this.gameJS.runAnimation.call(this.gameJS,"error");
        } 
        else {
            this.resetPosition(); 
        }
    },
    check: function () {
        if (CONSOLE_LOG_OPEN) cc.log('this.node.isCollisioned=' + this.node.isCollisioned);
        return this.node.isCollisioned;
    },
    //碰上
    optionClick:function(){
        var _t = this;
        this.rightAnimation(this.othercollider,_t,()=>{
            if(this.gameJS.tipsNode){
                this.gameJS.stopTipsAnimation.call(this.gameJS);
            }
            this.updateState(true);
            _t.node.removeFromParent();
            this.removeThingByContainerTag(this.node.originParent.tag);
            this.gameJS.runAnimation.call(this.gameJS,"right",1400);
            if(!this.hasSameTypeThing(_t.node.tag)){
                AUDIO_OPEN && this.gameJS.playCarMoveAudio();
                this.othercollider.node.parent.getComponent("sp.Skeleton").setAnimation(0,"settle_accounts",false);//出场
                this.othercollider.node.tag = -1;
                this.othercollider.node.active = false;
                var progressJS = this.gameJS.progress.getComponent("ProgressJs");
                if(_t.isWin()){
                    console.log("第"+(this.gameJS.nowQuestionID+1) + "题答对了");
                    AUDIO_OPEN && _t.gameJS.playFlyStarAudio();
                    progressJS.playFlayStar(this.othercollider.node.getPosition(),_t.gameJS.nowQuestionID,1) //飞星方法
                    setTimeout(()=>{
                        _t.gameJS.selectAnswer(true);
                    },6000);
                }
            }
            this.moveAble = false;
            this.gameJS.currTouchOption = null;
        });
    },
    moveThingTouchCanCel:function(event){
        if(!this.moveAble)return;
        this.resetPosition();
    },

    getMoveAble:function(optionID){
        if(!this.gameJS.currTouchOption || optionID === this.gameJS.currTouchOption){
            this.gameJS.currTouchOption = optionID;
            return true;
        }else{
            return false;
        }
    },
    // update (dt) {},
    resetPosition:function(){
        this.moveAble = false;
        cc.log(this.node.__optionID+'reset');
        // var originPos = this.node.originParent.convertToWorldSpaceAR(cc.v2(0,0));
        // originPos = this.gameJS.scaleNode.convertToNodeSpaceAR(originPos);
        var currPos = this.node.convertToWorldSpaceAR(cc.v2(0,0));
        currPos = this.node.originParent.convertToNodeSpaceAR(currPos);
        // var offsetX = originPos.x - currPos.x,offsetY = originPos.y - currPos.y;

        this.node.parent = this.node.originParent;
        this.node.setPosition(currPos);

        //var move = cc.moveBy(this.calculateAnimTime(),offsetX,offsetY);
        var move = cc.moveTo(this.calculateAnimTime(), cc.p(this.startx, this.starty));

        var moveDown = cc.moveBy(0.4,0,-46);//.easing(cc.easeCubicActionOut());
        var moveUp = cc.moveBy(0.5,0,46);//.easing(cc.easeCubicActionIn());
            this.node.stopAllActions();
            this.node.runAction(cc.sequence(
            move,
            cc.callFunc(()=>{
                // this.node.parent = this.node.originParent;
                // this.node.x = this.node.y = 0;
               this.gameJS.beltNode.zIndex = 0;
                this.node.parent.getChildByName('leaf').getComponent("sp.Skeleton").setAnimation(0,"error",false);
            },this),
            moveDown,
            moveUp,
            cc.callFunc(()=>{
                this.gameJS.currTouchOption = null;
                this.node.setPosition(this.startx, this.starty);
                this.updateState(true);
                if(this.gameJS.tipsNode && this.node.parent === this.gameJS.tipsSource){//引导未结束
                    this.gameJS.tipsHandAnimation.call(this.gameJS,1);
                    this.gameJS.tipsHand.resumeAllActions();
                    this.gameJS.moveThing.resumeAllActions();
                }
                //zindex
                // if(typeof callback === "function")callback();
        })),this);
    },
    hasSameTypeThing:function(tag){
        var containers = this.gameJS.beltContainer.children[0].children;
        var thing = null;
        for(let i=0;i<containers.length;i++){
            thing = containers[i].getChildByName('thing');
            if(thing && thing.tag === tag){
                return true;
            }
        }
        return false;
    },
    isWin:function(){
        var monkey = this.gameJS.monkey,giraffe = this.gameJS.giraffe,frog = this.gameJS.frog;
        return monkey.getChildByName("collisionNode").tag === -1 && giraffe.getChildByName("collisionNode").tag === -1 && frog.getChildByName("collisionNode").tag === -1;
    },
        //计算复位动画执行时间
    calculateAnimTime: function () {
        var distance = cc.pDistance(this.node.position, cc.p(this.node.originParent.x, this.node.originParent.y));
        var s = distance / 1000;
        s = s > 1 ? 1 : s;
        return s * 0.4;
    },
     /*node禁止触摸事件 
     */
    updateState: function (interactable) {
        if (interactable) {
            this.gameJS.beltContainer.resumeSystemEvents(true);
            this.gameJS.beltNode.resumeSystemEvents(true);
        } else {
            this.gameJS.beltContainer.pauseSystemEvents(true);
            this.gameJS.beltNode.pauseSystemEvents(true);
        }
    },
    // 碰对动画
    rightAnimation:function(other,self,callback){ //
        var otherPos = other.node.convertToWorldSpaceAR(cc.v2(0,0));
        otherPos = this.gameJS.scaleNode.convertToNodeSpaceAR(otherPos);
        var currPos = this.node.convertToWorldSpaceAR(cc.v2(0,0));
        currPos = this.gameJS.scaleNode.convertToNodeSpaceAR(currPos);
        var offsetX = otherPos.x - currPos.x,offsetY = otherPos.y - currPos.y;

        var jump = cc.moveBy(0.3,offsetX,offsetY+300,600,1);
        var jumpDown = cc.moveBy(0.3,0,-300,400,1);
        self.node.runAction(cc.sequence(jump,cc.callFunc(()=>{
            self.node.parent.zIndex = -1;
        }),
        jumpDown,
        cc.callFunc(()=>{
            self.node.parent.zIndex = 0;
            if(typeof callback === 'function')callback();
        })),this);
    }
});
