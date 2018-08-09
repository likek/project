//骨骼状态
let spineWidth = 150 
let miWidth = 10 
let stateArray = [
    "stand", //常态 站立
    "grasp", //拖拽状态
    "happy", //开心
    "happy_coterie",//降落开心
    "sad", // 悲哀
    "jump", // 跳跃
    "original_number" // 数字形态
]

const {ccclass, property} = cc._decorator;

@ccclass
export default class NumberSpine extends cc.Component {
    // 数字骨骼预制
    @property(cc.Prefab)
    spine0: cc.Prefab = null;

    @property(cc.Prefab)
    spine1 : cc.Prefab = null;

    @property(cc.Prefab)
    spine2 : cc.Prefab = null;

    @property(cc.Prefab)
    spine3 : cc.Prefab = null;

    @property(cc.Prefab)
    spine4 : cc.Prefab = null;

    @property(cc.Prefab)
    spine5 : cc.Prefab = null;

    @property(cc.Prefab)
    spine6 : cc.Prefab = null;

    @property(cc.Prefab)
    spine7 : cc.Prefab = null;

    @property(cc.Prefab)
    spine8 : cc.Prefab = null;

    @property(cc.Prefab)
    spine9 : cc.Prefab = null;

    number: string
    stand: object
    objs: cc.Node[] = new Array<cc.Node>();

    // stand 用于记录骨骼状态， type 用于记录类型， 显示骨骼还是精灵
    onLoad () {
        //状态
        this.stand = null
        this.number = null 
    }
    // num  type string  传入数字
    init (num) {
        num = num.toString();
        if(this.number=== num){
            return;
        }
        for(let i=0;this.number&&i < this.number.length;i++){
            let number  = num.charAt(i)
            this["spine"+number +i] = null;
            this["spineEyel"+number +i] = null;
            this["spineEyer"+number +i] = null;
            this["_Eyelx"+number +i] = null;
            this["_Eyely"+number +i] = null;
        }
        for(var i = 0; i < this.objs.length; ){
            this.objs.shift().destroy();
        }
        this.number = num 
        if (typeof(num) == "string") {
            for(let i=0;i<num.length;i++){
                let number  = num.charAt(i)
                let spinePre = cc.instantiate(this["spine"+number]);
                this.objs.push(spinePre);
                this.node.addChild(spinePre)
                spinePre.position = cc.p(-num.length/2*(spineWidth+miWidth)+i*(spineWidth+miWidth)+miWidth/2+spineWidth/2, 0);
                this["spine"+number +i] = spinePre.getComponent("sp.Skeleton")
                this["spineEyel"+number +i] = this["spine"+number +i].findBone("eye_l")
                this["spineEyer"+number +i] = this["spine"+number +i].findBone("eye_r")
                this["_Eyelx"+number +i] =  this["spineEyel"+number +i].x
                this["_Eyely"+number +i] =  this["spineEyer"+number +i].y
            }
        }
        this.stand = null;
        this.setStand(0);
    }
    // 设置状态动画  支持字符串 和下标  例子 setStand(1) setStand("happy")
    setStand (state) {
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
            return;
        }
        if (numState && numState !== this.stand) {
            this.stand = numState
            for(let i=0;i<this.number.length;i++){
                let number  = this.number.charAt(i)
                this["spineEyel"+number +i].x =  this["_Eyelx"+number +i]
                this["spineEyel"+number +i].y =  this["_Eyely"+number +i]
                this["spineEyer"+number +i].x =  this["_Eyelx"+number +i]
                this["spineEyer"+number +i].y =  this["_Eyely"+number +i]
                this["spine"+number +i].setAnimation(0,numState,true);
            }
            this.resetEyePos();
        }
    }

    getStand () {
        return this.stand || ""
    }

    getNumber () {
        return this.number || ""
    }

    //获取父类 世界坐标
    getEyseParent () {
        return this.node.convertToWorldSpaceAR(cc.p(0,0))
    }
    // 获取偏移位置点
    getEyseRotatePos (pos,Epos) {
        let shootVector = cc.p(pos.x - Epos.x ,pos.y - Epos.y)
        // //向量标准化(即向量长度为1)  
        let normalizedVector = cc.pNormalize(shootVector) ; 
   
        let distance =  cc.pDistance(Epos, cc.p(pos.x,pos.y));
        let scale = Math.min(2 * (distance / 70),10) 
        let tpos = cc.pAdd(cc.p(0,0),cc.pMult(normalizedVector,scale))        
        return tpos
    }
    // 眼睛跟随手指位置
    setEysePos (pos) {
        // 不是站立状态不执行
        if (typeof this.stand === 'string'&&this.stand !== "stand") {
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

    
    }
    resetEyePos () {
        for(let i=0;this.number&&i<this.number.length;i++){
            let number  = this.number.charAt(i)
            if (this["spineEyel"+number +i] && this["spineEyer"+number +i]) {
                this["spineEyel"+number +i].x = this["_Eyelx"+number +i]
                this["spineEyel"+number +i].y = this["_Eyely"+number +i]
                this["spineEyer"+number +i].x = this["_Eyelx"+number +i]
                this["spineEyer"+number +i].y = this["_Eyely"+number +i]
            }
        }
    }

    onEnable(){
        for(let i=0;this.number&&i<this.number.length;i++){
            let number  = this.number.charAt(i)
            if(this["spine"+number +i]){
                this["spine"+number +i].setAnimation(0,this.stand,true);
                this["spineEyel"+number +i] = this["spine"+number +i].findBone("eye_l")
                this["spineEyer"+number +i] = this["spine"+number +i].findBone("eye_r")
                this["_Eyelx"+number +i] =  this["spineEyel"+number +i].x
                this["_Eyely"+number +i] =  this["spineEyer"+number +i].y
            }
        }
    }

    onDisable(){

    }
}
