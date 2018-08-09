import { UnitData, UNIT_TYPE, UNIT_TOUCH_TYPE } from "./networkdata";
import Game from "./game";
import TouchHandler from "./touch/touchhandler";

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
export default class Rainbow extends cc.Component {

    @property(Game)
    game: Game = null

    @property(TouchHandler)
    touchHandler: TouchHandler = null

    @property(cc.Node)
    stars: cc.Node = null

    onLoad(){
       
    }

    rainbowTouch(eventname, eventData){
        var data = eventData.getUserData();
        if('touchmovem'===eventname){
            if(data){
                var isshow = false;
                for(var i = 0;i < this.node.children.length; i++){
                    if(cc.rectContainsPoint(this.node.children[i].getBoundingBoxToWorld(), data)){
                        isshow = true;
                        break;
                    }
                }
                this.stars.active = isshow;
                this.stars.position = this.stars.parent.convertToNodeSpaceAR(data);
                isshow&&this.game.playMagicAudio();
            }else{
                this.stars.active = false;
            }
        }else if('touchreset'===eventname){
            this.stars.active = false;
        }
    }

    onEnable(){
        this.game.eventBus.register('touchmovem', this.rainbowTouch.bind(this), 'rtouchmovem');
        this.game.eventBus.register("touchreset", this.rainbowTouch.bind(this), 'rtouchreset');
    }

    onDisable(){
        this.game.eventBus.unregister('touchmovem', this.rainbowTouch.bind(this), 'rtouchmovem');
        this.game.eventBus.unregister("touchreset", this.rainbowTouch.bind(this), 'rtouchreset');
    }
}
