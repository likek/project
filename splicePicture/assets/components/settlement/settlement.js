let DB_ANIM_ASSET = {
    'win': 'happy',
    'lose': 'tear'
};

cc.Class({
    extends: cc.Component,

    properties: {
        failSpine : cc.Node,
        successSpine : cc.Node,
        timeOutSpine : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.background = this.node.getChildByName('background');
        this.scale = this.node.getChildByName('scale');
    },

    //播放获胜动画
    playWinAnim: function(callback){
        this.node.active = true;
        this.successSpine.active = true  
        this.successSpine.getComponent("sp.Skeleton").setAnimation(0,"animation",false)
        let that = this 
        this.scheduleOnce(function(){
            callback.call(that.game);
        },2.5); 
    }, 

    //播放失败动画
    playLoseAnim: function(callback){
        
        this.node.active = true;
        this.failSpine.active = true 
        this.failSpine.getComponent("sp.Skeleton").setAnimation(0,"animation",false)
        let that = this 

        this.scheduleOnce(function(){
            callback.call(that.game);
        }, 2.5);

    },

    //播放失败动画
    playTimeUpAnim: function(callback){

        this.node.active = true;
        this.timeOutSpine.active = true  
        this.timeOutSpine.getComponent("sp.Skeleton").setAnimation(0,"animation",false)
        let that = this 

        this.scheduleOnce(function(){
            callback.call(that.game);
        },1);

    },
    
    //重置
    reset: function(){
        // this.background.active= false;
        this.failSpine.active = false 
        this.successSpine.active = false 
        this.timeOutSpine.active = false 
        this.node.active = false;
    },

    log: function(msg){
        if(CONSOLE_LOG_OPEN)cc.log(msg);
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
