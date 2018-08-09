import StepData from "../prefabs/tips/stepdata";
import Cjs from "./cjs";
import Pan from "./pan";
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
export default class Plates extends cc.Component {

    @property(Game)
    game: Game = null

    @property(cc.Node)
    lplate: cc.Node = null

    @property(cc.Node)
    rplate: cc.Node = null

    @property(cc.Node)
    panarea: cc.Node = null

    @property(Pan)
    panJs: Pan = null

    @property(cc.Prefab)
    flapjackPrefab: cc.Prefab = null

    objs: Cjs[] = [];

    objsMap = {};

    onLoad(){
    }

    setData(data: number){
        this.lplate.removeAllChildren(true);
        this.rplate.removeAllChildren(true);
        this.objs= [];
        this.objsMap = {};
        for(var i = 0, f; typeof data === 'number'&&i < data; i++){
            if(i<4){
                f = cc.instantiate(this.flapjackPrefab);
                f.position = cc.p(0, 360-90-i*180);
                f.parent = this.lplate;

                this.objs.push(f.getComponent('cjs'));
                this.objsMap['f'+i] = f.getComponent('cjs');
                f.getComponent('cjs').unitjs.game = this.game;
                f.getComponent('cjs').touchjs.game = this.game;
                f.getComponent('cjs').setData({
                    'bg': 0,
                    'id': 'f'+i,
                    'opos': f.convertToWorldSpaceAR(cc.p(0, 0)),
                    'cantouch': true,
                    'target': this.panarea.getBoundingBoxToWorld(),
                    'targetJs': this.panJs,
                    'platearea': this.getPlateArea()
                });
            }else if(i < 8){
                f = cc.instantiate(this.flapjackPrefab);
                f.position = cc.p(0, 360-90-(i-4)*180);
                f.parent = this.rplate;
                this.objs.push(f.getComponent('cjs'));
                f.getComponent('cjs').unitjs.game = this.game;
                f.getComponent('cjs').touchjs.game = this.game;
                this.objsMap['f'+i] = f.getComponent('cjs');
                f.getComponent('cjs').setData({
                    'bg': 0,
                    'id': 'f'+i,
                    'opos': f.convertToWorldSpaceAR(cc.p(0, 0)),
                    'cantouch': true,
                    'target': this.panarea.getBoundingBoxToWorld(),
                    'targetJs': this.panJs,
                    'platearea': this.getPlateArea()
                });
            }
        }   
    }

    getPlateArea(){
        var r = [];
        this.lplate.active&&r.push(this.lplate.getBoundingBoxToWorld());
        this.rplate.active&&r.push(this.rplate.getBoundingBoxToWorld());
        return r;
    }

    isNeedReset(){
        var r = false;
        for(var i = 0; i < this.objs.length; i++){
            if(this.objs[i].unitjs.isNeedReset()){
                return true;
            }
        }
        return false;
    }

    reset(){
        for(var i = 0; i < this.objs.length; i++){
            this.objs[i].unitjs.reset();
        }
    }
}
