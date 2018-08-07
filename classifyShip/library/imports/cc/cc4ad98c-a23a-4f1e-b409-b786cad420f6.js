"use strict";
cc._RF.push(module, 'cc4admMojpPHrQJt4bK1CD2', 'MoveThing');
// scripts/MoveThing.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        thing: cc.Node,
        gameJS: null
    },
    onCollisionEnter: function onCollisionEnter(other, self) {
        var _this = this;

        if (!this.gameJS.collideAble || this.__lastCollisionTime && new Date().getTime() - this.__lastCollisionTime < 1000) return;
        this.__lastCollisionTime = new Date().getTime();
        if (other.node.tag === self.node.tag) {
            //答对了
            this.moveAble = false;
            var _t = this;
            this.rightAnimation(other, self, function () {
                if (!_this.hasSameTypeThing(self.node.tag)) {
                    other.node.parent.getComponent("sp.Skeleton").setAnimation(0, "settle_accounts", false); //出场
                    other.node.tag = -1;
                    other.node.active = false;
                    var progressJS = _this.gameJS.progress.getComponent("ProgressJs");
                    if (_t.isWin()) {
                        console.log("第" + (_this.gameJS.nowQuestionID + 1) + "题答对了");
                        progressJS.playFlayStar(other.node.getPosition(), _t.gameJS.nowQuestionID, 1); //飞星方法
                        setTimeout(function () {
                            _t.gameJS.selectAnswer(true);
                        }, 6000);
                    }
                }
                _this.gameJS.currTouchOption = null;
            });
        } else {
            //答错了
            this.moveAble = true;
            this.resetPosition(function () {
                _this.gameJS.currTouchOption = null;
            });
            this.gameJS.runAnimation.call(this.gameJS, "error");
            this.gameJS.wrongAnswerNum++;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},
    start: function start() {},

    resetPosition: function resetPosition(callback) {
        var _this2 = this;

        if (!this.thing || !this.thing.parent) return;
        var pos = this.thing.convertToWorldSpaceAR(cc.v2(0, 0));
        pos = this.gameJS.scaleNode.convertToNodeSpaceAR(pos);
        var move = cc.moveTo(this.calculateAnimTime(), pos.x, pos.y);
        this.node.runAction(cc.sequence(move, cc.callFunc(function () {
            if (!_this2.thing || !_this2.thing.parent) return;
            var pos = _this2.thing.convertToWorldSpace(cc.v2(0, 0));
            _this2.node.setPosition(pos);
            _this2.thing.opacity = 255;
            _this2.node.opacity = 0;
            _this2.thing.parent.getChildByName('leaf').getComponent("sp.Skeleton").setAnimation(0, "error", false);
            var moveDown = cc.moveBy(0.4, 0, -46).easing(cc.easeCubicActionOut());
            var moveUp = cc.moveBy(0.5, 0, 46).easing(cc.easeCubicActionIn());
            _this2.thing.runAction(cc.sequence(moveDown, moveUp));
            console.log("resetPosition" + _this2.node.ismoving);
            if (typeof callback === "function") callback();
        })), this);
    },
    hasSameTypeThing: function hasSameTypeThing(tag) {
        var containers = this.thing.parent.parent.children;
        var thing = null;
        for (var i = 0; i < containers.length; i++) {
            thing = containers[i].getChildByName('leaf').getChildByName('thing');
            if (thing && thing !== this.thing && thing.tag === tag) {
                return true;
            }
        }
        return false;
    },
    isWin: function isWin() {
        var monkey = this.gameJS.monkey,
            giraffe = this.gameJS.giraffe,
            frog = this.gameJS.frog;
        return monkey.getChildByName("collisionNode").tag === -1 && giraffe.getChildByName("collisionNode").tag === -1 && frog.getChildByName("collisionNode").tag === -1;
    },
    //计算复位动画执行时间
    calculateAnimTime: function calculateAnimTime() {
        var distance = cc.pDistance(this.node.position, cc.p(this.thing.x, this.thing.y));
        var s = distance / 1000;
        s = s > 1 ? 1 : s;
        return s * 0.6;
    },
    rightAnimation: function rightAnimation(other, self, callback) {
        var _this3 = this;

        //
        var otherPos = other.node.convertToWorldSpaceAR(cc.v2(0, 0));
        otherPos = this.gameJS.scaleNode.convertToNodeSpaceAR(otherPos);

        var jump = cc.moveTo(0.3, otherPos.x, otherPos.y + 300, 600, 1);
        var jumpDown = cc.moveTo(0.3, otherPos.x, otherPos.y, 400, 1);
        self.node.runAction(cc.sequence(jump, cc.callFunc(function () {
            self.node.zIndex = -1;
        }), jumpDown, cc.callFunc(function () {
            self.node.opacity = 0;
            self.node.zIndex = 0;
            _this3.gameJS.removeThingByContainerTag.call(_this3.gameJS, _this3.thing.parent.tag);
            _this3.gameJS.runAnimation.call(_this3.gameJS, "right", 1400);
            _this3.gameJS.rightAnswerNum++;
            _this3.resetPosition();
            if (typeof callback === 'function') callback();
        })), this);
    }
    // update (dt) {},
});

cc._RF.pop();