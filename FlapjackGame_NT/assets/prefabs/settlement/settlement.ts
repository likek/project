
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

    background: cc.Node
    glow: cc.Node
    glowDots: cc.Node
    title: cc.Node
    cutes: cc.Node

    load(){
        this.background = this.node.getChildByName('background');
        this.glow = this.node.getChildByName('scale').getChildByName('glow');
        this.glowDots = this.node.getChildByName('scale').getChildByName('glow_dots');
        this.title = this.node.getChildByName('scale').getChildByName('title');
        this.cutes = this.node.getChildByName('scale').getChildByName('cutes');
    };

    setData(data: GameData, questionIndex: number){
        cc.log('Set data in settlement.');
        this.reset();
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
        this.node.active = true;
        var that = this;
        cc.loader.loadRes('win', cc.SpriteFrame, function(err, assets){
            if (err) {
                cc.log(err);
            }else{
                that.title.getComponent(cc.Sprite).spriteFrame = assets;
            }
        });
        this.playDBAnim(DB_ANIM_ASSET['win']);

        var anim = this.node.getComponent(cc.Animation);

        
        this.scheduleOnce(function(){
            callback&&callback.call(that.game);
        }, 2);

        anim.play('win');
    };

    /**
     * 失败
     */
    lose(callback: Function){
        cc.log("Lose");

        this.node.active = true;
        var that = this;
        cc.loader.loadRes('lose', cc.SpriteFrame, function(err, assets){
            if (err) {
                cc.log(err);
            }else{
                that.title.getComponent(cc.Sprite).spriteFrame = assets;
            }
        });
        this.playDBAnim(DB_ANIM_ASSET['lose']);

        var anim = this.node.getComponent(cc.Animation);

        this.scheduleOnce(function(){
            callback&&callback.call(that.game);
        }, 1.5);

        anim.play('lose');
    };

    /**
     * 时间到
     */
    timeup(callback: Function){
        cc.log("Time up");

        this.node.active = true;
        var that = this;
        cc.loader.loadRes('time_up', cc.SpriteFrame, function(err, assets){
            if (err) {
                cc.log(err);
            }else{
                that.title.getComponent(cc.Sprite).spriteFrame = assets;
            }
        });
        this.playDBAnim(DB_ANIM_ASSET['lose']);

        var anim = this.node.getComponent(cc.Animation);

        this.scheduleOnce(function(){
            callback&&callback.call(that.game);
        }, 1.5);

        anim.play('lose');
    };

    playDBAnim(name: string){
        var children = this.cutes.children;
        for(var i = 0 ; i < children.length; i ++){
            children[i].getChildByName('cute').getComponent(dragonBones.ArmatureDisplay).playAnimation(name, -1);
        }
    };

    //重置
    reset() {
        this.background.opacity = 0;
        this.background.active= false;
        this.glow.scaleX = 0;
        this.glow.scaleY = 0;
        this.glow.opacity = 255;
        this.glowDots.active = false;
        this.title.getComponent(cc.Sprite).spriteFrame = null;
        var children = this.cutes.children;
        for(var i = 0, dba; i < children.length; i ++){
            dba = children[i].getChildByName('cute').getComponent(dragonBones.ArmatureDisplay);
            dba.animationName = null;
        }
        this.node.active = false;
    }
}