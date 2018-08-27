cc.Class({
    extends: cc.Component,

    properties: {
        //草地
        lawnNightTex: cc.SpriteFrame,
        lawnTex: cc.SpriteFrame,

        //灯
        lightTex: cc.SpriteFrame,
        lightNightTex: cc.SpriteFrame,

        //题目框背景
        questionTex: cc.SpriteFrame,
        questionNightTex: cc.SpriteFrame,

        //青蛙
        frogRight: cc.SpriteFrame,
        // frogWrong: cc.SpriteFrame,
        frogNomal: cc.SpriteFrame,
        fronBody: cc.SpriteFrame,

        //萤火虫
        chong1: cc.SpriteFrame,
        chong2: cc.SpriteFrame,

        rightAudio: {
            url: cc.AudioClip,
            default: null
        },
        wrongAudio: {
            url: cc.AudioClip,
            default: null
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
