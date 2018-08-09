import TouchObj from "./touch/touchobj";
import TouchHandler from "./touch/touchhandler";
import { UnitData, UNIT_TYPE, UNIT_TOUCH_TYPE } from "./networkdata";
import Game from "./game";

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
export default class Cloud extends cc.Component {

    count: number = 0;
    ox: number = 0;

    @property(String)
    id: string = ''

    @property(TouchHandler)
    touchHandler: TouchHandler = null

    @property(TouchObj)
    touchObj: TouchObj = null

    @property(Game)
    game: Game = null

    @property(Number)
    xf: number = 30

    @property(Number)
    ia: number = 0.2

    @property(cc.Animation)
    anim: cc.Animation = null

    onLoad(){
        this.ox = this.node.x;

        var unitData = new UnitData();
        unitData.id = this.id;
        unitData.type = UNIT_TYPE.CLOUD;
        unitData.touchType = UNIT_TOUCH_TYPE.CLICK;
        this.touchObj.game = this.game;
        this.touchObj.setData(unitData, this.touchHandler);

        this.game.eventBus.register('cloudstart', this.startAnim.bind(this), this.id);
        this.game.eventBus.register('cloudend', this.endAnim.bind(this), this.id);
    }

    startAnim(eventname, eventdata){
        var data = eventdata.getUserData();
        if(eventname==='cloudstart'&&data.id===this.id){
            this.node.setScale(cc.p(0.7, 0.7));
        }
    }

    endAnim(eventname, eventdata){
        var data = eventdata.getUserData();
        if(eventname==='cloudend'&&data.id===this.id){
            this.anim.play('cloudr', 0);
        }
    }

    onEnable(){
        if(this.id){
            this.game.eventBus.register('cloudstart', this.startAnim.bind(this), this.id);
            this.game.eventBus.register('cloudend', this.endAnim.bind(this), this.id);
        }
    }

    onDisable(){
        if(this.id){
            this.game.eventBus.unregister('cloudstart', this.startAnim.bind(this), this.id);
            this.game.eventBus.unregister('cloudend', this.endAnim.bind(this), this.id);
        }
    }

    update (dt) {
        this.count+=dt;
        this.node.x = this.xf*Math.sin(this.ia+this.count)+ this.ox;
        if(this.count>2*Math.PI){
            this.count -= 2*Math.PI;
        }
    }
}
