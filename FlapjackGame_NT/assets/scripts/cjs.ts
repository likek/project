import Flapjack from "../prefabs/flapjack/flapjack";
import TouchObj from "./touch/touchobj";
import StepData from "../prefabs/tips/stepdata";

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
export default class Cjs extends cc.Component {

    @property(Flapjack)
    unitjs: Flapjack = null

    @property(TouchObj)
    touchjs: TouchObj = null

    setData(data: object){
        this.unitjs&&this.unitjs.initFlapjack(data);
        this.touchjs&&this.touchjs.setData(data);
    }
}
