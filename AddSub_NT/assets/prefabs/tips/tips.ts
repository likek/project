import AbsTips from "./abstips";
import { GameData, Question, QUESTION_TYPE, GroupData } from "../../scripts/networkdata";
import { Step } from "./step";
import Cjs from "../unit/cjs";
import Group from "../group/group";
import { TouchType } from "../../scripts/touch/touchone";

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

    objs: Array<Cjs> = new Array<Cjs>();

    objsMap: object = {};

    groups: Array<Group> = new Array<Group>();

    @property(cc.Prefab)
    groupPrefab: cc.Prefab = null;

    @property(cc.Node)
    hand: cc.Node = null;

    @property({
        override: true,
        type: cc.Node
    })
    scale: cc.Node = null;

    showTipTime: number = 0;

    load(){
    };

    setData(data: GameData, questionIndex: number){
        cc.log('Set data in tips.');
        cc.log('Tips data is: %o' , data.tips);

        this.touchHandler.game = this.game;

        this.objs.splice(0);
        this.objsMap = {};
        this.groups.forEach(function(element, index){
            element.node.destroy();
        });
        this.groups.splice(0);

        this.data = data.tips;
        
        for(var i = 0, g; i < this.data.groups.length; i++){
            g = cc.instantiate(this.groupPrefab);
            g.parent = this.scale;
            g.getComponent('group').game = this.game;
            g.getComponent('group').setData(this.data.groups[i]);

            g.children.forEach(element => {
                element.active = false;
            });

            var that = this;
            this.groups.push(g.getComponent('group'));
            g.getComponent('group').getAllObjs().forEach(element => {
                this.objs.push(element);
                element.touchjs.handler = that.touchHandler;
            });
        }

        this.objs.forEach(element=> {
            this.objsMap[element['unitjs']['data']['id']] = element;
        })

        for(var i = 0; i < this.data.interactiveJson['steps'].length; i++){
            var step = new Step();
            step.showhandAnim = i!==0;
            step.setData(this.data.interactiveJson['steps'][i]);
            step.game = this.game;
            step.objs = this.objs;
            step.objsMap = this.objsMap;
            step.hand = this.hand;
            step.touchHandler = this.touchHandler;
            this.tipSteps.push(step);
        }
    };

    preAnimation(){
        if(this.tipSteps.length > 0){
            var max = 0;
            for(var i = 0; i < this.groups.length; i++){
                if(this.groups[i].data.id==='options'){
                    this.groups[i].node.children.forEach(element => {
                        element.getComponent('cjs').touchjs.touchType=TouchType.NONE;
                        element.y = 500;
                        max = Math.max(1/360*Math.abs(element.getComponent('cjs').unitjs.data.y-element.y), max);
                        element.runAction(cc.moveTo(1/360*Math.abs(element.getComponent('cjs').unitjs.data.y-element.y), element.getComponent('cjs').unitjs.data.x, element.getComponent('cjs').unitjs.data.y).easing(cc.easeCubicActionOut()));
                    });
                }
            }

            this.scheduleOnce(function(){
                for(var i = 0; i < this.groups.length; i++){
                    if(this.groups[i].data.id==='options'){
                        this.groups[i].node.children.forEach(element => {
                            element.getComponent('cjs').touchjs.touchType=TouchType.CLICK;
                        });
                    }
                }
                if(this.stepIndex===0){
                    this.tipSteps[this.stepIndex].showhandAnim = true;
                }
            }.bind(this), Math.max(0.5, max-1));
        }
    }

    postAnimation(isRight: boolean, callback: Function){
        var max = 0;
        this.game.playdaudioable = false;
        for(var i = 0; i < this.groups.length; i++){
            if(this.groups[i].data.id==='options'){
                this.groups[i].node.children.forEach(element => {
                    element.getComponent('cjs').touchjs.touchType=TouchType.NONE;
                    if(element.getComponent('cjs').unitjs.getState().choosed){
                        if(isRight){
                            element.getComponent('cjs').unitjs.playHappyResult();
                            max = Math.max(1/360*Math.abs(-1200-element.y)+3, max);
                            element.runAction(cc.sequence(cc.delayTime(3), cc.moveTo((1/360*Math.abs(-1200-element.y)*0.7), element.getComponent('cjs').unitjs.data.x, -1200).easing(cc.easeCubicActionIn())));
                        }else{
                            element.getComponent('cjs').unitjs.playSadResult();
                            max = Math.max(1/360*Math.abs(-1200-element.y), max);
                            element.runAction(cc.sequence(cc.repeat(cc.sequence(cc.moveBy(0.1, 15, 10).easing(cc.easeCubicActionOut()), cc.moveBy(0.1, -15, -10)).easing(cc.easeCubicActionOut()), 5),
                                cc.moveTo(1/360*Math.abs(-1200-element.y)*0.6, element.getComponent('cjs').unitjs.data.x, -1200).easing(cc.easeCubicActionOut())
                            ));
                        }
                    }else{
                        if(isRight){
                            max = Math.max(1/360*Math.abs(-1200-element.y)+0.1, max);
                            element.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(1/360*Math.abs(-1200-element.y), element.getComponent('cjs').unitjs.data.x, -1200).easing(cc.easeCubicActionOut())));
                        }else{
                            max = Math.max(1/360*Math.abs(-1200-element.y)+2, max);
                            element.runAction(cc.sequence(cc.delayTime(2), cc.moveTo(1/360*Math.abs(-1200-element.y), element.getComponent('cjs').unitjs.data.x, -1200).easing(cc.easeCubicActionOut())));
                        }
                    }
                });
            }
        }
        this.scheduleOnce(function(){
            callback&&callback();
        }.bind(this), Math.max(0.5, max));
    }

    pause(){
        cc.log('Tips pause.');
    };

    resume(){
        cc.log('Tips resume.');
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
    };

    /**
     * 完成引导
     */
    finish(){
        var r = this.objs.filter(function(value){return value.unitjs.getState().choosed});
        this.game.progressJs.postAnimation(true, null, r&&r.length>0?r[0].unitjs.getState().id:null);
        this.postAnimation(true, function(){
            this.node.active = false;
            this.game.startTimer();
            this.game.showGame();
        }.bind(this));
    };

    /**
     * 跳过引导
     */
    skip(){
        this.node.active = false;
        this.game.startTimer();
        this.game.showGame();
    };

    /**
     * 下一步
     */
    nextstep(){
        this.stepIndex++;
        if(this.stepIndex >= this.tipSteps.length){
            this.finish();
        }else{
            this.showStep();
        }
    };

    update(dt){
        this.showTipTime+=dt;//控制手出现的时间5
        if(this.showTipTime > 2&&this.stepIndex < this.tipSteps.length){
            this.showTipTime = 0;
            this.showStep();
        }
    }

    onEnable(){
        this.game.eventBus.register('tipnextstep', this.nextstep.bind(this), 'tipnextstep', this.node);
        this.game.eventBus.register('handled', this.handled.bind(this), 'tiphandled', this.node);
        this.game.eventBus.register("touchmovem", this.moveEyes.bind(this), 'touchmovemt');
        this.game.eventBus.register("touchreset", this.moveEyes.bind(this), 'touchresett');
    }

    onDisable(){
        this.game.eventBus.unregister('tipnextstep', this.nextstep, 'tipnextstep', this.node);
        this.game.eventBus.unregister('handled', this.nextstep, 'tiphandled', this.node);
        this.game.eventBus.unregister("touchmovem", this.moveEyes.bind(this), 'touchmovemt');
        this.game.eventBus.unregister("touchreset", this.moveEyes.bind(this), 'touchresett');
    }

    moveEyes(eventname, eventdata){
        if(eventname==="touchmovem"){
            this.objs.forEach(e=>{
                e.node.active&&e.unitjs.moveEye(eventdata.getUserData());
            });
        }else if(eventname==="touchreset"){
            this.objs.forEach(e=>{
                e.node.active&&e.unitjs.moveEye(null);
            });
        }
    }

}
