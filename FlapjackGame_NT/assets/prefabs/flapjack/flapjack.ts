import Game from "../../scripts/game";

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
export default class Flapjack extends cc.Component {

    @property(Game)
    game: Game = null;

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property([cc.SpriteFrame])
    bglist: cc.SpriteFrame[] = new Array<cc.SpriteFrame>();

    data: object 

    initData: object


    onLoad(){
    }

    initFlapjack(data: object){
        this.initData = {
            'bg': data['bg'],
            'id': data['id'],
            'opos': data['opos'],
            'cantouch': data['cantouch'],
            'target': data['target'],
            'targetJs': data['targetJs'],
            'platearea': data['platearea']
        };
        (data&&typeof data['scaleY']==='number')&&(this.node.scaleY = data['scaleY']);
        this.setData(data);
    }

    setData(data: object){
        this.data = data;
        this.refresh();
    }

    refresh(){
        this.bg.spriteFrame = this.data&&this.bglist[this.data['bg']];
    }

    isFinish(){
        return this.data['bg']===2;
    }

    needCook(){
        return this.data['bg']===0||this.data['bg']===1;
    }

    cook(callback?:Function){
        if(this.data['bg']===0){
            this.node.runAction(cc.sequence(
                cc.tintTo(3.4, 243, 191, 102),
                cc.scaleTo(0.333, 0.9, 0.9).easing(cc.easeCubicActionInOut()),
                cc.scaleTo(0.467,1.55, -0.27).easing(cc.easeCubicActionInOut()),
                cc.scaleTo(0.399,0.8, -1).easing(cc.easeCubicActionInOut()),
                cc.scaleTo(0,1, 1).easing(cc.easeCubicActionInOut()),
                cc.callFunc(function(){
                    this.node.color = cc.color(255, 255, 255);
                    this.data['bg'] = 1;
                    this.refresh();
                    if(typeof callback === 'function'){
                        setTimeout(()=>{
                            callback();
                        },3000);
                    }
                }.bind(this))
            ));
        }else if(this.data['bg']===1){
            this.node.runAction(cc.sequence(
                cc.tintTo(3.4, 243, 191, 102),
                cc.scaleTo(0.333, 0.9, -0.9).easing(cc.easeCubicActionInOut()),
                cc.scaleTo(0.467,1.55, 0.27).easing(cc.easeCubicActionInOut()),
                cc.scaleTo(0.399,0.8, 0.8).easing(cc.easeCubicActionInOut()),
                cc.scaleTo(0.234,1, 1).easing(cc.easeCubicActionInOut()),
                cc.callFunc(function(){
                    this.node.color = cc.color(255, 255, 255);
                    this.data['bg'] = 2;
                    this.refresh();
                    this.node.parent.parent.zIndex = 999;
                }, this),
                cc.delayTime(0.2),
                cc.callFunc(function(){
                    this.game.playToInitAudio();
                },this),
                cc.moveTo(
                    1/800*cc.pDistance(this.node.convertToWorldSpaceAR(cc.p(0, 0)), this.data['opos']),
                    this.node.parent.convertToNodeSpaceAR(this.data['opos'])
                ),
                cc.callFunc(function(){
                    this.data['targetJs'].node.getComponent('cjs').unitjs['changeCookState'](2, this.node.scaleY);
                    this.data['targetJs'].node.active = true;
                    this.node.parent.parent.zIndex = 0;
                    this.node.active = false;
                    this.node.parent.parent.getComponent('pan').removeAFlapjack(this.data['id']);
                    if(typeof callback === 'function'){
                        setTimeout(()=>{
                            callback();
                        },3000);
                    }
                }, this)
            ));
        }
    }

    getState(){
        var d = {
            'bg': this.data['bg'],
            'id': this.data['id'],
            'opos': this.data['opos']
        };
        return d;
    }

    changeState(data: object){
        this.data = data;
        this.refresh();
    }

    changeCookState(bg: number, scaleY:number = 1){
        this.data['bg'] = bg;
        this.node.scaleY = scaleY;
        this.refresh();
    }

    isNeedReset(){
       return this.initData['bg']!==this.data['bg']; 
    }

    reset(){
        this.node.getComponent('cjs').setData({
            'bg': this.initData['bg'],
            'id': this.initData['id'],
            'opos': this.initData['opos'],
            'cantouch': this.initData['cantouch'],
            'target': this.initData['target'],
            'targetJs': this.initData['targetJs'],
            'platearea': this.initData['platearea']
        });
        this.node.active = true;
        this.node.scaleY = 1;
    }
}
