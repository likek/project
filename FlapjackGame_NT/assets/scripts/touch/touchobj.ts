import TouchOne from "./touchone";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TouchObj extends TouchOne {

    onLoadObj(){
        
    }

    canTouch(): boolean{
        return this.data&&this.data['cantouch']&&this.data['bg']!==2;
    }

    dropAction(target:TouchOne){
        if(this.data['type']===1){
            this.handler.disable();
            var tpos = this.handler.dragoption.parent.convertToNodeSpaceAR(this.data['targetJs'].node.convertToWorldSpaceAR(cc.p(0, 0)));
            var distance = Math.min(cc.pDistance(tpos, this.handler.dragoption.position),1000);
            this.handler.dragoption.runAction(cc.sequence(
                cc.jumpTo(distance/1000, tpos, 30, 1),
                cc.callFunc(function(){
                    this.data['targetJs'].node.getComponent('cjs').unitjs['changeCookState'](this.data['bg'], this.node.scaleY);
                    this.data['targetJs'].node.scaleY = this.node.scaleY;
                    this.data['targetJs'].node.active = true;
                    this.restoreState();
                    this.node.active = false;
                    this.node.parent.parent.getComponent('pan').removeAFlapjack(this.data['id']);
                    this.handler.enable();
                    this.game.eventBus.dispatchEvent('tipnextstep', null, this.game.tips);
                }, this)
            ));
        }else{
            var d:object = {
                'bg': this.data['bg'],
                'id': this.data['id'],
                'opos': this.data['opos'],
                'cantouch': true,
                'target': this.data['target'],
                'targetJs': this,
                'otargetJs': this.data['targetJs'],
                'type': 1,
                'platearea': this.data['platearea'],
                'scaleY': this.node.scaleY
            };
            this.data['targetJs']['addAFlapjack'](d);
            this.restoreState();
            this.node.active = false;
        }
    }

    isToTarget(pos: cc.Vec2): TouchOne {
        if(this.data['type']===1&&this._isRectsContainsPoint(this.data['platearea'], pos)){
            return this;
        }else if(this.data['type']!==1&&cc.rectContainsPoint(this.data['target'], pos)&&this.data['targetJs']['canAdd']()){
            return this;
        }
        return null;
    }

    _isRectsContainsPoint(targets:cc.Rect[], pos: cc.Vec2): boolean{
        var r: boolean = false;
        for(var i = 0; i < targets.length; i++){
            if(cc.rectContainsPoint(targets[i], pos)){
                r = true;
                break;
            }
        }
        return r;
    }

    canCollide(other: TouchOne): boolean {
        return false;
    }

    canExchange(other: TouchOne): boolean {
        return false;
    }

    exChange(other: TouchOne) {

    }
}
