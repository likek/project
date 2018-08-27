let spName = {
    "A" :"blue",
    "B" :"orange",
    "C" :"red",
    "D" :"yellow",
    "?" :"white",
}

cc.Class({
    extends: cc.Component,

    properties: {
        spblue :  cc.SpriteFrame,
        sporange :  cc.SpriteFrame,
        spred :  cc.SpriteFrame,
        spyellow :  cc.SpriteFrame,
        optionSp : cc.Sprite

    },

    // use this for initialization
    onLoad: function () {
        this.no = ""
        this.isTouch = true //是否可触摸 
        this.node.on(cc.Node.EventType.TOUCH_START, this.starTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onCancel, this);

        
    },
    //设置题目
    setData :function (no) {
        this.no = no 
        this.optionSp.spriteFrame = this["sp"+spName[no]]
    },
    starTouch:function () {
        this.game.unschedule(this.game.playQueAudio)
        if (!this.game.isShowFeed && this.isTouch) {
            this.node.scale = 0.9 
        }
    },
    onCancel:function () {
        this.game.schedule(this.game.playQueAudio,40,this)
        if (!this.game.isShowFeed && this.isTouch) {
            this.node.scale = 1
        }
    },
    onTouch: function(event){
        this.game.schedule(this.game.playQueAudio,40,this)
        if(!this.game.isShowFeed && this.isTouch){
            this.node.scale = 1
            this.game.commitEvent(this.no,this.node.position)
        }
    },



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

