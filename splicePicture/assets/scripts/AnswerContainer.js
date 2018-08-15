cc.Class({
    extends: cc.Component,

    properties: {
        answer: cc.Prefab,
        node2x2: cc.Prefab,
        node2x3: cc.Prefab,
        node3x3: cc.Prefab,

        gameJS: null,
        bottomNode: cc.Node,
    },
    start () {

    },

    // update (dt) {},

    initData(data){
        this.setBoxs(this.node,data);
        // this.setBoxs(this.bottomNode,data);

        // var items = this.bottomNode.children[0].children[0];//底部所有片段
        // for(let i = 0;i<items;i++){
           
        // }
    },

    setBoxs(container,data){
        container.removeAllChildren();
        if(!this.checkData(data))return;
        let parent = data === "2x2" ? this.node2x2 : (data === "2x3"? this.node2x3 : this.node3x3);
        parent = cc.instantiate(parent);
        container.addChild(parent);
        data = data.split("x");
        let col = data[0];
        let row = data[1];
        let avaliWidth = parent.width;
        let availHeight = parent.height;
        let itemWidth = avaliWidth / col;
        let itemHeight = availHeight / row;
        for(let r = 0;r<row;r++){
            for(let c = 0;c<col;c++){
                let answer = cc.instantiate(this.answer);
                parent.addChild(answer);
                answer.width = itemWidth;
                answer.height = itemHeight;
                answer.x = itemWidth * c + itemWidth/2 - avaliWidth/2;
                answer.y = itemHeight * r + itemHeight/2 - availHeight/2;
                answer.__optionId = row-1-r + "-" + c;
                answer.getComponent(cc.CircleCollider).radius = Math.min(answer.height,answer.width) * 0.248;

                let answerCopy = new cc.Node();
                answerCopy.addComponent(cc.Sprite);
                this.bottomNode.addChild(answerCopy);
                answerCopy.width = answer.width;
                answerCopy.height = answer.height;
                answerCopy.x = answer.x;
                answerCopy.y = answer.y;

                var option = this.getOptionByAnswer(answer.__optionId);
                cc.loader.load(option.optioncontimg,(err,res)=>{
                    if (!err) {
                        var spriteFrame = new cc.SpriteFrame(res);
                        answerCopy.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        cc.loader.releaseAsset(res);
                    }
                });
            }
        }
    },
    checkData(data){
        return typeof data === "string" && /\d+x\d+/.test(data);
    },

    getOptionByAnswer(optionID){
        var question = this.gameJS.questionArr[this.gameJS.nowQuestionID];
        var options = question.optionsArr;
        var res = null;
        for(let i=0;i<options.length;i++){
            if(options[i].optionContent === optionID){
                res = options[i];
            }
        }
        return res;
    }
});
