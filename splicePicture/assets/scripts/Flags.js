cc.Class({
    extends: cc.Component,

    properties: {
        flagL: cc.Node,//左边旗子
        flagR: cc.Node,
        option: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    initData(data,gameJS){
        this.flagL.removeAllChildren();
        this.flagR.removeAllChildren();
        if(!this.checkInitData(data))return;
        let len = data.length/2;
        for(let i= 0;i<data.length;i++){
            let option = cc.instantiate(this.option);
            let imgNode = option.getChildByName("button_bg");
            let border = imgNode.getChildByName('border');
            border.opacity = 0;
            imgNode.setScale(0.7);
            let item = data[i];
            let parent = i < len ? this.flagL : this.flagR;
            parent.addChild(option);
            let sizeY = parent.height*0.8;//放图片所需要的位置长度
            let offset = sizeY/len;
            imgNode.getComponent(cc.Sprite).spriteFrame = gameJS.getSpriteFrame(item.optioncontimg);
            imgNode.getComponent("OptionJS").init(gameJS,item);
            imgNode.tag = 100 + i;
            border.width = imgNode.width + 12;
            border.height = imgNode.height + 12;
            option.x = 0;
            option.y = offset * (i%len) + offset/2 - sizeY/2 - parent.height*0.046;
            imgNode.getComponent(cc.CircleCollider).radius = Math.min(imgNode.height,imgNode.width) * 0.248 * 1/0.7;
            let rotateDirection = Math.random() < 0.5 ? 1 : -1;
            let rotateDegree = Math.random() * 20 * rotateDirection;
            imgNode.setRotation(rotateDegree);
        }
    },

    checkInitData(initData){
        return Array.isArray(initData);
    }
});
