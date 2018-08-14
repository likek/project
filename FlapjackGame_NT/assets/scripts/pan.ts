import Flapjack from "../prefabs/flapjack/flapjack";
import Game from "./game";
import Cjs from "./cjs";
import TouchHandler from "../scripts/touch/touchhandler";

// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pan extends cc.Component{

    @property(sp.Skeleton)
    fire: sp.Skeleton = null

    @property(cc.Node)
    fireDot: cc.Node = null

    @property(cc.Node)
    panbody: cc.Node = null

    @property(cc.Label)
    leftl: cc.Label = null

    @property(cc.Label)
    reftl: cc.Label = null

    @property(cc.Button)
    cookBtn: cc.Button = null

    @property(cc.Node)
    pan: cc.Node = null

    @property(Game)
    game: Game = null

    cookTime: number = 0;

    data: object[] = null;

    @property(TouchHandler)
    touchHandler: TouchHandler

    @property([Cjs])
    flapjackList: Cjs[] = new Array<Cjs>();

    onLoad(){
    }

    initPan(data: object[]){
        this.cookTime = 0;
        this.setData(data);
    }

    setData(data: object[]){
        this.data = data;
        this.refresh();
    }

    cook(){
        if(this.touchHandler.touchId)return;
        this.game.eventBus.dispatchEvent('handled', null);
        if(this.data&&this.data.length>0){
            var id = this.game.playFireAudio();
            this.node.parent.parent.pauseSystemEvents(true);
            this.cookBtn.interactable = false;
            this.fire.node.active = true;
            this.fire.addAnimation(0, 'start', false);
            this.fire.addAnimation(0, 'stand', false);
            this.fire.addAnimation(0, 'stand', false);
            // this.fire.addAnimation(0, 'stand', false);
            this.fire.addAnimation(0, 'end', false);
            this.fireDot.active = true;
    
            var count=0;
            this.fire.setCompleteListener(function(){
                count++;
                if(count===4){
                    var flapjack0 = this.flapjackList[0].unitjs.data;
                    var flapjack1 = this.flapjackList[1].unitjs.data;
                    if((flapjack0 && flapjack0["bg"] === 2)||(flapjack1 && flapjack1["bg"] === 2)){
                        setTimeout(()=>{
                            //需要等待饼子飞出去
                            callFunc.call(this);
                        },1300);
                    }else{
                        callFunc.call(this);
                    }
                    setTimeout(()=>{
                        //让音频完整播完
                        this.game.stopAudio(id);
                    },400);
                }
                function callFunc(){
                    this.fireDot.active = false;
                    this.node.parent.parent.resumeSystemEvents(true);
                    this.refresh();
                    this.game.eventBus.dispatchEvent('btnstatechanged', null, this.node.parent.parent);
                    this.game.eventBus.dispatchEvent('handled', null);
                    this.game.eventBus.dispatchEvent('tipnextstep', null, this.node.parent.parent);
                    this.cookBtn.interactable = true;
                }
            }.bind(this));
    
            this.schedule(function(){
                this.cookTime++;
                this.refresh();
                this.game.eventBus.dispatchEvent('handled', null);
            }.bind(this), 0.08, 59);
            var touchHandler = this.touchHandler;
            touchHandler && (touchHandler.isCooking = true);
            this.flapjackList[0].node.active&&this.flapjackList[0].unitjs.cook(()=>{touchHandler && (touchHandler.isCooking = false);});
            this.flapjackList[1].node.active&&this.flapjackList[1].unitjs.cook(()=>{touchHandler && (touchHandler.isCooking = false);});
        }
    }

    refresh(){
        var time = this.timeformat(this.cookTime);
        var r = time.split(':');
        this.leftl.string = r[0];
        this.reftl.string = r[1];

        this.flapjackList[0].node.position = cc.p(-80, 80);
        this.flapjackList[1].node.position = cc.p(80, -80);
        if(this.data&&this.data.length===0){
            this.flapjackList[0].node.active = false;
            this.flapjackList[1].node.active = false;
        }else if(this.data&&this.data.length===1){
            this.flapjackList[0].setData(this.data[0]);
            this.flapjackList[0].node.active = true;
            this.flapjackList[1].node.active = false;
        }else if(this.data&&this.data.length===2){
            this.flapjackList[0].node.active = true;
            this.flapjackList[1].node.active = true;
            this.flapjackList[0].setData(this.data[0]);
            this.flapjackList[1].setData(this.data[1]);
        }else{
            this.flapjackList[0].node.active = false;
            this.flapjackList[0].node.setScale(1, 1);
            this.flapjackList[1].node.active = false;
            this.flapjackList[1].node.setScale(1, 1);
        }
    }

    //时间显示格式化
    timeformat(time){
        let min = Math.floor(time / 60),
        sec = time % 60,
        fMin = min < 10 ? '0'+ min : min,
        fSec = sec < 10 ? '0'+ sec : sec;
        if(time > 59) {
            return fMin + ":" + fSec;
        }else {
            return '00:'+ fSec
        }
    }

    canAdd(): boolean{
        return !this.data||this.data.length < 2;
    }

    addAFlapjack(flapjackd: object){
        if(!this.data||this.data.length===0){
            this.data = [];
            this.data.push(flapjackd);
        }else{
            this.data.push(flapjackd);
        }
        this.refresh();
        flapjackd['scaleY'] = undefined;
        this.game.eventBus.dispatchEvent('btnstatechanged', null, this.node.parent.parent);
        this.game.eventBus.dispatchEvent('tipnextstep', null, this.node.parent.parent);
    }

    removeAFlapjack(id: string){
        if(!this.data||this.data.length>0){
            this.data = this.data.filter(function(element){
                return id!==element['id'];
            });
        }
    }

    isNeedReset(): boolean{
        return this.cookTime!==0||(this.data instanceof Array&&this.data.length > 0);
    }

    reset(){
        this.cookTime = 0;
        this.data = null;
        this.refresh();
    }

    getResult(){
        return this.cookTime/60;
    }
}
