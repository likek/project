import StepData from "./stepdata";
import Game from "../../scripts/game";
import TouchHandler from "../../scripts/touch/touchhandler";
import Tips from "./tips";

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

    isFinish: boolean

    game: Game

    touchHandler: TouchHandler

    data: StepData

    objsMap: object

    hand: cc.Node

    tips: Tips

    commit: cc.Node

    pan: cc.Node

    plate: cc.Node

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
            !this.isFinish&&this.post();
        }.bind(this), this.data['totalduration']);
    }

    pre(){
        cc.log('Step pre');
        this.touchHandler.disable();
        this.tips.node.pauseSystemEvents(true);
        this.plate.children.forEach(e=>{
            e.getComponent('touchobj')&&e.getComponent('touchobj').data&&(e.getComponent('touchobj').data['cantouch'] = false);
        });
        this.pan.getChildByName('panbody').children.forEach(e=>{
            e.getComponent('touchobj')&&e.getComponent('touchobj').data&&(e.getComponent('touchobj').data['cantouch'] = false);
        });
        this.pan.getChildByName('panpanel').active = false;

        this.data['objs'].forEach(function(element, index){
            if(this.data['pre'][element]){
                if(element==='hand'){
                    this.hand.active = true;
                    if(typeof this.data['pre'][element]['zIndex'] === 'number'){
                        this.hand.zIndex = this.data['pre'][element]['zIndex'];
                    }
                    
                    if(typeof this.data['pre'][element]['position'] === 'string'){
                        var pos;
                        if(this.data['pre'][element]['position']==='panel'){
                            pos = this.hand.parent.convertToNodeSpaceAR(this.pan.getChildByName('panpanel').convertToWorldSpaceAR(cc.p(0,0)));
                        }else if(this.data['pre'][element]['position']==='commit'){
                            pos = this.hand.parent.convertToNodeSpaceAR(this.commit.convertToWorldSpaceAR(cc.p(0,0)));
                        }else if(this.data['pre'][element]['position']==='p2'){
                            pos = this.hand.parent.convertToNodeSpaceAR(this.pan.getChildByName('panbody').getChildByName('flapjack3').convertToWorldSpaceAR(cc.p(0,0)));
                        }else{
                            pos = this.hand.parent.convertToNodeSpaceAR(this.objsMap[this.data['pre'][element]['position']].node.convertToWorldSpaceAR(cc.p(0,0)));
                        }
                        
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
                }else if(element==='pan'){
                    this.pan.active = true;
                }else if(element==='panel'){
                    this.pan.getChildByName('panpanel').active = true;
                }else if(element==='commit'){
                    this.commit.active = true;
                }else if(element==='p2'){
                    this.pan.active = true;
                    this.pan.getChildByName('panbody').getChildByName('flapjack3').active = true;
                    this.data['post'][element]&&this.data['post'][element].forEach(element => {
                        this.pan.getChildByName('panbody').getChildByName('flapjack3')['o'+element] = this.pan.getChildByName('panbody').getChildByName('flapjack3')[element];
                    });
                    this.pan.getChildByName('panbody').getChildByName('flapjack3').getComponent('touchobj').data['cantouch'] = true;
                }else if(element==='plate'){
                    if(typeof this.data['pre'][element]['parentzIndex'] === 'number'){
                        this.plate.parent.zIndex = this.data['pre'][element]['parentzIndex'];
                    }
                }else {
                    this.objsMap[element].node.active = true;

                    if(typeof this.data['pre'][element]['zIndex'] === 'number'){
                        this.objsMap[element].node.zIndex = this.data['pre'][element]['zIndex'];
                    }
                    
                    if(typeof this.data['pre'][element]['parentzIndex'] === 'number'){
                        this.objsMap[element].node.parent.zIndex = this.data['pre'][element]['parentzIndex'];
                    }

                    if(typeof this.data['pre'][element]['parentparentzIndex'] === 'number'){
                        this.objsMap[element].node.parent.parent.zIndex = this.data['pre'][element]['parentparentzIndex'];
                    }


                    this.data['post'][element]&&this.data['post'][element].forEach(ielement => {
                        this.objsMap[element].node['o'+ielement] = this.objsMap[element].node[ielement];
                    });

                    this.objsMap[element].node.getComponent('touchobj')&&this.objsMap[element].node.getComponent('touchobj').data&&(this.objsMap[element].node.getComponent('touchobj').data['cantouch'] = true);
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
                            var pos;
                            if(element['target']==='target'){
                                pos = this.hand.parent.convertToNodeSpaceAR(this.pan.getChildByName('panbody').convertToWorldSpaceAR(cc.p(0,0)));
                            }else if(element['target']==='plate'){
                                pos = this.hand.parent.convertToNodeSpaceAR(this.plate.convertToWorldSpaceAR(cc.p(0,0)));
                            }else{
                                pos = this.hand.parent.convertToNodeSpaceAR(this.objsMap[element['target']].node.convertToWorldSpaceAR(cc.p(0, 0)));
                            }
                            if(typeof element['offsetx'] === 'number'){
                                pos.x = pos.x + element['offsetx'];
                            }
                            if(typeof element['offsety'] === 'number'){
                                pos.y = pos.y + element['offsety'];
                            }
                            actionlist.push(cc.moveTo(element['duration'], pos));
                        }else if(element['type']==='scaleto'){
                            actionlist.push(cc.scaleTo(element['duration'], element['target']));
                        }
                    });

                    actionlist.push(cc.delayTime(0.1));

                    this.hand.runAction(cc.sequence(actionlist));
                    console.log("hand");
                }else if(element==='p2'){
                    var actionlist = [];
                    var p = this.pan.getChildByName('panbody').getChildByName('flapjack3').parent;
                    this.data['actions'][element].forEach(element => {
                        if(element['type']==='moveto'){
                            var pos;
                            if(element['target']==='target'){
                                pos = p.convertToNodeSpaceAR(this.pan.getChildByName('panbody').convertToWorldSpaceAR(cc.p(0,0)));
                            }else if(element['target']==='plate'){
                                pos = p.convertToNodeSpaceAR(this.plate.convertToWorldSpaceAR(cc.p(0,0)));
                            }else{
                                pos = p.convertToNodeSpaceAR(this.objsMap[element['target']].node.convertToWorldSpaceAR(cc.p(0, 0)));
                            }
                            actionlist.push(cc.moveTo(element['duration'], pos));
                        }
                    });
                    actionlist.push(cc.delayTime(0.1));
                    this.pan.getChildByName('panbody').getChildByName('flapjack3').runAction(cc.sequence(actionlist));
                }else {
                    var actionlist = [];
                    var p = this.objsMap[element].node.parent;
                    this.data['actions'][element].forEach(element => {
                        if(element['type']==='moveto'){
                            var pos;
                            if(element['target']==='target'){
                                pos = p.convertToNodeSpaceAR(this.pan.getChildByName('panbody').convertToWorldSpaceAR(cc.p(0,0)));
                            }else if(element['target']==='plate'){
                                pos = p.convertToNodeSpaceAR(this.plate.convertToWorldSpaceAR(cc.p(0,0)));
                            }else{
                                pos = p.convertToNodeSpaceAR(this.objsMap[element['target']].node.convertToWorldSpaceAR(cc.p(0, 0)));
                            }
                            actionlist.push(cc.moveTo(element['duration'], pos));
                        }
                    });

                    actionlist.push(cc.delayTime(0.1));

                    this.objsMap[element].node.runAction(cc.sequence(actionlist));
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
                }else if(element==='p2'){
                    this.data['post'][element].forEach(ielement => {
                        this.pan.getChildByName('panbody').getChildByName('flapjack3')[ielement] = this.pan.getChildByName('panbody').getChildByName('flapjack3')['o'+ielement];
                    });
                }else {
                    this.data['post'][element].forEach(ielement => {
                        this.objsMap[element].node[ielement] = this.objsMap[element].node['o'+ielement];
                    });
                }
            }
        }.bind(this));     
       
        this.touchHandler.enable();
        this.tips.node.resumeSystemEvents(true);
    }
}