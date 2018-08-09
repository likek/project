const {ccclass, property} = cc._decorator;

@ccclass
export default class Scale extends cc.Component {

    @property(cc.Size)
    designSize: cc.Size = new cc.Size(0,0);

    onLoad () {
        let scale = Math.min(cc.winSize.width/this.designSize.width, cc.winSize.height/this.designSize.height);
        this.node.setScale(scale, scale);
    }
}
