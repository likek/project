import { GameData } from "../networkdata";
import Game from "../game";
import TouchHandler from "../touch/touchhandler";

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
export default abstract class Layer extends cc.Component {

    game: Game

    @property(cc.Node)
    scale: cc.Node = null;

    @property(TouchHandler)
    touchHandler: TouchHandler = null

    onLoad(){
        this.load();
    }

    /**
     * 加载
     */
    abstract load();

    /**
     * 设置数据
     */
    abstract setData(data: GameData, questionIndex: number);

    /**
     * 暂停
     */
    abstract pause();

    /**
     * 恢复
     */
    abstract resume();

}
