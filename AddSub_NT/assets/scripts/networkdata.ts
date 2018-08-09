import Game from "./game";

const {ccclass, property} = cc._decorator;

export enum PLATFORM {
    ITS,//ITS
    IPS//IPS
}

export enum TIMER_TYPE {
    COUNTDOWN,//单题倒计时
    TOTAL_COUNTDOWN,//总倒计时
    COUNTUP//正计时
}

export enum QUESTION_TYPE {
    SINGLE_CHOICE = 1,//单选
    JUDGMENT = 2,//判断
    SHORT_ANSWER = 3//简答题
}

/**
 * 组类型
 */
export enum GROUP_TYPE {
    GRID, //网格类型
    CUSTOM //自定义
}

/**
 * 对象类型
 */
export enum UNIT_TYPE {
    OPTION, //选项
    TARGET, //目标
    DEFAULT, //默认
    TITLE, //标题
    OPTION_AREA, //选项区域
    NONE,
    TREE,//树
    CLOUD,//云
    RAINBOW//彩虹
}

/**
 * 触摸类型
 */
export enum UNIT_TOUCH_TYPE {
    DARG_MOVE,
    CLICK,
    DRAG_SLIDE,
    NONE
}

/**
 * 预制对象类型
 */
export enum PREFAB_TYPE {
    TITLE,
    NUMBER
}

/**
 * 组数据
 */
@ccclass 
export class GroupData {
    id: string
    type: GROUP_TYPE
    colNum: number
    horizontalSpace: number
    verticalSpace: number
    x: number
    y: number
    width: number
    height: number
    objs: Array<UnitData>
}

/**
 * 单位
 */
@ccclass 
export class UnitData {
    oid: string //数据源id
    type: UNIT_TYPE
    touchType: UNIT_TOUCH_TYPE
    id: string
    content: string
    imgUrl: string
    x: number
    y: number
    width: number
    height: number
    prefabtype: PREFAB_TYPE
    infinite: boolean//是否无限再生
    state: Array<string>//状态
    verify: boolean
    tipnextstep: boolean
    choosed: boolean
    randomtime: number

    clone(): UnitData{
        var u = new UnitData();
        u.oid = this.oid;
        u.type = this.type;
        u.touchType = this.touchType;
        u.id = this.id;
        u.content = this.content;
        u.imgUrl = this.imgUrl;
        u.x = this.x;
        u.y = this.y;
        u.width = this.width;
        u.height = this.height;
        u.prefabtype = this.prefabtype;
        u.infinite = this.infinite;
        u.state = this.state;
        u.verify = this.verify;
        u.choosed = this.choosed;
        u.tipnextstep = this.tipnextstep;
        return u;
    }

    equal(other: UnitData): boolean{
        return this.oid===other.oid
            &&this.type===other.type
            &&this.touchType===other.touchType
            &&this.id===other.id
            &&this.content===other.content
            &&this.imgUrl===other.imgUrl
            &&this.x===other.x
            &&this.y===other.y
            &&this.width===other.width
            &&this.height===other.height
            &&this.prefabtype===other.prefabtype
            &&this.infinite===other.infinite
            &&this.state===other.state
            &&this.verify===other.verify
            &&this.choosed===other.choosed
            &&this.tipnextstep===other.tipnextstep;
    }
}

/**
 * 规则类型
 */
export enum RuleType {
    SINGLE_CHOICE,
    JUDGMENT,
    SINGLE_CHOICE_CLICK,
    JUDGMENT_CLICK
}

/**
 * 规则
 */
@ccclass 
export class RuleData {
    id: string
    value: string
    objs:string[]
    type: RuleType
}

@ccclass
export class Question {
    timerType: TIMER_TYPE//计时器类型
    time: number //答题时间
    levelQuestionDetailID: string//IPS题目（小题）ID
    leveLQuestionDetailNum: number//IPS题目（小题）序号
    qescont: string //题干内容
    qescontImg: Array<string> //题目图片地址
    quecontAudio: Array<string> //题目音频地址
    type: QUESTION_TYPE//题目类型 
    interactiveJson: Object //自定义json
    groups: Array<GroupData>//组
    rules: Array<RuleData>//规则
    isvalid: boolean //是否有效
    invalidalert: string //无效提示
    spritUrls: Array<string> = []//图片地址集合 
}

@ccclass
export class GameData {
    gameName: string//游戏名
    platform: PLATFORM//游戏工作平台
    questionlist: Array<Question>//游戏问题数据列表
    valid: boolean = false//是否有效
    spriteMaps: object = {}//图片映射集合 
    timerType: TIMER_TYPE//计时器类型
    totalTimeList: number[]//总时间列表
    tips: Question//引导数据
    playerData: Array<PlayerData>//用户数据

    /**
     * 获取下载的图片
     */
    getSpriteFrame(spriteUrl:string){
        let r = this.spriteMaps&&this.spriteMaps[spriteUrl]&&this.spriteMaps[spriteUrl].content;
        if(r instanceof cc.Texture2D){
            return new cc.SpriteFrame(r);
        }
        return null;
    }
}

@ccclass
export class PlayerData {
    answerTime: number = 0
    leveLQuestionDetailNum: string = ''//序号
    levelQuestionDetailID: string = ''//ID
    answerStatus: string = '2'//1正确，2错误
    answerContext: string = ''
}

@ccclass
export default class NetWorkData {
    game: Game

    //请求数据
    public requestData(localconfig, tips){
        var xhr = cc.loader.getXMLHttpRequest();
        var fileUrl = this.getQueryString('fileUrl');
        xhr.open("GET", fileUrl);
        if (cc.sys.isNative) {
			xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
		}
        xhr.timeout = 60000;//timeout
        
        // Special event
        var self = this;
		xhr.onreadystatechange = function () {
			try {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					cc.log(xhr.responseText.substring(0, 30));
					if (xhr.status === 200) {
                        self.parseData(xhr.responseText, localconfig, tips, function(result){
                            if(result.valid){
                                self.game.eventBus.dispatchEvent('dataloaded', result);
                            }else{
                                cc.log('There was a problem with the request.');
                                //解析失败反馈结果
                                self.gameLoadFailed(2);
                            }
                        }.bind(self));
					} else {
						cc.log('There was a problem with the request.');
						//下载失败反馈结果
						self.gameLoadFailed(1);
					}
				}
			} catch (e) {
				cc.log('Caught Exception: ' + e.description);
				//下载失败反馈结果
				self.gameLoadFailed(1);
			}
        };
        
        xhr.send();
    }

    //解析数据
    parseData(data: string, localconfig: object, tips: Array<object>, callback: Function) {
        var questions = JSON.parse(data);
        var gameData = new GameData();
        if (questions || questions.length > 0) {
            var tipsIndex = typeof questions[0]['tipsIndex'] === 'number'&&questions[0]['tipsIndex']>=0&&questions[0]['tipsIndex']<tips.length?questions[0]['tipsIndex']:0;
            gameData.tips = this.parseItem(tips[tipsIndex], localconfig, tips);
            var questionlist = new Array<Question>()
            for(var i = 0, t; i < questions.length; i++){
                t = this.parseItem(questions[i], localconfig, tips);
                t = this.varifyItem(t);
                questionlist.push(t);
            }
            gameData.questionlist = questionlist;
            gameData.gameName = this.getQueryString('gameName');
            gameData.platform = this.getQueryString('platform')==='its'?PLATFORM.ITS:PLATFORM.IPS;
            gameData.timerType = questionlist[0].timerType;
            gameData.totalTimeList = this._getTotalTimeList(questionlist);
            gameData.valid = true;
            gameData.playerData = (function(){
                var r = [];
                for(var i =0, t; i < gameData.questionlist.length; i++){
                    t = new PlayerData();
                    t.levelQuestionDetailID = gameData.questionlist[i].levelQuestionDetailID;
                    t.leveLQuestionDetailNum = gameData.questionlist[i].leveLQuestionDetailNum;
                    r.push(t);
                }
                return r;
            }());

            this.loadPic(gameData, function(result){
                if(result.r){
                    //通知游戏加载成功，开始游戏
                    this.gameLoadSuccess(questionlist.length);
                    callback(gameData);
                }else{
                    //下载失败反馈结果
				    this.gameLoadFailed(1);
                }
                
            }.bind(this));
		} 
    }

    //解析单条数据
    parseItem(item: Object, localconfig: object, tips: object) : Question {
        var result = new Question();

        result.timerType = item['interactiveJson']&&item['interactiveJson']['timerType']&&this._getTimerType(item['interactiveJson']['timerType']);
        result.time = item['interactiveJson']&&parseInt(''+item['interactiveJson']['time']);
        result.levelQuestionDetailID = item['questionid'];
        result.leveLQuestionDetailNum = item['orderid'];
        result.qescont = this.filteSpan(item['qescont']);
        result.qescontImg = item['quescontimg'];
        result.spritUrls = item['quescontimg'];
        result.quecontAudio = item['qescontsound'];
        result.type = item['queType'];
        result.groups = item['interactiveJson']&&item['interactiveJson']['groups'] instanceof Array&&item['interactiveJson']['groups'].map(element => {
            var group = new GroupData();
            group.id = element.id;
            group.objs = element.objs instanceof Array &&element.objs.map(oitem => {
                var unit = new UnitData();
                unit.id = oitem.id;
                unit.type = typeof localconfig['objstype'][oitem['type']] ==='number'?localconfig['objstype'][oitem['type']]:localconfig['objstype'][localconfig['groups'][element.id]['objstype']];;
                unit.content = this.filteSpan(oitem['content']);
                unit.imgUrl =  item['quescontimg'] instanceof Array&&oitem['imgurl']&&item['quescontimg'][oitem['imgurl']];
                unit.touchType = typeof localconfig['objstouchType'][oitem['touchType']] === 'number'?localconfig['objstouchType'][oitem['touchType']]:localconfig['objstouchType'][localconfig['groups'][element.id]['objstouchType']];
                unit.x = oitem['x'];
                unit.y = oitem['y'];
                unit.infinite = typeof oitem['infinite']==='boolean'?oitem['infinite']:localconfig['groups'][element.id]['infinite'];
                unit.width = localconfig['groups'][element.id]['osizew'];
                unit.height = localconfig['groups'][element.id]['osizeh'];
                unit.prefabtype = localconfig['prefabtype'][localconfig['groups'][element.id]['prefabtype']];
                unit.verify = typeof oitem['verify']==='boolean'?oitem['verify']:localconfig['groups'][element.id]['verify'];
                unit.choosed = false;
                unit.state = (oitem['state'] instanceof Array&&oitem['state'].length>0)?oitem['state']:localconfig['groups'][element.id]['state'];
                unit.tipnextstep = typeof oitem['tipnextstep']==='boolean'?oitem['tipnextstep']:localconfig['groups'][element.id]['tipnextstep'];
                return unit;
            });
            group.type = localconfig['grouptype'][localconfig['groups'][element.id]['type']];
            group.colNum = localconfig['groups'][element.id]['colNum'];
            group.horizontalSpace = localconfig['groups'][element.id]['horizontalSpace'];
            group.verticalSpace = localconfig['groups'][element.id]['verticalSpace'];
            group.x = localconfig['groups'][element.id]['x'];
            group.y = localconfig['groups'][element.id]['y'];
            group.width = localconfig['groups'][element.id]['width'];
            group.height = localconfig['groups'][element.id]['height'];
            return group;
        });
        result.rules = item['interactiveJson']&&item['interactiveJson']['rules'] instanceof Array&&item['interactiveJson']['rules'].map(element => {
            var rule = new RuleData();
            rule.id = element['id'];
            rule.value = element['value'];
            rule.type = localconfig['rules'][element.type]['type'];
            rule.objs = element['objs'];
            return rule;
        });

        if(!(result.groups instanceof Array)){
            result.groups = [];
        }

        if(!(result.rules instanceof Array)){
            result.rules = [];
        }

        if(!(result.spritUrls instanceof Array)){
            result.spritUrls = [];
        }else{
            result.spritUrls.filter(element => {return element})
        }

        if((item['queType']===1||item['queType']===2)&&item['optionandanswers']&&item['optionandanswers'][0]['options'] instanceof Array){
            var optiongroup = new GroupData();
            var optionrule = new RuleData();
            optiongroup.id = 'options';
            optiongroup.objs = item['optionandanswers'][0]['options'].map(oitem => {
                var unit = new UnitData();
                unit.id = oitem['optionno'];
                unit.type = typeof localconfig['objstype'][oitem['type']]==='number'?localconfig['objstype'][oitem['type']]:localconfig['objstype'][localconfig['groups']['options']['objstype']];
                unit.content = this.filteSpan(oitem['optioncontent']);
                unit.touchType = typeof localconfig['objstouchType'][oitem['touchType']]==='number'?localconfig['objstouchType'][oitem['touchType']]:localconfig['objstouchType'][localconfig['groups']['options']['objstouchType']];
                unit.imgUrl =  oitem['optioncontimg'];
                unit.x = oitem['x']
                unit.y = oitem['y']
                unit.infinite = typeof oitem['infinite']==='boolean'?oitem['infinite']:localconfig['groups']['options']['infinite'];
                unit.width = localconfig['groups']['options']['osizew'];
                unit.height = localconfig['groups']['options']['osizeh'];
                unit.prefabtype = localconfig['prefabtype'][localconfig['groups']['options']['prefabtype']];
                unit.verify = typeof oitem['verify']==='boolean'?oitem['verify']:localconfig['groups']['options']['verify'];
                unit.choosed = false;
                unit.state = (oitem['state'] instanceof Array&&oitem['state'].length>0)?oitem['state']:localconfig['groups']['options']['state'];
                unit.tipnextstep = typeof oitem['tipnextstep']==='boolean'?oitem['tipnextstep']:localconfig['groups']['options']['tipnextstep'];

                oitem['optioncontimg']&&result.spritUrls.push(oitem['optioncontimg']);
                return unit;
            });
            optiongroup.type = localconfig['grouptype'][localconfig['groups']['options']['type']];
            optiongroup.colNum = localconfig['groups']['options']['colNum'];
            optiongroup.horizontalSpace = localconfig['groups']['options']['horizontalSpace'];
            optiongroup.verticalSpace = localconfig['groups']['options']['verticalSpace'];
            optiongroup.x = localconfig['groups']['options']['x'];
            optiongroup.y = localconfig['groups']['options']['y'];
            optiongroup.width = localconfig['groups']['options']['width'];
            optiongroup.height = localconfig['groups']['options']['height'];

            optionrule.id = "options";
            optionrule.value = this.filteSpan(item['optionandanswers'][0]['rightanswer']);
            optionrule.type = localconfig['rules'][localconfig['groups']['options']['ruletype']]['type'];
            optionrule.objs = item['optionandanswers'][0]['options'].map(element => {
                return element['optionno'];
            });

            result.rules.forEach(element => {
                if(element.id === 'options'){
                    typeof element.value === 'string'&&(optionrule.value = element.value);
                    typeof element.type === 'number'&&(optionrule.type = element.type);
                }
            });
            
            result.groups.push(optiongroup);
            result.rules.push(optionrule);
        }

        if(this.filteSpan(item['qescont'])){
            var titleGroup = new GroupData();
            titleGroup.id = 'title';
            var titleUnit = new UnitData();
            titleUnit.id = 'title';
            titleUnit.type = UNIT_TYPE.TITLE;
            titleUnit.content = this.filteSpan(item['qescont']);
            titleUnit.imgUrl =  '';
            titleUnit.x = 0
            titleUnit.y = 0
            titleUnit.width = localconfig['groups']['title']['osizew'];
            titleUnit.height = localconfig['groups']['title']['osizeh'];
            titleUnit.prefabtype = localconfig['prefabtype'][localconfig['groups']['title']['prefabtype']];

            titleGroup.objs = [
                titleUnit
            ];
            titleGroup.type = localconfig['grouptype'][localconfig['groups']['title']['type']];
            titleGroup.colNum = localconfig['groups']['title']['colNum'];
            titleGroup.horizontalSpace = localconfig['groups']['title']['horizontalSpace'];
            titleGroup.verticalSpace = localconfig['groups']['title']['verticalSpace'];
            titleGroup.x = localconfig['groups']['title']['x'];
            titleGroup.y = localconfig['groups']['title']['y'];
            titleGroup.width = localconfig['groups']['title']['width'];
            titleGroup.height = localconfig['groups']['title']['height'];
        }
        result.groups.push(titleGroup);

        result.interactiveJson = item['interactiveJson'];

        return result;
    }

    //验证数据
    varifyItem(item: Question) : Question {
        item.isvalid = true;
        item.invalidalert = '';
        return item;
    }

    //获取时间类型
    _getTimerType(type:number){
        switch(type){
            case 0:
            return TIMER_TYPE.COUNTDOWN;
            case 1: 
            return TIMER_TYPE.TOTAL_COUNTDOWN;
            case 2: 
            return TIMER_TYPE.COUNTUP;
            default:
            return TIMER_TYPE.COUNTDOWN;
        }
    }

    //获取总时间列表
    _getTotalTimeList(qlist: Question[]){
        var r: number[] = [];
        for(var i = 0; i < qlist.length; i++){
            r.push(qlist[i].time);
        }
        return r;
    }

    //加载图片
    loadPic(gamedata: GameData, callback: Function){
        var urls = [];
        for(var i = 0; i < gamedata.questionlist.length; i++){
            if(gamedata.questionlist[i].spritUrls instanceof Array && gamedata.questionlist[i].spritUrls.length > 0){
                gamedata.questionlist[i].spritUrls.forEach(element => {
                    urls.push(element);
                })
            }
        }
        if(urls.length > 0){
            var self = this;
            cc.loader.load(urls, function (errors, texs) {
                if (errors) {
                    callback({'d': gamedata, 'r': false});
                    return;
                }
                //设置图片映射集合
                gamedata.spriteMaps = texs.map;
                callback({'d': gamedata, 'r': true});
            });
        }else{
            callback({'d': gamedata, 'r': true});
        }
    }

    //游戏加载成功
    public gameLoadSuccess(totalNumber){
        var params = encodeURI('isShow=1&totalNumber=' + totalNumber);
        window.location.href = 'optionBlank://gameLoadSuccess?' + params;
    }

    //游戏加载失败type:1.下载失败，2.解析失败
    public gameLoadFailed(type){
        if (type == 1) {
			var params = encodeURI('errcode=10001&errmsg=下载失败');
			window.location.href = 'optionBlank://gameLoadFailed?' + params;
		} else {
			var params = encodeURI('errcode=10002&errmsg=解析失败');
			window.location.href = 'optionBlank://gameLoadFailed?' + params;
		}
    }

    //游戏进度变更
    public gameLoadProcess(nowNumber, totalNumber){
        var params = encodeURI('nowNumber=' + nowNumber + '&totalNumber=' + totalNumber);
        window.location.href = 'optionBlank://gameLoadProgress?' + params;
    }

    //游戏结束
    gameOver(answerInfoArr){
        cc.log(answerInfoArr);
		var data = encodeURI(JSON.stringify(answerInfoArr));
		window.location.href = 'optionBlank://gameOver?status=1&data=' + data;
    }

    //解析url参数
	getQueryString(name: string) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURI(r[2]); return null;
    }
    
    //过滤span标签
    filteSpan(data: string = ''){
        if(data){
            data = data.replace('<span>', '');
            data = data.replace('</span>', '');
        }
        return data;
    }
}
