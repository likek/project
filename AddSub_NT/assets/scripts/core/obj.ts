import TouchOne from "../touch/touchone";
import Game from "../game";

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
export default abstract class Obj extends cc.Component {

    /**
     * 核心
     */
    @property(Game)
    game: Game = null

    /**
     * 初始数据
     */
    data: object

    /**
     * 初始状态
     */
    initState: object

    /**
     * 上一个状态
     */
    lastState: object

    /**
     * 当前状态
     */
    currentState: object

    /**
     * 触摸
     */
    touchone: TouchOne

    /**
     * 设置数据
     */
    abstract setData(data: any);

    /**
     * 刷新
     */
    abstract refresh();

    /**
     * 设置数据
     */
    abstract getState(): object;

    /**
     * 改变状态
     */
    abstract changeState(state: object);

    /**
     * 是否需要重置
     */
    abstract isNeedReset(): boolean;

    /**
     * 重置
     */
    abstract reset(): boolean;

}
