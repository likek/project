const {ccclass, property} = cc._decorator;

@ccclass
export default class EventBus extends cc.Component {

    eventList: Map<cc.Node,Map<string, Array<Function>>> = new Map<cc.Node,Map<string, Array<Function>>> ();

    dispatchEvent(eventName: string, eventData: Object, area?: cc.Node){//发送事件
        var event = new cc.Event.EventCustom(eventName, true);
        area = area?area:this.node;
        if(eventData){
            eventData['area'] = area;
        }else{
            eventData = {'area': area};
        }
        event.setUserData(eventData);
        area?area.dispatchEvent(event):this.node.dispatchEvent(event);
    }

    register(eventName: string, callback: Function, callbackID: string, area?: cc.Node){//注册事件监听
        if(area){
            if(this.eventList.get(area)&&this.eventList.get(area).has(eventName)){
                var list = this.eventList.get(area).get(eventName);
                if(!list){
                    callback['callbackID'] = callbackID;
                    this.eventList.get(area).set(eventName, [callback]);
                }else if(list instanceof Array&&!this._isNotSame(list, callbackID)){
                    callback['callbackID'] = callbackID;
                    list.push(callback);
                }
            }else{
                if(!this.eventList.get(area)){
                    this.eventList.set(area, new Map<string, Array<Function>>());
                }   
                callback['callbackID'] = callbackID;
                this.eventList.get(area).set(eventName, [callback]);
                area.on(eventName, this.callback, this);
            }
        }else{
            if(this.eventList.get(this.node)&&this.eventList.get(this.node).has(eventName)){
                var list = this.eventList.get(this.node).get(eventName);
                if(!list){
                    callback['callbackID'] = callbackID;
                    this.eventList.get(this.node).set(eventName, [callback]);
                }else if(list instanceof Array&&!this._isNotSame(list, callbackID)){
                    callback['callbackID'] = callbackID;
                    list.push(callback);
                }
            }else{
                if(!this.eventList.get(this.node)){
                    this.eventList.set(this.node, new Map<string, Array<Function>>());
                }
                callback['callbackID'] = callbackID;
                this.eventList.get(this.node).set(eventName, [callback]);
                this.node.on(eventName, this.callback, this);
            }
        }
    }

    _isNotSame(list:Array<Function>, callbackID: string): boolean{
        for(var i =0; i < list.length; i ++){
            if(list[i]['callbackID']===callbackID){
                return true;
            }
        }
        return false;
    }

    callback(event: cc.Event.EventCustom){
        var eventName = event.getEventName();
        var eventData = event;
        var list = this.eventList.get(eventData.getUserData()['area'])&&this.eventList.get(eventData.getUserData()['area']).get(eventName);
        for(var i = 0; list&&i < list.length; i++){
            list[i]&&list[i](eventName, eventData);
        }

    }   

    unregister(eventName: string, callback: Function, callbackID: string, area?: cc.Node){//取消事件监听
        if(area){
            if(this.eventList.get(area)&&this.eventList.get(area).has(eventName)){
                var list = this.eventList.get(area).get(eventName);
                var r = [];
                for(var i = 0; list instanceof Array&&i < list.length; i++){
                    if(list[i]['callbackID']!==callbackID){
                        r.push(list[i]);
                    }
                }
    
                if(r.length===0){
                    this.eventList.get(area).delete(eventName);
                    area.off(eventName, this.callback, this);
                }else{
                    this.eventList.get(area).set(eventName, r);
                }
            }else{
                area.off(eventName, this.callback, this)
            }
        }else{
            if(this.eventList.get(this.node)&&this.eventList.get(this.node).has(eventName)){
                var list = this.eventList.get(this.node).get(eventName);
                var r = [];
                for(var i = 0; list instanceof Array&&i < list.length; i++){
                    if(list[i]['callbackID']!==callbackID){
                        r.push(list[i]);
                    }
                }
    
                if(r.length===0){
                    this.eventList.get(this.node).delete(eventName);
                    this.node.off(eventName, this.callback, this);
                }else{
                    this.eventList.get(this.node).set(eventName, r);
                }
            }else{
                this.node.off(eventName, this.callback, this)
            }
        }
        
    }
}
