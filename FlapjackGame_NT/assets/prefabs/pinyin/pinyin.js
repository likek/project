var VALIGN = cc.Enum({TOP:0,MIDDLE:1,BOTTOM:2});
var HALIGN = cc.Enum({LEFT:0,CENTER:1,RIGHT:2});
cc.Class({
    extends: cc.Component,

    properties: {
        calpinyin: cc.Node,
        calhanzi: cc.Node,
        calcontainer: cc.Node,
        hanzi: '',
        pinyin: '',
        maxwidth: 1600,
        gap: 20,
        verticalAlign: {
            'type': VALIGN,
            'default': VALIGN.MIDDLE
        },
        textAlign: {
            'type': HALIGN,
            'default': HALIGN.CENTER
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.plPool = new cc.NodePool();
        this.hlPool = new cc.NodePool();
        this.refresh();
    },

    setData: function(hanzi, pinyin){
        this.hanzi = hanzi;
        this.pinyin = pinyin;
        this.refresh();
    },

    refresh: function(){        
        var hanziarr = this.splitCString(this.hanzi);
        var hanzimap = this.toLengthMap(hanziarr, this.calhanzi);
        var hanzigroup = this.toGroupHanzi(hanzimap);
        
        if(this.pinyin){
            var pinyinarr = this.pinyin?this.pinyin.split(' '):[];
            var pinyinmap = this.toLengthMap(pinyinarr, this.calpinyin);
            var pinyingroup = this.toGrouppinyin(hanzigroup, pinyinmap);
            this.createLabels(hanzigroup, pinyingroup);
        }else {
            this.createLabelsH(hanzigroup);
        }
    },

    //创建显示标签
    createLabels: function(hgroup, pgroup){
        var sy = 0;
        if(this.verticalAlign===VALIGN.TOP){
            sy = 0;
        }else if(this.verticalAlign===VALIGN.MIDDLE){
            sy = +(hgroup.length/2*(this.calhanzi.height + this.calpinyin.height));
        }else if(this.verticalAlign===VALIGN.BOTTOM){
            sy = +(hgroup.length*(this.calhanzi.height + this.calpinyin.height));
        }
        for(var i = 0; i < this.calcontainer.childrenCount; ){
            if(this.calcontainer.children[0].tag === 0){
                this.hlPool.put(this.calcontainer.children[0]);
            }else if(this.calcontainer.children[0].tag === 1){
                this.plPool.put(this.calcontainer.children[0]);
            }
        }
        for(var i = 0, h, p; i < hgroup.length; i++){
            hgroup[i].forEach((element, index) => {
                if(this.hlPool.size()>0){
                    h = this.hlPool.get();
                }else{
                    h = cc.instantiate(this.calhanzi);
                }
                h.position = cc.p(element.x, sy-i*(this.calhanzi.height + this.calpinyin.height)-this.calpinyin.height);
                h.getComponent(cc.Label).string = element.data;
                h.opacity = 255;
                h.parent = this.calcontainer;
                h.tag = 0;
            });
            pgroup[i].forEach((element, index) => {
                if(this.plPool.size()>0){
                    p = this.plPool.get();
                }else{
                    p = cc.instantiate(this.calpinyin);
                }
                p.position = cc.p(element.x, sy-i*(this.calhanzi.height + this.calpinyin.height));
                p.getComponent(cc.Label).string = element.data;
                p.opacity = 255;
                p.parent = this.calcontainer;
                p.tag = 1;
            });
        }
    },

    //创建显示标签
    createLabelsH: function(hgroup){
        var sy = 0;
        if(this.verticalAlign===VALIGN.TOP){
            sy = 0;
        }else if(this.verticalAlign===VALIGN.MIDDLE){
            sy = +(hgroup.length/2*(this.calhanzi.height));
        }else if(this.verticalAlign===VALIGN.BOTTOM){
            sy = +(hgroup.length*(this.calhanzi.height));
        }
        for(var i = 0; i < this.calcontainer.childrenCount; ){
            if(this.calcontainer.children[0].tag === 0){
                this.hlPool.put(this.calcontainer.children[0]);
            }else if(this.calcontainer.children[0].tag === 1){
                this.plPool.put(this.calcontainer.children[0]);
            }
        }
        for(var i = 0, h, p; i < hgroup.length; i++){
            hgroup[i].forEach((element, index) => {
                if(this.hlPool.size()>0){
                    h = this.hlPool.get();
                }else{
                    h = cc.instantiate(this.calhanzi);
                }
                h.position = cc.p(element.x, sy-i*(this.calhanzi.height));
                h.getComponent(cc.Label).string = element.data;
                h.opacity = 255;
                h.parent = this.calcontainer;
                h.tag = 0;
            });
        }
    },

    //根据汉字分组对拼音进行分组
    toGrouppinyin: function(hgroup, lmap){
        var r = [];
        r.count = lmap.count;
        for(var i = 0, c = 0, t = [], tl = 0, tlh = 0; i < hgroup.length; i ++){
            for(var j = 0; j < hgroup[i].length&&c + j < lmap.count; j++){
                t.push({
                    'data': lmap[c+j]['data'],
                    'length': lmap[c+j]['length'],
                    'x': hgroup[i][j].x
                });
            }
            r.push(t);
            t = [];
            tl = 0;
            tlh = 0;
            c += j;
        }
        return r;
    },

    //根据最大宽度限制对文字进行分组
    toGroupHanzi: function(lmap){
        var grounps = [];
        grounps.count = lmap.count;
        for(var i = 0, t = [], tl = 0; i < lmap.count; i ++){
            if(tl+lmap[i]['length']<this.maxwidth){
                lmap[i]['x'] = tl + lmap[i]['length']/2;
                t.push(lmap[i]);
                tl+=lmap[i]['length'] + this.gap;
            }else{
                t.glength = tl;
                grounps.push(t);
                t = [];
                tl = 0;
                lmap[i]['x'] = tl + lmap[i]['length']/2;
                t.push(lmap[i]);
                tl+=lmap[i]['length'] + this.gap;
            }
        }
        if(t){
            t.glength = tl;
            grounps.push(t);
        }

        for(var i = 0, xs; i < grounps.length; i++){
            if(this.textAlign === HALIGN.CENTER){
                xs = grounps[i].glength/2;
            }else if(this.textAlign === HALIGN.LEFT){
                xs = this.maxwidth/2;
            }else if(this.textAlign === HALIGN.RIGHT){
                xs = grounps[i].glength - this.maxwidth/2;
            }
            grounps[i].forEach(element => {
                element.x = element.x - xs;
            });
        }
        return grounps;
    },

    //转换为长度映射
    toLengthMap: function(arr, calNode){
        var r = {};
        r.count = arr instanceof Array?arr.length: 0;
        for(var i = 0; arr instanceof Array&&calNode instanceof cc.Node&&i < arr.length; i++){
            r[i] = {};
            r[i]['data'] = arr[i];
            calNode.getComponent(cc.Label).string = arr[i];
            r[i]['length'] = calNode.width;
        }
        return r;
    },

    //拆分连续的字符串
    splitCString: function(str){
        var r = [];
        for(var i =0; typeof str === 'string'&&i < str.length; i++){
            r.push(str.charAt(i));
        }
        return r;
    }

    // update (dt) {},
});
