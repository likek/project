import Layer from "../../scripts/core/layer";


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
export default abstract class AbsProgress extends Layer {

    /**
     * 游戏是否正确
     */
    abstract isRight(): boolean;

    /**
     * 是否需要重置
     */
    abstract isNeedReset(): boolean;

    /**
     * 是否完成
     */
    abstract isFinish(): boolean;

    /**
     * 重置
     */
    abstract reset(): boolean;

    /**
     * 提交
     */
    abstract commit();
}