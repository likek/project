import TouchHandler from "./touchhandler";
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
export default abstract class TouchOne extends cc.Component {

    @property(Game)
    game: Game = null;

    data: object

    /** 触摸空余量 */
    private touchOffset: cc.Vec2

    /** 原始缩放 */
    private originScale: cc.Vec2

    /** 原始透明度 */
    private originOpacity: number

    /** 触摸管理器 */
    handler: TouchHandler

    onLoad() {
        // init logic
        this.touchOffset = cc.p(0, 0);

        this.onLoadObj();
    }

    /**
     * 设置类型
     * @param type 类型
     * @param touchType 触摸类型
     */
    setData(data) {
        this.data = data;
    }

    abstract onLoadObj()

    /** 获取世界坐标表示的包围盒 */
    getBoundingBox(){
        return this.node.getBoundingBoxToWorld();
    }

    /** 是否可触摸 */
    abstract canTouch(): boolean;

    /** 保存状态 */
    saveState(pos: cc.Vec2){
        var achorInWorld = this.node.convertToWorldSpaceAR(cc.p(0, 0));
        this.touchOffset = cc.p(pos.x-achorInWorld.x, pos.y-achorInWorld.y);
        this.originOpacity = this.node.opacity;
        this.originScale = cc.p(this.node.scaleX, this.node.scaleY);
        this.node.opacity = this.data&&this.data['infinity']?this.originOpacity:0;

        this.handler.dragoption.position = this.handler.dragoption.parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.p(0, 0)));
        this.handler.dragoption.active = true;
        this.handler.dragoption.opacity = this.originOpacity;
        this.handler.dragoption.scaleX = this.node.scaleX;
        this.handler.dragoption.scaleY = this.node.scaleY;

        this.handler.dragoptionJs.changeState(this.node.getComponent('cjs').unitjs.getState());
        this.game&&this.game.playPressAudio();
    }

    /** 移动 */
    move(pos: cc.Vec2){
        let posToP = this.node.parent.convertToNodeSpaceAR(pos);
        this.handler.dragoption.position = this.handler.dragoption.parent.convertToNodeSpaceAR(this.node.parent.convertToWorldSpaceAR(cc.p(posToP.x-this.touchOffset.x, posToP.y-this.touchOffset.y)));
    }

    /** 释放 */
    abstract dropAction(target:TouchOne);

    /** 判断是否到达目标点 */
    abstract isToTarget(pos: cc.Vec2): TouchOne;

    /** 恢复状态 */
    restoreState(){
        this.touchOffset = cc.p(0, 0);
        this.node.scaleX = this.originScale.x;
        this.node.scaleY = this.originScale.y;
        this.node.opacity = this.originOpacity;

        this.handler.dragoption.active = false;
        this.game&&this.game.playDropAudio();
    }

    /** 停止触摸 */
    disableTouch(){
        this.handler.disable();
    }

    /** 开启触摸 */
    enableTouch(){
        this.handler.enable();
    }

    /** 重置 */
    reset(){
        this.handler.reset();
    }

    /**
     * 是否可以碰撞
     * @param other 另外一个触摸项
     */
    abstract canCollide(other: TouchOne): boolean;

    /**
     * 是否可以交换
     * @param other 另外一个触摸项
     */
    abstract canExchange(other: TouchOne): boolean;

    /**
     * 交换
     * @param other 另外一个触摸项
     */
    abstract exChange(other: TouchOne);
}
