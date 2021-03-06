import TouchOne from "./touchone";
import Unit from "../../prefabs/unit/unit";
import Game from "../game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TouchHandler extends cc.Component {

    /** 不可触碰区域 */
    @property([cc.Node])
    unTouchAreas = new Array<cc.Node>()

    /** 是否可触碰 */
    @property(Boolean)
    touchAble = true

    /** 拖拽 */
    @property(cc.Node)
    dragoption = null

    /** 拖拽 */
    dragoptionJs: Unit = null

    game: Game = null

    /** 触碰id */
    private touchId: number
    /** 触碰节点 */
    private touchNodes = new Array<TouchOne>()
    /** 当前触碰节点 */
    private cTouchNode: TouchOne
    /** 触摸时间记录 */
    private touchAMT: number

    // use this for initialization
    onLoad() {
        this.touchId = undefined;
        this.touchNodes = new Array<TouchOne>()
        this.cTouchNode = null;

        this.dragoptionJs = this.dragoption.getComponent('unit');

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancle, this);
    }

    /** 获取触摸点 */
    getTouchNodes(){
        var r = [];
        var c = function(node: cc.Node){
            node.active&&node.children.forEach(element => {
                if(element.active&&element.getComponent('touchobj') instanceof TouchOne){
                    r.push(element.getComponent('touchobj'));
                }else if(element.childrenCount > 0){
                    c(element)
                }   
            });
        }

        c(this.node);
        return r;
    }

    /** 根据位置获取触摸点 */
    getTouchNodesByPos(pos: cc.Vec2, ninclude: TouchOne):TouchOne{
        var nodes = this.getTouchNodes();
        for(let i = 0, bb; i< nodes.length; i++){
            bb = nodes[i].getBoundingBox();
            if(cc.rectContainsPoint(bb, pos)&&ninclude!==nodes[i]){
                return nodes[i];
            }
        }
        return null;
    }

    /** 开启触摸 */
    enable(){
        this.touchAble = true;
    }

    /** 关闭触摸 */
    disable(){
        this.touchAble = false;
    }

    //开始触摸
    onTouchStart(event){
        if(this.touchAble&&(this.touchId===event.getID()||this.touchId===undefined)){
            let pos = event.getLocation();
            var touchNodes = this.getTouchNodes();
            let numberNode:TouchOne = null;
            let otherNode: TouchOne = null;
            let resultNode:TouchOne = null;
            for(var i = 0, bb; i< touchNodes.length; i++){
                bb = touchNodes[i].getBoundingBox();
                if(cc.rectContainsPoint(bb, pos)){
                    if(this.isNumberNode(touchNodes[i])){
                        numberNode = touchNodes[i];
                        break;
                    }else{
                        otherNode = touchNodes[i];
                    }
                }
            }
            resultNode = numberNode||otherNode||null;
            if(resultNode){
                if(this.cTouchNode){
                    this.cTouchNode.restoreState();
                    this.touchId = undefined;
                }
                if(resultNode.canTouch()){
                    this.cTouchNode = resultNode;
                    this.cTouchNode.saveState(pos);
                    this.touchId = event.getID();
                    this.touchAMT = 0;
                }
            }
        }
    }

    isNumberNode(touchNode:TouchOne):boolean{
        return touchNode.node.name === "unit";
    }

    //触摸移动
    onTouchMove(event){
        if(this.touchAble&&this.touchId===event.getID()&&this.cTouchNode){
            this.touchId = event.getID();
            let pos = event.getLocation();
            var bb = cc.rect(0, -30, cc.winSize.width, cc.winSize.height+30);
            if(!cc.rectContainsRect(bb, (this.dragoption.active?this.dragoption.getBoundingBoxToWorld():this.cTouchNode.node.getBoundingBoxToWorld()))){
                this.cTouchNode.restoreState();
                this.touchId = undefined;
                this.cTouchNode = null;
            }else if(this._isInUnTouchArea(this.dragoption.active?this.dragoption.getBoundingBoxToWorld():this.cTouchNode.node.getBoundingBoxToWorld())){
                this.cTouchNode.restoreState();
                this.touchId = undefined;
                this.cTouchNode = null;
            }else{
                this.cTouchNode.move(pos);
                this.touchAMT = 0;
            }
        }
        var tpos = event.getLocation();
        this.game.eventBus.dispatchEvent('touchmovem', tpos);
    }

    //触摸截止
    onTouchEnd(event){
        if(this.touchAble&&this.touchId===event.getID()&&this.cTouchNode){
            this.touchId = undefined;
            let pos = event.getLocation();
            var target = this.cTouchNode.isToTarget(pos)
            if(target){
                this.cTouchNode.dropAction(target);
                this.cTouchNode = null;
            }else{
                 this.cTouchNode.restoreState();
                 this.cTouchNode = null;
            }
        }
        this.game.eventBus.dispatchEvent('touchreset', null);
    }

    //触摸取消
    onTouchCancle(event){
        if(this.touchAble&&this.touchId===event.getID()&&this.cTouchNode){
            this.touchId = undefined;
            this.cTouchNode.restoreState();
            this.cTouchNode = null;
        }
        this.game.eventBus.dispatchEvent('touchreset', null);
    }

    _isInUnTouchArea(rect: cc.Rect){
       for(let i = 0; i < this.unTouchAreas.length; i++){
            if(cc.rectIntersectsRect(this.unTouchAreas[i].getBoundingBoxToWorld(), rect)){
                return true;
            }
       }
       return false;
    }

    //重置当前触摸项
    reset(){
        if(this.cTouchNode){
            this.cTouchNode.restoreState();
            this.cTouchNode = null;
        }
        this.touchId = undefined;
        this.dragoption.active = false;
    }

    // called every frame, uncomment this function to activate update callback
    update(dt) {
        this.touchAMT+=dt;
        if(this.touchAMT>5&&this.cTouchNode){
            this.reset();
            this.touchAMT = 0;
        }
    }
}
