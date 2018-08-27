
cc.Class({
    extends: cc.Component,

    properties: {
        option_sp : cc.Sprite,
        option  : cc.Node,
        hands   : cc.Node
    },

    // use this for initialization
    onLoad: function () {
        
    },
    //控制选项上的提示手
    setData: function(opPos){
        
        //默认取第一个
        if(opPos ){
            opPos.y = -645
            this.option.active = true
            let moveAction = cc.repeatForever(
                cc.sequence(
                    cc.moveTo(1.6, cc.p(opPos.x+100,opPos.y-60)),
                    cc.callFunc(function(){
                        this.option.x  = opPos.x  +200  
                        this.option.y  = opPos.y - 80;   
                    }, this)
                )
            );
            this.option.x  = opPos.x  +150  
            this.option.y  = opPos.y - 80;   

            this.option.runAction(moveAction);    
            // this.numData = numData
            // this.QueData = QueData     

        }else{
            this.option.active = false;
        }
    },

    stopAction :function () {
        this.option.stopAllActions()
        this.option.runAction(cc.hide())
    },

    playAction :function () {
        this.option.resumeAllActions ()
        this.option.opacity = 255
    },

    pauseAction :function () {
        this.option.opacity = 0
        this.option.pauseAllActions ()
    },
    
    // 显示按钮上的提示手
    setBtnHands :function (btnPos) {
       this.hands.opacity = 255
       this.option.opacity = 0
       this.stopAction()
       this.hands.position = btnPos 

    },

    setNextTips :function (index ) {
        let numSp = this.numData[index]
        this.option.stopAllActions()
        let moveAction = cc.repeatForever(
            cc.sequence(
                cc.moveTo(1.6, cc.p(this.QueData.position.x+60,this.QueData.position.y-50)),
                cc.callFunc(function(){
                    this.option.x  = numSp.x  +60  
                    this.option.y  = numSp.y +60; 
                }, this)
            )
    
        );
        this.option.x  = numSp.x  +60  
        this.option.y  = numSp.y +60;   
        this.option.opacity = 255
        this.option.runAction(moveAction); 
   
     },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
       
    // },  
});
