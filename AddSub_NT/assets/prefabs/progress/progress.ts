import AbsProgress from "./absprogress";
import { Question, GameData, QUESTION_TYPE, RuleData, RuleType, PLATFORM } from "../../scripts/networkdata";
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
export default class Progress extends AbsProgress {

    data: Question = null;

    objs: Array<Cjs> = new Array<Cjs>();

    objsMap: object = {};

    groups: Array<Group> = new Array<Group>();


    @property(cc.Prefab)
    groupPrefab: cc.Prefab = null;

    @property({
        override: true,
        type: cc.Node
    })
    scale: cc.Node = null;

    load(){
    };

    setData(data: GameData, questionIndex: number){
        cc.log('Set data in process.');
        cc.log('Progress data is: %o' , questionIndex===-1?data.tips:data.questionlist[questionIndex]);
        this.data = questionIndex===-1?data.tips:data.questionlist[questionIndex];

        this.touchHandler.game = this.game;
        if(questionIndex===-1){
            this.touchHandler.disable();
        }else{
            this.touchHandler.enable();
        }
       
        this.objs.splice(0);
        this.objsMap = {};
        this.groups.forEach(function(element, index){
            element.node.destroy();
        });
        this.groups.splice(0);

        for(var i = 0, g; i < this.data.groups.length; i++){
            g = cc.instantiate(this.groupPrefab);
            g.parent = this.scale;
            g.getComponent('group').game = this.game;
            g.getComponent('group').setData(this.data.groups[i]);

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
    };

    preAnimation(callback){
        var max = 0;
        this.game.playdaudiotime = 0;
        this.game.playdaudioable = true;
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
            callback&&callback();
        }.bind(this), Math.max(0.5, max-1));
    }

    postAnimation(isRight: boolean, callback: Function, choosedid?: string){
        var max = 0;
        this.game.playdaudioable = false;
        for(var i = 0; i < this.groups.length; i++){
            if(this.groups[i].data.id==='options'){
                this.groups[i].node.children.forEach(element => {
                    element.getComponent('cjs').touchjs.touchType=TouchType.NONE;
                    if(typeof choosedid === 'string'&&element.getComponent('cjs').unitjs.getState().id===choosedid){
                        element.getComponent('cjs').unitjs.getState().choosed = true;
                    }
                    if(element.getComponent('cjs').unitjs.getState().choosed){
                        if(isRight){
                            element.getComponent('cjs').unitjs.playHappyAudio();
                            element.getComponent('cjs').unitjs.playHappyResult();
                            max = Math.max(1/360*Math.abs(-1200-element.y)+3, max);
                            element.runAction(cc.sequence(cc.delayTime(3), cc.moveTo((1/360*Math.abs(-1200-element.y)*0.7), element.getComponent('cjs').unitjs.data.x, -1200).easing(cc.easeCubicActionIn())));
                        }else{
                            element.getComponent('cjs').unitjs.playUnHappyAudio();
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
        cc.log('Progress pause.');
    };

    resume(){
        cc.log('Progress resume.');
    };

    /**
     * 游戏是否正确
     */
    isRight(): boolean {
        for(var i = 0, rule: RuleData; i < this.data.rules.length; i++){
            rule = this.data.rules[i];
            if(rule.type === RuleType.SINGLE_CHOICE){
                //do nothing
            }else if(rule.type === RuleType.JUDGMENT){
                //do nothing
            }else if(rule.type === RuleType.SINGLE_CHOICE_CLICK){
                var objs:Cjs[] = [];
                for(var j = 0; rule.objs&&j < rule.objs.length; j++){
                    objs.push(this.objsMap[rule.objs[j]]);
                }
                var playerdata = objs.filter(e => {return e.unitjs['getState']().choosed});
                return rule.value===(playerdata.length>0?playerdata[0].unitjs['getState']().id:undefined);
            }else if(rule.type === RuleType.JUDGMENT_CLICK){
                //do nothing
            }
        }
        return this.data.rules.length>0;
    };

     /**
     * 游戏是否正确
     */
    getAnswer(): string {
        for(var i = 0, rule: RuleData; i < this.data.rules.length; i++){
            rule = this.data.rules[i];
            if(rule.type === RuleType.SINGLE_CHOICE){
                return '';
            }else if(rule.type === RuleType.JUDGMENT){
                return '';
            }else if(rule.type === RuleType.SINGLE_CHOICE_CLICK){
                var objs:Cjs[] = [];
                for(var j = 0; rule.objs&&j < rule.objs.length; j++){
                    objs.push(this.objsMap[rule.objs[j]]);
                }
                var playerdata = objs.filter(e => {return e.unitjs['getState']().choosed});
                return playerdata.length>0?playerdata[0].unitjs['getState']().id:'';
            }else if(rule.type === RuleType.JUDGMENT_CLICK){
                return '';
            }
        }
        return '';
    }

    /**
     * 是否需要重置
     */
    isNeedReset(): boolean{
        for(var i = 0; i < this.groups.length; i++){
            if(this.groups[i].isNeedReset()){
                return true;
            }
        }
        return false;
    };

    /**
     * 是否完成
     */
    isFinish(): boolean {
        return true;
    };

    /**
     * 重置
     */
    reset(): boolean {
        if(this.isNeedReset()){
            for(var i = 0; i < this.groups.length; i++){
                this.groups[i].reset();
            }
            return true;
        }else{
            return false;
        }
    };

    onEnable(){
        this.game.eventBus.register("verify", this.commit.bind(this), 'progress', this.node);
        this.game.eventBus.register("touchmovem", this.moveEyes.bind(this), 'touchmovem');
        this.game.eventBus.register("touchreset", this.moveEyes.bind(this), 'touchreset');
    }

    onDisable(){
        this.game.eventBus.unregister("verify", this.commit.bind(this), 'progress', this.node);
        this.game.eventBus.unregister("touchmovem", this.moveEyes.bind(this), 'touchmovem');
        this.game.eventBus.unregister("touchreset", this.moveEyes.bind(this), 'touchreset');
    }

    moveEyes(eventname, eventdata){
        if(eventname==="touchmovem"){
            this.objs.forEach(e=>{
                e.unitjs.moveEye(eventdata.getUserData());
            });
        }else if(eventname==="touchreset"){
            this.objs.forEach(e=>{
                e.unitjs.moveEye(null);
            });
        }
    }

     /**
     * 提交
     */
    commit(){
        cc.log("commit");
        this.game.stopTimer();
        if(this.isRight()){
            this.game.collectPlayerDataByIndex('1', this.getAnswer());
            this.game.playRightAudio();
            this.postAnimation(true, function(){
                if(this.game.gameData.platform===PLATFORM.IPS){
                    this.game.eventBus.dispatchEvent('nextscene', null);
                }
            }.bind(this));
        }else{
            this.game.collectPlayerDataByIndex('2', this.getAnswer());
            this.game.playFallingAudio();
            this.postAnimation(false, function(){
                if(this.game.gameData.platform===PLATFORM.IPS){
                    this.game.eventBus.dispatchEvent('nextscene', null);
                }
            }.bind(this));
        }
    };
}
