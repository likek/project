cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        selected_node: cc.Node
    },
    onLoad: function() {
        this.isSelect = false;
        this.sp = this.node.getComponent("cc.Sprite");
    },
    init: function(gameJS, idx){  
        this.gameJS = gameJS;
        this.idx = idx;
        var str = "" + ( idx + 1 ) + "";
        this.label.string = str;
        this.selected_node.opacity = 0;
    },

    onClick: function(){
        this.gameJS.changQustion(this.idx);
    },

    setSelected: function(val){
        this.isSelect = val;
        this.selected_node.opacity = val ? 255 : 0;
    },

});
