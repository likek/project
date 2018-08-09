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

    @property([cc.AudioClip])
    audios: cc.AudioClip[] = new Array<cc.AudioClip>();

    audioMaps = {
        'win': 0,
        'lose': 1,
        'timeup': 1,
        'btn': 2,
        'press': 3,
        'drop': 4,
        'fire': 5,
        'toInit': 6
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

    @property(Boolean)
    shouldPlayAudio: boolean = true

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
            this.settlement.active&&this.settlementJs.pause();
            this.tips.active&&this.tipsJs.pause();
            this.progress.active&&this.progressJs.pause();
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
            this.settlement.active&&this.settlementJs.resume();
            this.tips.active&&this.tipsJs.resume();
            this.progress.active&&this.progressJs.resume();
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
            this.eventBus.dispatchEvent('gameover', null);
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
            if(this.timerJs.type===TimerType.COUNTUP||this.timerJs.type===TimerType.TOTAL_COUNTDOWN){
                this.collectPlayerDataByIndex("2", '');
                this.gameOver();
            }else{
                this.collectPlayerDataByIndex("2", '');
                this.nextscene();
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
        this.showTipsYet = true;
        this.progress.active = true;
        this.progressJs.setData(this.gameData, -1);
    }

    /**
     * 显示游戏
     */
    showGame(){
        this.progress.active = true;
        this.progressJs.setData(this.gameData, this.questionIndex);
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
        if(this.gameData.platform === PLATFORM.IPS){
            this.timerJs.startTimer();
        }
    }

    /**
     * 停止计时
     */
    stopTimer(){
        if(this.gameData.platform === PLATFORM.IPS){
            this.timerJs.stopTimer();
        }
    }

    /**
     * 显示获胜动画
     * @param callback 获胜动画回调
     */
    showWin(callback: Function){
        this.playWinAudio();
        this.settlementJs.win(callback);
    }

    /**
     * 显示失败动画
     * @param callback 获胜动画回调
     */
    showLose(callback: Function){
        this.playLoseAudio();
        this.settlementJs.lose(callback);
    }

    playAudio(filepath, loop:boolean, volumn: number): number{
        if(this.shouldPlayAudio){
            return cc.audioEngine.play(filepath, loop, volumn);
        }
        return undefined;
    }

    playWinAudio(){
        this.playAudio(this.audios[this.audioMaps['win']], false, 1);
    }

    playLoseAudio(){
        this.playAudio(this.audios[this.audioMaps['lose']], false, 1);
    }

    playTimeUpAudio(){
        this.playAudio(this.audios[this.audioMaps['lose']], false, 1);
    }

    playBtnAudio(){
        this.playAudio(this.audios[this.audioMaps['btn']], false, 1);
    }

    playPressAudio(){
        this.playAudio(this.audios[this.audioMaps['press']], false, 1);
    }

    playDropAudio(){
        this.playAudio(this.audios[this.audioMaps['drop']], false, 1);
    }


    playFireAudio(){
        return this.playAudio(this.audios[this.audioMaps['fire']], true, 1);
    }

    playToInitAudio(){
        this.playAudio(this.audios[this.audioMaps['toInit']], false, 1);
    }

    stopAudio(id){
        cc.audioEngine.stop(id);
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
    }
    
    onDisable(){
        this.eventBus.unregister('loadscene', this.loadScene.bind(this), 'loadscene');
        this.eventBus.unregister('nextscene', this.nextScene.bind(this), 'nextscene');
        this.eventBus.unregister('dataloaded', this.dataLoaded.bind(this), 'dataloaded');
        this.eventBus.unregister('gameover', this.gameOver.bind(this), 'gameover');
    }
}
