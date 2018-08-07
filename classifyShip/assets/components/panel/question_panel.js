let questionAry = []; 
//选项区域
cc.Class({
    extends: cc.Component,

    properties: {
        oItemPrefab: cc.Prefab, //背景预制
    },

    // use this for initialization
    onLoad: function () {
        this.oItemPool = new cc.NodePool();

    },
    isEmpty: function () {
        return questionAry.length == 0;
    },
    copyAry: function () {
        //return Array.from(questionAry);//不支持9以下系统
        var newAry = questionAry.slice(0, questionAry.length);
        if (CONSOLE_LOG_OPEN) console.log('questionAry.slice' + newAry + '  ' + questionAry);

        return newAry;

    },
   //创建选项floor向下取整,ceil向上取整
   createOptions: function () {

    for (let i = 0, option, optionJs; i < questionAry.length; i++) {

        if (i == this.questionAry.length - 1) {
            if(this.oItemPool.size() > 0){
                option =  this.oItemPool.get();
            }else{
            option = cc.instantiate(this.oItemPrefab);
            }
            option.parent = this.node;
        } else {
            option = this.node.children[i];
        }
        let width = option.width,
            height = this.node.height,
            paddingX = 15,
            paddingY = 10,
            wcount = 3,
            index = i % 3,
            // x = (-wcount / 2 + index + 0.5) * (width + paddingX),
            x = (index -1) * (width + paddingX),
            y = i < 3 ? (height/3 + paddingY) : i < 6 ? paddingY*3 : (-height/3 + paddingY*5.5);
             option.setPosition(cc.p(x, y));

    }
},
    
    addOption: function (contentAry) {
        let cb = () => {
           //node.zIndex = this.num++; //不设置zIndex,数组里取值顺序错乱
           var newAry = contentAry.slice(0, contentAry.length);
            questionAry.push(newAry.sort(_sortNumber));
            this.createOptions(contentAry);
            // this.numLabel.string = questionAry.length;
            this.updateSum();
        };
        cb();
    },
  
    /* 还原所有状态 */
    removeAllOption: function () {

        for (var i = 0; i < this.node.children.length; i++) {
            let contentNode = this.node.children[i];
            contentNode.removeAllChildren(true);
        }
        this.node.removeAllChildren(true);
       
        questionAry.splice(0, questionAry.length);
        questionAry = [];
        this.updateSum();

    },
    //更新显示
    updateSum: function (){
        //this.textLabel.string = this.questionAry.length;
    }


});