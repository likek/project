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
export default class Background extends cc.Component {

    @property(cc.Size)
    maxSize: cc.Size = new cc.Size(0, 0)

    @property(cc.Node)
    bg: cc.Node = null

    onLoad(){
        if(cc.winSize.width > this.maxSize.width){
            this.bg.width = cc.winSize.width;
        }else{
            this.bg.width = this.maxSize.width;
        }
    }
}
