import TouchHandler from "./touchhandler";
import Game from "../game";
import { UnitData } from "../networkdata";

// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

const {ccclass, property} = cc._decorator;

export enum TouchOneType {
    OPTION, //选项
    TARGET, //目标
    DEFAULT, //默认
    TITLE, //标题
    OPTION_AREA, //选项区域
    NONE,
    TREE,
    CLOUD,
    RAINBOW
}

export enum TouchType {
    DARG_MOVE,
    CLICK,
    DRAG_SLIDE,
    NONE
}

@ccclass
export default abstract class TouchOne extends cc.Component {

    game: Game = null

    id: string
    
    content: string

    oid: string

    type: TouchOneType = TouchOneType.NONE

    infinity: boolean

    /** 触摸类型 */
    touchType = TouchType.NONE

    /** 触摸空余量 */
    private touchOffset: cc.Vec2

    /** 原点 */
    private originPos: cc.Vec2

    /** 原始缩放 */
    private originScale: cc.Vec2

    /** 原始透明度 */
    private originOpacity: number

    /** 原始层级 */
    private zIndex: number

    /** 触摸管理器 */
    handler: TouchHandler

    onLoad() {
        // init logic
        this.touchOffset = cc.p(0, 0);

        this.onLoadObj();
    }

    /**
     * 设置类型
     * @param type 类型
     * @param touchType 触摸类型
     */
    setData(data: UnitData, touchHandler: TouchHandler) {
        this.id = data.id;
        this.content = data.content;
        this.type = this._getType(data.type);
        this.touchType = this._getTouchType(data.touchType);
        this.infinity = data.infinite;
        this.handler = touchHandler;
    }

    _getType(type){
        switch(type){
            case 0:
            return TouchOneType.OPTION;
            case 1:
            return TouchOneType.TARGET;
            case 2:
            return TouchOneType.DEFAULT;
            case 3:
            return TouchOneType.TITLE;
            case 4:
            return TouchOneType.OPTION_AREA;
            case 5:
            return TouchOneType.NONE;
            case 6:
            return TouchOneType.TREE;
            case 7:
            return TouchOneType.CLOUD;
            case 8:
            return TouchOneType.RAINBOW;
        }
    }

    _getTouchType(type){
        switch(type){
            case 0:
            return TouchType.DARG_MOVE;
            case 1:
            return TouchType.CLICK;
            case 2:
            return TouchType.DRAG_SLIDE;
            case 3:
            return TouchType.NONE;
        }
    }

    abstract onLoadObj()

    /** 获取世界坐标表示的包围盒 */
    getBoundingBox(){
        return this.node.getBoundingBoxToWorld();
    }

    /** 是否可触摸 */
    canTouch(){
        if(this.type === TouchOneType.OPTION){
            return this.touchType !== TouchType.NONE;
        } else if(this.type === TouchOneType.DEFAULT){
            return false;
        } else if(this.type === TouchOneType.NONE){
            return false;
        } else if(this.type === TouchOneType.OPTION_AREA){
            return false;
        } else if(this.type === TouchOneType.TARGET){
            return this.touchType !== TouchType.NONE;
        } else if(this.type === TouchOneType.TITLE){
            return false;
        } else if(this.type === TouchOneType.TREE){
            return true;
        } else if(this.type === TouchOneType.CLOUD){
            return true;
        } else if(this.type === TouchOneType.RAINBOW){
            return true;
        }
        return false;
    }

    /** 保存状态 */
    saveState(pos: cc.Vec2){
        if(this.touchType == TouchType.DARG_MOVE||this.touchType == TouchType.DRAG_SLIDE){
            var achorInWorld = this.node.convertToWorldSpaceAR(cc.p(0, 0));
            this.touchOffset = cc.p(pos.x-achorInWorld.x, pos.y-achorInWorld.y);
        
            this.originOpacity = this.node.opacity;
            this.node.opacity = this.infinity?this.originOpacity:0;

            this.handler.dragoption.position = this.handler.dragoption.parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.p(0, 0)));
            this.handler.dragoption.active = true;
            this.handler.dragoption.opacity = this.originOpacity;

            this.handler.dragoptionJs.changeState(this.node.getComponent('unit').getState());
        }else if(this.touchType == TouchType.CLICK){
            this.originScale = new cc.Vec2(this.node.scaleX,this.node.scaleY);
            this.originOpacity = this.node.opacity;
            this.node.scaleX = this.originScale.x * 1;
            this.node.scaleY = this.originScale.y * 1;

            if(this.type===TouchOneType.TREE){
                this.game.playSelectAudio();
                this.game.eventBus.dispatchEvent('treestart', {'id':this.id});
            }else if(this.type===TouchOneType.CLOUD){
                this.game.playSelectAudio();
                this.game.eventBus.dispatchEvent('cloudstart', {'id':this.id});
            }else if(this.type===TouchOneType.OPTION){
                this.game.playSelectAudio();
                this.game.playNumAudio(this.content);
            }
        }
    }

    /** 移动 */
    move(pos: cc.Vec2){
        if(this.touchType == TouchType.DARG_MOVE || this.touchType == TouchType.DRAG_SLIDE){
            let posToP = this.node.parent.convertToNodeSpaceAR(pos);
            this.handler.dragoption.position = this.handler.dragoption.parent.convertToNodeSpaceAR(this.node.parent.convertToWorldSpaceAR(cc.p(posToP.x-this.touchOffset.x, posToP.y-this.touchOffset.y)));
        }else if(this.touchType == TouchType.CLICK){
            //do nothing
            var rect = this.node.getBoundingBoxToWorld();
            if(!rect.contains(pos)){
                this.reset();
            }else{
                if(this.type===TouchOneType.RAINBOW){
                    this.game.eventBus.dispatchEvent('rainbowtouch', {'pos':pos});
                }
            }
        }
        this.game.eventBus.dispatchEvent('handled', {"id": this.id, "type": this.touchType, "state": this.node.getComponent('cjs')&&this.node.getComponent('cjs').unitjs.getState()}, this.node.parent.parent.parent);
    }

    /** 释放 */
    dropAction(target:TouchOne){
        if(this.touchType == TouchType.DARG_MOVE){
            if(this.canCollide(target)){
                if(this.canExchange(target)){
                    this.exChange(target);
                }else{
                    this.restoreState();
                }
            }else{
                this.restoreState();
            }
        }else if(this.touchType == TouchType.DRAG_SLIDE){
            //to implement
        }else if(this.touchType == TouchType.CLICK){
            this.game.eventBus.dispatchEvent('click', {"id": this.id, "type": this.touchType, "state": this.node.getComponent('cjs')&&this.node.getComponent('cjs').unitjs.getState()}, this.node.parent.parent.parent);
            this.restoreState();
        }
    }

    /** 判断是否到达目标点 */
    isToTarget(pos: cc.Vec2): TouchOne{
        if(this.touchType == TouchType.DARG_MOVE){
            return this.handler.getTouchNodesByPos(pos, this);
        }else if(this.touchType == TouchType.DRAG_SLIDE){
            //to implement
            return null;
        }else if(this.touchType == TouchType.CLICK){
            return this;
        }
    }

    /** 恢复状态 */
    restoreState(){
        if(this.touchType == TouchType.DARG_MOVE||this.touchType == TouchType.DRAG_SLIDE){
            this.touchOffset = cc.p(0, 0);
            this.handler.dragoption.active = false;
            this.node.opacity = this.originOpacity;
        }else if(this.touchType == TouchType.CLICK){
            this.node.scaleX = this.originScale.x;
            this.node.scaleY = this.originScale.y;
            this.node.opacity = this.originOpacity;

            if(this.type===TouchOneType.TREE){
                this.game.eventBus.dispatchEvent('treeend', {'id':this.id});
            }else if(this.type===TouchOneType.CLOUD){
                this.game.eventBus.dispatchEvent('cloudend', {'id':this.id});
            }
        }
    }

    /** 停止触摸 */
    disableTouch(){
        this.handler.disable();
    }

    /** 开启触摸 */
    enableTouch(){
        this.handler.enable();
    }

    /** 重置 */
    reset(){
        this.handler.reset();
    }

    /**
     * 是否可以碰撞
     * @param other 另外一个触摸项
     */
    canCollide(other: TouchOne): boolean {
        if(this.type===TouchOneType.OPTION&&other.type===TouchOneType.TARGET){
            if(this.touchType===TouchType.DARG_MOVE&&other.touchType===TouchType.DARG_MOVE){
                return true;
            }else if(this.touchType===TouchType.DARG_MOVE&&other.touchType===TouchType.NONE){
                return true;
            }
        }else if(this.type===TouchOneType.TARGET&&other.type===TouchOneType.TARGET){
            if(this.touchType===TouchType.DARG_MOVE&&other.touchType===TouchType.DARG_MOVE){
                return true;
            }else if(this.touchType===TouchType.DARG_MOVE&&other.touchType===TouchType.NONE){
                return true;
            }
        }else if(this.type===TouchOneType.TARGET&&other.type===TouchOneType.OPTION_AREA){
            return true;
        }
        return false;
    };

    /**
     * 是否可以交换
     * @param other 另外一个触摸项
     */
    canExchange(other: TouchOne): boolean {
        if(this.type===TouchOneType.OPTION&&other.type===TouchOneType.TARGET){
            if(this.touchType===TouchType.DARG_MOVE&&other.touchType===TouchType.DARG_MOVE){
                return true;
            }else if(this.touchType===TouchType.DARG_MOVE&&other.touchType===TouchType.NONE){
                return true;
            }
        }else if(this.type===TouchOneType.TARGET&&other.type===TouchOneType.TARGET){
            if(this.touchType===TouchType.DARG_MOVE&&other.touchType===TouchType.DARG_MOVE){
                return true;
            }else if(this.touchType===TouchType.DARG_MOVE&&other.touchType===TouchType.NONE){
                return true;
            }
        }else if(this.type===TouchOneType.TARGET&&other.type===TouchOneType.OPTION_AREA){
            return true;
        }
        return false;
    };

    /**
     * 交换
     * @param other 另外一个触摸项
     */
    exChange(other: TouchOne) {
        if(!this.infinity){
            this.touchType = TouchType.NONE;
        }

        this.handler.dragoption.active = false;

        if(this.type===TouchOneType.OPTION){
            if(other.type===TouchOneType.TARGET){
                this.game.eventBus.dispatchEvent('changestate', {"id": other.id, "oid": this.id, "state": this.node.getComponent('cjs').unitjs.getState()}, this.node.parent.parent.parent);
            }
        }else if(this.type===TouchOneType.TARGET){
            if(other.type===TouchOneType.TARGET){
                this.game.eventBus.dispatchEvent('changestate', {"id": other.id, "oid": this.oid, "state": this.node.getComponent('cjs').unitjs.getState()}, this.node.parent.parent.parent);
                this.game.eventBus.dispatchEvent('changestate', {"id": this.id,  "oid": other.oid, "state": other.node.getComponent('cjs').unitjs.getState()}, this.node.parent.parent.parent);
            }else if(other.type===TouchOneType.OPTION_AREA){
                this.game.eventBus.dispatchEvent('toinit', {"id": this.id}, this.node.parent.parent.parent);
                this.game.eventBus.dispatchEvent('toinit', {"id": this.oid}, this.node.parent.parent.parent);
            }
        }
    };
}
