import TouchHandler from "./touch/touchhandler";
import TouchObj from "./touch/touchobj";
import Game from "./game";
import { UnitData, UNIT_TYPE, UNIT_TOUCH_TYPE } from "./networkdata";

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
export default class NewClass extends cc.Component {

    @property(String)
    id: string = ''

    @property(TouchHandler)
    touchHandler: TouchHandler = null

    @property(TouchObj)
    touchObj: TouchObj = null

    @property(Game)
    game: Game = null

    @property(cc.Animation)
    anim: cc.Animation = null

    onLoad(){
        var unitData = new UnitData();
        unitData.id = this.id;
        unitData.type = UNIT_TYPE.TREE;
        unitData.touchType = UNIT_TOUCH_TYPE.CLICK;
        this.touchObj.game = this.game;
        this.touchObj.setData(unitData, this.touchHandler);

        this.game.eventBus.register('treestart', this.startAnim.bind(this), this.id);
        this.game.eventBus.register('treeend', this.endAnim.bind(this), this.id);
    }

    startAnim(eventname, eventdata){
        var data = eventdata.getUserData();
        if(eventname==='treestart'&&data.id===this.id){
            this.node.getChildByName('bottom').setScale(cc.p(1, 0.7));
        }
    }

    endAnim(eventname, eventdata){
        var data = eventdata.getUserData();
        if(eventname==='treeend'&&data.id===this.id){
            this.anim.playAdditive('treer', 0);
        }
    }

    onEnable(){
        if(this.id){
            this.game.eventBus.register('treestart', this.startAnim.bind(this), this.id);
            this.game.eventBus.register('treeend', this.endAnim.bind(this), this.id);
        }
    }

    onDisable(){
        if(this.id){
            this.game.eventBus.unregister('treestart', this.startAnim.bind(this), this.id);
            this.game.eventBus.unregister('treeend', this.endAnim.bind(this), this.id);
        }
    }
}
