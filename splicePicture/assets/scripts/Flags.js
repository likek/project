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
        if(!this.checkInitData(data))return;
        let len = data.length/2;
        for(let i= 0;i<data.length;i++){
            ((i)=>{
                let option = cc.instantiate(this.option);
                let imgNode = option.getChildByName("button_bg");
                let item = data[i];
                let parent = i <= len - 1 ? this.flagL : this.flagR;
                let sizeY = parent.height*0.8;//放图片所需要的位置长度
                let offset = sizeY/len;
                cc.loader.load(item.optioncontimg,(err,res)=>{
                    if (!err) {
                        var spriteFrame = new cc.SpriteFrame(res);
                        imgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        imgNode.getComponent("OptionJS").init(gameJS,item);
                        cc.loader.releaseAsset(res);
                        parent.addChild(option);
                        option.x = 0;
                        option.y = offset * (i%3) + offset/2 - sizeY/2;
                        console.log(option.y);
                    }
                });
            })(i);
        }
    },

    checkInitData(initData){
        return Array.isArray(initData);
    }
});
