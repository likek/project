cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label
    },

    init: function(title) {  
        this.label.string = title;
    }
});
