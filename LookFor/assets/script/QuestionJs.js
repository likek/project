let blockWidth = 156
let miWidth = 0

cc.Class({
    extends: cc.Component,

    properties: {
        cakeSpine : cc.Node,  //兔子骨骼
        yunSpine : cc.Node, //云骨骼
        maAnSpine : cc.Node, //
        cellNode : cc.Node, //单独存放cell

        cellPre : cc.Prefab,
        boxNode : cc.Node, //盒子node

    },

    // use this for initialization
    onLoad: function () {
        this.rightanswer = ""
        this.commicakeSpinetAnswer = "" //记录提交的答案
        //初始化记录显示的滚入的滑动条 和滚出的滑动条
        //显示盒子的纹理计数
        this.cellJsData = []
       
    },
    setData :function (rightanswer,flagData) {
        this.rightanswer = rightanswer
        let delayTime = 0.01
        //切题放在这处理
        if (this.boxNode && this.boxNode.childrenCount > 0) {
            this.hiedQuestion()
            // this.boxNode.removeAllChildren(true);
            this.cellJsData = []
            delayTime = 0.5
        }

        this.scheduleOnce(function(){
            for (let i = 0; i < flagData.length; i++) {
                let cell = cc.instantiate(this.cellPre);
                cell.parent = this.boxNode; 
                cell.position =cc.p(-flagData.length/2*(blockWidth+miWidth)+i*(blockWidth+miWidth)+miWidth/2+blockWidth/2, 0)
                let  cellJs =  cell.getComponent('CellJs')
                cellJs.setCellSkine(flagData[i])
                this.cellJsData.push(cellJs)
                
            }
            this.showQuestion()
        },delayTime);
    },

    // 彩旗入场
    showQuestion:function (time) {
        this.game.playAudioById("juice") 
        for (let i = 0; i < this.cellJsData.length; i++) {
            const cellJs = this.cellJsData[i];
            cellJs.showIn()
            
        }
    },

    // 彩旗退场
    hiedQuestion:function () {
        // this.game.playAudioById("juice") 
        for (let i = 0; i < this.cellJsData.length; i++) {
            const cellJs = this.cellJsData[i];
            cellJs.showOut()
            
        }

    },

    // 彩旗答对
    rightQuestion:function () {
        for (let i = 0; i < this.cellJsData.length; i++) {
            const cellJs = this.cellJsData[i];
            cellJs.showRight()
            
        }

    },

    reset: function(){
        this.rightanswer = ""
       
    },
    //找到问号的彩旗变成正确的颜色
    findFlag:function (no) {
        for (let i = 0; i < this.cellJsData.length; i++) {
            const cellJs = this.cellJsData[i];
            if (cellJs.type == "?" || cellJs.type == "？") {
                cellJs.showColor(no)
            }
        }
    },
    
    isRight :function (no) {// 判断答案是否正确
        if (no && this.rightanswer === no) {
            this.findFlag(no)
            return true 
        }
        return false 
    },

    showWin:function (callback) {

        this.cakeSpine.getComponent("sp.Skeleton").setAnimation(0,"happy",false)
        this.cakeSpine.getComponent("sp.Skeleton").addAnimation(0,"stand",true,1)
        this.rightQuestion()
        let that = this 

        this.scheduleOnce(function(){
            callback.call(that.game);
        },2.2);
        // this.vesselSpineL.getComponent("sp.Skeleton").setAnimation(0,"right",false)
    },
    showLose:function (callback) {  
        this.cakeSpine.getComponent("sp.Skeleton").setAnimation(0,"sad",false)
        this.cakeSpine.getComponent("sp.Skeleton").addAnimation(0,"stand",true,1)
        let that = this 

        this.scheduleOnce(function(){
            callback.call(that.game);
        },1.2);
    },

    showTimeOut:function (callback) {  
        this.cakeSpine.getComponent("sp.Skeleton").setAnimation(0,"sad",false)
        this.cakeSpine.getComponent("sp.Skeleton").addAnimation(0,"stand",true,2)
        let that = this 

        if (callback) {
            this.scheduleOnce(function(){
                callback.call(that.game);
            },3.2);
        }

    },

    
 
});
