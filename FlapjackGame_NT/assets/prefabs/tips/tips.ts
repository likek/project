import AbsTips from "./abstips";
import { GameData, Question, QUESTION_TYPE, GroupData } from "../../scripts/networkdata";
import { Step } from "./step";
import Title from "../../scripts/title";
import Plates from "../../scripts/plates";
import Pan from "../../scripts/pan";

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
export default class Tips extends AbsTips {

    tipSteps: Array<Step>  = new Array<Step>()
    stepIndex: number = 0

    data: Question = null;

    objsMap: object = {};

    @property(cc.Node)
    hand: cc.Node = null;

    @property(Title)
    title: Title = null

    @property(Plates)
    plates: Plates = null

    @property(Pan)
    pan: Pan = null

    @property(cc.Button)
    commitBtn: cc.Button = null

    @property({
        override: true,
        type: cc.Node
    })

    @property(cc.Node)
    blockInputEventsNode: cc.Node = null;
    
    scale: cc.Node = null;

    showTipTime: number = 0;


    load(){
    };

    setData(data: GameData, questionIndex: number){
        cc.log('Set data in tips.');
        cc.log('Tips data is: %o' , data.tips);

        this.data = data.tips;
        this.plates.setData(this.data.interactiveJson['flapjackcount']);

        this.plates.objs.forEach(e=>{
            e.node.active = false;
        });
        this.pan.touchHandler = this.touchHandler;

        this.tipSteps  = new Array<Step>();
        for(var i = 0; i < this.data.interactiveJson['steps'].length; i++){
            var step = new Step();
            step.objsMap = this.plates.objsMap;
            step.game = this.game;
            step.pan = this.pan.node;
            step.hand = this.hand;
            step.commit = this.commitBtn.node;
            step.touchHandler = this.touchHandler;
            step.tips = this;
            step.plate = this.plates.lplate;
            step.setData(this.data.interactiveJson['steps'][i]);
            this.tipSteps.push(step);
        }
    };

    pause(){
        cc.log('Tips pause.');
    };

    resume(){
        cc.log('Tips resume.');
        this.touchHandler.reset();
        this.commitBtn['_pressed'] = false;
        this.commitBtn['_hovered'] = false;
        this.commitBtn.node.setScale(1, 1);
    };

    /**
     * 开始引导
     */
    startTip(){
        this.stepIndex = 0
        if(this.tipSteps.length > 0){
            this.showStep();
        }else{
            this.finish();
        }
    };

    /**
     * 显示步骤
     */
    showStep(){
        var step = this.tipSteps[this.stepIndex];
        step.start();
        this.game.progressJs.commitBtn.interactable = true;
        this.game.progressJs.resetBtn.interactable = true;
        if(this.stepIndex === this.tipSteps.length - 1){
            //倒数第二步
            this.commitBtn.interactable = true;
            this.pan.node.getChildByName('panpanel').active = false;
        }
    }

    handled(){
        this.showTipTime = 0;
    }

    /**
     * 关闭引导
     */
    close(){
        this.node.active = false;
        this.game.startTimer();
        this.game.showGame();
    };

    /**
     * 完成引导
     */
    finish(){
        this.game.playBtnAudio();
        this.game.showSettle();
        this.touchHandler.disable();
        this.game.showWin(function(){
            this.node.active = false;
            this.game.hideSettle();
            this.game.startTimer();
            this.game.showGame();
            this.touchHandler.enable();
            this.touchHandler.active = true;
            this.blockInputEventsNode.removeFromParent();
        }.bind(this));
    };

    /**
     * 跳过引导
     */
    skip(){
        if(this.touchHandler.isCooking || this.touchHandler.touchId)return;
        this.game.playBtnAudio();
        this.node.active = false;
        this.game.startTimer();
        this.game.showGame();
        this.blockInputEventsNode.removeFromParent();
    };

    /**
     * 下一步
     */
    nextstep(){
        this.stepIndex++;
        if(this.stepIndex >= this.tipSteps.length){
            this.tipSteps[this.stepIndex-1].isFinish = true;
            this.finish();
        }else{
            this.tipSteps[this.stepIndex-1].isFinish = true;
            this.showStep();
        }
    };

    update(dt){
        this.showTipTime+=dt;
        if(this.showTipTime > 10&&this.stepIndex < this.tipSteps.length){
            this.showTipTime = 0;
            this.showStep();
        }
    }

    onEnable(){
        this.game.eventBus.register('tipnextstep', this.nextstep.bind(this), 'tipnextstep', this.node);
        this.game.eventBus.register('handled', this.handled.bind(this), 'tiphandled');
    }

    onDisable(){
        this.game.eventBus.unregister('tipnextstep', this.nextstep, 'tipnextstep', this.node);
        this.game.eventBus.unregister('handled', this.handled.bind(this), 'tiphandled');
    }

}
