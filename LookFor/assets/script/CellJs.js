let skineName = {
    "A" :"blue",
    "B" :"orange",
    "C" :"red",
    "D" :"yellow",
    "?" :"white",
}
 


cc.Class({
    extends: cc.Component,

    properties: {
        falgSpine :cc.Node,
       
    },

    // use this for initialization
    onLoad: function () {
        //类型
        this.type = ""
        this.falgSp = this.falgSpine.getComponent("sp.Skeleton")

    },
   
    setCellSkine :function (type) {
        this.type = type 
        this.falgSp.setSkin(skineName[type])
    },

    //设置显示
    showIn:function () {
        if (this.type == "?" || this.type == "？") {
            this.falgSp.setAnimation(0,"in_white",false)
            this.falgSp.addAnimation(0,"stand_white",true,0.4)
        }else{
            this.falgSp.setAnimation(0,"in",false)
            this.falgSp.addAnimation(0,"stand_colour",true,0.4)

        }
    },

    //设置显示
    showOut:function () {
        this.falgSp.setAnimation(0,"out",false)
        this.scheduleOnce(function(){
            this.node.removeFromParent()
        },0.4);
    },
    showRight:function () {
        this.falgSp.setAnimation(0,"select_light",false)
    },
    //答对的需要从问号变成对的颜色
    showColor :function (no) {
        this.falgSp.setSkin(skineName[no])
        this.falgSp.setAnimation(0,"stand_colour",true)
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
