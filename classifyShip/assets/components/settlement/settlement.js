let DB_ANIM_ASSET = {
    'win': 'happy',
    'lose': 'tear'
};

cc.Class({
    extends: cc.Component,

    properties: {
        failSpine: cc.Node, //1颗星
        twoStarSpine: cc.Node, //2颗星
        successSpine: cc.Node, //3颗星
        timeOutSpine: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.background = this.node.getChildByName('background');
        this.scale = this.node.getChildByName('scale');
    },

    //播放获胜动画
    playWinAnim: function (callback) {
        this.node.active = true;
        this.background.active = true;
        this.successSpine.active = true

        var R2 = this.successSpine.getChildByName('R2');
        var R1 = this.successSpine.getChildByName('R1');
        var L2 = this.successSpine.getChildByName('L2');
        var L1 = this.successSpine.getChildByName('L1');
        var three_star = this.successSpine.getChildByName('three_star_');
        var three_star_p = this.successSpine.getChildByName('three_star');
        R2.getComponent("sp.Skeleton").setAnimation(0, "in", false)
        R1.getComponent("sp.Skeleton").setAnimation(0, "in", false)
        L2.getComponent("sp.Skeleton").setAnimation(0, "in", false)
        L1.getComponent("sp.Skeleton").setAnimation(0, "in", false)
        three_star.getComponent("sp.Skeleton").setAnimation(0, "in", false)
        this.scheduleOnce(function () {
            let anim =  three_star_p.getComponent(cc.Animation);
            anim.on('stop', function(){
            }, this);
        },0.33);

        let that = this
        this.scheduleOnce(function () {
            R2.getComponent("sp.Skeleton").setAnimation(0, "stand", true)
            R1.getComponent("sp.Skeleton").setAnimation(0, "stand", true)
            L2.getComponent("sp.Skeleton").setAnimation(0, "stand", true)
            L1.getComponent("sp.Skeleton").setAnimation(0, "stand", true)
            three_star.getComponent("sp.Skeleton").setAnimation(0, "stand", true)
            // three_star_p.removeFromParent();

        }, 1.5);     
        this.scheduleOnce(function () {
            three_star_p.getChildByName('green').getComponent(cc.ParticleSystem).stopSystem(),
            three_star_p.getChildByName('orange').getComponent(cc.ParticleSystem).stopSystem(),
            three_star_p.getChildByName('pink').getComponent(cc.ParticleSystem).stopSystem(),
            three_star_p.getChildByName('red').getComponent(cc.ParticleSystem).stopSystem();

        }, 2.5);     

        this.scheduleOnce(function () {
            callback && callback.call(that.game);
        }, 2.5);

    },
    //播放获胜动画
    playTwoStarAnim: function (callback) {
        this.node.active = true;
        this.background.active = true;
        this.twoStarSpine.active = true
        var R2 = this.twoStarSpine.getChildByName('R2');
        var L2 = this.twoStarSpine.getChildByName('L2');
        var two_star = this.twoStarSpine.getChildByName('two_star');
        var two_star_p = this.twoStarSpine.getChildByName('two_star1');

        R2.getComponent("sp.Skeleton").setAnimation(0, "in", false)
        L2.getComponent("sp.Skeleton").setAnimation(0, "in", false)
        two_star.getComponent("sp.Skeleton").setAnimation(0, "in", false)

        this.scheduleOnce(function () {
            R2.getComponent("sp.Skeleton").setAnimation(0, "stand", true)
            L2.getComponent("sp.Skeleton").setAnimation(0, "stand", true)
            two_star.getComponent("sp.Skeleton").setAnimation(0, "stand", true)
        }, 1.5);     
        this.scheduleOnce(function () {
            two_star_p.getChildByName('green').getComponent(cc.ParticleSystem).stopSystem(),
            two_star_p.getChildByName('orange').getComponent(cc.ParticleSystem).stopSystem(),
            two_star_p.getChildByName('pink').getComponent(cc.ParticleSystem).stopSystem(),
            two_star_p.getChildByName('red').getComponent(cc.ParticleSystem).stopSystem();

        }, 2.5);     
        let that = this
        this.scheduleOnce(function () {
            callback && callback.call(that.game);
        }, 2.5);

    },
    //播放失败动画
    playLoseAnim: function (callback) {

        this.node.active = true;
        this.background.active = true;
        this.failSpine.active = true
        var star = this.failSpine.getChildByName('star');
        var R2 = this.failSpine.getChildByName('R2');
        var one_star = this.failSpine.getChildByName('one_star');

        star.getComponent("sp.Skeleton").setAnimation(0, "in", false)
        R2.getComponent("sp.Skeleton").setAnimation(0, "in", false)
        one_star.getComponent("sp.Skeleton").setAnimation(0, "in", false)

        let that = this
        this.scheduleOnce(function () {
            star.getComponent("sp.Skeleton").setAnimation(0, "stand", true)
            R2.getComponent("sp.Skeleton").setAnimation(0, "stand", true)
            one_star.getComponent("sp.Skeleton").setAnimation(0, "stand", true)

        }, 1.5);
        this.scheduleOnce(function () {
            callback && callback.call(that.game);
        }, 2.5);

    },

    //播放失败动画
    playTimeUpAnim: function (callback) {

        this.node.active = true;
        this.background.active = true;
        this.timeOutSpine.active = true
        this.timeOutSpine.getComponent("sp.Skeleton").setAnimation(0, "time_over", false)
        let that = this

        this.scheduleOnce(function () {
            callback && callback.call(that.game);
        }, 1);

    },

    //重置
    reset: function () {

        this.background.active = false;
        this.failSpine.active = false
        this.twoStarSpine.active = false
        this.successSpine.active = false
        this.timeOutSpine.active = false
        this.node.active = false;

    },

    log: function (msg) {
        if (CONSOLE_LOG_OPEN) cc.log(msg);
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});