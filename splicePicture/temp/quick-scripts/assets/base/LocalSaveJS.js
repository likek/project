(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/base/LocalSaveJS.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f4c57nVhA1DEK8uDdBUQDFX', 'LocalSaveJS', __filename);
// base/LocalSaveJS.js

"use strict";

cc.Class({
				extends: cc.Component,

				properties: {},

				save: function save(key, data) {
								var localStorage = cc.sys.localStorage;
								if (!localStorage) {
												localStorage.setItem(key, data);
								} else {
												writeCookie(key, data);
								}
				},

				load: function load(key) {
								var localStorage = cc.sys.localStorage;
								if (!localStorage) {
												return localStorage.getItem(key);
								} else {
												return readCookie(key);
								}
				}

});

function readCookie(name) {
				var cookieValue = "";
				var search = name + "=";
				if (document.cookie.length > 0) {
								var offset = document.cookie.indexOf(search);
								if (offset != -1) {
												offset += search.length;
												var end = document.cookie.indexOf(";", offset);
												if (end == -1) end = document.cookie.length;
												cookieValue = unescape(document.cookie.substring(offset, end));
								}
				}
				return cookieValue;
}

//time=秒
function writeCookie(name, value, time) {
				var expire = "";
				if (time != null) {
								//domain=.baidu.com
								expire = new Date(new Date().getTime() + time * 1000);
								expire = "; expires=" + expire.toGMTString();
				}
				expire += "; path=/";

				document.cookie = name + "=" + escape(value) + expire;
}

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=LocalSaveJS.js.map
        