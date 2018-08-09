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
export default abstract class AbsTips extends Layer {

    /**
     * 开始引导
     */
    abstract startTip();

    /**
     * 关闭引导
     */
    abstract close();

    /**
     * 完成引导
     */
    abstract finish();

    /**
     * 跳过引导
     */
    abstract skip();

    /**
     * 下一步
     */
    abstract nextstep();
}
