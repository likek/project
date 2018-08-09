"use strict";
cc._RF.push(module, 'cf7e7Hjl8pBApNKVzaPXR0c', 'config');
// scripts/config.js

'use strict';

//log日志开关
window.CONSOLE_LOG_OPEN = false;

//转换16进制颜色为rgb
function HEX2RGB(hexColor) {
	return {
		r: parseInt(hexColor.slice(1, 3), 16),
		g: parseInt(hexColor.slice(3, 5), 16),
		b: parseInt(hexColor.slice(5, 7), 16)
	};
}

function RGB2HEX(r, g, b) {
	var color = '#' + str_pad(Math.floor(r).toString(16), 2, '0') + str_pad(Math.floor(g).toString(16), 2, '0') + str_pad(Math.floor(b).toString(16), 2, '0');
	return color;
}
//去除收尾空格
function trim(value) {
	var temp = value;
	var obj = /^(\s*)([\W\w]*)(\b\s*$)/;
	if (obj.test(temp)) {
		temp = temp.replace(obj, '$2');
	}
	obj = /^(\s*)$/;
	if (obj.test(temp)) {
		temp = '';
	}

	return temp;
}
//转换为整数
function toInt(str) {
	var result = parseInt(str, 10);
	return isNaN(result) ? 0 : result;
}
//是否为数字
function isNum(num) {
	var rule = /^\d+$/;
	if (rule.test(num)) return true;
	return false;
}
//取min-max区间的随机数
function rand(min, max) {
	var Range = max - min;
	var Rand = Math.random();
	return min + Math.round(Rand * Range);
}
/**
 * 统计字符串长度，中文2的长度
 * @returns
 */
String.prototype.len = function () {
	return this.replace(/[^\x00-\xff]/g, "**").length;
};
/**
 * 字符串截取
 * @param len
 * @returns
 */
String.prototype.cutStr = function (n) {
	var r = /[^\x00-\xff]/g;

	if (this.replace(r, "**").length <= n) return this;
	var new_str = "";
	var str = "";
	for (var i = 0, j = 0; i < this.length && j < n; i++) {
		str = this.substr(i, 1);
		new_str += str;
		j += str.replace(r, "**").length > 1 ? 2 : 1;
	}
	return new_str + " ..";
};
/**
 * 替换字符串中的字符
 * @param str
 * @param replace_what
 * @param replace_with
 * @returns
 */
function str_replace(str, replace_what, replace_with) {
	var ndx = str.indexOf(replace_what);
	var delta = replace_with.length - replace_what.length;
	while (ndx >= 0) {
		str = str.substring(0, ndx) + replace_with + str.substring(ndx + replace_what.length);
		ndx = str.indexOf(replace_what, ndx + delta + 1);
	}
	return str;
}
// alert( readCookie("myCookie") );
function readCookie(name) {
	var cookieValue = "";
	var search = name + "=";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = document.cookie.indexOf(";", offset);
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

function getTime() {
	return new Date().getTime();
}

//=====解决js浮点运算bug<<<

//除法函数，用来得到精确的除法结果
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
	var t1 = 0,
	    t2 = 0,
	    r1,
	    r2;
	try {
		t1 = arg1.toString().split(".")[1].length;
	} catch (e) {}
	try {
		t2 = arg2.toString().split(".")[1].length;
	} catch (e) {}
	//with(Math) {
	r1 = Number(arg1.toString().replace(".", ""));
	r2 = Number(arg2.toString().replace(".", ""));
	return r1 / r2 * Math.pow(10, t2 - t1);
	//}
}
//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
	return accDiv(this, arg);
};
//乘法函数，用来得到精确的乘法结果
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2) {
	var m = 0,
	    s1 = arg1.toString(),
	    s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

//给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
	return accMul(arg, this);
};

//加法函数，用来得到精确的加法结果
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
	var r1, r2, m;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	return (arg1 * m + arg2 * m) / m;
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
	return accAdd(arg, this);
};

//减法函数，用来得到精确的减法结果
//调用：accSub(arg1,arg2)
//返回值：arg1减去arg2的精确结果
function accSub(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	// last modify by deeka
	// 动态控制精度长度
	n = r1 >= r2 ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.sub = function (arg) {
	return accSub(arg, this);
};
// =====解决js浮点运算bug>>>

cc._RF.pop();