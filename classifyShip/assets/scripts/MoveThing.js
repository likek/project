cc.Class({
    extends: cc.Component,

    properties: {
        thing:cc.Node,
        gameJS:null,
    },
    onCollisionEnter:function(other,self){
        if(!this.gameJS.collideAble || this.__lastCollisionTime && new Date().getTime() - this.__lastCollisionTime < 1000)return;
        this.__lastCollisionTime = new Date().getTime();
        if(other.node.tag === self.node.tag){ //答对了
            this.moveAble = false;
            var _t = this;
            this.rightAnimation(other,self,()=>{
                if(!this.hasSameTypeThing(self.node.tag)){
                    other.node.parent.getComponent("sp.Skeleton").setAnimation(0,"settle_accounts",false);//出场
                    other.node.tag = -1;
                    other.node.active = false;
                    var progressJS = this.gameJS.progress.getComponent("ProgressJs");
                    if(_t.isWin()){
                        console.log("第"+(this.gameJS.nowQuestionID+1) + "题答对了");
                        progressJS.playFlayStar(other.node.getPosition(),_t.gameJS.nowQuestionID,1) //飞星方法
                        setTimeout(()=>{
                            _t.gameJS.selectAnswer(true);
                        },6000);
                    }
                }
                this.gameJS.currTouchOption = null;
            });
        }else{ //答错了
            this.moveAble = true;
            this.resetPosition(()=>{
                this.gameJS.currTouchOption = null;
            });
            this.gameJS.runAnimation.call(this.gameJS,"error");
            this.gameJS.wrongAnswerNum++;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

    },
    resetPosition:function(callback){
        if(!this.thing||!this.thing.parent)return;
        var pos = this.thing.convertToWorldSpaceAR(cc.v2(0,0));
        pos = this.gameJS.scaleNode.convertToNodeSpaceAR(pos);
        var move = cc.moveTo(this.calculateAnimTime(),pos.x,pos.y);
        this.node.runAction(cc.sequence(move,cc.callFunc(()=>{
            if(!this.thing||!this.thing.parent)return;
            var pos = this.thing.convertToWorldSpace(cc.v2(0,0));
            this.node.setPosition(pos);
            this.thing.opacity = 255;
            this.node.opacity = 0;
            this.thing.parent.getChildByName('leaf').getComponent("sp.Skeleton").setAnimation(0,"error",false);
            var moveDown = cc.moveBy(0.4,0,-46).easing(cc.easeCubicActionOut());
            var moveUp = cc.moveBy(0.5,0,46).easing(cc.easeCubicActionIn());
            this.thing.runAction(cc.sequence(moveDown,moveUp));
            console.log("resetPosition" + this.node.ismoving);
            if(typeof callback === "function")callback();
        })),this);
    },
    hasSameTypeThing:function(tag){
        var containers = this.thing.parent.parent.children;
        var thing = null;
        for(let i=0;i<containers.length;i++){
            thing = containers[i].getChildByName('leaf').getChildByName('thing');
            if(thing && thing!== this.thing && thing.tag === tag){
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
        var distance = cc.pDistance(this.node.position, cc.p(this.thing.x, this.thing.y));
        var s = distance / 1000;
        s = s > 1 ? 1 : s;
        return s * 0.6;
    },
    rightAnimation:function(other,self,callback){ //
        var otherPos = other.node.convertToWorldSpaceAR(cc.v2(0,0));
        otherPos = this.gameJS.scaleNode.convertToNodeSpaceAR(otherPos);

        var jump = cc.moveTo(0.3,otherPos.x,otherPos.y+300,600,1);
        var jumpDown = cc.moveTo(0.3,otherPos.x,otherPos.y,400,1);
        self.node.runAction(cc.sequence(jump,cc.callFunc(()=>{
            self.node.zIndex = -1;
        }),
        jumpDown,
        cc.callFunc(()=>{
            self.node.opacity = 0;
            self.node.zIndex = 0;
            this.gameJS.removeThingByContainerTag.call(this.gameJS,this.thing.parent.tag);
            this.gameJS.runAnimation.call(this.gameJS,"right",1400);
            this.gameJS.rightAnswerNum++;
            this.resetPosition();
            if(typeof callback === 'function')callback();
        })),this);
    }
    // update (dt) {},
});
