const {ccclass, property} = cc._decorator;

export enum TimerType {
    COUNTDOWN,//单题倒计时
    TOTAL_COUNTDOWN,//总倒计时
    COUNTUP//正计时, 总时间需设置为3600
}

@ccclass
export default class Timer extends cc.Component {

    @property([cc.Component.EventHandler])
    timeupCallFunc = new Array<cc.Component.EventHandler>()

    @property(cc.Label)
    timelable: cc.Label = null

    @property({
        type: cc.Enum(TimerType)
    })
    type:TimerType = TimerType.COUNTDOWN

    count: number = 0;
    totalcount: number = 0;
    ctotaltime: number = 0;
    totaltime: any = [];
    isinit: boolean = false;
    stimecount: number = 0;
    isTiming: boolean = false;
    validstate: boolean = false;
    istoend: boolean = false;

    //初始化计时器
    iniTimer(type, totaltime){
        this.count = 0;//计时
        this.totalcount = 0;//总计时
        this.ctotaltime = 0;//当前总时间
        this.totaltime = [];//总时间数据
        this.isinit = false;//是否初始化
        this.stimecount = 0;//计时次数
        this.isTiming = false;//是否在计时
        this.validstate = true;
        this.istoend = false;
        if(this.isTiming){
            this.unschedule(this._timecallback);
        }
        this.stimecount = 0;
        this.type = type!==0&&type!==1&&type!==2?0:type;
        
        if(type!==0&&type!==1&&type!==2){
            cc.warn('Timer type should be 0,1,2. Look up the Timer TYPE for detail.');
            this.validstate = false;
        }

        if(type===0){
            this.totaltime = totaltime instanceof Array?totaltime:[];
            this.ctotaltime = typeof this.totaltime[this.stimecount] === 'number'?this.totaltime[this.stimecount]:0;

            if(!(totaltime instanceof Array)||((totaltime instanceof Array)&&totaltime.length===0)){
                cc.warn('Total time should be a array of int and at least one element.');
                this.validstate = false;
            }
        }else if(type===1){
            this.totaltime = (typeof totaltime === 'number'&&totaltime>0)?totaltime:(totaltime instanceof Array&&totaltime.length>0&&totaltime[0]>0?totaltime[0]:0);
            this.ctotaltime = this.totaltime

            if(typeof totaltime !== 'number'&&totaltime<=0){
                cc.warn('Total time should be nagative integer.');
                this.validstate = false;
            }
        }else if(type===2){
            this.totaltime = 3601;
            this.ctotaltime = 3601;//正计时不可超过60min
        }

        this.isinit = true;
        this.totalcount = 0;

        this.timelable.string = this._getTime().showtimetext;
    }

    _timecallback(){
        this.count++;
        this.totalcount++;

        if(this.type===0){
            if(this.count >= this.ctotaltime){
                this.unschedule(this._timecallback);
                this.isTiming = false;
                this._timeup();
            }
        }else if(this.type===1){
            if(this.totalcount >= this.ctotaltime){
                this.unschedule(this._timecallback);
                this.isTiming = false;
                this._timeup();
                this.istoend = true;
            }
        }else if(this.type===2){
            if(this.totalcount >= this.ctotaltime){
                this.unschedule(this._timecallback);
                this.isTiming = false;
                this._timeup();
                this.istoend = true;
            }
        }

        this.timelable.string = this._getTime().showtimetext;
    }

    //开始计时
    startTimer(){
        if(!this.isinit){
            cc.warn('You shoul init the timer before using it.');
        }else if(!this.validstate){
            cc.warn('Timer state is not valid, check your init data.');
        }else if(this.isTiming){
            cc.warn('Timer is working.');
        } else if(this.istoend){
            cc.warn('Timer\'s life is to end.');
        } else{
            if(this.type===0&&this.stimecount>=this.totaltime.length){
                cc.warn('Total time data is run out, can not start timer any more.');
            }else{
                this.count = 0;
                if(this.type===0){
                    this.ctotaltime = this.totaltime[this.stimecount];
                }
                this.schedule(this._timecallback, 1);
                this.stimecount++;
                this.isTiming = true;
            }
        }
    }

    //时间显示格式化
    timeformat(time){
        let min = Math.floor(time / 60),
        sec = time % 60,
        fMin = min < 10 ? '0'+ min : min,
        fSec = sec < 10 ? '0'+ sec : sec;
        if(time > 59) {
            return fMin + ":" + fSec;
        }else {
            return '00:'+ fSec
        }
    }

    //停止计时
    stopTimer(callback: Function, target?:any){
        if(this.isTiming){
            this.unschedule(this._timecallback);
            if(callback&&callback.call){
                callback.call(target?target:this, this._getTime());
            }
            this.isTiming = false;
        }else{
            cc.warn('Timer is not working.');
        }
    }

    //获取时间数据
    _getTime(){
        var showtime = 0;
        if(this.type===0){
            showtime = this.ctotaltime - this.count;
        }else if(this.type===1){
            showtime = this.ctotaltime - this.totalcount;
        }else if(this.type===2){
            showtime = this.totalcount;
        }

        return {
            'type': this.type,
            'count': this.count,
            'totaltime': this.ctotaltime,
            'totalcount': this.totalcount,
            'showtime': showtime,
            'showtimetext': this.timeformat(showtime)
        }
    }

    startTimeTest(){
        this.startTimer();
    }

    stopTimeTest(){
        this.stopTimer(function(data){
            cc.log(data);
        });
    }

    hint(event){
        cc.log(event);
    }

    //时间到回调
    _timeup(){
        for(var i = 0; i < this.timeupCallFunc.length; i++){
            var target = this.timeupCallFunc[i].target;
            var com = target&&target.getComponent(this.timeupCallFunc[i].component);
            var handler = com&&com[this.timeupCallFunc[i].handler];
            var customdata = this.timeupCallFunc[i].customEventData;

            if(target&&com&&handler){
                var event = new cc.Event.EventCustom('TimeUp', true);
                event.setUserData(this._getTime());
                handler.call(com, event, customdata);
            }
        }
    }

    //添加时间到监听
    addTimeUpListener(callback){
        if(callback instanceof cc.Component.EventHandler){
            this.timeupCallFunc.push(callback);
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
}
