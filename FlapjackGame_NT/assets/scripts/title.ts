const {ccclass, property} = cc._decorator;

@ccclass
export default class Title extends cc.Component {

    @property(cc.Node)
    pinyin: cc.Node = null;

    pinyinJs = null

    onLoad() {
        this.pinyinJs = this.pinyin.getComponent('pinyin');
    }

    setData(title: string){
        if(typeof title === 'string'){
            var r = title.split('_');
            this.pinyinJs.setData(r[0], r[1]);
        }
    }
}
