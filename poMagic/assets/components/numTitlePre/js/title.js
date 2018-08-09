cc.Class({
    extends: cc.Component,

    properties: {
        label : cc.Label,
        img : cc.Sprite
    },

    // use this for initialization
    onLoad: function () {
     
    },

    setTitle: function(title,img){
    if (img&&img instanceof Array && img.length > 1 ) {
            this.img.enabled = true 
            this.img.spriteFrame = this.game.getSpriteFrame(img[img.length-1]);
            this.label.string = '';
    
        }else if (typeof title === 'string') {
            //替换加减= ？为可显示字符串  取值为 0之前的ascall 值  , - . /
            let newTitle = title.replace(/\+/g, ',').replace(/\=/g, '.').replace(/\?/g, '/')
            // /g全局搜索
            this.label.string = newTitle;
            this.img.spriteFrame = null ;
            
        }
        //清除锯齿
        this.label.font.spriteFrame.getTexture().setAliasTexParameters();

    },

    reset: function(){
        this.label.string = '';
        this.img.spriteFrame = null ;
        this.img.enabled = false 
        
        
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
