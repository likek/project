import NetWorkData, { GameData, PLATFORM } from "./networkdata";
import QuestionList from "../prefabs/questionlist/questionlist";
import Timer, { TimerType } from "../prefabs/timer/timer";
import EventBus from "./core/eventbus";
import Tips from "../prefabs/tips/tips";
import Progress from "../prefabs/progress/progress";
import Settlement from "../prefabs/settlement/settlement";

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

@ccclass
export default class Game extends cc.Component {

    eventBus: EventBus
    questionIndex: number = 0
    gameData: GameData
    net = new NetWorkData()
    showTipsYet: boolean 
    randomY: number[]
    randomAT: number[]
    showPlayAudio: boolean = true
    playdaudiotime:number = 0
    playdaudioable:boolean = true
    playdaudioId: number

    @property([cc.AudioClip])
    audioclips: cc.AudioClip[] = new Array<cc.AudioClip>();

    audioMap = {
        'tipaudio': 0,
        'description': 1,
        '0': 2,
        '1': 3,
        '2': 4,
        '3': 5,
        '4': 6,
        '5': 7,
        '6': 8,
        '7': 9,
        '8': 10,
        '9': 11,
        '10':22,
        'select': 12,
        'magic': 13,
        'nhappy': 14,
        'unhappy': 15,
        'think': 16,
        'falling': 17,
        'right': 18,
        'win': 19,
        'lose': 20,
        'timeup': 21
    }

    tipsJs = null

    @property(cc.Node)
    tips = null

    progressJs = null

    @property(cc.Node)
    progress = null

    settlementJs:Settlement = null

    @property(cc.Node)
    settlement = null

    questionListJs = null

    @property(cc.Node)
    questionListNode = null

    timerJs = null

    @property(cc.Node)
    timerNode = null

    onLoad() {
        this.net.game = this;
        this.eventBus = this.node.getComponent('eventbus');

        this.tipsJs = this.tips.getComponent('tips');
        this.progressJs = this.progress.getComponent('progress');
        this.settlementJs = this.settlement.getComponent('settlement');
        this.questionListJs = this.questionListNode.getComponent('questionlist');
        this.timerJs = this.timerNode.getComponent('timer');

        //关联
        this.tipsJs.game = this;
        this.settlementJs.game = this;
        this.progressJs.game = this;

        //注册监听home键事件
        document.addEventListener('resignActivePauseGame', function () {
            this.settlement &&this.settlement.active&&this.settlementJs.pause();
            this.tips&& this.tips.active&&this.tipsJs.pause();
            this.progress&& this.progress.active&&this.progressJs.pause();
            cc.director.pause();
            cc.game.pause();

            cc.log('app just resign active.');
        }.bind(this));
        document.addEventListener('becomeActiveResumeGame', function () {
            if (cc.game.isPaused) {
                cc.game.resume();
            }
            if (cc.director.isPaused) {
                cc.director.resume();
            }
            this.settlement&& this.settlement.active&&this.settlementJs.resume();
            this.tips&& this.tips.active&&this.tipsJs.resume();
            this.progress&&this.progress&&this.progress.active&&this.progressJs.resume();
            cc.log('app just become active.');
        }.bind(this));

        this.loadData();
    }

    /**
     * 加载游戏数据
     */
    loadData(){
        var self = this;
        cc.loader.loadResArray(["config", 'tips'], function (err, data) {
            if(err){
                self.net.gameLoadFailed(1);
            }else{
                self.net.requestData(data[0], data[1]);
            }
        });
    }

    /**
     * 游戏数据加载完毕
     * @param eventname 事件名
     * @param eventdata 事件数据
     */
    dataLoaded(eventname, eventdata){
        if(eventname==='dataloaded'){
            this.gameData = eventdata.getUserData();
            this.playBgm();
            if(this.gameData.platform === PLATFORM.IPS){
                this.questionListNode.active = false;
                this.timerNode.active = true;
                this.timerJs.iniTimer(this.gameData.timerType, this.gameData.totalTimeList);
            }else{
                this.questionListNode.active = true;
                this.timerNode.active = false;
                this.questionListJs.setData(this.gameData.questionlist.length);
            }
            this.loadScene();
        }
    }

    /**
     * 加载单场景
     */
    loadScene(){
        cc.log('Load scene:'+ this.questionIndex);
        this.randomY = [];
        this.randomAT = [];
        for(var i = 0; i < 30; i++){
            this.randomY.push(parseInt(''+(-(cc.random0To1()*5 - 1)))*200);
            this.randomAT.push(cc.random0To1()*2.67);
        }
        if(this.shouldShowTip()){
            this.hideGame();
            this.showTips();
            this.hideSettle();
        }else{
            this.hideTips();
            this.showGame();
            this.hideSettle();
            this.startTimer();
        }
    }

    /**
     * 下一个场景
     */
    nextScene(){
        cc.log('Next scene:'+ this.questionIndex);
        if(this.questionIndex < this.gameData.questionlist.length - 1){
            this.questionIndex ++;
            this.net.gameLoadProcess(this.questionIndex+1, this.gameData.questionlist.length);
            this.eventBus.dispatchEvent('loadscene', null);
        }else{
            this.showFinishAnim(function(){
                this.eventBus.dispatchEvent('gameover', null);
            }.bind(this));
        }
    }

    showFinishAnim(callback: Function){
        var r = true;
        for(var i = 0; i < this.gameData.playerData.length; i++){
            if(this.gameData.playerData[i].answerStatus==='2'){
                r = false;
                break;
            }
        }

        this.showSettle();
        if(r){
            this.showWin(callback);
        }else{
            this.showLose(callback);
        }
    }

    /**
     * 通过序号加载场景
     * @param event 序号点击事件
     */
    loadSceneByIndex(event: cc.Event.EventCustom){
        this.questionIndex = event.getUserData();
        this.eventBus.dispatchEvent('loadscene', null);
    }

    /**
     * 时间到
     */
    timeUp(){
        this.playTimeUpAudio();
        this.progressJs.touchHandler.reset();
        this.showSettle();
        this.settlementJs.timeup(function(){
            if(this.timerJs.type===TimerType.COUNTDOWN){
                this.collectPlayerDataByIndex("2", "");
                this.eventBus.dispatchEvent('nextscene', null);
            }else if(this.timerJs.type===TimerType.TOTAL_COUNTDOWN||this.timerJs.type===TimerType.COUNTUP){
                this.collectPlayerDataByIndex("2", "");
                this.playdaudioable = false;
                this.gameOver();
            }
        }.bind(this));
    }

    /**
     * 游戏结束
     */
    gameOver(){
        this.net.gameOver(this.gameData.playerData);
    }

    /**
     * 是否应该显示引导
     */
    shouldShowTip(){
        return this.questionIndex === 0&&!this.showTipsYet;
    }

    /**
     * 显示引导
     */
    showTips(){
        this.tips.active = true;
        this.tipsJs.setData(this.gameData, this.questionIndex);
        this.tipsJs.startTip();
        this.tipsJs.preAnimation();
        // this.tips.pauseSystemEvents(true);
        this.showTipsYet = true;
        this.progress.active = true;
        this.progressJs.setData(this.gameData, -1);
        this.progressJs.preAnimation();
        this.scheduleOnce(function(){
            this.playAudio(this.audioclips[this.audioMap['tipaudio']], false, 1);
        }.bind(this), 0.1);
        this.scheduleOnce(function(){
            this.playdaudioId = this.playAudio(this.audioclips[this.audioMap['description']], false, 1);
        }.bind(this), 2.4);
        this.scheduleOnce(function(){
            //this.tips.resumeSystemEvents(true);;
        }.bind(this), 2.5);//12
    }

    /**
     * 显示游戏
     */
    showGame(){
        this.progress.active = true;
        this.progressJs.setData(this.gameData, this.questionIndex);
        this.progressJs.preAnimation();
    }

    /**
     * 显示反馈
     */
    showSettle(){
        this.settlement.active = true;
        this.settlementJs.setData(this.gameData, this.questionIndex);
    }

    /**
     * 隐藏引导
     */
    hideTips(){
        this.tips.active = false;
    }

    /**
     * 隐藏游戏
     */
    hideGame(){
        this.progress.active = false;
    }

    /**
     * 隐藏结算
     */
    hideSettle(){
        this.settlement.active = false;
    }

    /**
     * 开始计时
     */
    startTimer(){
        if(this.gameData.platform===PLATFORM.IPS){
            this.timerJs.startTimer();
        }
    }

    /**
     * 开始计时
     */
    stopTimer(){
        if(this.gameData.platform===PLATFORM.IPS){
            this.timerJs.stopTimer();
        }
    }

    /**
     * 显示获胜动画
     * @param callback 获胜动画回调
     */
    showWin(callback: Function){
        this.settlementJs.win(callback);
        this.playWinAudio();
    }

    /**
     * 显示失败动画
     * @param callback 获胜动画回调
     */
    showLose(callback: Function){
        this.settlementJs.lose(callback);
        this.playFailAudio();
    }

    /**
     * 播放音频
     */
    playAudio(filepath, loop: boolean, volume: number): number{
        if(this.playAudio){
            return cc.audioEngine.play(filepath, loop, volume);
        }
        return null;
    }

    /**
     * 停止音频
     */
    stopAudio(audioId: number){
        if(typeof audioId === 'number'){
            cc.audioEngine.stop(audioId);
        }
    }

    playBgm(){
        var url = this.gameData.questionlist.length>0&&this.gameData.questionlist[0].quecontAudio instanceof Array&&this.gameData.questionlist[0].quecontAudio.length>0&&this.gameData.questionlist[0].quecontAudio[0];
        if(typeof url === 'string'&&url.length > 0){
            cc.loader.load(url, function(err, audio){
                if(err){
                    cc.log('Audio play failed.');
                }else{
                    this.playAudio(audio, true, 1);
                    cc.loader.releaseAsset(audio);
                }
            }.bind(this));
        }
    }

    playNumAudio(num: string){
        if(this.audioclips[this.audioMap[num]]){
            this.playAudio(this.audioclips[this.audioMap[num]], false, 1);
        }
    }

    playSelectAudio(){
        this.playAudio(this.audioclips[this.audioMap['select']], false, 1);
    }

    playMagicAudio(){
        this.playAudio(this.audioclips[this.audioMap['magic']], false, 0.4);
    }

    playNHappyAudio(){
        this.playAudio(this.audioclips[this.audioMap['nhappy']], false, 1);
    }

    playNUnhappyAudio(){
        this.playAudio(this.audioclips[this.audioMap['unhappy']], false, 1);
    }

    playThinkAudio(){
        this.playAudio(this.audioclips[this.audioMap['think']], false, 1);
    }

    playFallingAudio(){
        this.stopAudio(this.playdaudioId);
        this.playAudio(this.audioclips[this.audioMap['falling']], false, 1);
    }

    playRightAudio(){
        this.stopAudio(this.playdaudioId);
        this.playAudio(this.audioclips[this.audioMap['right']], false, 1);
    }

    playWinAudio(){
        this.stopAudio(this.playdaudioId);
        this.playAudio(this.audioclips[this.audioMap['win']], false, 1);
    }

    playFailAudio(){
        this.stopAudio(this.playdaudioId);
        this.playAudio(this.audioclips[this.audioMap['lose']], false, 1);
    }

    playTimeUpAudio(){
        this.stopAudio(this.playdaudioId);
        this.playAudio(this.audioclips[this.audioMap['timeup']], false, 1);
    }

    handled(){
        this.playdaudiotime = 0;
    }

    /**
     * 收集用户数据
     */
    collectPlayerDataByIndex(answerStatus: string, content: string){
        var r = this.gameData.playerData[this.questionIndex];
        r.answerTime = this.timerJs._getTime().count;
        r.answerStatus = answerStatus;
        r.answerContext = content;
    }


    onEnable(){
        this.eventBus.register('loadscene', this.loadScene.bind(this), 'loadscene');
        this.eventBus.register('nextscene', this.nextScene.bind(this), 'nextscene');
        this.eventBus.register('dataloaded', this.dataLoaded.bind(this), 'dataloaded');
        this.eventBus.register('gameover', this.gameOver.bind(this), 'gameover');
        this.eventBus.register('touchmovem', this.handled.bind(this), 'touchmovemda');
    }
    
    onDisable(){
        this.eventBus.unregister('loadscene', this.loadScene, 'loadscene');
        this.eventBus.unregister('nextscene', this.nextScene, 'nextscene');
        this.eventBus.unregister('dataloaded', this.dataLoaded, 'dataloaded');
        this.eventBus.unregister('gameover', this.gameOver, 'gameover');
        this.eventBus.unregister('touchmovem', this.handled.bind(this), 'touchmovemda');
    }

    update(dt){
        this.playdaudiotime+=dt;
        if(this.playdaudioable&&this.playdaudiotime>20){
            this.playdaudioId = this.playAudio(this.audioclips[this.audioMap['description']], false, 1);
            this.playdaudiotime = 0;
        }
    }
}
