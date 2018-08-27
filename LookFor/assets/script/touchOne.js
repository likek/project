cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.achorInWorld = this.node.convertToWorldSpaceAR(cc.p(0, 0));
        this.touchOffset = cc.p(0, 0);

        this.onLoadChild();

    },


    //记录选项区
    changeToOption: function(){
        this._originOptionPos = this.node.position;
        this._originOptionParent = this.node.parent;
        this._originOptionOpacity = this.node.opacity;
        
    },

    canTouch: function(){
        return this.canTouchFlag;
    },

    saveState: function(pos){
        this.achorInWorld = this.node.convertToWorldSpaceAR(cc.p(0, 0));
        this.touchOffset = cc.p(pos.x-this.achorInWorld.x, pos.y-this.achorInWorld.y);
        this.originPos = this.node.position;
        this.originScaleX = this.node.scaleX;
        this.originScaleY = this.node.scaleY;
        this.originOpacity = this.node.opacity;
        this.zIndex = this.node.zIndex;
        this.setStand("grasp")
        this.game.playAudioById("touchB")     
        this.node.zIndex = 999;
        this.setParentZindex(10)
    },

    move: function(pos){
        let posToP = this.node.parent.convertToNodeSpaceAR(pos);
        this.node.position = cc.p(posToP.x-this.touchOffset.x, posToP.y-this.touchOffset.y);
    },  

    dropAction: function(pos,target){
        //to implement
    },

    isToTarget: function(pos){
        let targetAreas = this.game.QuestionJs.getTargetAreas();
        return this._isInTargetArea(pos, targetAreas);
    },

    _isInTargetArea: function (pos,targetAreas) {
        if (targetAreas) {
            let box     =  targetAreas.getBoundingBoxToWorld()            
            // 拖至连接处             
            if(cc.rectContainsPoint(box, pos)){
                return true;
            }
        }
        return false 
    },  

    restoreStateOption: function(index){
        // this.node.parent.zIndex = index || this.pZIndex;
        this.touchOffset = cc.p(0, 0);
        this.setParentZindex(0)
        this.node.parent = this._originOptionParent;
        this.node.opacity = this._originOptionOpacity
        // let offEct =  cc.pDistance(this.node.position, this._originOptionPos);
        this.canTouchFlag = false 
        // Math.min(400,offEct)
        this.node.runAction(cc.sequence( cc.jumpTo(0.5, this._originOptionPos, 400, 1),
        cc.callFunc(function () {
            this.canTouchFlag = true 
            this.node.position = this._originOptionPos;
        },this)))
        this.setStand("stand")

    },

    restoreState: function(height){
        let jumpHeight = height || 400
        this.touchOffset = cc.p(0, 0);
        // 
        this.setParentZindex(0)
        this.canTouchFlag = false 
        this.node.runAction(cc.sequence( cc.jumpTo(0.5, this.originPos, jumpHeight, 1),
        cc.callFunc(function () {
            this.canTouchFlag = true 
            this.node.position = this.originPos;
        },this)))
        this.node.scaleX = this.originScaleX;
        this.node.scaleY = this.originScaleY;
        this.node.opacity = this.originOpacity;
        this.node.zIndex = this.zIndex;
        this.setStand("stand")
      
    },

    restoreStateNow: function(){
        this.touchOffset = cc.p(0, 0);
        this.node.position = this.originPos;
        this.node.scaleX = this.originScaleX;
        this.node.scaleY = this.originScaleY;
        this.node.opacity = this.originOpacity;
        this.node.zIndex = this.zIndex;
    },

    disableTouch: function(){
        this.handler.disable();
    },

    enableTouch: function(){
        this.handler.enable();
    },
    //设置父节点坐标 防止穿帮现象
    setParentZindex :function (index) {
        if (this.node.parent && this.node.parent._name == "commitNode") {
            this.node.parent.zIndex = index
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
