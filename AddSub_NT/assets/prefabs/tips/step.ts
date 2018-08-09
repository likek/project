import StepData from "./stepdata";
import Game from "../../scripts/game";
import Cjs from "../unit/cjs";
import TouchHandler from "../../scripts/touch/touchhandler";

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

export enum StepType {
    MANUAL,//手动
    AUTO//自动
}

/**
 * 步骤
 */
export default abstract class AbsStep {

    stepType: StepType

    game: Game = null

    touchHandler: TouchHandler = null

    data: StepData

    objs: Array<Cjs>

    objsMap: object

    hand: cc.Node

    /**
     * 设置数据
     */
    abstract setData(data: StepData);

    /**
     * 开始
     */
    abstract start();

    /**
     * 引导
     */
    abstract _tip();

    /**
     * 预处理
     */
    abstract pre();

    /**
     * 过程中
     */
    abstract progress();

    /**
     * 后处理
     */
    abstract post();
}

export class Step extends AbsStep {

    data

    showhandAnim: boolean = false

    setData(data){
        this.data = data;
    }

    start(){
        this._tip();
    }

    _tip(){
        this.pre();
        this.progress();

        this.game.scheduleOnce(function(){
            this.post();
        }.bind(this), this.data['totalduration']);
    }

    pre(){
        cc.log('Step pre');
        this.touchHandler.disable();
        this.data['objs'].forEach(function(element, index){
            if(this.data['pre'][element]){
                if(element==='hand'){
                    this.hand.active = this.showhandAnim;

                    if(typeof this.data['pre'][element]['zIndex'] === 'number'){
                        this.hand.zIndex = this.data['pre'][element]['zIndex'];
                    }
                    
                    if(typeof this.data['pre'][element]['position'] === 'string'){
                        var pos = this.hand.parent.convertToNodeSpaceAR(this.objsMap[this.data['pre'][element]['position']].node.convertToWorldSpaceAR(cc.p(0,0)));
                        
                        if(typeof this.data['pre'][element]['offsetx'] === 'number'){
                            pos.x = pos.x + this.data['pre'][element]['offsetx'];
                        }
        
                        if(typeof this.data['pre'][element]['offsety'] === 'number'){
                            pos.y = pos.y + this.data['pre'][element]['offsety'];
                        }
                    
                        this.hand.position = pos;
                    }

                    this.data['post'][element]&&this.data['post'][element].forEach(element => {
                        this.hand['o'+element] = this.hand[element];
                    });
                }else {
                    this.objsMap[element].node.active = true;

                    if(typeof this.data['pre'][element]['zIndex'] === 'number'){
                        this.objsMap[element].node.zIndex = this.data['pre'][element]['zIndex'];
                    }
                    
                    if(typeof this.data['pre'][element]['parentzIndex'] === 'number'){
                        this.objsMap[element].node.parent.zIndex = this.data['pre'][element]['parentzIndex'];
                    }

                    this.data['post'][element]&&this.data['post'][element].forEach(ielement => {
                        this.objsMap[element].node['o'+ielement] = this.objsMap[element].node[ielement];
                    });

                    this.objsMap[element].unitjs.playStandResult();
                }
            }
        }.bind(this));
    }

    progress(){
        cc.log('Step progress');
        this.data['objs'].forEach(function(element, index){
            if(this.data['actions'][element] instanceof Array){
                if(element==='hand'){
                    var actionlist = [];
                    this.data['actions'][element].forEach(element => {
                        if(element['type']==='moveto'){
                            var pos = this.hand.parent.convertToNodeSpaceAR(this.objsMap[element['target']].node.convertToWorldSpaceAR(cc.p(0, 0)));
                            if(typeof element['offsetx'] === 'number'){
                                pos.x = pos.x + element['offsetx'];
                            }
                            if(typeof element['offsety'] === 'number'){
                                pos.y = pos.y + element['offsety'];
                            }
                            actionlist.push(cc.moveTo(element['duration'], pos));
                        }else if(element['type']==='scaleto'){
                            actionlist.push(cc.scaleTo(element['duration'], element['target']));
                        }else if(element['type']==='delaytime'){
                            actionlist.push(cc.delayTime(element['duration']));
                        }else if(element['type']==='fadein'){
                            actionlist.push(cc.fadeIn(element['duration']));
                        }
                    });

                    actionlist.length>0&&actionlist.push(cc.delayTime(0.1));

                    actionlist.length>0&&this.hand.runAction(cc.sequence(actionlist));
                }else {
                    var actionlist = [];
                    var p = this.objsMap[element].node.parent;
                    this.data['actions'][element].forEach(element => {
                        if(element['type']==='moveto'){
                            var pos = p.convertToNodeSpaceAR(this.objsMap[element['target']].node.convertToWorldSpaceAR(cc.p(0, 0)));
                            
                            actionlist.push(cc.moveTo(element['duration'], pos));
                        }
                    });

                    actionlist.length>0&&actionlist.push(cc.delayTime(0.1));

                    actionlist.length>0&&this.objsMap[element].node.runAction(cc.sequence(actionlist));
                }
            }
        }.bind(this));
    }

    post(){
        cc.log('Step post');
        this.data['objs'].forEach(function(element, index){
            if(this.data['post'][element] instanceof Array){
                if(element==='hand'){
                    this.data['post'][element].forEach(element => {
                        this.hand[element] = this.hand['o'+element];
                    });

                    this.hand.active = false;
                }else {
                    this.data['post'][element].forEach(ielement => {
                        this.objsMap[element].node[ielement] = this.objsMap[element].node['o'+ielement];
                    });
                }
            }
        }.bind(this));        
        this.touchHandler.enable();
    }
}