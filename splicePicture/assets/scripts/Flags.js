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
            ((i)=>{
                let option = cc.instantiate(this.option);
                let imgNode = option.getChildByName("button_bg");
                let border = imgNode.getChildByName('border');
                border.opacity = 0;
                imgNode.setScale(0.7);
                let item = data[i];
                let parent = i < len ? this.flagL : this.flagR;
                parent.addChild(option);
                console.log(i < len ? "this.flagL" : "this.flagR")
                let sizeY = parent.height*0.8;//放图片所需要的位置长度
                let offset = sizeY/len;
                cc.loader.load(item.optioncontimg,(err,res)=>{
                    if (!err) {
                        var spriteFrame = new cc.SpriteFrame(res);
                        imgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        imgNode.getComponent("OptionJS").init(gameJS,item);
                        border.width = imgNode.width + 12;
                        border.height = imgNode.height + 12;
                        cc.loader.releaseAsset(res);
                        option.x = 0;
                        option.y = offset * (i%len) + offset/2 - sizeY/2;
                        imgNode.getComponent(cc.CircleCollider).radius = Math.min(imgNode.height,imgNode.width) * 0.248 * 1/0.7;
                    }
                });
            })(i);
        }
    },

    checkInitData(initData){
        return Array.isArray(initData);
    }
});
