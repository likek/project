let STATE = new cc.Enum({
    'unable': 0,
    'nomal': 1,
    'right': 2,
    'wrong': 3
});
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad: function () {
        this.show  = this.node.getChildByName("show");
        this.anim  = this.node.getChildByName("anim");
        this.right = this.node.getChildByName("right");
        this.wrong = this.node.getChildByName("wrong");
        this.text  = this.node.getChildByName('text');
        var self   = this;  
        document.addEventListener('resignActivePauseGame', function () {
            self.reloadState();
        });

    },
    reloadState : function (){
        //this.node.getComponent(cc.Button)._pressed = false;
       //切换后台不再触发选中
    },
    init: function (gameJS, option, i, unabled) {

        this.gameJS = gameJS;
        var self = this;

        if (unabled) {
            this.text.active = true;
            this.text.getComponent(cc.Label).string = option;
               cc.loader.loadRes('texture', cc.SpriteAtlas, function (err, atlas) {
               var frame = atlas.getSpriteFrame('fang2');
               self.show.getComponent(cc.Sprite).spriteFrame = frame;
               cc.loader.releaseAsset('texture', cc.SpriteAtlas);
            });
            this.state = STATE.unable;
            this.show.opacity = 255;
            this.anim.opacity = 0;
            this.right.opacity = 0;
            this.wrong.opacity = 0; 
            this.updateState(false);
        }else{
            this.text.active = false;
            this.text.getComponent(cc.Label).string = '';
               cc.loader.loadRes('texture', cc.SpriteAtlas, function (err, atlas) {
               var frame = atlas.getSpriteFrame('fang1');
               self.show.getComponent(cc.Sprite).spriteFrame = frame;
               cc.loader.releaseAsset('texture', cc.SpriteAtlas);
            });
            this.state = STATE.nomal;
            this.show.opacity = 255;
            this.anim.opacity = 0;
            this.right.opacity = 0;
            this.wrong.opacity = 0; 

        }
    },

    optionClick: function () {
        var self = this;
        self.updateState(false);
        this.node.parent.pauseSystemEvents(true);
        //this.gameJS.isShowAnim = true;
       
        this.gameJS.playOptionAudio();
        
    },
   

    //按钮是否可点击
    updateState: function (interactable) {
        var buttonCom = this.node.getComponent(cc.Button);
        buttonCom.interactable = interactable;
    },
    resetState: function (){
        // if(this.state != STATE.unable){
        //    this.state = STATE.nomal;
        //    this.text.active = false;
        //    this.show.opacity = 255;
        //    this.anim.opacity = 0;
        //    this.right.opacity = 0;
        //    this.wrong.opacity = 0;
        // }
        
    }
});