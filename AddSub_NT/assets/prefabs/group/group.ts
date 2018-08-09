import AbsGroup from "./absgroup";
import { GROUP_TYPE, UNIT_TYPE, UNIT_TOUCH_TYPE, GroupData, UnitData } from "../../scripts/networkdata";
import Cjs from "../unit/cjs";

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
export default class Group extends AbsGroup {

    data: GroupData 

    initState: Array<UnitData>

    lastState: Array<UnitData>

    currentState: Array<UnitData>

    @property([cc.Prefab])
    oPrefabs = new Array<cc.Prefab>();

    onLoad(){
    }

    setData(data: GroupData){
        this.data = data;

        this.node.removeAllChildren();

        for(var i = 0, t, length = this.data.objs.length; this.data&&i < this.data.objs.length; i++){
            t = cc.instantiate(this.oPrefabs[0]);

            if(this.data.type === GROUP_TYPE.GRID){
                if(this.data.colNum===-1){
                    this.data.objs[i].x = -this.data.horizontalSpace*(length/2-0.5) + i*this.data.horizontalSpace;
                    this.data.objs[i].y = 0;
                }else{
                    this.data.objs[i].x = -this.data.horizontalSpace*(Math.min(this.data.colNum, length)/2-0.5) + (i%this.data.colNum)*this.data.horizontalSpace;
                    this.data.objs[i].y = this.data.verticalSpace*((Math.ceil(length/this.data.colNum)/2)-0.5) - (Math.floor(i/this.data.colNum))*this.data.verticalSpace;
                }
            }else{
                this.data.objs[i].x = -this.data.horizontalSpace*(length/2-0.5) + i*this.data.horizontalSpace;
                this.data.objs[i].y = this.game.randomY[i];
            }

            this.data.objs[i].randomtime = this.game.randomAT[i];
            
            t.getComponent('cjs').unitjs.game = this.game;
            t.getComponent('cjs').touchjs.game = this.game;
            t.parent = this.node;
            t.getComponent('cjs').unitjs.setData(this.data.objs[i]);
            t.getComponent('cjs').touchjs.setData(this.data.objs[i], null);
        }

        this.refresh();
    };

    refresh(){
        this.node.x = this.data.x;
        this.node.y = this.data.y;
        this.node.width = this.data.width;
        this.node.height = this.data.height;
    }

    getState(): Array<UnitData>{
        var r = [];
        for(var i = 0; i < this.node.children.length; i++){
            r.push(this.node.children[i].getComponent('cjs').unitjs.getState());
        }
        return r;
    };

    changeState(){
        //do nothing
    }

    isNeedReset(): boolean{
        for(var i = 0; i < this.node.children.length; i++){
            if(!this.node.children[i].getComponent('cjs').unitjs.isNeedReset()){
                return true;
            }
        }
        return false;
    };

    reset(): boolean{
        if(this.isNeedReset()){
            for(var i = 0; i < this.node.children.length; i++){
                this.node.children[i].getComponent('cjs').unitjs.reset();
            }
            return true;
        }else{
            return false;
        }
    };

    getAllObjs(): Array<Cjs> {
        var r = [];
        for(var i = 0; i < this.node.children.length; i++){
            r.push(this.node.children[i].getComponent('cjs'));
        }
        return r;
    }
}
