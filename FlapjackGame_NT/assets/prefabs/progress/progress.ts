import AbsProgress from "./absprogress";
import { Question, GameData, QUESTION_TYPE, RuleData, RuleType, PLATFORM } from "../../scripts/networkdata";
import Title from "../../scripts/title";
import Plates from "../../scripts/plates";
import Pan from "../../scripts/pan";

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
export default class Progress extends AbsProgress {

    data: Question = null;

    @property({
        override: true,
        type: cc.Node
    })
    scale: cc.Node = null;

    @property(Title)
    title: Title = null

    @property(Plates)
    plates: Plates = null

    @property(Pan)
    pan: Pan = null

    @property(cc.Button)
    commitBtn: cc.Button = null

    @property(cc.Button)
    resetBtn: cc.Button = null

    load(){
    };

    setData(data: GameData, questionIndex: number){
        cc.log('Set data in process.');
        cc.log('Progress data is: %o' , questionIndex===-1?data.tips:data.questionlist[questionIndex]);
        this.data = questionIndex===-1?data.tips:data.questionlist[questionIndex];

        if(questionIndex===-1){
            this.touchHandler.disable();
        }else{
            this.touchHandler.enable();
            this.node.resumeSystemEvents(true);
        }
       
        this.title.setData(this.data.qescont);
        this.pan.touchHandler = this.touchHandler;
        this.pan.reset();
        this.plates.setData(this.data.interactiveJson['flapjackcount']);
        //初次进来禁用提交按钮
        this.commitBtn.interactable = false;
        this.resetBtn.interactable = false;
    };

    pause(){
        cc.log('Progress pause.');
    };

    resume(){
        cc.log('Progress resume.');
        this.touchHandler.reset();
        this.commitBtn['_pressed'] = false;
        this.commitBtn['_hovered'] = false;
        this.commitBtn.node.setScale(1, 1);
        this.resetBtn['_pressed'] = false;
        this.resetBtn['_hovered'] = false;
        this.resetBtn.node.setScale(1, 1);
    };

    /**
     * 游戏是否正确
     */
    isRight(): boolean {
        var r = this.pan.getResult();
        return r===this.data.interactiveJson['cooktime'] && this.isFinish();
    };

    /**
     * 是否需要重置
     */
    isNeedReset(): boolean{
        // return this.plates.isNeedReset()||this.pan.isNeedReset();
        return true;
    };

    /**
     * 是否完成
     */
    isFinish(): boolean {
        var objs = this.plates.objs,objData;
        for(var i = 0; i < objs.length; i++){
            objData = objs[i].unitjs.data;
            if(!objData || objData.bg !== 2){
                return false;
            }
        }
        return true;
    };

    /**
     * 重置
     */
    reset(): boolean {
        if(this.touchHandler.touchId)return;
        this.game.playBtnAudio();
        if(this.isNeedReset()){
            this.plates.reset();
            this.pan.reset();
            // this.btnStateChanged();
            this.commitBtn.interactable = false;
            this.resetBtn.interactable = false;
            return true;
        }
        return false;
    };

    onEnable(){
        this.game.eventBus.register('btnstatechanged', this.btnStateChanged.bind(this), 'btnstatechanged', this.node);
    }

    onDisable(){
        this.game.eventBus.unregister('btnstatechanged', this.btnStateChanged.bind(this), 'btnstatechanged', this.node);
    }

    btnStateChanged(){
        this.commitBtn.interactable = this.isNeedReset();
        this.resetBtn.interactable = this.isNeedReset();
    }

     /**
     * 提交
     */
    commit(){
        if(this.touchHandler.touchId)return;
        this.game.playBtnAudio();
        this.node.pauseSystemEvents(true);
        this.game.stopTimer();
        cc.log("commit");
        if(this.isRight()){
            this.game.showSettle();
            this.game.collectPlayerDataByIndex('1', ''+this.pan.getResult());
            this.game.showWin(function(){
                if(this.game.gameData.platform === PLATFORM.IPS){
                    this.game.eventBus.dispatchEvent('nextscene', null);
                }else{
                    this.game.hideSettle();
                }
            }.bind(this));
        }else{
            this.game.showSettle();
            this.game.collectPlayerDataByIndex('2', ''+this.pan.getResult());
            this.game.showLose(function(){
                if(this.game.gameData.platform === PLATFORM.IPS){
                    this.game.eventBus.dispatchEvent('nextscene', null);
                }else{
                    this.game.hideSettle();
                }
            }.bind(this));
        }
    };
}
