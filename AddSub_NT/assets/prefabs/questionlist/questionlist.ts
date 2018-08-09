const {ccclass, property} = cc._decorator;

var MAX_BTN_NUM = 7;
@ccclass
export default class QuestionList extends cc.Component {

    @property(cc.SpriteFrame)
    lbtnbg = null

    @property(cc.SpriteFrame)
    btnbg = null

    @property([cc.Node])
    btnsc =  new Array<cc.Node>()

    @property(Number)
    count = 0

    @property([cc.Component.EventHandler])
    clickCallbackFunc = new Array<cc.Component.EventHandler>()

    left: cc.Node
    right: cc.Node
    btns: cc.Node
    pageNum: number
    cPageNum: number
    selectNum: number
    clickable: boolean
    btnsPos: cc.Vec2[]
 
    onLoad() {
        this.left = this.node.getChildByName('left');
        this.right = this.node.getChildByName('right');
        this.btns = this.node.getChildByName('btns');

        this.pageNum = parseInt(''+(this.count/MAX_BTN_NUM)) + (this.count%MAX_BTN_NUM>0?1:0);
        this.cPageNum = 0;
        this.selectNum = 0;
        this.clickable = true;
        this.btnsPos = [];

        for(let i = 0; i < this.btnsc.length; i++){
            this.btnsPos.push(cc.p(this.btnsc[i].x, this.btnsc[i].y));
        }

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);

        this.refreshBtns();
    }
 
    //设置数据，callback点击回调
    setData(count: number) {
         this.count = typeof count === 'number'?count:0;
         this.pageNum = parseInt(''+(this.count/MAX_BTN_NUM)) + (this.count%MAX_BTN_NUM>0?1:0);
         this.cPageNum = 0;
         this.selectNum = 0;
         this.clickable = true;
 
         if(this.count < MAX_BTN_NUM){
             this.left.active = false;
             this.right.active = false;
         }else{
             this.left.active = true;
             this.right.active = true;
         }
 
         this.refreshBtns();
     }
 
    //添加点击监听器
    addClickListener(callback: cc.Component.EventHandler) {
         if(callback instanceof cc.Component.EventHandler){
             this.clickCallbackFunc.push(callback);
         }
    }
 
    refreshBtns(){
        let cBtnNum = (this.cPageNum < this.pageNum - 1)?MAX_BTN_NUM:(this.count-this.cPageNum*MAX_BTN_NUM)%(MAX_BTN_NUM+1);
        for(let i = 0; i < cBtnNum; i++){
            this.btnsc[i].active = true;
            this.btnsc[i].getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.selectNum===(this.cPageNum*MAX_BTN_NUM + i)?this.lbtnbg:this.btnbg;
            this.btnsc[i].getChildByName('lable').getComponent(cc.Label).string = ''+(this.cPageNum*MAX_BTN_NUM + i + 1);
        }

        for(let i = cBtnNum; i < MAX_BTN_NUM; i++){
            this.btnsc[i].active = false;         
        }
    }
 
    //点击测试
    hint(data){
        cc.log(data);
    }
 
    //左
    leftVectorClick(){
        if(this.cPageNum>=1){
            this.cPageNum--;
        }
        this.refreshBtns();
    }
 
    //右
    rightVectorClick(){
        if(this.cPageNum<this.pageNum-1){
            this.cPageNum++;
        }
        this.refreshBtns();
    }
     
    //触碰
    touchStart(event) {
         let pos = this.btns.convertToNodeSpaceAR(event.getLocation());
         for(let i = 0, d, lastbtnNum, cBtnNum; i < this.btnsPos.length; i++){
             d = cc.pDistance(this.btnsPos[i], pos);
             if(d < 40&&this.btnsc[i].active){
                 lastbtnNum = this.selectNum - this.cPageNum*MAX_BTN_NUM;
                 if(lastbtnNum>=0&&lastbtnNum<MAX_BTN_NUM){
                     this.btnsc[lastbtnNum].getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.btnbg;
                 }
                 this.selectNum = i + this.cPageNum*MAX_BTN_NUM;
                 cBtnNum = this.selectNum - this.cPageNum*MAX_BTN_NUM;
                 if(cBtnNum>=0&&cBtnNum<MAX_BTN_NUM){
                     this.btnsc[cBtnNum].getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.lbtnbg;
                 }
                 for(var j = 0; j < this.clickCallbackFunc.length; j++){
                     var target = this.clickCallbackFunc[j].target;
                     var com = target&&target.getComponent(this.clickCallbackFunc[j].component);
                     var handler = com&&com[this.clickCallbackFunc[j].handler];
                     var customdata = this.clickCallbackFunc[j].customEventData;
                     if(target&&com&&handler){
                         var tevent = new cc.Event.EventCustom('Click', true);
                         tevent.setUserData(i + this.cPageNum*MAX_BTN_NUM);
                         handler.call(com, tevent, customdata);
                     }
                 }
                 break;
             }
         }
     }
}
