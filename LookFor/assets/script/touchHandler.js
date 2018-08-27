let touchOne = require('touchOne');
cc.Class({
    extends: cc.Component,

    properties: {
        boundingBox: cc.Rect,
        unTouchAreas: [cc.Rect]
    },

    // use this for initialization
    onLoad: function () {
        this.touchId = undefined;
        this.touchAble = true;
        this.touchNodes = [];
        this.isEdit = false;
        this.cTouchNode = null;
        this.tipsCount  = 0  // tips记步器

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancle, this);
        this.isTouch = false
        
        this.schedule(function () {
            if (!this.isTouch ) {
                this.reset()
            }
        }, 2.0,this);
    },

    
    //注册触摸
    regist: function(component){
        this.isEdit = true;
        if(component instanceof touchOne){
            
             this.touchNodes.push(component);
             component.handler = this;
        }else{
            cc.warn('Component registed must is a touchOne class instance.');
        }
        this.isEdit = false;
    },

    //取消触摸
    remove: function(component){
        this.isEdit = true;
        for(let i = 0; i< this.touchNodes.length; i++){
            if(this.touchNodes[i]===component){
                component.handler = null;
                this.touchNodes.splice(i, 1);
                if(component===this.cTouchNode){
                    this.cTouchNode = null;
                }
            }
        }
        this.isEdit = false;
    },

    //开启触摸
    enable: function(){
        this.touchAble = true;
    },

    //关闭触摸
    disable: function(){
        this.touchAble = false;
    },

    //开始触摸
    onTouchStart: function(event){
        if(!this.isEdit&&this.touchAble&&(this.touchId===event.getID()||this.touchId===undefined)){
            let pos = event.getLocation();
            // tips模式 限制单一触摸点
            let i 
            if (this.game.isTips) {
                i = this.tipsCount
            }else{
                i = 0
            }
            for(i ; i< this.touchNodes.length; i++){
                let bb 
                if (this.game.isTips) {
                    bb = this.touchNodes[this.tipsCount].node.getBoundingBoxToWorld();
                }else{
                    bb = this.touchNodes[i].node.getBoundingBoxToWorld();
                }
                if(cc.rectContainsPoint(bb, pos)){
                    if(this.cTouchNode){
                        this.cTouchNode.restoreState();
                        this.touchId = undefined;
                    }

                    if(this.touchNodes[i].canTouch()){
                        this.cTouchNode = this.touchNodes[i];
                        this.cTouchNode.saveState(pos);
                        this.touchId = event.getID();
                    }
                    this.touchBegin  = true 
                    this.pos = pos 
                    this.isTouch = true 
                    //执行操作后不播放题目音效
                    this.game.isPlayAudio = false 
                    this.game.unschedule(this.game.playQueAudio)
                    if (this.game.isTips) {
                        this.game.tipsJs.pauseAction()
                        // this.game.tipsNode.active = false;
                    }
                    break;
                }
            }
        }
        return true
    },

    //触摸移动
    onTouchMove: function(event){
        if(!this.isEdit&&this.touchAble&&this.touchId===event.getID()&&this.cTouchNode){
            this.touchId = event.getID();
            let pos = event.getLocation();
            var bb = cc.rect(0, -100, cc.winSize.width, cc.winSize.height+100);
            //执行操作后不播放题目音效
            this.game.isPlayAudio = false 
            if(!cc.rectContainsRect(bb, this.cTouchNode.node.getBoundingBoxToWorld())){
                this.cTouchNode.restoreState();
                if (this.game.isTips) {
                    this.scheduleOnce(function () {
                        this.game.tipsJs.playAction()
                    },0.5)
                }
                this.touchId = undefined;
                this.cTouchNode = null;
                this.game.playAudioById("touchC")
            }else if(this._isInUnTouchArea(pos)){
                this.cTouchNode.restoreState();
                if (this.game.isTips) {
                    this.scheduleOnce(function () {
                        this.game.tipsJs.playAction()
                    },0.5)
                }
                this.touchId = undefined;
                this.cTouchNode = null;
                this.game.playAudioById("touchC")
            }else{
                this.touchBegin  = true 
                this.pos = pos 
                this.cTouchNode.move(pos);
                // this.cTouchNode.setNumOpacity(pos);
            }
        }
        return true
        
    },

    //触摸截止
    onTouchEnd: function(event){
        if(!this.isEdit&&this.touchAble&&this.touchId===event.getID()&&this.cTouchNode){
            this.touchId = undefined;
            let pos = event.getLocation();
            let target = this.cTouchNode.isToTarget(pos)
            // this.cTouchNode.resetNumOpacity()            
            if(target ){
                this.cTouchNode.dropAction(pos);
                //tips模式 发送选择答案消息 开始下一步提示
                if (this.game.isTips) {
                    this.tipsCount += 1
                    //步骤完了提示按钮
                    if (this.tipsCount >= this.touchNodes.length) {
                        this.node.dispatchEvent(new cc.Event.EventCustom('tipsCommit', true));
                    }else{
                        this.game.tipsJs.setNextTips(this.tipsCount)
                    }
                }
                this.cTouchNode = null;
            }else{
                this.game.playAudioById("touchC") 
                this.cTouchNode.restoreStateOption();
                this.game.QuestionJs.setCommitChildPos()
                this.cTouchNode = null;
                if (this.game.isTips) {
                    this.scheduleOnce(function () {
                        this.game.tipsJs.playAction()
                    },0.5)
                }
            }
            for(let i = 0; i < this.game.optionsJs.numSpines.length; i++){
                this.game.optionsJs.numSpines[i].resetEyePos()
            }
        }
        this.touchBegin  = false 
        this.pos = null 
        this.isTouch = false

        this.game.schedule(this.game.playQueAudio,27,this)
        return true
        
    },

    //触摸取消
    onTouchCancle: function(event){
        if(!this.isEdit&&this.touchAble&&this.touchId===event.getID()&&this.cTouchNode){
            this.touchId = undefined;
            this.cTouchNode.restoreState();
            // this.cTouchNode.resetNumOpacity()                        
            this.cTouchNode = null;
            for(let i = 0; i < this.game.optionsJs.numSpines.length; i++){
                this.game.optionsJs.numSpines[i].resetEyePos()
            }
        }
        this.touchBegin  = false 
        this.pos = null 
        this.isTouch = false
        return true
        
    },

    _isInUnTouchArea: function(pos){
       for(let i = 0; i < this.unTouchAreas.length; i++){
            if(pos.x>this.unTouchAreas[i].x&&pos.y>this.unTouchAreas[i].y&&pos.x<this.unTouchAreas[i].x+this.unTouchAreas[i].width&&pos.y<this.unTouchAreas[i].y+this.unTouchAreas[i].height){
                return true;
            }
       }
       return false;
    },

    //重置当前触摸项
    reset: function(){
        if(this.cTouchNode){
            this.cTouchNode.restoreState();
            this.cTouchNode = null;
        }
        this.touchId = undefined;
    },

    //立即重置当前触摸项
    resetRightNow: function(){
        if(this.cTouchNode){
            this.cTouchNode.restoreStateNow();
            this.cTouchNode = null;
        }
        this.touchId = undefined;
    },

    //清除所有触摸组件
    clear: function(){
        this.touchId = undefined;
        this.touchAble = false;
        for(let i = 0; i < this.touchNodes.length; i++){
            this.touchNodes[i].handler = null;
        }
        this.touchNodes = [];
        this.isEdit = false;
        this.cTouchNode = null;
    },
    getTouchNodes :function () {
        return   this.touchNodes
    },
    
    update:function (dt) {
        if (this.touchBegin && this.pos) {
            for(let i = 0; i < this.game.optionsJs.numSpines.length; i++){
                this.game.optionsJs.numSpines[i].setEysePos(this.pos)
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
});
