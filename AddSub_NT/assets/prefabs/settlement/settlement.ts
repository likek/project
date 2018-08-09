
import { AbsSettlement } from "./abssettlement";
import { GameData } from "../../scripts/networkdata";

var DB_ANIM_ASSET = {
    'win': 'happy',
    'lose': 'sad'
};

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
export default class Settlement extends AbsSettlement {

    @property(sp.Skeleton)
    winanim: sp.Skeleton = null;

    @property(sp.Skeleton)
    loseanim: sp.Skeleton = null;

    @property(sp.Skeleton)
    timeupanim: sp.Skeleton = null;

    load(){
       
    };

    setData(data: GameData, questionIndex: number){
        cc.log('Set data in settlement.');
    };

    pause(){
        cc.log('Settle pause.');
    };

    resume(){
        cc.log('Settle resume.');
    };

    /**
     * 获胜
     */
    win(callback: Function){
        cc.log("Win");
        this.winanim.node.active = true;
        this.winanim.setAnimation(0, 'animation', false);
        this.winanim.setCompleteListener(function(){
            this.winanim.clearTrack(0);
            this.winanim.node.active = false;
            callback&&callback();
        }.bind(this));
    };

    /**
     * 失败
     */
    lose(callback: Function){
        cc.log("Lose");
        this.loseanim.node.active = true;
        this.loseanim.setAnimation(0, 'animation', false);
        this.loseanim.setCompleteListener(function(){
            this.loseanim.clearTrack(0);
            this.loseanim.node.active = false;
            callback&&callback();
        }.bind(this));
    };

    /**
     * 时间到
     */
    timeup(callback: Function){
        cc.log("Time up");
        this.timeupanim.node.active = true;
        this.timeupanim.setAnimation(0, 'animation', false);
        this.timeupanim.setCompleteListener(function(){
            this.timeupanim.clearTrack(0);
            this.timeupanim.node.active = false;
            callback&&callback();
        }.bind(this));
    };
}