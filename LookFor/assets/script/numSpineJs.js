

// // 类型 0为骨骼 1为纹理
// let numType = cc.Enum({
//     SPINE   : 0,
//     SPRITE   : 1,

// });
//骨骼状态
let spineWidth = 150 
let miWidth = 30 
var touchOne = require("touchOne");
let stateArray = [
    "stand", //常态 站立
    "grasp", //拖拽状态
    "happy", //开心
    "sad", // 悲哀
    "jump", // 跳跃
    "original_number" // 数字形态
]
cc.Class({
    extends: touchOne,

    properties: {
        // 数字骨骼预制
        spine0 : cc.Prefab,
        spine1 : cc.Prefab,
        spine2 : cc.Prefab,
        spine3 : cc.Prefab,
        spine4 : cc.Prefab,
        spine5 : cc.Prefab,
        spine6 : cc.Prefab,
        spine7 : cc.Prefab,
        spine8 : cc.Prefab,
        spine9 : cc.Prefab,
        yySp   : cc.Node, //阴影图片

    },
    // stand 用于记录骨骼状态， type 用于记录类型， 显示骨骼还是精灵
    onLoadChild: function () {
        //状态
        this.stand = null
        this.number = null 
        this.canTouchFlag = true 
    },
    // num  type string  传入数字
    init:function (num) {
        num = num.toString()
        this.number = num 
        if (typeof(num) == "string") {
            for(let i=0;i<num.length;i++){
                let number  = num.charAt(i)
                let spinePre = cc.instantiate(this["spine"+number]);
                this.node.addChild(spinePre)
                spinePre.position = cc.p(-num.length/2*(spineWidth+miWidth)+i*(spineWidth+miWidth)+miWidth/2+spineWidth/2, 0);
                this["spine"+number +i] = spinePre.getComponent("sp.Skeleton")
                this["spineEyel"+number +i] = this["spine"+number +i].findBone("eye_l")
                this["spineEyer"+number +i] = this["spine"+number +i].findBone("eye_r")
                this["_Eyelx"+number +i] =  this["spineEyel"+number +i].x
                this["_Eyely"+number +i] =  this["spineEyer"+number +i].y
                
            }
        }
        this.setStand(0)

    },
    // 设置状态动画  支持字符串 和下标  例子 setStand(1) setStand("happy")
    setStand :function (state) {
        let numState = null 
        if (typeof(state) == "string") {
            for (let index = 0; index < stateArray.length; index++) {
                if (stateArray[index] == state) {
                    numState = state
                    break;
                }
                
            }
        }else if  (typeof(state) == "number"){
            numState = stateArray[state]
        }else{
            return
        }
        if (numState && numState != this.stand) {
            this.stand = numState
            for(let i=0;i<this.number.length;i++){
                let number  = this.number.charAt(i)
                this["spineEyel"+number +i].x =  this["_Eyelx"+number +i]
                this["spineEyel"+number +i].y =  this["_Eyely"+number +i]
                this["spineEyer"+number +i].x =  this["_Eyelx"+number +i]
                this["spineEyer"+number +i].y =  this["_Eyely"+number +i]
                this["spine"+number +i].setAnimation(0,numState,true)
            }
        }
        this.yySp.active = this.stand !== "grasp" && this.stand !== "original_number"
    },

    getStand :function () {
        return this.stand || ""
    },

    getNumber :function () {
        return this.number || ""
    },

    //获取父类 世界坐标
    getEyseParent :function () {
        return this.node.convertToWorldSpaceAR(cc.p(0,0))
    },
    // 获取偏移位置点
    getEyseRotatePos :function (pos,Epos) {
        let shootVector = cc.p(pos.x - Epos.x ,pos.y - Epos.y)
        // //向量标准化(即向量长度为1)  
        let normalizedVector = cc.pNormalize(shootVector) ; 
   
        let distance =  cc.pDistance(Epos, cc.p(pos.x,pos.y));
        let scale = Math.min(2 * (distance / 70),10) 
        let tpos = cc.pAdd(cc.p(0,0),cc.pMult(normalizedVector,scale))        
        return tpos
    },
    // 眼睛跟随手指位置
    setEysePos :function (pos) {
        // 不是站立状态不执行
        if (this.stand !== "stand") {
            return
        }
        let lpos =  this.getEyseRotatePos(pos,this.getEyseParent())
        for(let i=0;i<this.number.length;i++){
            let number  = this.number.charAt(i)
            if (this["spineEyel"+number +i] && this["spineEyer"+number +i]) {
                this["spineEyel"+number +i].x = -lpos.y + this["_Eyelx"+number +i]
                this["spineEyel"+number +i].y = lpos.x + this["_Eyely"+number +i]
                this["spineEyer"+number +i].x = -lpos.y + this["_Eyelx"+number +i]
                this["spineEyer"+number +i].y = lpos.x + this["_Eyely"+number +i]
            }
        }

    
    },
    resetEyePos :function () {
        for(let i=0;i<this.number.length;i++){
            let number  = this.number.charAt(i)
            if (this["spineEyel"+number +i] && this["spineEyer"+number +i]) {
                this["spineEyel"+number +i].x = this["_Eyelx"+number +i]
                this["spineEyel"+number +i].y = this["_Eyely"+number +i]
                this["spineEyer"+number +i].x = this["_Eyelx"+number +i]
                this["spineEyer"+number +i].y = this["_Eyely"+number +i]
            }
        }
    },
    //碰撞处理
    dropAction: function(pos){
        this.disableTouch()
        //检验答案
        // 播放数学音效
        // 检测是否还能继续提交答案
        if (this.game.QuestionJs.checkIsCommit(this.number)){
            let commitNode = this.game.QuestionJs.getCommitNode();
            if (this.node.parent != commitNode) {
                this.node.parent = commitNode
                this.setStand(0)
                //检测第一个数字是否为0
                this.game.QuestionJs.checkOneIsZero()
                //设置数字骨骼位置
                this.game.QuestionJs.setCommitChildPos()
                let path = "num" + this.game.QuestionJs.getCommitAnswer()
                cc.loader.loadRes(path, cc.AudioClip, function(err,clip){
                    if (!err) {
                        cc.audioEngine.play(clip, false, 1);
                    }
                })
            }else{
                this.restoreState(100) 
            }

        }else{
            this.restoreState() 
        }
   
    

            this.enableTouch()
    
        
    }, 

    // called every frame, uncomment this function to activate update callback
});
