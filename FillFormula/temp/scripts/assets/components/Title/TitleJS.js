"use strict";
cc._RF.push(module, '5b283IiR/BBgLkN+zazJigp', 'TitleJS');
// components/Title/TitleJS.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label
    },

    init: function init(title) {
        this.label.string = title;
    }
});

cc._RF.pop();