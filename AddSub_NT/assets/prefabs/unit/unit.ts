import Obj from "../../scripts/core/obj";
import { UnitData, UNIT_TYPE, PREFAB_TYPE } from "../../scripts/networkdata";
import NumberLabel from "../number/number";
import NumberSpine from "../numSpineJs";


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
export default class Unit extends Obj {

    @property(NumberLabel)
    lable: NumberLabel = null;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(NumberSpine)
    slabel: NumberSpine = null;

    @property(cc.Animation)
    sanim: cc.Animation = null;

    @property(sp.Skeleton)
    result: sp.Skeleton = null;

    data: UnitData = new UnitData();

    initState: UnitData = new UnitData();

    currentState: UnitData = new UnitData();
    
    lastState: UnitData = new UnitData();

    playthinkAudioTime: number=  0;
    playthinkAudioWaitTime: number = cc.random0To1()*20+20;
    playthinkAudioAble: boolean = true;

    setData(data: UnitData){
        this.data = data;

        this.initState = data;
        this.currentState = data;
        this.lastState = data;
        this.refresh();

        if(typeof this.data.type === 'number'){
            this.node.getComponent('touchobj').type = this.data.type;
        }

        if(typeof this.data.touchType === 'number'){
            this.node.getComponent('touchobj').touchType = this.data.touchType;
        }

        this.game.eventBus.register('changestate', this.changeStateF.bind(this), this.data.id, this.node.parent.parent.parent);
        this.game.eventBus.register('toinit', this.changeStateF.bind(this), this.data.id, this.node.parent.parent.parent);
        this.game.eventBus.register('click', this.changeStateF.bind(this), this.data.id, this.node.parent.parent.parent);
    };

    refresh(){
        if(this.currentState.prefabtype===PREFAB_TYPE.TITLE){
            this.sprite.node.active = false;
            this.currentState.content&&(this.lable.node.parent.active = true);
            this.lable.setData(this.currentState.content);
            this.sanim.node.active = false;
            this.node.x = this.currentState.x;
            this.node.y = this.currentState.y;
        }else if(this.currentState.prefabtype===PREFAB_TYPE.NUMBER){
            this.sprite.node.active = true;
            this.lable.node.parent.active = false;
            this.sanim.node.active = true;
            var time = this.sanim.getAnimationState('number')&&this.sanim.getAnimationState('number').isPlaying&&this.sanim.getAnimationState('number').time;
            this.sanim.play('number', typeof time === 'number'?time:this.currentState.randomtime);
            this.slabel.init(this.currentState.content);
            this.node.x = this.currentState.x;
            this.node.y = this.currentState.y;
        }
    };

    moveEye(pos: cc.Vec2){
        if(this.currentState.prefabtype===PREFAB_TYPE.NUMBER){
            if(pos){
                this.slabel.setEysePos(pos);
            }else{
                this.slabel.resetEyePos();
            }
        }
    };

    getState(): UnitData{
        return this.currentState;
    };

    changeState(state: UnitData){
        this.lastState = this.currentState.clone();
        this.currentState = state.clone();

        this.refresh();
    }

    playHappyResult(callback){
        this.result.node.active = true;
        this.result.addAnimation(0, 'animation', false);
        this.slabel.setStand(3);
        this.result.setCompleteListener(function(){
            this.result.node.active = false;
            callback&&callback();
        }.bind(this));
    }

    playSadResult(callback){
        this.slabel.setStand(4);
    }

    playStandResult(callback){
        this.slabel.setStand(0);
    }


    changeStateF(eventname, eventdata){
        if(eventname==='changestate'){
            var data = eventdata.getUserData();
            if(data.id === this.data.id){
                var d = data['state'].clone();
                d.choosed = true;
                d.oid = data.oid;
                d.id = this.data.id;
                this.changeState(d);

                if(this.data.verify){
                    this.game.eventBus.dispatchEvent("verify", null, this.node.parent.parent.parent);
                }
    
                if(this.data.tipnextstep){
                    this.game.eventBus.dispatchEvent("tipnextstep", null, this.node.parent.parent.parent);
                }
            }

        }else if(eventname==='toInit'){
            var data = eventdata.getUserData();
            if(data.id === this.data.id){
                this.reset();
            }
        }else if(eventname==='click'){
            var data = eventdata.getUserData();
            if(data.id === this.data.id){
                var d = data['state'].clone();
                d.choosed = true;
                d.oid = data.oid;
                d.id = this.data.id;
                this.changeState(d);

                if(this.data.verify){
                    this.game.eventBus.dispatchEvent("verify", null, this.node.parent.parent.parent);
                }

                if(this.data.tipnextstep){
                    this.game.eventBus.dispatchEvent("tipnextstep", null, this.node.parent.parent.parent);
                }
            }
        }
    }

    playHappyAudio(){
        this.node.active&&this.game&&this.game.playNHappyAudio();
    }

    playUnHappyAudio(){
        this.node.active&&this.game&&this.game.playNUnhappyAudio();
    }

    playThinkAudio(){
        this.node.active&&this.game&&this.game.playThinkAudio();
    }

    isNeedReset(): boolean{
        return this.initState.equal(this.currentState);
    };

    reset(): boolean{
        if(this.isNeedReset()){
            this.lastState = this.initState.clone();
            this.currentState = this.initState.clone();
            this.refresh();
            return true;
        }else{
            return false;
        }
    };

    onEnable(){
        if(this.data&&this.data.id){
            this.game.eventBus.register('changestate', this.changeStateF.bind(this), this.data.id, this.node.parent.parent.parent);
            this.game.eventBus.register('toinit', this.changeStateF.bind(this), this.data.id, this.node.parent.parent.parent);
            this.game.eventBus.register('click', this.changeStateF.bind(this), this.data.id, this.node.parent.parent.parent);
        }
    }

    onDisable(){
        if(this.data&&this.data.id){
            this.game.eventBus.unregister('changestate', this.changeStateF, this.data.id, this.node.parent.parent.parent);
            this.game.eventBus.unregister('toinit', this.changeStateF, this.data.id, this.node.parent.parent.parent);
            this.game.eventBus.unregister('click', this.changeStateF, this.data.id, this.node.parent.parent.parent);
        }
    }

    update(dt){
        this.playthinkAudioTime+=dt;
        if(this.playthinkAudioTime>this.playthinkAudioWaitTime){
            this.playThinkAudio();
            this.playthinkAudioTime = 0;
        }
    }
}
