/* JavaScript Document */

/*
    目录：
    1、工具函数
        1.1、dom方法
        1.2、事件相关
        1.3、cookie与storage
        1.4、增强函数
        1.5、时间日期处理
        1.6、格式化函数
        1.7、浏览器相关
        1.8、网络请求
        1.9、项目中使用
        1.10、跨域解决方案
        1.99、自我拓展
    2、常用插件
        2.1、运动框架
        2.2、轮播相关
        2.3、特效
    3、canvas操作
        3.1、canvas
    4、定位
        4.1、高德地图相关
    5、微信
        5.1、微信支付与微信sdk调用
    6、参考函数
        6.1、各种参考函数
    7、算法函数与设计模式
        7.1、排序算法
        7.2、其它算法
        7.3、设计模式
    8、vue框架
        8.1、vue项目中用到
    9、react框架
        9.1、react项目中用到
    10、严格模式
        10.1、严格模式使用规则
*/

/*
    1.1、dom方法
*/

//原生常用方法封装
function Id(id) {
    return document.getElementById(id);
};

function Class(Class) {
    return document.getElementsByClassName(Class);
};

function Tag(tag) {
    return document.getElementsByTagName(tag);
};

function QS(Class) { //带上选择符号(包括属性)，只能选一组中的一个元素
    return document.querySelector(Class);
};

function QSA(Class) { //带上选择符号(包括属性)，能选一组元素
    return document.querySelectorAll(Class);
};

function Create(tag) {
    return document.createElement(tag);
};

function Add(obj, obj1) {
    obj.appendChild(obj1);
};

function Insert(obj, obj1, obj2) { //父元素，要插入的元素，插入元素的后一个兄弟元素
    obj.insertBefore(obj1, obj2);
};

function Remove(obj, obj1) {
    obj.removeChild(obj1);
};

function AddClass(obj, className) {
    obj.classList.add(className);
};

function RemoveClass(obj, className) {
    obj.classList.remove(className);
};

function ToggleClass(obj, className) {
    obj.classList.toggle(className);
};

function HasClass(obj, className) {
    return obj.classList.contains(className);
};

function parent(obj) {
    return obj.parentElement || obj.parentNode;
};

function prevSibling(obj) {
    return obj.previousElementSibling || obj.previousSibling;
};

function nextSibling(obj) {
    return obj.nextElementSibling || obj.nextSibling;
};

function firstChild(obj) {
    return obj.firstElementChild || obj.firstChild;
};

function lastChild(obj) {
    return obj.lastElementChild || obj.lastChild;
};

function Scroll(obj, position, dis) {
    var position = 'scroll' + position.toLowerCase().replace(/^[a-z]{1}/, position.charAt(0).toUpperCase());

    if (obj === document || obj === document.body) {
        document.documentElement[position] = document.body[position] = dis;
    } else {
        obj[position] = dis;
    }
};

//获取对象样式
function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
};

//获取到document的位置
function getPos(obj, attr) {
    var obj1 = obj;
    var value = 0;
    var iPos = 0;
    var i = 0;

    while (obj) {
        iPos = attr == 'left' ? obj.offsetLeft : iPos = obj.offsetTop;
        value += iPos;
        obj = obj.offsetParent;
        i++;
    }
    return value;
};

//获取dom到document的位置和宽高集合
function getClientRect(dom) {
    var rect = dom.getBoundingClientRect();
    var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var clientLeft = document.documentElement.clientLeft;
    var clientTop = document.documentElement.clientTop;
    var json = {
        left: rect.left + scrollLeft - clientLeft,
        top: rect.top + scrollTop - clientTop,
        right: rect.right + scrollLeft,
        bottom: rect.bottom + scrollTop,
        dLeft: rect.left + clientLeft,
        dTop: rect.top + clientTop,
        rect: function () {
            return {
                left: this.left,
                top: this.top,
                right: this.right,
                bottom: this.bottom,
                dLeft: this.dLeft,
                dTop: this.dTop,
                width: rect.width || this.right - this.left,
                height: rect.height || this.bottom - this.top,
            };
        },
    };

    return json.rect();
};

//碰撞检测(配合定时器使用)
function collide(obj1, obj2) {
    var l1 = obj1.offsetLeft;
    var r1 = obj1.offsetLeft + obj1.offsetWidth;
    var t1 = obj1.offsetTop;
    var b1 = obj1.offsetTop + obj1.offsetHeight;

    var l2 = obj2.offsetLeft;
    var r2 = obj2.offsetLeft + obj2.offsetWidth;
    var t2 = obj2.offsetTop;
    var b2 = obj2.offsetTop + obj2.offsetHeight;

    return r1 < l2 || l1 > r2 || b1 < t2 || t1 > b2 ? false : true;
};

//实时监测两组物体碰撞并返回数据(性能良好：小于或等于2500次循环，性能上限：大于或等于10000次循环)
//class1，一组要做碰撞检测的元素的选择器字符串
//class2，另一组要做碰撞检测的元素的选择器字符串
//endFn，回调函数(处理逻辑)
//data[//返回的数据包
//  {
//      exist1:true,//碰撞元素1是否存在于碰撞数组
//      exist2:true,//碰撞元素2是否存在于碰撞数组
//      isRemove:true,//是否可以安全删除两个元素(两个元素都不存在于碰撞数组)
//      obj1:obj1,//碰撞到的元素1
//      obj2:obj2,//碰撞到的元素2
//      pos1:{//碰撞元素1的位置
//          left:left,
//          top:top,
//      },
//      pos2:{//碰撞元素2的位置
//          left:left,
//          top:top,
//      },
//  }
//];
function watchObjectPZ(class1, class2, endFn) {
    var colJson = {}; //保留准备处理的id

    yydTimer(function () {
        var data = [];

        for (var i = 0; i < QSA(class1).length; i++) {
            for (var j = 0; j < QSA(class2).length; j++) {
                if (collide(QSA(class1)[i], QSA(class2)[j])) {
                    var exist1 = false;
                    var exist2 = false;
                    var condition = !colJson[QSA(class1)[i].id] && !colJson[QSA(class2)[j].id];

                    //元素是否存在于碰撞数组里
                    if (colJson[QSA(class1)[i].id]) exist1 = true;
                    if (colJson[QSA(class2)[j].id]) exist2 = true;

                    //用来存储碰撞后的id，以备下次判断使用
                    if (condition) colJson[QSA(class1)[i].id] = 1;
                    if (condition) colJson[QSA(class2)[j].id] = 1;

                    data.push({
                        exist1: exist1,
                        exist2: exist2,
                        isRemove: condition,
                        obj1: QSA(class1)[i],
                        obj2: QSA(class2)[j],
                        pos1: {
                            left: QSA(class1)[i].offsetLeft,
                            top: QSA(class1)[i].offsetTop,
                        },
                        pos2: {
                            left: QSA(class2)[j].offsetLeft,
                            top: QSA(class2)[j].offsetTop,
                        },
                    });
                    if (condition) break;
                }
            }
        }
        if (data.length) {
            endFn && endFn(data);
        }
    }, 1000 / 60);
};

//选择器方式的碰撞检测
var collisionDetection = {
    set: function (domList) { //设置以备检测列表的样式以及信息，父级需设置宽高，参数(元素列表)
        var domList = domList.length ? domList : [domList];

        for (var i = 0; i < domList.length; i++) {
            var obj = domList[i];
            var width = obj.offsetWidth;
            var height = obj.offsetHeight;
            var left = obj.offsetLeft;
            var right = left + width;
            var top = obj.offsetTop;
            var bottom = top + height;
            var dataInfo = {
                name: obj.className,
                width: width,
                height: height,
                left: left,
                top: top,
            };

            obj.style.left = left + 'px';
            obj.style.top = top + 'px';
            obj.setAttribute('dataInfo', encodeURIComponent(JSON.stringify(dataInfo)));
        }
        for (var i = 0; i < obj.length; i++) {
            var obj = obj[i];

            obj.style.position = 'absolute';
        }

        return this;
    },
    get: function (self, other) { //获取当前元素碰撞到的元素列表，参数(当前元素,需检测元素的模板元素)
        var otherDataInfo = JSON.parse(decodeURIComponent(other.getAttribute('dataInfo')) || '') || {};
        var otherWidth = otherDataInfo.width;
        var otherHeight = otherDataInfo.height;
        var selfDataInfo = JSON.parse(decodeURIComponent(self.getAttribute('dataInfo')) || '') || {};
        var selfWidth = selfDataInfo.width;
        var selfHeight = selfDataInfo.height;
        var selfLeft = selfDataInfo.left;
        var selfTop = selfDataInfo.top;
        var minLeftIndex = -1;
        var maxLeftIndex = -1;
        var minTopIndex = -1;
        var maxTopIndex = -1;
        var seletorInfo = {
            name: 'floor',
            width: otherWidth,
            height: otherHeight,
        };
        var seletorArr = [];

        minLeftIndex = Math.floor(selfLeft / otherWidth);
        maxLeftIndex = Math.floor((selfLeft + selfWidth) / otherWidth);
        minTopIndex = Math.floor(selfTop / otherHeight);
        maxTopIndex = Math.floor((selfTop + selfHeight) / otherHeight);

        if (~minLeftIndex && ~maxLeftIndex && ~minTopIndex && ~maxTopIndex) {
            for (var i = minLeftIndex; i <= maxLeftIndex; i++) {
                for (var j = minTopIndex; j <= maxTopIndex; j++) {
                    seletorInfo.left = i * otherWidth;
                    seletorInfo.top = j * otherHeight;
                    seletorArr.push(`[dataInfo="${encodeURIComponent(JSON.stringify(seletorInfo))}"]`);
                }
            }
        }

        var seletor = seletorArr.join(',');
        var seletDom = QSA(seletor);

        return seletDom;
    },
};

//用js修改样式表
//linkHref（样式表完整名称）
//className(想要修改的选择器完整名称)
//json(json格式去写样式)
function jsStyle(linkHref, className, json) {
    var sheets = document.styleSheets; //拿到所有样式表
    var sheet = null;

    for (var i = 0; i < sheets.length; i++) {
        if (sheets[i].href) {
            var sHref = sheets[i].href;
            sHref = sHref.substring(sHref.lastIndexOf('/') + 1, sHref.length);

            if (sHref == linkHref) {
                sheet = sheets[i]; //拿到样式表对象
            }
        }
    }

    var rules = sheet.cssRules || sheet.rules; //拿到所有的样式
    var rule = null;

    for (var i = 0; i < rules.length; i++) {
        if (rules[i].selectorText == className) {
            rule = rules[i]; //拿到想要操作的那条样式
            for (var attr in json) {
                rule.style[attr] = json[attr];
            }
        }
    }
    return rule.cssText;
};

//重置file文件
//obj(file文件对象)
function resetFile(obj) {
    var oFrom = document.createElement('form');
    var oParent = obj.parentNode;

    oFrom.appendChild(obj);
    oFrom.reset();
    oParent.appendChild(obj);
};

//路由切换回到顶部防闪屏（用于单页应用）
function routerChange() {
    document.body.style.display = 'none';
    setTimeout(function () {
        document.body.style.display = 'block';
        document.documentElement.scrollTop = document.body.scrollTop = 0;
    });
};

//禁止与允许body滚动
function controlBodyScroll(disableScroll, goTop) {
    var oHtml = document.documentElement;
    var oBody = document.body;

    if (disableScroll) {
        oHtml.style.height = '100%';
        oHtml.style.overflowY = 'hidden';
        oBody.style.height = '100%';
        oBody.style.overflowY = 'hidden';
    } else {
        oHtml.style.height = 'auto';
        oHtml.style.overflowY = 'visible';
        oBody.style.height = 'auto';
        oBody.style.overflowY = 'visible';
    }

    if (goTop) {
        oHtml.scrollTop = oBody.scrollTop = 0;
        setTimeout(function () {
            oHtml.scrollTop = oBody.scrollTop = 0;
        });
    }
};

/*
    1.2、事件相关
*/

//绑定的方式阻止事件冒泡
function cBub(ev) {
    var ev = ev || event;

    if (ev.stopPropagation) ev.stopPropagation(); //标准
    ev.cancelBubble = true; //ie
};

//绑定的方式阻止默认事件
function pDef(ev) {
    var ev = ev || event;

    if (ev.preventDefault) ev.preventDefault(); //标准
    ev.returnValue = false; //ie
};

//兼容之前用到的fix函数
function fix(ev) {
    pDef(ev);
};

//绑定事件，可重复绑定('事件名称'必须加引号)
function bind(obj, evname, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evname, fn, false);
        if (evname == 'mousewheel') {
            obj.addEventListener('DOMMouseScroll', fn, false);
        }
    } else {
        obj.attachEvent('on' + evname, function () {
            fn.call(obj);
        });
    }
};

//取消绑定，可重复取消('事件名称'必须加引号)
function unbind(obj, evname, fn) {
    if (obj.removeEventListener) {
        obj.removeEventListener(evname, fn, false);
        if (evname == 'mousewheel') {
            obj.removeEventListener('DOMMouseScroll', fn, false);
        }
    } else {
        obj.detachEvent('on' + evname, fn);
    }
};

//鼠标滚轮事件兼容
function MouseWheel(obj, upFn, downFn) {
    bind(obj, 'mousewheel', mousewheelFn);

    function mousewheelFn(ev) {
        var ev = ev || event;
        var up = true;

        if (ev.wheelDelta) {
            up = ev.wheelDelta > 0 ? true : false;
        } else {
            up = ev.detail < 0 ? true : false;
        }
        up ? upFn && upFn.call(obj, ev) : downFn && downFn.call(obj, ev);

        pDef(ev);
    };
};

//dom加载完毕执行函数
function domLoad(fn) {
    var onOff = true;

    setTimeout(function () {
        if (document.readyState == 'complete') {
            onOff && fn && fn('readyState');
            onOff = false;
        }
    });
    bind(document, 'DOMContentLoaded', function () {
        onOff && fn && fn('DOMContentLoaded');
        onOff = false;
    });
    bind(document, 'onreadystatechange', function () {
        onOff && fn && fn('onreadystatechange');
        onOff = false;
    });
    bind(window, 'load', function () {
        onOff && fn && fn('load');
        onOff = false;
    });
};

//自动点击事件
function autoEvent(obj, event) {
    if (document.createEvent) {
        var evObj = document.createEvent('MouseEvents');

        evObj.initEvent(event, true, false); //事件的类型、事件是否起泡、是否可以用 preventDefault() 方法取消事件
        obj.dispatchEvent(evObj);
    } else if (document.createEventObject) {
        obj.fireEvent(event);
    }
};

//生成32位唯一字符串(大小写字母数字组合)
function soleString32() {
    var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var timestamp = +new Date() + Math.floor(Math.random() * 10);
    var resultStr = '';

    for (var i = 0; i < 19; i++) {
        resultStr += str.charAt(Math.floor(Math.random() * str.length));
    }
    resultStr += timestamp;

    resultStr = resultStr.split('');
    resultStr.sort(function (a, b) {
        return Math.random() - 0.5;
    });
    resultStr = resultStr.join('');
    return resultStr;
};

//自定义事件的实现（发布订阅模式）
var customEvent = {
    json: {},
    on: function (evName, fn) {
        if (Type(this.json[evName]) != 'object') {
            this.json[evName] = {};
        }
        if (Type(fn) == 'function') {
            fn.id = soleString32();
            this.json[evName][fn.id] = fn;
        }
        return this;
    },
    emit: function (evName) {
        var evFnArr = this.json[evName];
        var params = Array.prototype.slice.call(arguments, 1);

        if (Type(evFnArr) == 'object') {
            for (var attr in this.json[evName]) {
                if (Type(this.json[evName][attr]) == 'function') {
                    this.json[evName][attr].apply(this, params);
                }
            }
        }
        return this;
    },
    remove: function (evName, fn) {
        var evFnArr = this.json[evName];

        if (Type(evName) == 'string' && Type(evFnArr) == 'object') {
            if (Type(fn) == 'function') {
                if (fn.id) {
                    delete this.json[evName][fn.id];
                } else {
                    for (var attr in this.json[evName]) {
                        if (this.json[evName][attr] + '' === fn + '') {
                            delete this.json[evName][attr];
                            break;
                        }
                    }
                }
            } else {
                delete this.json[evName];
            }
        }
        return this;
    }
};

//兼容手机和pc端的拖拽事件方法(该方法不进行拖拽，只封装事件)
/*
    option {
        obj: obj, //被拖拽的对象
        start: function (position, ev) {}, //拖拽开始的函数
        move: function (position, ev) {}, //拖拽中的函数
        end: function (position, ev) {}, //拖拽结束的函数
        preventDefault: true, //是否阻止系统默认拖拽事件
    }
*/
function onDrag(option) {
    var obj = option.obj;
    var start = option.start;
    var move = option.move;
    var end = option.end;
    var preventDefault = option.preventDefault;
    var position = {
        sX: 0,
        sY: 0,
        mX: 0,
        mY: 0,
        eX: 0,
        eY: 0,
    };

    isPhone() ? mo() : pc();

    function mo() {
        bind(obj, 'touchstart', fn1);

        function fn1(ev) {
            var ev = ev || event;

            position.sX = ev.changedTouches[0].clientX;
            position.sY = ev.changedTouches[0].clientY;
            start && start.call(obj, position, ev);
        };
        bind(obj, 'touchmove', fn2);

        function fn2(ev) {
            var ev = ev || event;

            position.mX = ev.changedTouches[0].clientX;
            position.mY = ev.changedTouches[0].clientY;
            move && move.call(obj, position, ev);
        };
        bind(obj, 'touchend', fn3);

        function fn3() {
            var ev = ev || event;

            position.eX = ev.changedTouches[0].clientX;
            position.eY = ev.changedTouches[0].clientY;
            end && end.call(obj, position, ev);
        };
    };

    function pc() {
        obj.onmousedown = function (ev) {
            var ev = ev || event;

            position.sX = ev.clientX;
            position.sY = ev.clientY;

            if (obj.setCapture) obj.setCapture;
            start && start.call(obj, position, ev);
            document.onmousemove = function (ev) {
                var ev = ev || event;

                position.mX = ev.clientX;
                position.mY = ev.clientY;
                move && move.call(obj, position, ev);
            };
            document.onmouseup = function () {
                document.onmousemove = document.onmouseup = null;
                if (obj.releaseCapture) obj.releaseCapture;
                var ev = ev || event;

                position.eX = ev.clientX;
                position.eY = ev.clientY;
                end && end.call(obj, position, ev);
            };
            return false;
        };
    };

    if (preventDefault) bind(obj, 'touchmove', pDef);
    document.onselectstart = function () {
        return false;
    };
};

//兼容手机和电脑端的拖拽方法
function drag(obj, lMin, lMax, tMin, tMax, sFn, mFn, endFn) {
    var disX = 0;
    var disY = 0;
    var lMin = lMin || 0;
    var lMax = lMax || Math.max(document.documentElement.clientWidth, parseInt(getStyle(document.body, 'width'))) - parseInt(getStyle(obj, 'width'));
    var tMin = tMin || 0;
    var tMax = tMax || Math.max(document.documentElement.clientHeight, parseInt(getStyle(document.body, 'height'))) - parseInt(getStyle(obj, 'height'));

    isPhone() ? mo() : pc();

    function mo() {
        bind(obj, 'touchstart', fn1);

        function fn1(ev) {
            var ev = ev || event;

            disX = ev.changedTouches[0].clientX - css(obj, 'left');
            disY = ev.changedTouches[0].clientY - css(obj, 'top');
            sFn && sFn.call(obj, disX, disY);
        };
        bind(obj, 'touchmove', fn2);

        function fn2(ev) {
            var ev = ev || event;
            var l = ev.changedTouches[0].clientX - disX;
            var t = ev.changedTouches[0].clientY - disY;

            if (l < lMin) l = lMin;
            if (l > lMax) l = lMax;
            if (t < tMin) t = tMin;
            if (t > tMax) t = tMax;
            css(obj, 'left', l + 'px');
            css(obj, 'top', t + 'px');
            mFn && mFn.call(obj, l, t);
        };
        bind(obj, 'touchend', fn3);

        function fn3() {
            endFn && endFn.call(obj);
        };
    };

    function pc() {
        obj.onmousedown = function (ev) {
            var ev = ev || event;
            disX = ev.clientX - css(obj, 'left');
            disY = ev.clientY - css(obj, 'top');

            if (obj.setCapture) obj.setCapture;
            sFn && sFn.call(obj, disX, disY);
            document.onmousemove = function (ev) {
                var ev = ev || event;
                var l = ev.clientX - disX;
                var t = ev.clientY - disY;

                if (l < lMin) l = lMin;
                if (l > lMax) l = lMax;
                if (t < tMin) t = tMin;
                if (t > tMax) t = tMax;
                css(obj, 'left', l + 'px');
                css(obj, 'top', t + 'px');
                mFn && mFn.call(obj, l, t);
            };
            document.onmouseup = function () {
                document.onmousemove = document.onmouseup = null;
                if (obj.releaseCapture) obj.releaseCapture;
                endFn && endFn.call(obj);
            };
            return false;
        };
    };

    bind(obj, 'touchmove', pDef);
    document.onselectstart = function () {
        return false;
    };
};

/*
    1.3、cookie与storage
*/

//cookie操作
var cookie = {
    set: function (key, value, sec) {
        var value = value;
        var sec = sec || 60 * 60 * 24 * 30;
        var type = Type(value);
        var oDate = new Date();

        switch (type) {
            case 'object':
            case 'array':
                value = JSON.stringify(value);
                break;
        }

        oDate.setSeconds(oDate.getSeconds() + sec);
        oDate = oDate.toGMTString();
        document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' + oDate;
    },
    get: function (key) {
        var str = document.cookie;
        var reg = new RegExp('(^|(;\\s))' + key + '=([^;\\s]+)((;\\s)|$)');
        var result = str.match(reg);

        result = result ? decodeURIComponent(result[3]) : '';

        try {
            result = Type(+result) == 'number' ? result : JSON.parse(result);
        } catch (e) {}

        return result;
    },
    getKeys: function () {
        var str = document.cookie;
        var reg1 = /\=+/g;
        var reg2 = /(\;|[\;\s])+/g;

        try {
            if (str.length) {
                str = str.replace(reg1, '":"');
                str = str.replace(reg2, '","');
                str = '{"' + str;
                str += '"}';
                str = JSON.parse(str);
            } else {
                str = {};
            }
        } catch (e) {}

        return str;
    },
    getAll: function () {
        var json = {};
        var keys = this.getKeys();

        for (var attr in keys) {
            json[attr] = this.get(attr);
        }

        return json;
    },
    remove: function (key) {
        var oDate = new Date();

        oDate.setDate(oDate.getDate() - 1);
        oDate = oDate.toGMTString();
        document.cookie = key + '=;expires=' + oDate;
    },
    clear: function () {
        var keys = this.getKeys();

        for (var attr in keys) {
            this.remove(attr);
        }
    },
};

//创建Store对象(增强localStorage或sessionStorage，直接存取对象或者数组)
var Store = function () {
    this.name = 'Store';
};

Store.prototype = {
    init: function (type) {
        this.store = window[type];
        return this;
    },
    set: function (key, value) {
        var type = Type(value);

        switch (type) {
            case 'object':
            case 'array':
                this.store.setItem(key, JSON.stringify(value));
                break;
            default:
                this.store.setItem(key, value);
        }

    },
    get: function (key) {
        var value = this.store.getItem(key);

        try {
            value = Type(+value) == 'number' ? value : JSON.parse(value);
        } catch (e) {}

        return value;
    },
    getAll: function () {
        var store = copyJson(this.store);
        var json = {};
        var value = '';

        for (var attr in store) {
            try {
                value = store[attr];
                value = Type(+value) == 'number' ? value : JSON.parse(value);
            } catch (e) {}
            json[attr] = value;
        }
        return json;
    },
    remove: function (key) {
        this.store.removeItem(key);
    },
    clear: function () {
        this.store.clear();
    },
};

//localStorage操作
var lStore = new Store().init('localStorage');

//sessionStorage操作
var sStore = new Store().init('sessionStorage');

/*
    1.4、增强函数
*/

//判断数据类型的方法（对typeof的增强，8种常用类型的判断，返回小写字符串）
function Type(obj) {
    var arr = ['null', 'undefined', 'nan', 'function', 'number', 'string', 'array', 'object'];
    if (obj === null) {
        return 'null';
    }
    if (obj !== obj) {
        return 'nan';
    }
    if (typeof Array.isArray === 'function') {
        if (Array.isArray(obj)) { //浏览器支持则使用isArray()方法
            return 'array';
        }
    } else { //否则使用toString方法
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            return 'array';
        }
    }
    return (typeof obj).toLowerCase();
};

//判断数据类型的方法（对typeof的增强，9种类型的判断，返回小写字符串）
function Type1(obj) {
    var arr = ['null', 'nan', 'function', 'number', 'string', 'array', 'object', 'date', 'regexp'];
    var t, c, n;

    if (obj === null) {
        return 'null';
    }
    if (obj !== obj) {
        return 'nan';
    }
    if ((t = typeof obj) !== 'object') {
        return t.toLowerCase();
    }
    if ((c = classof(obj)) !== 'Object') {
        return c.toLowerCase();
    }
    if (obj.constructor && typeof obj.constructor === 'function' && (n = getName(obj))) {
        return n.toLowerCase();
    }

    function classof(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1);
    };

    function getName(obj) {
        if ('name' in obj) return obj.name;
        return obj.name = obj.constructor.toString().match(/function\s*([^(]*)\(/)[1];
    };
    return 'object';
};

//定时器增强requestAnimationFrame与setInterval兼容
function yydTimer(fn, msec) {
    var id = null;
    var clear = null;
    var lastT = null;
    var msec = msec || 1000 / 60;

    if (msec < 17.1) msec = 17.1; //解决间隔小于17.1的BUG
    if (window.requestAnimationFrame) {
        function animate(time) {
            id = requestAnimationFrame(animate);

            if (lastT == null) {
                lastT = parseInt(time);
            }
            if (parseInt(time) % msec < lastT) {
                fn && fn(clear, id);
            }
            lastT = parseInt(time) % msec;

            clear = function () {
                cancelAnimationFrame(id);
            };

            return id;
        };
        id = animate(0);
    } else {
        id = setInterval(function () {
            fn && fn(clear, id);
        }, msec);

        clear = function () {
            clearInterval(id);
        };
    }

    window.onhashchange = function () {
        clear();
    };
};

//判断json是否有某个key，不管是否为空
function jsonHasKey(json, key) {
    if (Type(json) != 'object') {
        return false;
    }
    return key in json;
};

//判断数组、json、字符串是否所有值都不为空
function allHaveValue(obj) {
    var bool = true;

    if (Type(obj) == 'array') {
        for (var i = 0; i < obj.length; i++) {
            if (!obj[i] && obj[i] !== 0) {
                bool = false;
                break;
            }
        }
    } else if (Type(obj) == 'object') {
        for (var attr in obj) {
            if (!obj[attr] && obj[attr] !== 0) {
                bool = false;
                break;
            }
        }
    } else {
        if (!obj && obj !== 0) {
            bool = false;
        }
    }
    return bool;
};

//对象截取增强方法，返回截取后的对象，非变异方法(string,array,object)
//obj(要截取的对象)
//posiCut(根据[start,end]位置截取)
//indexCut(按索引删除)
//bool(为true时，如果是json则按key名删除)
function yydCut(obj, posiCut, indexCut, bool) {
    var type = Type(obj);
    var obj = obj;
    var json = {};
    var arr = [];
    var str = '';

    switch (type) {
        case 'string':
            if (Type(posiCut) == 'array') {
                obj = obj.slice(posiCut[0], posiCut[1] + 1);
            }
            if (Type(indexCut) == 'array') {
                for (var i = 0; i < obj.length; i++) {
                    json[i] = obj[i];
                }
                for (var i = 0; i < indexCut.length; i++) {
                    delete json[indexCut[i]];
                }
                for (var attr in json) {
                    str += json[attr];
                }
                obj = str;
            }
            break;
        case 'array':
            if (Type(posiCut) == 'array') {
                obj = obj.slice(posiCut[0], posiCut[1] + 1);
            }
            if (Type(indexCut) == 'array') {
                for (var i = 0; i < obj.length; i++) {
                    json[i] = obj[i];
                }
                for (var i = 0; i < indexCut.length; i++) {
                    delete json[indexCut[i]];
                }
                for (var attr in json) {
                    arr.push(json[attr]);
                }
                obj = arr;
            }
            break;
        case 'object':
            if (Type(posiCut) == 'array') {
                for (var attr in obj) {
                    arr.push(attr);
                }
                arr = arr.slice(posiCut[0], posiCut[1] + 1);
                for (var i = 0; i < arr.length; i++) {
                    json[arr[i]] = obj[arr[i]];
                }
                obj = json;
            }
            if (Type(indexCut) == 'array') {
                if (bool) {
                    for (var i = 0; i < indexCut.length; i++) {
                        delete obj[indexCut[i]];
                    }
                } else {
                    arr = [];
                    json = {};
                    var json1 = {};

                    for (var attr in obj) {
                        arr.push(attr);
                    }
                    for (var i = 0; i < arr.length; i++) {
                        json[i] = arr[i];
                    }
                    for (var i = 0; i < indexCut.length; i++) {
                        delete json[indexCut[i]];
                    }
                    for (var attr in json) {
                        json1[json[attr]] = obj[json[attr]];
                    }
                    obj = json1;
                }
            }
            break;
    }
    return obj;
};

/*
    1.5、时间日期处理
*/

//时间变成两位数
function toTwo(n) {
    return +n < 10 ? '0' + n : n + '';
};

//补零函数
//value（需要补零的值）
//length（需要补零的长度(数量)）
//isBehind（是否在末尾补零）
function zeroFill(value, length, isBehind) {
    var value = value || '';
    var length = length > 0 ? length : 0;
    var zeroStr = '';

    for (var i = 0; i < length; i++) {
        zeroStr += '0';
    }

    return !isBehind ? zeroStr + value : value + zeroStr;
};

//算出本月天数
//getMonth获得的月份是从0开始，要加1
//下月第0天就是最后一天，-1=倒数第二天，国外月份从0开始,逗号隔开年月日new Date之后月份要大一个月，字符串是正常的
function manyDay(year, month) {
    var nextMonth = new Date(year, month, 0);

    return nextMonth.getDate();
};

//正常化日期
function normalDate(oDate) {
    var oDate = oDate;
    var reg = /\-+/g;

    if (Type(oDate) == 'string') {
        oDate = oDate.split('.')[0]; //解决ie浏览器对yyyy-MM-dd HH:mm:ss.S格式的不兼容
        oDate = oDate.replace(reg, '/'); //解决苹果浏览器对yyyy-MM-dd格式的不兼容性
    }

    oDate = new Date(oDate);
    return oDate;
};

//获取星期
function getWeekName(oDate, str) {
    var oDate = normalDate(oDate || new Date());
    var iWeek = oDate.getDay();
    var str = str || '星期';
    var arr = ['日', '一', '二', '三', '四', '五', '六'];

    return str + arr[iWeek];
};

//根据出生日期获取年龄
function getAge(date, real) {
    var bDate = normalDate(date);
    var bYear = bDate.getFullYear();
    var bMonth = bDate.getMonth();
    var bDay = bDate.getDate();
    var nDate = new Date();
    var nYear = nDate.getFullYear();
    var nMonth = nDate.getMonth();
    var nDay = nDate.getDate();
    var dYear = nYear - bYear;
    var dMonth = (nMonth - bMonth) / 12;
    var dDay = (nDay - bDay) / 365;
    var diff = dYear + dMonth + dDay;
    var age = diff > 0 ? (real ? diff : Math.floor(diff)) : 0;

    return age;
};

//根据身份证号码获取性别和生日
function getSexAndDob(identity) {
    var sexAndDob = {};

    if (regJson.identity.reg.test(identity)) {
        var sex = identity.substring(identity.length - 2, identity.length - 1);
        var dob = identity.substring(6, 14);

        sex = sex & 1 == 1 ? '1' : '2';
        dob = `${dob.substring(0,4)}-${dob.substring(4,6)}-${dob.substring(6)}`;

        sexAndDob = {
            sex: sex,
            dob: dob,
        };
    }

    return sexAndDob;
};

//身份证号码校验、获取身份证信息以及计算最后一位校验码、转换15位身份证为18位
/*
    校验码计算
    1、十七位数字本体码加权求和公式
    S = Sum(Ai * Wi), i = 0, ... , 16 ，先对前17位数字的权求和
    Ai：表示第i位置上的身份证号码数字值
    Wi：表示第i位置上的加权因子
    7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2

    2、计算模
    Y = mod(S, 11)

    3、通过模得到对应的校验码
    Y： 0 1 2 3 4 5 6 7 8 9 10
    校验码： 1 0 X 9 8 7 6 5 4 3 2
    也就是说，如果得到余数为1则最后的校验位p应该为对应的0。

    15位的号码：
    a a b b c c y y m m d d x x s
    18位的号码：
    a a b b c c y y y y m m d d x x s p
*/
var idCardNo = {
    citys: { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }, //省,直辖市代码
    powers: ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'], //每位加权因子
    lastCodes: ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'], //第18位校检码
    normalIdCardNo: function (idCardNo) { //格式化15身份证号码为18位
        var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);

        return idCardNo.length == 15 ? id17 + this.getLastCode(id17) : idCardNo;
    },
    getLastCode: function (idCardNo) { //根据身份证前17位计算出最后一位校检码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var id17 = idCardNo.substring(0, 17);
        var sum = 0;
        var codeIndex = 0;

        for (var i = 0; i < 17; i++) {
            sum += id17.charAt(i) * this.powers[i];
        }

        codeIndex = sum % 11;

        return this.lastCodes[codeIndex];
    },
    getIdCardNoInfo: function (idCardNo) { //获取身份证信息
        var idCardNo = this.normalIdCardNo(idCardNo);
        var cityCode = idCardNo.substring(0, 2);
        var dobCode = idCardNo.substring(6, 14);
        var sexCode = idCardNo.substring(idCardNo.length - 2, idCardNo.length - 1);
        var bYear = dobCode.substring(0, 4);
        var bMonth = dobCode.substring(4, 6);
        var bDay = dobCode.substring(6);
        var bDate = new Date(bYear, bMonth - 1, bDay);
        var dob = dateFormat0(bDate, 'yyyy-MM-dd');
        var ageCode = getAge(dob) + '';
        var idCardNoInfo = {
            city: this.citys[cityCode],
            dob: dob,
            sex: sexCode & 1 == 1 ? '男' : '女',
            age: getAge(dob) + '岁',
            cityCode: cityCode,
            dobCode: dobCode,
            sexCode: sexCode,
            ageCode: ageCode,
        };

        return this.checkIdCardNo(idCardNo) ? idCardNoInfo : this.getIdCardNoCheckInfo(idCardNo);
    },
    checkAddressCode: function (idCardNo) { //检查地址码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var addressCode = idCardNo.substring(0, 6);
        var reg = /[1-8]\d{5}/;

        return reg.test(addressCode) && this.citys[addressCode.substring(0, 2)] ? true : false;
    },
    checkDobCode: function (idCardNo) { //检查日期码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var dobCode = idCardNo.substring(6, 14);
        var reg = /[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])/;
        var oDate = new Date();
        var bYear = dobCode.substring(0, 4);
        var bMonth = dobCode.substring(4, 6);
        var bDay = dobCode.substring(6);
        var bDate = new Date(bYear, bMonth - 1, bDay);
        var cYear = bDate.getFullYear();
        var cMonth = bDate.getMonth() + 1;
        var cDay = bDate.getDate();

        return reg.test(dobCode) && bDate <= oDate && cYear == bYear && cMonth == bMonth && cDay == bDay ? true : false;
    },
    checkLastCode: function (idCardNo) { //检查身份证最后一位校验码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var lastCode = idCardNo.charAt(idCardNo.length - 1);

        return lastCode == this.getLastCode(idCardNo) ? true : false;
    },
    getIdCardNoCheckInfo: function (idCardNo) { //获取身份证号码校验信息
        var regTestResult = /^[1-8]\d{5}[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[\dxX]$/.test(idCardNo);
        var idCardNo = this.normalIdCardNo(idCardNo);
        var checkResult = [
            regTestResult,
            this.checkAddressCode(idCardNo),
            this.checkDobCode(idCardNo),
            this.checkLastCode(idCardNo),
        ];
        var posIndex = checkResult.indexOf(false);
        var result = ~posIndex ? posIndex : true;
        var msgJson = {
            '-1': '身份证号码校验通过',
            '0': '身份证号码格式校验不通过',
            '1': '地址码校验不通过',
            '2': '日期码校验不通过',
            '3': '最后一位校验码校验不通过',
        };

        return {
            pass: result === true,
            code: posIndex,
            msg: msgJson[posIndex],
        };
    },
    checkIdCardNo: function (idCardNo) { //检查身份证号码
        var result = this.getIdCardNoCheckInfo(idCardNo);

        return result.pass;
    },
};

//时间格式化函数（根据秒数来格式化）
//seconds（多少秒）
//fmt（格式匹配）
//adjustFmt（是否自动调整格式，会删除无效的格式）
//年(y)、月(M)、日(d)、小时(h)、分(m)、秒(s)，都可以用1到任意位占位符
/*
    例子：
    secondFormat0(86400*365+86400*30+86400+3600+60+1,'yy/MM/dd hh:mm:ss'); //01/01/01 01:01:01
    secondFormat0(86400+3600+60+1,'hh:mm:ss'); //25:01:01
*/
function secondFormat0(seconds, fmt, adjustFmt) {
    var fmt = fmt || 'yy/MM/dd hh:mm:ss';
    var aMinute = 60;
    var aHour = aMinute * 60;
    var aDay = aHour * 24;
    var aMonth = aDay * 30;
    var aYear = aDay * 365;

    var iYears = Math.floor(seconds / aYear);
    var dMonth = seconds - iYears * aYear > 0 ? seconds - iYears * aYear : 0;
    dMonth = ~fmt.indexOf('y') ? dMonth : seconds;
    var iMonths = Math.floor(dMonth / aMonth);
    var dDay = dMonth - iMonths * aMonth > 0 ? dMonth - iMonths * aMonth : 0;
    dDay = ~fmt.indexOf('M') ? dDay : seconds;
    var iDays = Math.floor(dDay / aDay);
    var dHour = dDay - iDays * aDay > 0 ? dDay - iDays * aDay : 0;
    dHour = ~fmt.indexOf('d') ? dHour : seconds;
    var iHours = Math.floor(dHour / aHour);
    var dMinutes = dHour - iHours * aHour > 0 ? dHour - iHours * aHour : 0;
    dMinutes = ~fmt.indexOf('h') ? dMinutes : seconds;
    var iMinutes = Math.floor(dMinutes / aMinute);
    var dSeconds = dMinutes - iMinutes * aMinute ? dMinutes - iMinutes * aMinute : 0;
    dSeconds = ~fmt.indexOf('m') ? dSeconds : seconds;
    var iSeconds = Math.floor(dSeconds);

    var time = {
        'y+': iYears,
        'M+': iMonths,
        'd+': iDays,
        'h+': iHours,
        'm+': iMinutes,
        's+': iSeconds,
    };
    var result = '';
    var value = '';

    for (var attr in time) {
        if (new RegExp('(' + attr + ')').test(fmt)) {
            result = RegExp.$1;
            value = time[attr] + '';
            value = result.length == 1 ? value : zeroFill(value, result.length - value.length);

            if (adjustFmt && (+value) === 0) {
                var reg = new RegExp(attr + '([^a-zA-Z]+)[a-zA-Z]+');
                var matchStr = fmt.match(reg);

                if (matchStr) {
                    fmt = fmt.replace(matchStr[1], '');
                    value = '';
                }
            }

            fmt = fmt.replace(result, value);
        }
    }

    return fmt;
};

//日期格式化函数
//oDate（时间戳或字符串日期都支持）
//fmt（格式匹配）
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
/*
    例子：
    dateFormat0(new Date(),'yyyy-MM-dd hh:mm:ss.S'); //2018-12-21 17:24:33.664
    dateFormat0(new Date(),'y-M-d h:m:s.S/q'); //2018-12-21 17:24:33.666/4
*/
function dateFormat0(oDate, fmt) {
    var fmt = fmt || 'yyyy/MM/dd hh:mm:ss';
    var oDate = normalDate(oDate || new Date());
    var date = {
        'y+': oDate.getFullYear(), //年
        'M+': oDate.getMonth() + 1, //月
        'd+': oDate.getDate(), //日
        'h+': oDate.getHours(), //时
        'm+': oDate.getMinutes(), //分
        's+': oDate.getSeconds(), //秒
        'S': oDate.getMilliseconds(), //毫秒
        'q+': Math.ceil((oDate.getMonth() + 1) / 3), //季度，+3为了好取整
    };
    var result = '';
    var value = '';

    for (var attr in date) {
        if (new RegExp('(' + attr + ')').test(fmt)) {
            result = RegExp.$1;
            value = date[attr] + '';
            fmt = fmt.replace(result, result.length == 1 ? value : (attr == 'y+' ? value.substring(4 - result.length) : toTwo(value)));
        }
    }

    return fmt;
};

//时间格式化(主要用于格式化历史时间到当前时间是多少秒到多少年前)
//oDate（时间戳或字符串日期都支持）
function dateFormat1(oDate) {
    var oDate = normalDate(oDate);

    if (+oDate >= +new Date()) {
        return '刚刚';
    }
    var lookTime = +new Date() - (+oDate);
    var seconds = Math.floor(lookTime / (1000));
    var minutes = Math.floor(lookTime / (1000 * 60));
    var hours = Math.floor(lookTime / (1000 * 60 * 60));
    var days = Math.floor(lookTime / (1000 * 60 * 60 * 24));
    var months = Math.floor(lookTime / (1000 * 60 * 60 * 24 * 30));
    var years = Math.floor(lookTime / (1000 * 60 * 60 * 24 * 30 * 12));

    if (seconds < 60) {
        lookTime = seconds + '秒前';
    } else if (minutes < 60) {
        lookTime = minutes + '分钟前';
    } else if (hours < 24) {
        lookTime = hours + '小时前';
    } else if (days < 30) {
        lookTime = days + '天前';
    } else if (months < 12) {
        lookTime = months + '个月前';
    } else {
        lookTime = years + '年前';
    }
    return lookTime;
};

/*
    1.6、格式化函数
*/

//数字四舍五入为指定位数的数字
function toFixed0(value, length, closeRound) {
    var oldValue = value;
    var value = value + '';
    var arr = value.split('.');
    var length = Math.abs(length || 0);
    var zero = '';
    var rNum = '';

    for (var i = 0; i < length; i++) {
        zero += '0';
    }

    if (Type(oldValue) == 'number') {
        arr[1] = arr[1] ? arr[1] + zero : zero;
        rNum = arr[1].substring(0, length);
        arr[1] = rNum + '.' + arr[1].substring(length, arr[1].length);

        if (Type(+arr[1]) == 'number') {
            if (!closeRound) {
                arr[1] = Math.round(arr[1]);
            } else {
                arr[1] = arr[1].split('.')[0];
            }
        }

        if ((arr[1] + '').length == 1) {
            rNum = rNum.split('');
            rNum[length - 1] = arr[1];
            rNum = rNum.join('');
        } else {
            rNum = arr[1];
        }

        arr[1] = (rNum + zero).substring(0, length);
        arr = arr.join('.');
    } else {
        arr = oldValue;
    }

    return arr;
};

//金额格式化
function amountFormat0(value, dLength, cLength) {
    var oldValue = value;
    var value = +value;
    var arr = [];
    var dLength = dLength || 2;
    var cLength = cLength || 3;
    var zero = '';

    for (var i = 0; i < dLength; i++) {
        zero += '0';
    }

    if (Type(value) == 'number') {
        value += '';
        value = value.split('.');
        value[0] = value[0].split('');
        value[1] = (value[1] || '') + zero;
        value[1] = value[1].substring(0, dLength);

        arr.unshift('.', value[1]);
        while (value[0].length > cLength) {
            arr.unshift(',', value[0].splice(value[0].length - cLength, cLength).join(''));
        }

        arr = value[0].join('') + arr.join('');
    } else {
        arr = oldValue;
    }

    if (arr && arr.length) arr = arr.replace('-,', '-');
    return arr;
};

//格式化手机号为344
function formatMobile(val) {
    var reg = /^[1][3-9][0-9][ ][0-9]{4}[ ][0-9]{4}$/;
    var reg1 = /(\d{3})(?=\d)/;
    var reg2 = /(\d{4})(?=\d)/g;

    if (!reg.test(val)) {
        val = val.replace(/\s/g, '');
        val = val.replace(reg1, '$1 ');
        val = val.replace(reg2, '$1 ');
    }

    return val;
};

//科学运算（解决js处理浮点不正确的问题）
//num1（要进行运算的第一个数字）
//operator（运算符号,+,-,*,/）
//num2（要进行运算的第二个数字）
function computed(num1, operator, num2) {
    var length1 = (num1 + '').split('.')[1];
    length1 = length1 ? length1.length : 0;
    var length2 = (num2 + '').split('.')[1];
    length2 = length2 ? length2.length : 0;

    var integer1 = Math.pow(10, length1);
    var integer2 = Math.pow(10, length2);
    var iMax = Math.max(integer1, integer2);
    var result = '';

    switch (operator) {
        case '+':
            num1 = num1 * iMax;
            num2 = num2 * iMax;
            result = (num1 + num2) / iMax;
            break;
        case '-':
            num1 = num1 * iMax;
            num2 = num2 * iMax;
            result = (num1 - num2) / iMax;
            break;
        case '*':
            num1 = num1 * integer1;
            num2 = num2 * integer2;
            result = (num1 * num2) / integer1;
            result = result / integer2;
            break;
        case '/':
            num1 = num1 * integer1;
            num2 = num2 * integer2;
            result = (num1 / num2) / integer1;
            result = result / integer2;
            break;
    }
    return result;
};

/*
    1.7、浏览器相关
*/

//内核前缀查询
function getPrefix() {
    var style = document.body.style || document.documentElement.style;
    var arr = ['webkit', 'khtml', 'moz', 'ms', 'o'];
    for (var i = 0; i < arr.length; i++) {
        if (typeof style[arr[i] + 'Transition'] == 'string') {
            document.title = '内核前缀：-' + arr[i];
        }
    }
};

//查看键值修正版
function keyCode() {
    document.onkeyup = function (ev) {
        var ev = ev || event;
        var oP = document.createElement('p');
        var aString = String.fromCharCode(ev.keyCode);
        var json = { 27: 'Esc', 112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6', 118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12', 44: 'PrtScr', 145: 'Scroll', 19: 'Pause', 192: '`', 189: '-', 187: '=', 8: '←删除', 45: 'Insert', 36: 'Home', 33: 'PgUp', 144: '数字区 NumLock', 111: '数字区 /', 106: '数字区 *', 109: '数字区 -', 9: 'Tab', 219: '[', 221: ']', 13: 'Enter', 46: 'Delete', 35: 'End', 34: 'PgDn', 103: '数字区 7', 104: '数字区 8', 105: '数字区 9', 107: '数字区 +', 20: 'Capslock', 186: '：', 222: '’', 220: '｜', 100: '数字区 4', 101: '数字区 5', 102: '数字区 6', 16: 'Shift', 188: '，', 190: '。', 191: '/', 38: '方向↑', 97: '数字区 1', 98: '数字区 2', 99: '数字区 3', 17: 'Ctrl', 91: '左Window', 92: '右Window', 18: 'Alt', 32: '空格', 93: '打印', 37: '方向←', 40: '方向↓', 39: '方向→', 96: '数字区 0', 110: '数字区 .' };

        if (json[ev.keyCode]) {
            aString = json[ev.keyCode];
        }
        oP.innerHTML = '按键' + ':' + aString + ' ' + '键值' + ':' + ev.keyCode;
        document.body.appendChild(oP);
    };
};

//execCommand对文档执行预定义命令
//aCommandName表示要执行的命令名称，不可省略
//aShowDefaultUI表示是否显示对话框，默认为false，可省略
//aValueArgument表示额外参数值，默认为null，可省略
function execCommandFn(key, value) {
    var commandJson = {
        //段落格式
        '1_1': 'justifyCenter', //居中
        '1_2': 'justifyLeft', //左对齐
        '1_3': 'justifyRight', //右对齐
        '1_4': 'indent', //添加缩进
        '1_5': 'outdent', //去掉缩进
        //文本格式
        '2_1': 'fontname', //字体类型
        '2_2': 'fontsize', //字体大小
        '2_3': 'forecolor', //字体颜色
        '2_4': 'backColor', //背景色
        '2_5': 'bold', //加粗
        '2_6': 'italic', //斜体
        '2_7': 'underline', //下划线
        //编辑
        '3_1': 'copy', //复制
        '3_2': 'cut', //剪切
        '3_3': 'paste', //粘贴(经测试无效)
        '3_4': 'selectAll', //全选
        '3_5': 'delete', //删除
        '3_6': 'forwarddelete', //后删除
        '3_7': 'removeFormat', //清空格式
        '3_8': 'redo', //前进一步
        '3_9': 'undo', //后退一步
        '3_10': 'print', //打印(对firefox无效)
        //插入
        '4_1': 'insertHTML', //插入文档
        '4_2': 'formatblock', //插入标签
        '4_3': 'inserthorizontalrule', //插入<hr>
        '4_4': 'insertorderedlist', //插入<ol>
        '4_5': 'insertunorderedlist', //插入<ul>
        '4_6': 'insertparagraph', //插入<p>
        '4_7': 'insertimage', //插入图像
        '4_8': 'createlink', //增加链接
        '4_9': 'unlink', //删除链接
    };
    var aCommandName = commandJson[key];
    var aShowDefaultUI = false;
    var aValueArgument = value;

    document.execCommand(aCommandName, aShowDefaultUI, aValueArgument);
};

//选中文字兼容
function selectText(endFn) {
    var selectedObj = null;
    var rangeObj = null;
    var text = '';
    var html = '';

    if (document.getSelection) {
        var oDiv = document.createElement('div');
        var cloneContents = '';

        selectedObj = document.getSelection(); //标准
        text = selectedObj.toString();
        if (selectedObj.rangeCount > 0) {
            rangeObj = selectedObj.getRangeAt(0);
            cloneContents = rangeObj.cloneContents();
            oDiv.appendChild(cloneContents);
            html = oDiv.innerHTML;
        }
    } else {
        selectedObj = document.selection.createRange(); //ie
        text = selectedObj.text;
        html = selectedObj.htmlText;
    }

    endFn && endFn({
        selectedObj: selectedObj, //Selection对象
        rangeObj: rangeObj, //range对象
        text: text, //选中的文字
        html: html, //选中的html
        wrapTag: function (tagName, insert, objStyle, objProperty, objAttribute) { //给选中的内容包裹一个标签（并选中）
            var tagName = tagName || 'span';
            var objStyle = objStyle || {};
            var objProperty = objProperty || {};
            var objAttribute = objAttribute || {};
            var oRange = selectedObj.rangeCount > 0 ? selectedObj.getRangeAt(0) : '';
            var oTag = document.createElement(tagName);

            for (var attr in objStyle) {
                oTag.style[attr] = objStyle[attr];
            }
            if (objStyle['text-align']) {
                oTag.style.display = 'block';
            } else if (oTag.style.display == 'block') {
                oTag.style.display = 'unset';
            }

            for (var attr in objProperty) {
                oTag[attr] = objProperty[attr];
            }
            for (var attr in objAttribute) {
                oTag.setAttribute(attr, objAttribute[attr]);
            }

            execCommandFn('3_7');

            if (!insert && oRange && text) {
                oTag.innerText = text;
                selectedObj.deleteFromDocument();
                oRange.insertNode(oTag);
                selectedObj.removeAllRanges();
                selectedObj.addRange(oRange);
            } else {
                var oContentediable = QSA('[contenteditable="true"]')[0];
                var oDiv = document.createElement('div');

                oContentediable.focus();
                oDiv.appendChild(oTag);
                execCommandFn('4_1', oDiv.innerHTML);
            }
        },
        getNodeList: function (parent) { //获取选中的文本类型的node
            if (!parent) return [];
            var nodeList = [];

            function getNodeListFn(parent) {
                if (!parent.childNodes.length) return;
                var childNodes = parent.childNodes;

                for (var i = 0; i < childNodes.length; i++) {
                    var isContains = selectedObj.containsNode(childNodes[i]) && childNodes[i].data;

                    if (isContains) {
                        nodeList.push(childNodes[i]);
                    } else {
                        getNodeListFn(childNodes[i]);
                    }
                }
            };
            getNodeListFn(parent);

            return nodeList;
        },
        getCssText: function (parent) { //获取元素以及所有后代的cssText并解析成json
            if (!parent) return {};
            var result = {};

            function getCssTextFn(parent) {
                if ((!parent.childNodes || !parent.childNodes.length) && (!parent.style || !parent.style.cssText)) return;
                var cssText = parent.style.cssText;
                var reg = /(:\s")+/g;
                var reg1 = /(";\s)+/g;
                var reg2 = /(:\s)+/g;
                var reg3 = /(;\s)+/g;

                try {
                    if (cssText.length) {
                        cssText = cssText.replace(reg, ': ');
                        cssText = cssText.replace(reg1, '; ');
                        cssText = cssText.replace(reg2, '":"');
                        cssText = cssText.replace(reg3, '","');
                        cssText = cssText.substring(0, cssText.length - 1);
                        cssText = '{"' + cssText;
                        cssText = cssText + '"}';
                        cssText = JSON.parse(cssText);
                    }
                } catch (e) {}

                result = Object.assign({}, result, cssText || {});
                for (var i = 0; i < parent.childNodes.length; i++) {
                    getCssTextFn(parent.childNodes[i]);
                }
            };
            getCssTextFn(parent);

            return result;
        },
    });
    return text;
};

//粘贴事件处理
function onPaste(obj, endFn) {
    bind(obj, 'paste', pasteFn);

    function pasteFn(ev) {
        var ev = ev || event;
        var itemList = [];
        var clipboardData = [];
        var windowUrl = window.URL || window.webkitURL;

        if (ev.clipboardData && ev.clipboardData.items) {
            var items = ev.clipboardData.items;

            clipboardData = items;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var itemJson = {};

                itemJson.type = item.kind;
                switch (item.kind) {
                    case 'string':
                        item.getAsString(function (text) {
                            itemJson.text = text;
                        });
                        break;
                    case 'file':
                        itemJson.file = item.getAsFile();
                        itemJson.previewUrl = windowUrl.createObjectURL(itemJson.file);
                        break;
                }
                itemList.push(itemJson);
            }
        }

        endFn && endFn(itemList, clipboardData);
    };
};

//图片文件转base64字符串
function imgFilesToBase64(files, endFn) {
    var files = files || [];
    var result = [];

    function imgToBase64(file) {
        var oReader = new FileReader(file);

        oReader.readAsDataURL(file);
        oReader.onload = function () {
            var oImg = new Image();

            oImg.src = oReader.result;
            oImg.onload = function () {
                var windowUrl = window.URL || window.webkitURL;

                result.push({
                    file: file,
                    prevSrc: windowUrl.createObjectURL(file),
                    base64: oReader.result,
                });

                if (result.length == files.length) {
                    endFn && endFn(result);
                }
            };
        };
    };

    for (var i = 0; i < files.length; i++) {
        imgToBase64(files[i]);
    }
};

//图片上传预览
function preview(oInp, oImg) {
    var windowUrl = window.URL || window.webkitURL;

    for (var i = 0; i < oInp.length; i++) {
        oInp[i].index = i;
        oInp[i].onchange = function () {
            oImg[this.index].src = windowUrl.createObjectURL(this.files[0]);
        };
    }
};

//判断是否是手机浏览器
function isPhone() {
    var reg = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
    return window.navigator.userAgent.match(reg) ? true : false;
};

//判断是否是微信浏览器
function isWeixin() {
    var reg = /(micromessenger)/i;
    return window.navigator.userAgent.match(reg) ? true : false;
};

//判断是否是QQ浏览器
//bool为true判断是否是内置qq浏览器
function isQQ(bool) {
    var reg = /(QQ)/i;
    var reg1 = /(NetType\/)/i;
    var userAgent = window.navigator.userAgent;

    if (!bool) {
        return userAgent.match(reg) ? true : false;
    } else {
        return userAgent.match(reg) && userAgent.match(reg1) ? true : false;
    }
};

//判断是否是苹果浏览器
function isSafari() {
    var reg = /(pad|iPhone|Mac|ios)/i;
    return window.navigator.userAgent.match(reg) ? true : false;
};

//判断是否存在某个app
//url（自己有调起app的链接，比如支付宝付款链接）
//index（根据索引选择判断的协议）
//endFn（回调函数，参数为是否存在某个app的布尔值）
function hasApp(url, index, endFn) {
    var agreementArr = ['weixin://', 'alipays://', 'taobao://', 'weibo://'];
    var exist = true;
    var delay = 3000;
    var threshold = 66;
    var hidden = false;
    var oDate = +new Date();
    var oIframe = document.createElement('iframe');

    document.body.onpagehide = document.onvisibilitychange = function () {
        hidden = true;
    };

    function createIframe(dom, src) {
        dom.src = src;
        dom.style.display = 'none';
        document.body.appendChild(dom);
    };

    if (url) {
        createIframe(oIframe, url);
        setTimeout(function () {
            document.body.appendChild(oIframe);
        }, delay / 5);
    } else {
        createIframe(oIframe, agreementArr[index]);
    }

    setTimeout(function () {
        var oNow = +new Date();
        var iDiff = oNow - oDate;

        hidden = document.hidden || document.webkitHidden;

        if (iDiff < delay + threshold) {
            exist = false;
            if (hidden) {
                exist = true;
            }
        }
        document.body.removeChild(oIframe);
        endFn && endFn(exist);
    }, delay);
};

//返回当前地址?后面的参数的json格式(用于submit提交的str='1'&str1='2'格式)
function strToJson(str) {
    var str = str || window.location.search;
    var reg = /&+/g;
    var reg1 = /=+/g;

    try {
        if (str.match(/.+=/)) {
            str = decodeURI(str);
            str = str.replace('?', '');
            str = str.replace(reg, '","');
            str = str.replace(reg1, '":"');
            str = '{"' + str + '"}';
            str = JSON.parse(str);
        } else {
            str = {};
        }
    } catch (e) {
        str = {};
    }
    return str;
};

//返回当前地址?后面的参数的json格式(用于自己拼接的str={}&str1={}格式)
//注意要拼接标准json格式
function strToJson1(str) {
    var str = str || window.location.search;
    var reg = /&+/g;
    var reg1 = /=+/g;
    var reg2 = /^\?.+$/;

    try {
        if (str.match(/.+=/)) {
            str = decodeURI(str);
            str = reg2.test(str) ? str.replace('?', '"') : '"' + str;
            str = str.replace(reg, ',"');
            str = str.replace(reg1, '":');
            str = '{' + str + '}';
            str = JSON.parse(str);
        } else {
            str = {};
        }
    } catch (e) {
        str = {};
    }
    return str;
};

//传入json，转换成带?的表单格式的url地址
//json(要转换的对象)
//arr(要删除json的key的数组)
//href(要定制的href)
function jsonToStr(json, arr, href) {
    var str = '';
    var json = json || {};
    var arr = arr || [];
    var href = href || (window.location.origin + window.location.pathname);

    for (var i = 0; i < arr.length; i++) {
        delete json[arr[i]];
    }
    for (var attr in json) {
        str += attr + '=' + json[attr] + '&';
    }
    str = href + '?' + str.substr(0, str.length - 1);
    return str;
};

//正则匹配获取search参数
//不会有报错，比较安全
function getSearch(key, str) {
    var reg = new RegExp('(^|&|\\?)' + key + '=([^&]+)(&|$)');
    var str = str || window.location.search;
    var matchStr = str.match(reg);

    return matchStr && matchStr[2] || null;
};

//存储历史路径以及获取指定路径的上一个路径
var routerMap = {
    historyPath: [],
    savePath: function (blacklist) { //存储除黑名单以外的路径
        var blacklist = blacklist || [];
        var historyPath = this.historyPath;
        var pathname = window.location.pathname;

        if (!historyPath.length && blacklist.indexOf(pathname) == -1 || historyPath.length && blacklist.indexOf(pathname) == -1 && historyPath[historyPath.length - 1] != pathname) {
            historyPath.push(pathname);
        }
    },
    logPath: function () {
        console.log(this.historyPath);
    },
    getPrevPath: function (pathname) { //获取指定路由地址的上一个
        return this.historyPath[pathname ? this.historyPath.lastIndexOf(pathname) - 1 : this.historyPath.length - 1];
    },
};

//原生嵌入webview的刷新方法
function webviewRefresh() {
    //如果有定义window下的webviewRefresh，则执行window下的webviewRefresh
    if (window.webviewRefresh) {
        window.webviewRefresh();
        return;
    }

    var rPath = '';
    var pathname = window.location.pathname;
    var search = '';
    var hash = window.location.hash;
    var v = +new Date();
    var searchJson = strToJson();
    var searchStr = '';

    searchJson.v = v;

    for (var attr in searchJson) {
        searchStr += attr + '=' + searchJson[attr] + '&';
    }

    var lastIndex = searchStr.lastIndexOf('&');
    if (lastIndex == searchStr.length - 1) {
        searchStr = searchStr.substring(0, lastIndex);
    }
    search += '?' + searchStr;

    rPath = pathname + search + hash;

    window.location.reload();
    setTimeout(function () {
        window.location.replace(rPath);
    }, 300);
};

//判断页面是否有上一个历史记录页面，即是否可以后退
/*
    var hasPrevHistoryPageFn=hasPrevHistoryPage();//创建一个闭包函数
    var hasPrevHistoryPageFn.record();//每次切换页面执行记录方法
    hasPrevHistoryPageFn.ableGoBack((bool)=>{//回调中返回是否可以后退的bool值
        console.log(bool);
    });
*/
function hasPrevHistoryPage() {
    var historyArr = sStore.get('hasPrevHistoryPageHistoryArr') || [];
    var historyLength = sStore.get('hasPrevHistoryPageHistoryLength') || [];

    window.onunload = function () {
        sStore.set('hasPrevHistoryPageHistoryArr', historyArr);
        sStore.set('hasPrevHistoryPageHistoryLength', historyLength);
    };

    return {
        record: function () {
            function getPage(number) {
                var index = historyLength.indexOf(number);

                return index != -1 ? historyArr[index] : '';
            };

            setTimeout(function () {
                var href = window.location.href;
                var length = window.history.length;

                if (href != historyArr[historyArr.length - 1] || length != historyLength[historyLength.length - 1]) {
                    if (historyArr.length >= 4) {
                        historyArr.splice(2, 1);
                        historyLength.splice(2, 1);
                    }
                    historyArr.push(href);
                    historyLength.push(length);

                    switch (length) {
                        case 1:
                        case 2:
                            historyArr[length - 1] = href;
                            break;
                    }

                    if (historyArr.length >= 4) {
                        var currentPage = historyArr[historyArr.length - 1];
                        var currentLength = historyLength[historyLength.length - 1];
                        var prevPage = historyArr[historyArr.length - 2];
                        var prevLength = historyLength[historyLength.length - 2];
                        var firstPage = getPage(1);

                        if (currentPage == firstPage && currentLength == prevLength) {
                            historyArr[1] = prevPage;
                        }
                    }
                }
            });
        },
        ableGoBack: function (endFn) {
            function getPage(number) {
                var index = historyLength.indexOf(number);

                return index != -1 ? historyArr[index] : '';
            };

            setTimeout(function () {
                var bool = true;
                var length = window.history.length;

                if (length == 1) {
                    bool = false;
                } else if (length >= 2) {
                    var currentPage = historyArr[historyArr.length - 1];
                    var prevPage = historyArr[historyArr.length - 2];
                    var firstPage = getPage(1);
                    var secondPage = getPage(2);

                    if (currentPage == firstPage && prevPage == secondPage) {
                        bool = false;
                    }
                }

                endFn && endFn(bool);
            });
        },
    };
};

//js全屏模式api(注意，必须要用户点击事件触发，自动触发的事件和mouseover无效)
//obj(进入全屏模式的元素)
//enter(进入全屏模式)
//exit(退出全屏模式)
//fullElement(全屏显示的网页元素)
//IsFullScreen(是否是全屏模式，ie下无效)
function getFullscreenAPI(obj) {
    var dE = obj || document.documentElement;
    var arr = ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen', 'msRequestFullscreen'];
    var arr1 = ['', 'moz', 'webkit', 'ms'];
    var arr2 = ['exit', 'mozCancel', 'webkitExit', 'msExit'];
    var api = {};

    for (var i = 0; i < arr.length; i++) {
        if (dE[arr[i]]) {
            api = {
                enterK: arr1[i] + (arr1[i] ? 'R' : 'r') + 'equestFullscreen',
                exitK: arr2[i] + 'Fullscreen',
                elementK: arr1[i] + (arr1[i] ? 'F' : 'f') + 'ullscreenElement',
                isFullScreen: arr1[i] + (arr1[i] ? 'I' : 'i') + 'sFullScreen'
            };
            break;
        }
    }

    if (api) {
        api.enter = function () { dE[api.enterK]() };
        api.exit = function () { return document[api.exitK]() };
        api.fullElement = function () { return document[api.elementK] };
        api.IsFullScreen = function () { return document[api.isFullScreen] };
    }
    return api;
};

//浏览器通知
/*
    Notification.permission属性，用于读取用户给予的权限，它是一个只读属性，它有三种状态。
    default：用户还没有做出任何许可，因此不会弹出通知。
    granted：用户明确同意接收通知。
    denied：用户明确拒绝接收通知。

    config（通知的配置项）
    title：通知标题
    body：通知内容
    tag：通知的ID，格式为字符串。一组相同tag的通知，不会同时显示，只会在用户关闭前一个通知后，在原位置显示
    icon：图表的URL，用来显示在通知上
    dir：文字方向，可能的值为auto、ltr（从左到右）和rtl（从右到左），一般是继承浏览器的设置
    lang：使用的语种，比如en-US、zh-CN

    eventConfig（通知的事件配置项）
    show：通知显示给用户时触发
    click：用户点击通知时触发
    close：用户关闭通知时触发
    error：通知出错时触发（大多数发生在通知无法正确显示时）

    Notification.close()（关闭通知的方法）
*/
function notification(config, eventConfig) {
    var config = config || {};
    var eventConfig = eventConfig || {};
    var oN = null;

    config.title = config.title || '无标题';
    config.body = config.body || '无内容';

    if (window.Notification) {
        if (Notification.permission != 'denied') {
            Notification.requestPermission(function (status) {
                oN = new Notification(config.title, config);

                bind(oN, 'click', function () {
                    window.focus();
                });
                for (var attr in eventConfig) {
                    bind(oN, attr, function (ev) {
                        eventConfig[attr](ev, oN);
                    });
                }
            });
        } else {
            console.log('用户拒绝显示通知');
        }
    } else {
        console.log('你的浏览器不支持通知');
    }

    return oN;
};

//利用getUserMedia和canvas裁切视频并保存图片
/*
    options配置
    {
        imgType:'',//图片类型（默认png）
        width:'',//图片宽度（默认全屏宽）
        height:'',//图片高度（默认全屏高）

    }
    例子：
    var UserMedia=getUserMedia();

    document.onclick=function(){
        var src=UserMedia();

        document.write(`<img src="${src}" alt="图片" />`);
    };
*/
function getUserMedia(options) {
    var options = options || {};
    var imgType = { 'png': 'image/png', 'jpg': 'image/jpeg', 'gif': 'image/gif', 'icon': 'image/x-icon' };
    var prefixArr = ['webkit', 'moz', 'ms'];
    var iW = document.documentElement.clientWidth;
    var iH = document.documentElement.clientHeight;
    var iWidth = options.width || iW;
    var iHeight = options.height || iH;
    var windowUrl = window.URL || window.webkitUrl;
    var oVideo = document.createElement('video');
    var oCanvas = document.createElement('canvas');
    var oGc = oCanvas.getContext('2d');

    oCanvas.width = iWidth;
    oCanvas.height = iHeight;

    window.navigator.getMedia = window.navigator.getUserMedia;
    for (var i = 0; i < prefixArr.length; i++) {
        if (!window.navigator.getMedia) {
            window.navigator.getMedia = window.navigator[prefixArr[i] + 'GetUserMedia'];
        }
    }

    function play() {
        oVideo.play();
    };

    function success(stream) {
        var src = windowUrl.createObjectURL(stream);

        oVideo.src = src;
        bind(oVideo, 'canplaythrough', play);
    };

    function error(error) {
        console.log(error);
    };

    window.navigator.getMedia({
        video: true,
        audio: false,
    }, success, error);

    function screenshot() {
        oGc.drawImage(oVideo, 0, 0, iWidth, iHeight);
        return oCanvas.toDataURL(options.imgType || imgType.jpg);
    };

    return screenshot;
};

/*
    1.8、网络请求
*/

//ajax包装
//支持回调函数和promise两种风格
/*
    参数：
    ajaxWrap({
        url:'',//请求地址
        type:'post',//请求方法
        data:'',//请求传参
        contentType:'',//设置请求头contentType
        closeToForm:false,//关闭json转form格式
        dataType:'json',//返回数据类型
        headers:{},//请求头设置
        timeout:5000,//超时设置
        getXhr:function(xhr){//获取xhr对象的函数
            console.log(xhr);
        },
        progress:function(ev){//上传文件时触发的函数
            console.log(ev);
        },
        success:function(res){//请求状态成功且code成功的回调
            console.log(res);
        },
        finally:function(data){//请求状态成功的回调，promise模式在catch里捕获
            console.log(data);
        },
        error:function(error){//请求状态错误的回调
            console.log(error);
        },
    });
*/
/*
    例子：
    回调函数风格：
    ajaxWrap({
        code:0,
        url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
        type:'post',
        success:function(res){
            console.log(res);
        },
    });

    promise风格：
    ajaxWrap({
        code:0,
        url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
        type:'post',
    }).then((res)=>{
        console.log(res);
    });
*/
function ajaxWrap(config) {
    var str = '';
    var errorPromise = {
        then: function () {
            console.error('这是一个无效的then函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
        catch: function () {
            console.error('这是一个无效的catch函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
        finally: function () {
            console.error('这是一个无效的finally函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
    };
    var isTimeout = false;

    config.type = config.type ? config.type.toLowerCase() : 'get';
    config.dataType = config.dataType ? config.dataType.toLowerCase() : 'json';
    config.code = config.code || config.code == 0 ? config.code : 200;
    config.timeout = config.timeout || config.timeout == 0 ? config.timeout : 20000;

    if (!config.closeToForm && config.data && Type(config.data) == 'object') {
        for (var attr in config.data) {
            str += attr + '=' + config.data[attr] + '&';
        }
        config.data = str.substring(0, str.length - 1);
    }

    var xhr = null;

    try {
        xhr = new XMLHttpRequest();
    } catch (e) {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    if (config.getXhr && Type(config.getXhr) == 'function') {
        xhr = config.getXhr(xhr);
    }

    if (xhr.upload && config.progress && Type(config.progress) == 'function') {
        bind(xhr.upload, 'progress', config.progress);
    }

    if (config.type == 'get' && config.data) {
        config.url += '?' + config.data;
    }

    xhr.open(config.type, config.url, true);

    if (config.type == 'get') {
        xhr.send();
    } else {
        if (!config.closeToForm) xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        if (config.headers && Type(config.headers) == 'object') {
            for (var attr in config.headers) {
                xhr.setRequestHeader(attr, config.headers[attr]);
            }
        }
        xhr.send(config.data);
    }

    if (Type(config.timeout) == 'number') {
        xhr.timeout = config.timeout;
    }

    function onreadystatechangeFn(resolve, reject) {
        var data = null;

        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                try {
                    switch (config.dataType) {
                        case 'text':
                            data = xhr.responseText;
                            break;
                        case 'json':
                            data = JSON.parse(xhr.responseText);
                            break;
                        case 'html':
                            var oDiv = document.createElement('div');

                            oDiv.setAttribute('dataType', 'html');
                            oDiv.innerHTML = xhr.responseText;
                            data = oDiv;
                            break;
                        case 'script':
                            var oScript = document.createElement('script');

                            oScript.setAttribute('dataType', 'script');
                            oScript.innerHTML = xhr.responseText;
                            document.body.appendChild(oScript);
                            data = oScript;
                            break;
                    }
                } catch (e) {
                    console.log(e);
                }

                config.finally && config.finally(data);
                if (data.code == config.code) {
                    if (resolve && (Type(resolve) == 'function')) {
                        return resolve(data);
                    } else {
                        config.success && config.success(data);
                    }
                } else {
                    if (!config.noHint) {
                        if (data.msg) {
                            alerts(data.msg);
                        } else {
                            alerts('请求代码错误');
                        }
                    }

                    if (reject && (Type(reject) == 'function')) {
                        return reject(data);
                    }
                }
            } else {
                if (xhr.status == 0) {
                    alerts('请求超时');
                } else {
                    alerts('网络异常' + xhr.status);
                }
                if (reject && (Type(reject) == 'function')) {
                    return reject(xhr.status);
                } else {
                    config.error && config.error(xhr.status);
                }
            }
        }
    };

    if (config.success || config.finally || config.error) {
        xhr.onreadystatechange = onreadystatechangeFn;

        return errorPromise;
    } else {
        return new Promise(function (resolve, reject) {
            xhr.onreadystatechange = function () {
                onreadystatechangeFn(resolve, reject);
            };
        });
    }
};

//axios包装
//支持回调函数和promise两种风格
/*
    参数：
    axiosWrap({
        url:'',//请求地址
        method:'post',//请求方法
        params:'',//请求传参
        responseType:'json',//返回数据类型
        headers:{},//请求头设置
        timeout:20000,//请求超时设置
        onUploadProgress:function(ev){//上传文件时触发的函数
            console.log(ev);
        },
        onDownloadProgress:function(ev){//下载文件时触发的函数
            console.log(ev);
        },
        success:function(res){//请求状态成功且code成功的回调
            console.log(res);
        },
        finally:function(data){//请求状态成功的回调，promise模式在catch里捕获
            console.log(data);
        },
        error:function(error){//请求状态错误的回调
            console.log(error);
        },
    });
*/
/*
    例子：
    单个请求：
    回调函数风格：
    axiosWrap({
        code:0,
        url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
        method:'post',
        success(res){
            console.log(res);
        },
    });

    promise风格：
    axiosWrap({
        code:0,
        url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
        method:'post',
    }).then((res)=>{
        console.log(res);
    });


    并发请求：
    回调函数风格：
    axiosWrap({
        all:{
            apis:[//所有api配置
                {
                    code:0,
                    url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
                    method:'post',
                },
                {
                    code:0,
                    url:'https://www.muyouche.com/action2/CarBrand.ashx',
                    method:'post',
                },
            ],
            success(resArr){//都成功回调
                console.log(resArr);
            },
        },
    });

    promise风格：
    axiosWrap({
        all:{
            apis:[//所有api配置
                {
                    code:0,
                    url:'https://www.muyouche.com/action2/HomePageInfo.ashx',
                    method:'post',
                },
                {
                    code:0,
                    url:'https://www.muyouche.com/action2/CarBrand.ashx',
                    method:'post',
                },
            ],
        },
    }).then((resArr)=>{
        console.log(resArr);
    });
*/
function axiosWrap(config) {
    var config = config || {};
    var hostname = window.location.hostname;
    var all = config.all;
    var errorPromise = {
        then: function () {
            console.error('这是一个无效的then函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
        catch: function () {
            console.error('这是一个无效的catch函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
        finally: function () {
            console.error('这是一个无效的finally函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
    };

    config.code = config.code || config.code == 0 ? config.code : 200;

    function changeLoading(bool) {
        try {
            var store = import('store');

            store.then((data) => {
                data.default.commit({
                    type: 'UPDATE_LOADINGSTATUS',
                    isLoading: bool,
                });
            });
        } catch (e) {}
    };

    function changeRefresh(bool, status) {
        try {
            var store = import('store');

            store.then((data) => {
                data.default.commit({
                    type: 'SHOW_REFRESH_BT',
                    showRefreshBt: bool,
                    status: status || '',
                });
            });
        } catch (e) {}
    };

    changeRefresh(false);

    function createAxios(config) {
        var url = (hostname == 'localhost' || hostname == '127.0.0.1' || hostname == '172.16.21.92') ? (config.url ? config.url : '/api') : '/';
        var method = config.method ? config.method.toLowerCase() : '';
        var paramsOrData = method == 'get' || method == 'delete' || config.urlJointParams ? 'params' : 'data';
        var configResult = {
            url: url,
            method: method,
            [paramsOrData]: config.params,
            headers: config.headers || {},
            timeout: config.timeout || 20000,
            responseType: config.responseType || 'json', //默认值是json，可选项 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
            onUploadProgress: function (ev) {
                config.upFn && config.upFn(ev);
            },
            onDownloadProgress: function (ev) {
                config.downFn && config.downFn(ev);
            },
        };
        var axiosFn = axios(configResult);

        function axiosResultFn(resolve, reject) {
            axiosFn.then(function (res) {
                var data = res.data;

                if (res.status == 200) {
                    changeLoading(false);
                    config.finally && config.finally(data);

                    if (data.code == config.code) {
                        if (resolve && (Type(resolve) == 'function')) {
                            return resolve(data);
                        } else {
                            config.success && config.success(data);
                        }
                    } else {
                        if (!config.noHint) {
                            if (data.msg) {
                                alerts(data.msg);
                            } else {
                                alerts('请求代码错误');
                            }
                        }
                        if (reject && (Type(reject) == 'function')) {
                            return reject(data);
                        }
                    }
                } else {
                    alerts('网络异常' + res.status);
                    changeRefresh(true, res.status);
                    changeLoading(false);
                    if (reject && (Type(reject) == 'function')) {
                        return reject(res);
                    } else {
                        config.error && config.error(res);
                    }
                }
            }).catch(function (error) {
                console.log(error);
                changeLoading(false);
                if (error.response) {
                    alerts('网络异常');
                    changeRefresh(true, error.response.status);
                    if (reject && (Type(reject) == 'function')) {
                        return reject(error.response)
                    } else {
                        config.error && config.error(error.response);
                    }
                } else if (error.code == 'ECONNABORTED') {
                    alerts('请求超时');
                    changeRefresh(true, '请求超时');
                    if (reject && (Type(reject) == 'function')) {
                        return reject(error);
                    } else {
                        config.error && config.error(error);
                    }
                }
            });
        };

        !config.noMask && changeLoading(true);
        if (config.success || config.error || config.finally) {
            axiosResultFn();
            return errorPromise;
        } else {
            return new Promise(function (resolve, reject) {
                axiosResultFn(resolve, reject);
            });
        }
    };

    if (all && all.apis && all.apis.length > 0) {
        var apisArr = [];

        for (var i = 0; i < all.apis.length; i++) {
            if (all.apis[i].url) {
                apisArr.push(createAxios(all.apis[i]));
            }
        }

        function axiosAllResultFn(resolve, reject) {
            Promise.all(apisArr).then(function () {
                if (resolve && (Type(resolve) == 'function')) {
                    return resolve(arguments[0]);
                } else {
                    all.success && all.success(arguments[0]);
                }
            });
        };

        if (all.success || all.error || all.finally) {
            axiosAllResultFn();
            return errorPromise;
        } else {
            return new Promise(function (resolve, reject) {
                axiosAllResultFn(resolve, reject);
            });
        }
    } else {
        return createAxios(config);
    }
};

//WebSocket请求
//注：只能send字符串格式，一般用字符串json格式，断线会重新send之前send过的数据
/*
    主要api：
    var socMarket=Socket.init({
        url:'',//配置socket接口地址
        heartbeatJson:{},//配置后台心跳参数
        timeout:'',//断线重连时间，毫秒（默认5毫秒）
        timeout1:'',//心跳重连时间，毫秒（默认10毫秒）
        timeout2:'',//socket失败重连时间，毫秒（默认10毫秒）
    });

    socMarket.send({//发送的参数

    },function(res){//success函数，reqToken匹配的成功回调

    },function(res){//finally函数，不管是否匹配reqToken都会走

    },function(sendJson){//intervalSend函数，用于间隔执行send方法（可以在此写心跳重连函数）
        var timer=setInterval(function(){
            sendJson();
        },1000);
    });

    例子：
    var socMarket=new Socket();

    socMarket.init({
        url:'wss://api2018cfd-dev.ga096.cn/app/websocket/',
        heartbeatJson:{
            CMD:'1000',
            token:'',
            DATA:JSON.stringify({
                timeStamp:+new Date(),
            }),
        },
    });

    function subMarket(params,arr,endFn,intervalSendFn){
        var DATA=arr.map((item,index)=>({
            productCode:item,
        }));
        var params=Object.assign({},params,{
            CMD:'1004',
            token:params.token||'',
            DATA:JSON.stringify(DATA),
        });

        socMarket.send(params,null,function(res){
            if(res.CMD=='1005')endFn(res);
        },intervalSendFn);
    };

    var timer=null;

    subMarket({},['BTCUSD','EOSUSD','ETHUSD'],function(res){
        console.log(res);
    },function(sendJson){
        clearInterval(timer);
        timer=setInterval(function(){
            sendJson();
        },1000);
    });
*/
function Socket() {
    this.ws = null;
    this.paramsJson = {};
    this.deleteParamsJson = {};
    this.messageFnJson = {};
    this.options = {};

    this.timer = null;
    this.timer1 = null;
    this.timer2 = null;
    this.timeout = 0;
    this.timeout1 = 0;
    this.timeout2 = 0;

    this.first = true;
    this.onOff = true;
    this.resend = false;
    this.keyArr = [];

    return this;
};

Socket.prototype = {
    init: function (options) {
        this.options = options;
        this.timeout = options.timeout || 5000;
        this.timeout1 = options.timeout1 || 10000;
        this.timeout2 = options.timeout2 || 10000;
        this.reconect();

        return this;
    },
    reconect: function () {
        var This = this;

        function start() {
            This.ws = new WebSocket(This.options.url);

            bind(This.ws, 'open', function (res) {
                This.heartbeat();
                This.pubSend();
            });

            bind(This.ws, 'message', function (res) {
                This.heartbeat();
                This.pubSend();
            });

            bind(This.ws, 'close', function (res) {
                This.reconect();
                This.resend = true;

            });

            bind(This.ws, 'error', function (res) {
                This.reconect();
                This.resend = true;
            });
        };

        if (This.onOff) {
            if (This.first) {
                This.first = false;
                start();
            } else if (!This.ws || This.ws.readyState != 1) {
                clearTimeout(This.timer);
                This.timer = setTimeout(start, This.timeout);
            }
        }

        return this;
    },
    messageFn: function (key, successFn, finallyFn) {
        return function (res) {
            var data = null;

            try {
                data = JSON.parse(res.data);
                data.data = JSON.parse(data.data);
            } catch (e) {}

            finallyFn && finallyFn(data, res);
            if (data && data.reqToken == key) {
                successFn && successFn(data, res);
            }
        };
    },
    heartbeat: function () {
        var This = this;

        if (!This.timer1) {
            clearTimeout(This.timer1);
            clearTimeout(This.timer2);

            This.timer1 = setTimeout(function () {
                This.timer1 = null;
                This.options.heartbeatJson && This.ws && This.ws.send(JSON.stringify(This.options.heartbeatJson));
                if (!This.ws || This.ws.readyState != 1) {
                    This.timer2 = setTimeout(function () {
                        This.ws && This.ws.close();
                    }, This.timeout2);
                }
            }, This.timeout1);
        }

        return this;
    },
    pubSend: function () {
        if (this.resend) {
            this.resend = false;
            this.paramsJson = copyJson(this.deleteParamsJson);
            this.deleteParamsJson = {};
        }

        if (this.ws.readyState == 1) {
            for (var attr in this.paramsJson) {
                bind(this.ws, 'message', this.messageFnJson[attr]);
                this.ws.send(this.paramsJson[attr]);
                this.deleteParamsJson[attr] = this.paramsJson[attr];
                delete this.paramsJson[attr];
            }
        }
    },
    send: function (params, successFn, finallyFn, intervalSendFn) {
        //send函数中的params指定reqToken（注意在别重复）时，可以给clearOne传reqToken取消订阅该业务的函数，否则clearOne只能取消最后一个订阅函数
        var This = this;
        var key = params.reqToken || soleString32();
        var messageFn = This.messageFn(key, successFn, finallyFn);

        params.reqToken = key;
        params = JSON.stringify(params);

        if (This.ws.readyState == 1) {
            bind(This.ws, 'message', messageFn);
            This.ws.send(params);
            This.deleteParamsJson[key] = params;
        } else {
            This.paramsJson[key] = params;
        }

        intervalSendFn && intervalSendFn(function () {
            This.ws.send(params);
        });

        This.keyArr.push(key);
        This.messageFnJson[key] = messageFn;

        return this;
    },
    open: function () {
        this.onOff = true;
        this.reconect();

        return this;
    },
    close: function () {
        this.onOff = false;
        this.ws && this.ws.close();
        this.ws = null;

        return this;
    },
    clearOne: function (reqToken) {
        //send函数中的params指定reqToken（注意在别重复）时，可以给clearOne传reqToken取消订阅该业务的函数，否则clearOne只能取消最后一个订阅函数
        var key = reqToken || this.keyArr.pop();

        if (key && this.messageFnJson[key]) {
            unbind(this.ws, 'message', this.messageFnJson[key]);
            delete this.messageFnJson[key];
            delete this.deleteParamsJson[key]
        }

        return this;
    },
    clearAll: function () {
        for (var attr in this.messageFnJson) {
            this.clearOne();
        }

        return this;
    },
    logState: function (str) {
        console.log(str, 'ws.readyState：' + this.ws.readyState);

        return this;
    },
};

/*
    1.9、项目中使用
*/

//创建并在body中插入一个脚本
//src（插入脚本的src）
//endFn（插入脚本onload时回调函数，会回传一个参数，为true时表示第一次加载）
function createScript(src, endFn) {
    var src = src || '';
    var oScript = document.createElement('script');
    var currentScript = window[src] || oScript;

    if (!document.getElementById(src)) {
        oScript.id = src;
        oScript.src = src;
        bind(currentScript, 'load', function () {
            currentScript.loaded = true;
            endFn && endFn(true);
        });
        if (!window[src]) {
            window[src] = oScript;
        }
        document.body.appendChild(window[src]);
    } else {
        if (!currentScript.loaded) {
            bind(currentScript, 'load', function () {
                currentScript.loaded = true;
                endFn && endFn(false);
            });
        } else {
            endFn && endFn(false);
        }
    }
};

//开发与线上控制台模式切换
//arr(数组里面选定的都不输出)
function consoleNull(arr) {
    for (var i = 0; i < arr.length; i++) {
        window.console[arr[i]] = function () {};
    }
};

//网络处理
function networkHandle(onlineFn, offlineFn) {
    window.onoffline = function () {
        alerts('网络已断开！');
        offlineFn && offlineFn();
    };
    window.ononline = function () {
        alerts('网络已连接！');
        setTimeout(function () {
            webviewRefresh();
        }, 3000);
        onlineFn && onlineFn();
    };
};

//打开手机调试模式，2秒钟连续点击5下触发，右下角会出现图标，本地调试有效
//whiteList（允许调试的域名列表，例子如下：）
//openMoblieDebug(['ih.dev.aijk.net','ih2.test.aijk.net']);
function openMoblieDebug(whiteList) {
    var whiteList = whiteList || [];
    var hostname = window.location.hostname;
    var open = hostname == 'localhost' || hostname == '127.0.0.1' || hostname == '172.16.21.92' || ~whiteList.indexOf(hostname);
    var count = 0;

    function openFn() {
        if (open) {
            createScript('//cdn.jsdelivr.net/npm/eruda', function (firstLoad) {
                firstLoad && eruda.init();
            });
        }
    };

    function openJudgeFn() {
        var timer = null;

        count++;
        if (!timer) {
            timer = setTimeout(function () {
                if (count >= 5) {
                    unbind(document, 'click', openJudgeFn);
                    openFn();
                } else {
                    count = 0;
                }
                timer = null;
            }, 2000);
        }
    };

    if (open) {
        unbind(document, 'click', openJudgeFn);
        bind(document, 'click', openJudgeFn);
    }
};

//json克隆副本
function copyJson(json) {
    return json ? JSON.parse(JSON.stringify(json)) : json;
};

//处理ios输入框失去焦点页面不会回到原本位置
function refreshPosition() {
    setTimeout(() => {
        if (!isSafari()) return;
        var oInput = QSA('input,textarea');
        var oldPosition = 0;

        for (var i = 0; i < oInput.length; i++) {
            bind(oInput[i], 'focus', function () {
                oldPosition = document.body.scrollTop;
            });
            bind(oInput[i], 'blur', function () {
                if (document.body.scrollTop != oldPosition) {
                    document.body.scrollTop = oldPosition;
                }
            });
        }
    }, 300);
};

//限制文字长度，超出省略号
function limitText(text, length, symbol) {
    var text = text || '';
    var length = length || 6;
    var symbol = symbol || '...';
    var result = '';

    if (text && text.length > length) {
        result = text.substring(0, length) + symbol;
    } else {
        result = text;
    }
    return result;
};

//根据后缀名判断文件类型
function fileType(suffix) {
    var suffix = suffix || '';
    var typeList = ['image', 'audio', 'video', 'file'];
    var length = typeList.length - 1;
    var suffixJson = {
        image: ['png', 'jpg', 'jpeg', 'gif', 'ico', 'bmp', 'pic', 'tif'],
        audio: ['mp3', 'ogg', 'wav', 'acc', 'vorbis'],
        video: ['mp4', 'webm', 'avi', 'rmvb', '3gp', 'flv'],
    };
    var resultList = [];

    for (var attr in suffixJson) {
        resultList.push(!!~suffixJson[attr].indexOf(suffix));
    }

    var posIndex = resultList.indexOf(true);

    return posIndex != -1 ? typeList[posIndex] : typeList[length];
};

//加密函数，需要引入crypto-js
//加密顺序，des->base64->uri
/*
    例：
    encodeDesBase64URI({a:'123'})//5sxYjt0LduGHx1ZBXdfimA%3D%3D
*/
function encodeDesBase64URI(obj, key, iv) {
    if (!obj) return obj;

    var keyHex = CryptoJS.enc.Utf8.parse(key || '111111678678');
    var ivHex = CryptoJS.enc.Utf8.parse(iv || '\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008');

    try {
        obj = JSON.stringify(obj);
        obj = CryptoJS.DES.encrypt(obj, keyHex, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        obj = CryptoJS.enc.Base64.stringify(obj.ciphertext);
        obj = encodeURIComponent(obj);
    } catch (e) {}

    return obj;
};

//解密函数，需要引入crypto-js
//解密顺序，uri->base64->des
/*
    例：
    decodeURIBase64Des('5sxYjt0LduGHx1ZBXdfimA%3D%3D')//{a:'123'}
*/
function decodeURIBase64Des(obj, key, iv) {
    if (!obj) return obj;

    var keyHex = CryptoJS.enc.Utf8.parse(key || '111111678678');
    var ivHex = CryptoJS.enc.Utf8.parse(iv || '\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008');

    try {
        obj = decodeURIComponent(obj);
        obj = {
            ciphertext: CryptoJS.enc.Base64.parse(obj),
        };
        obj = CryptoJS.DES.decrypt(obj, keyHex, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        obj = obj.toString(CryptoJS.enc.Utf8);
        obj = JSON.parse(obj);
    } catch (e) {}

    return obj;
};

//根据屏幕大小设置根节点字体大小
//getFontSize（是否返回根节点fontSize大小）
//basic（基准值）
//maxScale（最大缩放比例）
/*
    最好结合postcss-pxtorem插件自动转换px为rem

    安装：
    npm i postcss-pxtorem -D

    修改根目录 .postcssrc.js 文件：
    注意：rootValue和basic（基准值）保持一致
    "postcss-pxtorem": {
        "rootValue": 100,
        "minPixelValue": 2, //如px小于这个值，就不会转换了
        "propList": ["*"], // 如需开启pxToRem模式，请在数组中加入"*"
        "selectorBlackList": [] //如需把css选择器加入黑名单，请在数组中加入对应的前缀，比如"mint-"
    }

    或者修改webpack.dev.conf.js和webpack.prod.conf.js
    test: /\.(css|scss|less)$/,
    use:[
        {
            options:{
                plugins:()=>[
                    require('postcss-pxtorem')({
                        "rootValue": 100,
                        "minPixelValue": 2, //如px小于这个值，就不会转换了
                        "propList": ["*"], // 如需开启pxToRem模式，请在数组中加入"*"
                        "selectorBlackList": [] //如需把css选择器加入黑名单，请在数组中加入对应的前缀，比如"mint-"
                    }),
                ],
            },
        },
        {
            loader: require.resolve('sass-loader'),
        },
    ],
*/
function htmlFontSize(getFontSize, basic, maxScale) {
    var getFontSize = getFontSize || false;
    var basic = basic || 100;
    var maxScale = maxScale || 1.5;

    function change() {
        var oHtml = document.documentElement;
        var iWidth = oHtml.clientWidth;
        var iScale = Math.min(iWidth / 375, maxScale);
        var fontSize = basic * iScale;

        if (!getFontSize) {
            oHtml.style.fontSize = fontSize + 'px';
        } else {
            return fontSize;
        }
    };

    if (!getFontSize) {
        change();
        window.onresize = change;
    } else {
        return change();
    }
};

//转换单位为rem
//需要引入import postcssrc from 'root/.postcssrc';
function unit(num, basic) {
    var length = 0;

    if (postcssrc) {
        length = postcssrc.plugins['postcss-pxtorem'].propList.length;
    }

    if (num == 0) return 0;
    if (length == 0) return num + 'px';
    var basic = basic || 100;
    var value = num / basic;

    return (value < 0.01 ? 0.01 : value) + 'rem';
};

//提示框插件
//str（提示的字符串）
//msec（提示框消失的时间，默认3秒）
//noMask（是否去除遮罩）
function alerts(str, msec, noMask) {
    var oMask = document.createElement('div');
    var oWrap = document.createElement('div');
    var msec = msec || 3000;

    oMask.style.cssText = 'width:100%;height:100%;position:fixed;left:0;top:0;z-index:99999;';
    oWrap.style.cssText = 'box-sizing:border-box;min-width:140px;max-width:100%;padding:0 20px;height:50px;line-height:50px;text-align:center;border-radius:5px;background:rgba(0,0,0,0.6);color:#fff;font-size:14px;position:fixed;top:50%;left:50%;z-index:99999;transform:translate3d(-50%,-50%,0);-webkit-transform:translate3d(-50%,0,0);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity 3s ease-in 0s;-webkit-transition:opacity 3s ease-in 0s;opacity:1;';
    oWrap.innerHTML = str;
    oWrap.style.transitionDuration = (msec / 1000 / 2) + 's';

    if (!noMask) {
        oMask.appendChild(oWrap);
        document.body.appendChild(oMask);
    } else {
        document.body.appendChild(oWrap);
    }

    setTimeout(function () {
        oWrap.style.opacity = 0;
    }, msec / 2);

    setTimeout(function () {
        if (!noMask) {
            document.body.removeChild(oMask);
        } else {
            document.body.removeChild(oWrap);
        }
    }, msec);
};

//提示框插件（成功和失败）
//str（提示的字符串）
//bool（true成功提示，false失败提示）
//msec（提示框消失的时间，默认3秒）
function toast(str, bool, msec) {
    var oWrap = document.createElement('div');
    var oIcon = document.createElement('div');
    var oText = document.createElement('div');
    var msec = msec || 3000;

    oWrap.style.cssText = 'box-sizing:border-box;width:260px;padding:20px;text-align:center;background-color:#fff;border-radius:5px;box-shadow:0 10px 20px rgba(0,0,0,0.2);position:fixed;left:50%;top:50%;z-index:99999;transform:translate3d(-50%,-50%,0);-webkit-transform:translate3d(-50%,-50%,0);transition:opacity 3s ease-in 0s;-webkit-transition:opacity 3s ease-in 0s;opacity:1;';
    oIcon.style.cssText = 'box-sizing:border-box;color:' + (bool ? '#56a786' : '#da596d') + ';font-size:40px;';
    oText.style.cssText = 'box-sizing:border-box;padding-top:20px;line-height:20px;';
    oText.innerHTML = str;

    oWrap.style.transitionDuration = (msec / 1000 / 2) + 's';

    AddClass(oIcon, 'iconfont');
    AddClass(oIcon, bool ? 'icon-Shape' : 'icon-Shapefuben');

    oWrap.appendChild(oIcon);
    oWrap.appendChild(oText);
    document.body.appendChild(oWrap);

    setTimeout(function () {
        oWrap.style.opacity = 0;
    }, msec / 2);

    setTimeout(function () {
        document.body.removeChild(oWrap);
    }, msec);
};

//所有积累正则
//reg（验证正则）
//iReg（输入正则）
//tReg（替换正则）
var regJson = {
    int: {
        name: '整型',
        reg: /^[0-9]+$/,
        iReg: /^[0-9]*$/,
        tReg: /[0-9]+/g,
    },
    number: {
        name: '数字',
        reg: /^[0-9]+\.?[0-9]*$/,
        iReg: /^[0-9]*\.?[0-9]*$/,
        tReg: /[0-9]+\.?[0-9]+/g,
    },
    aa: {
        name: '小写字母',
        reg: /^[a-z]+$/,
    },
    AA: {
        nmae: '大写字母',
        reg: /^[A-Z]+$/,
    },
    aA: {
        name: '字母',
        reg: /^[a-zA-Z]+$/,
        iReg: /^[a-zA-Z]*$/,
        tReg: /[a-zA-Z]+/g,
    },
    aa1: {
        name: '小写字母或数字',
        reg: /^[a-z0-9]+$/,
    },
    AA1: {
        name: '大写字母或数字',
        reg: /^[A-Z0-9]+$/,
    },
    aA1: {
        name: '字母和数字',
        reg: /^\w+$/,
    },
    zh: {
        name: '中文',
        reg: /^[\u2E80-\u9FFF]+$/,
        iReg: /^[\u2E80-\u9FFF]*$/,
        tReg: /[\u2E80-\u9FFF]+/g,
    },
    zhEn: {
        name: '中文或英文',
        reg: /^[\u2E80-\u9FFFa-zA-Z]+$/,
        iReg: /^[\u2E80-\u9FFFa-zA-Z]*$/,
        tReg: /[\u2E80-\u9FFFa-zA-Z]+/g,
    },
    mobile: {
        name: '手机号',
        reg: /^1[3-9]{1}\d{9}$/,
        iReg: /^[0-9]{0,11}$/,
    },
    identity: {
        name: '身份证号码',
        reg: /^[1-8]\d{5}[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[\dxX]$/,
    },
    bankCard: {
        name: '银行卡号',
        reg: /^[0-9]{8,28}$/,
    },
    user: {
        name: '用户名',
        reg: /^[\w-]{3,16}$/,
    },
    password: {
        name: '密码',
        reg: /^[^\u2E80-\u9FFF\s]{6,20}$/,
        iReg: /^[^\u2E80-\u9FFF\s]{0,20}$/,
    },
    email: {
        name: '邮箱',
        reg: /^([\w\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
    },
    verifyCode: {
        name: '6位数字验证码',
        reg: /^[0-9]{6}$/,
        iReg: /^[0-9]{0,6}$/,
    },
};

//提示框带多条件阻止
//优先级reg>type>if（校验类型只生效一个）
//arr[{if:'','reg':/^$/,type:'number','value':,'hint':''}]
//if（提示触发的条件）
//reg（正则匹配）
//type（已定义类型正则匹配）
//value（正则验证的值）
//hint（提示的字符串）
//endFn（全部验证通过后才走的回调函数）
//errorFn（参数中返回错误条件的索引）
//msec（提示框消失的时间，默认3秒）
function alertss(arr, endFn, errorFn, msec) {
    var onOff = true;
    var errorIndex = -1;

    for (var i = 0; i < arr.length; i++) {
        var condition = !jsonHasKey(arr[i], 'if') || arr[i].if;

        if (arr[i].reg) {
            if (condition && !arr[i].reg.test(arr[i].value)) {
                alerts(arr[i].hint, msec);
                onOff = false;
                errorIndex = i;
                break;
            }
        } else if (arr[i].type) {
            if (condition && regJson[arr[i].type] && !regJson[arr[i].type].reg.test(arr[i].value)) {
                alerts(arr[i].hint || '请输入有效的' + regJson[arr[i].type].name, msec);
                onOff = false;
                errorIndex = i;
                break;
            }
        } else if (arr[i].if) {
            alerts(arr[i].hint, msec);
            onOff = false;
            errorIndex = i;
            break;
        }
    }

    errorFn && errorFn(errorIndex);
    onOff && endFn && endFn();
};

//验证码防止刷新插件(多个按钮)
/*new UnReload([
    {
        obj:oBt1,//按钮
        obj1:oInput,//填写手机号的输入框(里面做了判断手机号码)
        num:10,//设置倒计时总秒数
        str1:null,//按钮未点击时候的文字
        str2:null,//按钮点击之后的文字
        lNum:'yydNum1',//刷新时本地存储倒计时已走秒数的名称
        lTime:'yydTime1',//刷新时本地存储当时时间戳的名称
        endFn:function(){//回调函数，这个函数仅在可点击状态执行一次
            console.log(111);
        }
    },
    {
    }
]);*/
function UnReload(option) {
    this.option = option;
    for (var i = 0; i < option.length; i++) {
        option[i].iNum = 0;
        option[i].timer = null;
        this.Click(option[i]);
        this.exist(option[i]);
        this.Unload();
    }
};
UnReload.prototype = {
    start: function (option) {
        var This = this;
        clearInterval(option.obj.timer);
        option.obj.classList.add('active');
        option.obj.innerHTML = ((option.num + 1) || 60) - option.iNum + (option.str2 || 's后重新发送');

        option.obj.timer = setInterval(function () {
            option.iNum++;

            if (option.iNum >= ((option.num + 1) || 60)) {
                clearInterval(option.obj.timer);
                option.obj.classList.remove('active');
                option.obj.innerHTML = option.str1 || '获取验证码';
                option.iNum = 0;
            } else {
                option.obj.innerHTML = ((option.num + 1) || 60) - option.iNum + (option.str2 || 's后重新发送');
            }
        }, 1000);
    },
    Click: function (option) {
        var This = this;

        option.obj.onclick = function () {
            if (option.iNum > 0 && option.iNum < ((option.num + 1) || 60)) return;
            if (option.obj1) {
                if (!option.obj1.value) {
                    alerts('请填写手机号！');
                    return;
                } else {
                    var reg = /^1[3-9]{1}\d{9}$/;

                    if (!reg.test(option.obj1.value)) {
                        alerts('手机号格式错误！');
                        return;
                    }
                }
            }
            if (document.getElementById('yydTXM') && !document.getElementById('yydTXM').value) {
                alerts('请输入图形验证码！');
                return;
            }
            option.endFn && option.endFn.call(option.obj);
            option.iNum = 1;
            This.start(option);
        };
    },
    exist: function (option) {
        var yydNum = +(window.localStorage.getItem(option.lNum || 'yydNum'));
        var yydTime = +(window.localStorage.getItem(option.lTime || 'yydTime'));

        if (yydNum) {
            var nTime = Math.round((+new Date() - yydTime) / 1000);

            option.iNum = ((+yydNum) + (+nTime));
            if (option.iNum > 0 && option.iNum <= ((option.num + 1) || 60)) {
                this.start(option);
            }
        }
    },
    Unload: function () {
        var This = this;
        window.onunload = function () {
            for (var i = 0; i < This.option.length; i++) {
                window.localStorage.setItem(This.option[i].lNum || 'yydNum', +This.option[i].iNum);
                window.localStorage.setItem(This.option[i].lTime || 'yydTime', +new Date());
            }
        };
    }
};

//自动裁剪图片插件
//option{
//obj:obj,(要裁剪图片的input(type="file")文件)
//sWidth(图片宽度超过这个宽度(默认640)就进行预压缩，压缩后的宽高基于此数值)
//width:100,(要裁剪的宽度，不写默认图片原始尺寸，宽高小于等于1则按图片宽度比例)
//height:100,(要裁剪的高度，不写默认图片原始尺寸，宽高小于等于1则按图片宽度比例)
//position:'center',(裁剪开始的位置，'top','center'(默认)，'bottom','left','right')
//type:'png',(裁剪后保存的图片类型，'png'(默认)，'jpg')
//quality:1,(裁剪后的图片质量(数值)，1.0(默认)，要生效不能用png格式)
//endFn:function(url,file){},(裁剪后返还函数，第一个是裁剪后的base64地址，第二个是文件的files[0]对象，包含图片信息)
//}
function autoClipImage(option) {
    var json = { 'png': 'image/png', 'jpg': 'image/jpeg', 'gif': 'image/gif', 'icon': 'image/x-icon' };
    var iW = option.width;
    var iH = option.height;

    var obj = option.obj;
    var sWidth = option.sWidth || 640;
    var width = option.width;
    var height = option.height;
    var position = option.position || 'center';
    var type = option.type || 'png';
    var quality = option.quality || 1;
    var endFn = option.endFn || null;

    obj.onchange = function () {
        if (!this.files.length) return; //没选择文件则不执行
        var file = this.files[0];
        var reader = new FileReader();
        var onOff = false;

        reader.readAsDataURL(file);
        reader.onload = function () {
            for (var attr in json) {
                if (file.type == json[attr]) {
                    onOff = true;
                    break;
                }
            }
            if (!onOff) {
                alerts('请上传图片文件！');
                resetFile(obj);
                console.log('文件类型为：' + file.type + '，不是正确的图片类型：' + JSON.stringify(json), file);
                return;
            }
            setImageURL(reader.result, file);
        };
    };

    function setImageURL(url, file) {
        var image = new Image();
        var oWrap = document.createElement('div');
        var oC = document.createElement('canvas');

        image.src = url;
        image.style.cssText = 'width:auto!important;height:auto!important;max-width:none!important;min-width:none!important;max-height:none!important;min-height:none!important;opacity:0;filter:alpha(opacity:0)';
        oWrap.style.cssText = 'position:absolute;';
        oWrap.appendChild(image);
        document.body.appendChild(oWrap);

        image.onload = function () {
            var iWidth = parseFloat(getStyle(image, 'width'));
            var iHeight = parseFloat(getStyle(image, 'height'));

            if (iWidth > sWidth) { //根据宽度限制进行预压缩
                var maxWidth = iWidth;
                var maxHeight = iHeight;

                iWidth = sWidth;
                iHeight = iHeight * sWidth / maxWidth;

                var oC1 = document.createElement('canvas');

                oC1.width = iWidth;
                oC1.height = iHeight;
                oWrap.appendChild(oC1);

                var oGC1 = oC1.getContext('2d');

                oGC1.drawImage(image, 0, 0, maxWidth, maxHeight, 0, 0, iWidth, iHeight);
                image.src = oC1.toDataURL(json[type]);
                image.onload = function () {
                    clip();
                };
            } else {
                clip();
            }

            function clip() { //判断希望的图片尺寸进行压缩和裁剪
                if (width && height) {
                    if (width <= 1 && height <= 1) {
                        width = iWidth * width;
                        height = iWidth * height;
                    }
                    if (width > iWidth && height <= width * iHeight / iWidth) {
                        image.style.width = width + 'px';
                        image.style.height = 'auto';
                    } else if (height > iHeight && width <= height * iWidth / iHeight) {
                        image.style.width = 'auto';
                        image.style.height = height + 'px';
                    }
                } else if (width && !height) {
                    if (width > iWidth) {
                        image.style.width = width + 'px';
                    }
                    height = iHeight;
                } else if (!width && height) {
                    if (height > iHeight) {
                        image.style.height = height + 'px';
                    }
                    width = iWidth;
                } else {
                    width = iWidth;
                    height = iHeight;
                }

                var iWidth1 = parseFloat(getStyle(image, 'width'));
                var iHeight1 = parseFloat(getStyle(image, 'height'));

                oWrap.style.width = iWidth1 + 'px';
                oWrap.style.height = iHeight1 + 'px';

                oC.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;z-index:10;';
                switch (position) {
                    case 'top':
                        oC.style.left = '50%';
                        oC.style.marginLeft = -width / 2 + 'px';
                        oC.style.right = 'auto';
                        oC.style.bottom = 'auto';
                        break;
                    case 'bottom':
                        oC.style.left = '50%';
                        oC.style.marginLeft = -width / 2 + 'px';
                        oC.style.right = 'auto';
                        oC.style.top = 'auto';
                        break;
                    case 'left':
                        oC.style.top = '50%';
                        oC.style.marginTop = -height / 2 + 'px';
                        oC.style.right = 'auto';
                        oC.style.bottom = 'auto';
                        break;
                    case 'right':
                        oC.style.top = '50%';
                        oC.style.marginTop = -height / 2 + 'px';
                        oC.style.left = 'auto';
                        oC.style.bottom = 'auto';
                        break;
                }
                oC.width = width;
                oC.height = height;
                oWrap.appendChild(oC);

                var iLeft = oC.offsetLeft;
                var iTop = oC.offsetTop;
                oWrap && document.body.removeChild(oWrap);

                var oGC = oC.getContext('2d');
                oGC.drawImage(image, iLeft * iWidth / iWidth1, iTop * iHeight / iHeight1, width * iWidth / iWidth1, height * iHeight / iHeight1, 0, 0, width, height);

                width = iW;
                height = iH;

                resetFile(obj);
                endFn && endFn(oC.toDataURL(json[type], quality), file);
            };
        };
    };
};

//预加载图片
//arr(预加载的一组图片地址)
function preload(arr, endFn) {
    var newimages = [];
    var iNum = 0;

    function loadOver() {
        iNum++;
        if (iNum == arr.length) {
            endFn && endFn(newimages);
        }
    }
    for (var i = 0; i < arr.length; i++) {
        newimages[i] = new Image();
        newimages[i].src = arr[i];
        newimages[i].onload = function () {
            loadOver();
        }
        newimages[i].onerror = function () {
            loadOver();
        }
    }
};

//懒加载图片(图片无地址时)
//imgArr(页面上需要懒加载图片的集合))
//srcName(dom上存图片路径的自定义属性)
//dis(页面滚动到距离图片多少开始加载，默认0
function lazyLoading(imgArr, srcName, dis) {
    var dis = dis || 0;

    scrollFn();
    bind(document, 'scroll', scrollFn);

    function scrollFn() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var dH = document.documentElement.clientHeight + scrollTop;
        var lH = 0;
        var index = 0;

        for (var i = 0; i < imgArr.length; i++) {
            lH = getPos(imgArr[i], 'top');
            if (dH > lH - dis) {
                index = i;
            }
        }
        for (var i = 0; i < index + 1; i++) {
            imgArr[i].src = imgArr[i].getAttribute(srcName);
        }
    };
};

//利用闭包实现函数防抖
//fn（用执行的函数）
//msec（执行间隔，毫秒）
/*
    使用示例（mousemove300ms后执行一次count）
    var iCount=1;

    var count=antiShake(function(){
     console.log(iCount++);
    });

    document.onmousemove=function(){
     count();
    };
*/
function antiShake(fn, msec) {
    var timer = null;

    return function () {
        var This = this;
        var Arguments = arguments;

        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(This, Arguments);
        }, msec || 300);
    };
};

//利用闭包实现函数节流
//fn（用执行的函数）
//msec（执行间隔，毫秒）
/*
    使用示例（mousemove每300ms执行一次count）
    var iCount=1;

    var count=throttle(function(){
     console.log(iCount++);
    });

    document.onmousemove=function(){
     count();
    };
*/
function throttle(fn, msec) {
    var timer = null;
    var first = true;

    return function () {
        var This = this;
        var Arguments = arguments;

        if (first) {
            first = false;
            fn.apply(This, Arguments);
        } else if (!timer) {
            timer = setTimeout(function () {
                clearTimeout(timer);
                timer = null;
                fn.apply(This, Arguments);
            }, msec || 300);
        }
    };
};

//简单显示隐藏选项卡插件
//obj（选项卡控制按钮）
//obj1（选项卡显示隐藏的一组节点）
//styleClass（选项卡选中高亮的class名称）
function tab(obj, obj1, styleClass) {
    for (var i = 0; i < obj.length; i++) {
        bind(obj[i], 'click', fn);
    }

    function fn() {
        for (var i = 0; i < obj.length; i++) {
            obj[i].classList.remove(styleClass);
            obj1[i].style.display = 'none';
            obj[i].index = i;
        }
        obj[this.index].classList.add(styleClass);
        obj1[this.index].style.display = 'block';
    };
};

//全选插件
//obj（全选按钮）
//obj1（所有选项的元素集合）
function allChecked(obj, obj1) {
    bind(obj, 'change', fn);

    function fn() {
        if (obj.checked == true) {
            for (var i = 0; i < obj1.length; i++) {
                obj1[i].checked = true;
            }
        } else {
            for (var i = 0; i < obj1.length; i++) {
                obj1[i].checked = false;
            }
        }
    };

    for (var i = 0; i < obj1.length; i++) {
        bind(obj1[i], 'change', fn1);
    }
    fn1();

    function fn1() {
        for (var i = 0; i < obj1.length; i++) {
            if (obj1[i].checked == false) {
                obj.checked = false;
                return;
            }
            obj.checked = true;
        }
    };
};

//回到顶部插件
//obj（回到顶部按钮）
//showPos（按钮出现的位置，默认一屏幕）
function goTop(obj, showPos) {
    var iH = document.documentElement.scrollHeight || document.body.scrollHeight;
    var iCH = document.documentElement.clientHeight;
    var oScrollTop = 0;
    var onOff = false;

    document.onscroll = function () {
        oScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var oDisplay = getStyle(obj, 'display');

        if (oScrollTop > (showPos || iCH)) {
            if (oDisplay == 'none') {
                obj.style.display = 'block';
                obj.style.opacity = '0';
                obj.style.filter = 'alpha(opacity:0)';
                allMove(300, obj, { 'opacity': 100 }, 'linear');
            }
        } else {
            if (oDisplay == 'block') {
                if (onOff) return;
                onOff = true;
                obj.style.opacity = '100';
                obj.style.filter = 'alpha(opacity:100)';
                allMove(300, obj, { 'opacity': 0 }, 'linear', function () {
                    obj.style.display = 'none';
                    onOff = false;
                });
            }
        }
    };

    bind(obj, 'click', fn);

    function fn() {
        document.documentElement.scrollTop = document.body.scrollTop = 0;
    };
};

//label自定义样式绑定单选框插件（配合样式）
//obj（一组label标签的元素）
//classStyle（切换后的active样式）
//注意：label标签里面必须要有元素，而且块状化才能支持宽高
function labelFor(obj, classStyle) {
    for (var i = 0; i < obj.length; i++) {
        obj[i].onchange = function () {
            for (var i = 0; i < obj.length; i++) {
                obj[i].classList.remove(classStyle);
            }

            if (this.children[0].checked) {
                this.classList.add(classStyle);
            }
        };
    }
};

//label自定义样式绑定复选框框插件（配合样式）
function labelFor1(obj, classStyle) {
    for (var i = 0; i < obj.length; i++) {
        obj[i].onchange = function () {
            this.children[0].checked ? this.classList.add(classStyle) : this.classList.remove(classStyle);
        };
    }
};

//限制输入类型
//oninput="inputType(this,0)"
function inputType(This, index) {
    var arr = [
        This.value.replace(/[^\d\.]+/g, ''), //数字类型0
        This.value.replace(/[^a-zA-Z]+/g, ''), //字母类型1
        This.value.replace(/[^a-zA-Z]+/g, '').toLowerCase(), //字母类型小写2
        This.value.replace(/[^a-zA-Z]+/g, '').toUpperCase(), //字母类型大写3
        This.value.replace(/[^\w]+/g, ''), //数字和字母类型4
        This.value.replace(/[^\w]+/g, '').toLowerCase(), //数字和字母类型小写5
        This.value.replace(/[^\w]+/g, '').toUpperCase(), //数字和字母类型大写6
        This.value.replace(/[^\u2E80-\u9FFFa-zA-Z]+/g, ''), //汉字和英文7
    ];
    This.value = arr[index || 0];
};

//input输入汉字不带拼音
function realInput(obj, endFn) {
    var onOff = true;
    var timer = null;
    var timer1 = null;
    var timer2 = null;
    var lastValue = '';

    bind(obj, 'compositionstart', function (ev) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            onOff = false;
        });
    });

    bind(obj, 'compositionupdate', function (ev) {
        var ev = ev || window.event;
        var reg = /[\u2E80-\u9FFF]+/;
        var reg1 = /^\s{1}[a-zA-Z]+$/;
        var reg2 = /^[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]+$/;
        var reg3 = /^[·！#￥（——）：；“”‘、，|《。》？、【】[\]]+$/;
        var oldValue = ev.currentTarget.value;
        var insertValue = ev.data;
        var value = oldValue + insertValue;

        lastValue = oldValue;
        clearTimeout(timer1);
        timer1 = setTimeout(function () {
            if (!onOff) {
                if (insertValue.match(reg) || reg1.test(insertValue) || reg2.test(insertValue) || reg3.test(insertValue)) {
                    endFn && endFn(value, oldValue, insertValue);
                }
            }
        });
    });

    bind(obj, 'compositionend', function (ev) {
        setTimeout(function () {
            onOff = true;
        });
    });

    bind(obj, 'input', function (ev) {
        var ev = ev || window.event;
        var delayTime = 0;
        var oldValue = ev.currentTarget.value;
        var insertValue = ev.data;
        var value = (insertValue && insertValue.length == 1) ? (lastValue + insertValue) : oldValue;

        if (insertValue && insertValue.length == 1) {
            delayTime = 300;
        } else {
            delayTime = 0;
        }

        onOff = true;
        clearTimeout(timer2);
        timer2 = setTimeout(function () {
            lastValue = value;
            if (onOff) {
                endFn && endFn(value);
            }
        }, delayTime || 20);
    });
};

//下拉刷新页面
function pullReload() {
    var oWrap = document.createElement('div');
    var oDiv = document.createElement('div');
    var oSpan = document.createElement('span');

    oWrap.style.cssText = ' margin:0; padding:0; width:100%; height:100%; position:fixed; left:0; top:0; right:0; bottom:0; margin:auto; z-index:999999999; display:none;';
    oDiv.style.cssText = ' margin:0; padding:0; width:100px; height:100px; position:absolute; left:0; top:0; right:0; bottom:0; margin:auto; overflow:hidden;';
    oSpan.style.cssText = ' margin:0; padding:0; width:80px; height:30px; line-height:30px; text-align:center; font-size:12px; background-color:rgba(255,255,255,0.9); color:#999; box-shadow:0 0 4px rgba(0,0,0,0.3); border:1px solid #ddd; border-radius:5px; position:absolute; left:0; top:-150px; right:0; bottom:0; margin:auto;';

    document.body.appendChild(oWrap);
    oWrap.appendChild(oDiv);
    oDiv.appendChild(oSpan);

    var iTop = parseInt(getStyle(oSpan, 'top'));
    var pY = 0;
    var scrollY = 0;
    var iDisY = 0;

    bind(document, 'touchmove', pDef);
    onDrag({
        obj: document,
        start: function (position, ev) {

        },
        move: function (position, ev) {
            scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            iDisY = position.mY - position.sY;

            if (scrollY == 0) {
                oWrap.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
            if (iDisY > 0) {
                bind(document, 'touchmove', pDef);
                document.body.style.overflow = 'hidden';
                pY = iTop + iDisY / 2;
            } else {
                unbind(document, 'touchmove', pDef);
                document.body.style.overflow = 'auto';
                pY = iTop + iDisY / 1;
            }
            if (pY < -150) {
                pY = -150;
                document.body.style.overflow = 'auto';
            }
            if (pY > 60) {
                pY = 60;
            }
            if (pY > -50) {
                oSpan.innerHTML = '松开刷新';
                oSpan.style.color = '#0479cc';
            } else {
                oSpan.innerHTML = '下拉刷新';
                oSpan.style.color = '#999';
            }
            oSpan.style.top = pY + 'px';
        },
        end: function (position, ev) {
            bind(document, 'touchmove', pDef);
            document.body.style.overflow = 'auto';
            allMove(300, oSpan, { 'top': -150 }, 'easeIn', function () {
                oWrap.style.display = 'none';
                if (scrollY == 0 && pY > -50) {
                    window.location.reload();
                }
            });
        },
    });
};

/*
    1.10、跨域解决方案
*/

/*
    服务端入手
    1、 跨域资源共享（CORS）
    2、 通过jsonp跨域
    3、 nodejs中间件代理跨域
    4、 nginx代理跨域
    5、 WebSocket协议跨域

    前端入手
    6、 document.domain + iframe跨域
    7、 window.name + iframe跨域
    8、 location.hash + iframe
    9、 postMessage跨域
*/

//跨域解决方案之document.domain + iframe跨域
//思路：两个页面都通过js强制设置document.domain为基础主域，就实现了同域。
//方案：两个页面都通过js强制设置document.domain为基础主域
//缺点：此方案仅限主域相同，子域不同的跨域应用场景。
//url（要跨域的地址）
//domain（基础主域）
//endFn（回调函数，回参为跨域页面的iframe）
//showIframe（是否显示被嵌套页面）
/*
    documentDomainCrossDomain('http://yangyd.cn/test/','yyd.com',function(iframe){
        console.log(iframe.contentWindow.location);
    });
*/
function documentDomainCrossDomain(url, domain, endFn, showIframe) {
    var oIframe = document.createElement('iframe');

    document.domain = domain;
    oIframe.src = url;
    oIframe.style.display = showIframe ? 'block' : 'none';
    oIframe.onload = function () {
        endFn && endFn(oIframe);
    };

    document.body.appendChild(oIframe);
};

//跨域解决方案之window.name + iframe跨域
//思路：window.name属性的独特之处：name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。
//方案：第一次让iframe加载跨域页面，保存window.name，然后再让iframe加载同域页面获取window.name
//缺点：只能单次收发数据
//url（要跨域的地址）
//endFn（回调函数，回参为跨域页面返回的data数据）
/*
    windowNameCrossDomain('http://yangyd.cn/test/',function(data){
        console.log(data);//This is domain2 data!
    });
*/
function windowNameCrossDomain(url, endFn) {
    var crossUrlLoaded = false;
    var oIframe = document.createElement('iframe');

    oIframe.src = url;
    oIframe.style.display = 'none';
    oIframe.onload = function () {
        if (!crossUrlLoaded) {
            crossUrlLoaded = true;
            oIframe.contentWindow.location.href = '/crossDomainProxy.html'; //不存在该html时会报错404，但是不影响，如果不想报错，就建一个对应名字的空页面
        } else {
            endFn && endFn(oIframe.contentWindow.name);
            oIframe.contentWindow.document.write('');
            document.body.removeChild(oIframe);
        }
    };

    document.body.appendChild(oIframe);
};

//跨域解决方案之location.hash + iframe跨域
//思路：a欲与b跨域相互通信，通过中间页c来实现。 三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。
//方案：需要一个同域的代理页面，代理页面监听hashchange事件，通过window.top调用获取数据页面的回调方法传入hash里的数据，跨域页面通过改变代理页面的hash值传数据
//缺点：只能单向收发数据
/*
    A域：需要获取数据的页面
    var hashChangeCrossDomain=new hashChangeCrossDomain();

    hashChangeCrossDomain.on('http://yangyd.cn/test',function(data){
        console.log(window.location.href,'收到',data);
    });

    A域：代理监听hash变化的页面
    var hashChangeCrossDomain=new hashChangeCrossDomain();

    hashChangeCrossDomain.watch();

    B域：需要跨域发送数据的页面
    var hashChangeCrossDomain=new hashChangeCrossDomain();

    hashChangeCrossDomain.emit('http://yyd.com/proxy.html','发送数据给http://yyd.com')
*/
function hashChangeCrossDomain() {
    this.name = 'hashChangeCrossDomain';
};

hashChangeCrossDomain.prototype = {
    init: function (showIframe) {
        this.showIframe = showIframe ? 'block' : 'none';

        return this;
    },
    createIframe: function (url) {
        if (!url) return this;
        var oIframe = document.createElement('iframe');

        oIframe.style.display = this.showIframe;
        oIframe.src = url;

        return oIframe;
    },
    getSearch: function (key, str) {
        var reg = new RegExp('(^|&|\\?)' + key + '=([^&]+)(&|$)');
        var str = str || window.location.search;
        var matchStr = str.match(reg);

        return matchStr && matchStr[2] || null;
    },
    watch: function () {
        var This = this;

        window.onhashchange = function () {
            var hash = window.location.hash;
            var posIndex = hash.indexOf('?');

            if (~posIndex) {
                var str = hash.substring(posIndex);
                var hashData = This.getSearch('hashData', str);

                hashData = decodeURIComponent(hashData);
                try {
                    hashData = JSON.parse(hashData);
                } catch (e) {}

                window.top.hashChangeCrossDomainFn && window.top.hashChangeCrossDomainFn(hashData);
            }
        };

        return this;
    },
    on: function (url, endFn) { //url为跨域页面的url，endFn为回调函数，回参为跨域页面发送的数据
        if (!this.onIframe) {
            this.onIframe = this.createIframe(url);
        }

        window.hashChangeCrossDomainFn = endFn;
        document.body.appendChild(this.onIframe);

        return this;
    },
    emit: function (url, data) { //url为同域代理页面的url，data为跨域页面要发送的数据
        var This = this;
        var data = data || '';

        if (!This.emitIframe) {
            This.emitIframe = This.createIframe(url);
            This.emitIframe.style.display = 'none';
        }

        function emitFn(exec) {
            if (!exec && This.emitIframe.loaded) return;
            var hash = '#' + (url.split('#')[1] || '');
            var posIndex1 = hash.indexOf('?');
            var posIndex2 = hash.indexOf('=');
            var resultHash = '';

            if (!~posIndex1) {
                hash += '?';
            }
            if (~posIndex2) {
                hash += '&';
            }

            This.emitIframe.loaded = true;
            hash += 'hashData=' + encodeURIComponent(JSON.stringify(data));
            This.emitIframe.src = url + hash;
        };

        if (This.emitIframe.loaded) {
            emitFn(true);
        } else {
            This.emitIframe.onload = function () {
                emitFn(false);
            };
            document.body.appendChild(This.emitIframe);
        }

        return this;
    },
};

//跨域解决方案之postMessage跨域
/*
    思路：postMessage是HTML5 XMLHttpRequest Level 2中的API，且是为数不多可以跨域操作的window属性之一，它可用于解决以下方面的问题：
    a.） 页面和其打开的新窗口的数据传递
    b.） 多窗口之间消息传递
    c.） 页面与嵌套的iframe消息传递
    d.） 上面三个场景的跨域数据传递
*/
//方案：主页面嵌套跨域的页面，给被嵌套页面发消息可以通过iframe.contentWindow.postMessage，被嵌套页面给主页面发消息可以通过window.top.postMessage
//缺点：可能不兼容
/*
    主页面
    var postMessageCrossDomain=new postMessageCrossDomain().init(true);

    postMessageCrossDomain.on(function(data){
        console.log(window.location.href,'收到',data);
    });
    postMessageCrossDomain.emit('child','http://yangyd.cn/test/','父页面通过postMessage跨域发送数据');

    跨域的页面
    var postMessageCrossDomain=new postMessageCrossDomain().init(true);

    postMessageCrossDomain.on(function(data){
        console.log(window.location.href,'收到',data);
    });
    postMessageCrossDomain.emit('parent','http://yyd.com/','子页面通过postMessage跨域发送数据');
*/
function postMessageCrossDomain() {
    this.name = 'postMessageCrossDomain';
};

postMessageCrossDomain.prototype = {
    init: function (showIframe) {
        this.showIframe = showIframe ? 'block' : 'none';

        return this;
    },
    createIframe: function (url) {
        if (!url) return this;
        var oIframe = document.createElement('iframe');

        oIframe.style.display = this.showIframe;
        oIframe.src = url;

        return oIframe;
    },
    on: function (endFn) { //endFn为回调函数，回参为跨域页面发送的数据
        window.addEventListener('message', function (ev) {
            var data = ev.data;

            try {
                data = JSON.parse(data);
            } catch (e) {}

            endFn && endFn(data);
        }, false);

        return this;
    },
    emit: function (name, url, data) { //url跨域页面的url，data为跨域页面要发送的数据
        var This = this;
        var data = data || '';

        if (!This.emitIframe) {
            This.emitIframe = This.createIframe(url);
        }

        if (name == 'parent') {
            window.top.postMessage(JSON.stringify(data), url);
        } else {
            function emitFn(exec) {
                if (!exec && This.emitIframe.loaded) return;
                This.emitIframe.contentWindow.postMessage(JSON.stringify(data), url);
            };

            if (This.emitIframe.loaded) {
                emitFn(true);
            } else {
                This.emitIframe.onload = function () {
                    emitFn(false);
                };
                document.body.appendChild(This.emitIframe);
            }
        }

        return this;
    },
};

/*
    1.99、自我拓展
*/

//根据数据模板创建元素(防止xss攻击)
//el:元素名称string
//children:子元素array
function htmlTemplate(json) {
    var parent = null;
    var children = json.children;
    var filterArr = ['el', 'children'];
    var domArr = ['class', 'checked', 'selected', 'readonly', 'disabled', 'innerText', 'outerText', 'innerHTML', 'outerHTML'];
    var noAttrArr = ['innerText', 'outerText', 'innerHTML', 'outerHTML'];
    var reg = /^on/;

    parent = creatDom(json);

    function creatDom(json) {
        var obj = document.createElement(json.el || 'div');

        for (var attr in json) {
            if (filterArr.indexOf(attr) == -1) {
                if (domArr.indexOf(attr) != -1 || attr.match(reg)) {
                    obj[attr == 'class' ? attr + 'Name' : attr] = json[attr];
                } else if (noAttrArr.indexOf(attr) == -1) {
                    obj.setAttribute(attr, json[attr]);
                }
            }
        }

        return obj;
    };

    creatChild(parent, children);

    function creatChild(currentParent, children) {
        if (!children) return;

        for (var i = 0; i < children.length; i++) {
            var childDom = creatDom(children[i]);

            currentParent.appendChild(childDom);
            creatChild(childDom, children[i].children);
        }
    };

    return parent;
};

//模仿animation的动画插件
//obj(要做动画的对象)
//json(做动画的样式)
//var show={
//          0.1:{
//              transform:'rotateX(-120deg)',
//          },
//          1:{
//              transform:'rotateX(0deg)',
//          },
//      };
//msec(动画执行的总时间，单位毫秒)
//type(动画的运动类型)
function keyframes(obj, json, msec, type) {
    var msec = msec || 1000;
    var type = type || 'linear';

    for (var attr in json) {
        (function (attr, json) {
            setTimeout(function () {
                var json1 = json[attr];

                obj.style.transition = 'all ' + attr * msec + 'ms ' + type;
                obj.style.WebkitTransition = 'all ' + attr * msec + 'ms ' + type;
                for (var attr1 in json1) {
                    obj.style[attr1] = json1[attr1];
                }
            }, attr * msec);
        })(attr, json);
    }
};

/*
    2.1、运动框架
*/

//常用框架-->
//匀速链式运动框架
function move(msec, obj, attr, dis, target, endFn) {
    clearInterval(obj.move);
    var arr = [];
    var num = 0;
    var onOff = false;
    var position = parseInt(getStyle(obj, attr.split('/').join('')));
    for (var i = target; i > 0; i -= dis) {
        arr.push(i, -i);
    }
    arr.push(0);
    if (attr == '/left' || attr == '/top') {
        onOff = true;
    } else if (attr == 'opacity') {
        var dis = getStyle(obj, attr) * 100 < target ? dis : -dis;
    } else {
        var dis = parseInt(getStyle(obj, attr)) < target ? dis : -dis;
    }
    obj.move = setInterval(function () {
        if (onOff) {
            attr = attr.split('/').join('');
        } else if (attr == 'opacity') {
            var outcome = getStyle(obj, attr) * 100 + dis;
        } else {
            var outcome = parseInt(getStyle(obj, attr)) + dis;
        }
        if (outcome > target && dis > 0 || outcome < target && dis < 0) outcome = target;
        if (onOff) {
            obj.style[attr] = position + arr[num] + 'px';
            num++;
        } else if (attr == 'opacity') {
            obj.style.opacity = outcome / 100;
            obj.style.filter = 'alpha(opacity:' + outcome + ')';
        } else {
            obj.style[attr] = outcome + 'px';
        }
        if (outcome == target || num == arr.length) {
            clearInterval(obj.move);
            endFn && endFn.call(obj);
        }
    }, msec);
};

//匀速同步运动框架
function manyMove(msec, obj, json, dis, endFn) {
    clearInterval(obj.manyMove);
    obj.manyMove = setInterval(function () {
        var over = true;
        for (var attr in json) {
            var target = json[attr];
            if (attr == 'opacity') {
                var speed = getStyle(obj, attr) * 100 < target ? dis : -dis;
                var outcome = getStyle(obj, attr) * 100 + speed;
            } else {
                var speed = parseInt(getStyle(obj, attr)) < target ? dis : -dis;
                var outcome = parseInt(getStyle(obj, attr)) + speed;
            }
            if (outcome > target && speed > 0 || outcome < target && speed < 0) outcome = target;
            if (attr == 'opacity') {
                obj.style.opacity = outcome / 100;
                obj.style.filter = 'alpha(opacity:' + outcome + ')';
            } else {
                obj.style[attr] = outcome + 'px';
            }
            if (outcome != target) over = false;
        }
        if (over) {
            clearInterval(obj.manyMove);
            endFn && endFn.call(obj);
        }
    }, msec);
};

//综合类型同步运动框架
function allMove(time, obj, json, type, endFn) {
    clearInterval(obj.allMove);
    var Default = {};
    var startTime = new Date().getTime();
    for (var attr in json) {
        Default[attr] = 0;
        Default[attr] = attr == 'opacity' ? Math.round(getStyle(obj, attr) * 100) :
            parseInt(getStyle(obj, attr));
    }
    obj.allMove = setInterval(function () {
        var changeTime = new Date().getTime() - startTime;
        var t = time - Math.max(0, time - changeTime);
        for (var attr in json) {
            var value = moveType[type](t, Default[attr], json[attr] - Default[attr], time);
            if (attr == 'opacity') {
                obj.style.opacity = value / 100;
                obj.style.filter = 'alpha(opacity=' + value + ')';
            } else {
                obj.style[attr] = value + 'px';
            }
        }
        if (t == time) {
            clearInterval(obj.allMove);
            endFn && endFn.call(obj);
        }
    }, 1000 / 60)
};

var moveType = {
    //t:运动消耗的时间 b:初始值 c:目标值 d:设定的总时间 return:返回是随运动变化的结果值
    'linear': function (t, b, c, d) { //匀速运动
        return c * (t / d) + b;
    },
    'easeIn': function (t, b, c, d) { //加速运动
        return c * (t /= d) * t + b;
    },
    'easeOut': function (t, b, c, d) { //减速运动
        return c * (t /= d) * (2 - t) + b;
    },
    'easeBoth': function (t, b, c, d) { //加速减速运动
        return (t /= d / 2) < 1 ? c / 2 * t * t + b : c / 2 * ((t -= 1) * (2 - t) + 1) + b;
    },
    'easeInStrong': function (t, b, c, d) { //加加速运动
        return c * (t /= d) * t * t + b;
    },
    'easeOutStrong': function (t, b, c, d) { //减减速运动
        return c * (1 - (t = 1 - t / d) * t * t) + b;
    },
    'easeBothStrong': function (t, b, c, d) { //加加速减减速运动
        return (t /= d / 2) < 1 ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    'elasticIn': function (t, b, c, d, a, p) { //弹性加速
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * 0.3;
        if (!a || a < Math.abs(c)) a = c;
        var s = !a || a < Math.abs(c) ? p / 4 : s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    'elasticOut': function (t, b, c, d, a, p) { //加速弹性
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * 0.3;
        if (!a || a < Math.abs(c)) a = c;
        var s = !a || a < Math.abs(c) ? p / 4 : s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    'elasticBoth': function (t, b, c, d, a, p) { //弹性加速弹性
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (0.3 * 1.5);
        if (!a || a < Math.abs(c)) a = c;
        var s = !a || a < Math.abs(c) ? p / 4 : s = p / (2 * Math.PI) * Math.asin(c / a);
        return t < 1 ? -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b : a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    'backIn': function (t, b, c, d) { //回退加速
        var s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    'backOut': function (t, b, c, d) { //加速回退
        var s = 3.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    'backBoth': function (t, b, c, d) { //回退加速回退
        var s = 1.70158;
        return (t /= d / 2) < 1 ? c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b :
            c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    'bounceIn': function (t, b, c, d) { //弹球加速
        return c - moveType['bounceOut'](d - t, 0, c, d) + b;
    },
    'bounceOut': function (t, b, c, d) { //加速弹球
        if ((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b;
        if (t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        if (t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    },
    'bounceBoth': function (t, b, c, d) { //弹球加速弹球
        return t < d / 2 ? moveType['bounceIn'](t * 2, 0, c, d) * 0.5 + b :
            moveType['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
};

//基于css()函数的运动框架
function tweenMove(time, obj, json, type, endFn) {
    var fn = moveType[type];
    var t = 0;
    var b = {};
    var c = {};
    var d = time / 24;
    var attr = '';
    clearInterval(obj.timer);
    for (attr in json) {
        b[attr] = css(obj, attr);
        c[attr] = json[attr] - b[attr];
    }
    if (time < 30) {
        for (attr in json) {
            css(obj, attr, json[attr]);
        }
    } else {
        obj.timer = setInterval(function () {
            if (t < d) {
                t++;
                for (attr in json) {
                    css(obj, attr, fn(t, b[attr], c[attr], d));
                }
            } else {
                for (attr in json) {
                    css(obj, attr, json[attr]);
                }
                clearInterval(obj.timer);
                endFn && endFn.call(obj);
            }
        }, 1000 / 60);
    }
};

//设置css样式
function css(obj, attr, value) {
    if (arguments.length == 2) {
        if (attr == 'scale' || attr == 'rotate' || attr == 'rotateX' || attr == 'rotateY' || attr == 'scaleX' || attr == 'scaleY' || attr == 'translateY' || attr == 'translateX') {
            if (!obj.$Transform) obj.$Transform = {};
            switch (attr) {
                case 'scale':
                case 'scaleX':
                case 'scaleY':
                    return typeof (obj.$Transform[attr]) == 'number' ? obj.$Transform[attr] : 100;
                    break;
                default:
                    return obj.$Transform[attr] ? obj.$Transform[attr] : 0;
            }
        }
        var current = getStyle(obj, attr);
        return attr == 'opacity' ? Math.round(parseFloat(current) * 100) : parseInt(current);
    } else if (arguments.length == 3) {
        switch (attr) {
            case 'scale':
            case 'scaleX':
            case 'scaleY':
            case 'rotate':
            case 'rotateX':
            case 'rotateY':
            case 'translateZ':
            case 'translateX':
            case 'translateY':
                setCss3(obj, attr, value);
                break;
            case 'width':
            case 'height':
            case 'paddingLeft':
            case 'paddingTop':
            case 'paddingRight':
            case 'paddingBottom':
                value = Math.max(value, 0);
            case 'left':
            case 'top':
            case 'marginLeft':
            case 'marginTop':
            case 'marginRight':
            case 'marginBottom':
                obj.style[attr] = typeof (value) == 'string' ? value : value + 'px';
                break;
            case 'opacity':
                obj.style.filter = "alpha(opacity:" + value + ")";
                obj.style.opacity = value / 100;
                break;
            default:
                obj.style[attr] = value;
        }
    }
    return function (attr_in, value_in) { css(obj, attr_in, value_in) };
};

//兼容css3样式
function setCss3(obj, attr, value) {
    var val = '';
    var arr = ['Webkit', 'Moz', 'O', 'ms', ''];
    if (!obj['$Transform']) {
        obj['$Transform'] = {};
    }
    obj['$Transform'][attr] = Type(value) == 'number' ? parseInt(value) : value;
    for (var currentAttr in obj['$Transform']) {
        switch (currentAttr) {
            case 'scale':
            case 'scaleX':
            case 'scaleY':
                val += currentAttr + '(' + (obj['$Transform'][currentAttr] / 100) + ')';
                break;
            case 'rotate':
            case 'rotateX':
            case 'rotateY':
                val += currentAttr + '(' + (obj['$Transform'][currentAttr]) + 'deg)';
                break;
            case 'translate3d':
                val += currentAttr + '(' + (obj['$Transform'][currentAttr]) + ')';
                break;
            case 'translateX':
            case 'translateY':
            case 'translateZ':
                val += currentAttr + '(' + (obj['$Transform'][currentAttr]) + 'px)';
                break;
        }
    }
    for (var i = 0; i < arr.length; i++) {
        obj.style[arr[i] + 'Transform'] = val;
    }
};

/*
    2.2、轮播相关
*/

//项目常用插件-->
//手机无缝轮播划屏插件
//obj(轮播图的父容器)，obj1（高亮的小点的父容器），styleClass（高亮小点的样式）
//moveType(运动类型)'linear' 'easeIn' 'easeOut' 'easeBoth' 'easeInStrong' 'easeOutStrong' 'easeBothStrong'-
//-'elasticIn' 'elasticOut' 'elasticBoth' 'backIn' 'backOut' 'backBoth' 'bounceIn' 'bounceOut' 'bounceBoth'
//t（轮播间隔），t1(轮播滚动时间)，t2（划屏滚动时间），t3（划屏后轮播延迟时间）
function autoplay(obj, obj1, styleClass, moveType, t, t1, t2, t3) {
    var oLi = obj.children;
    var aLi = obj1.children;
    var iW = oLi[0].offsetWidth;
    var iL = oLi.length * 2;
    var iLeft = 0;
    var iTop = 0;
    var lDis = 0;
    var tDis = 0;
    var oTime = 0;
    var iNow = 0;
    var index = 0;
    var iOld = 0;
    var str = '';
    var timer = null;
    var timer1 = null;

    obj.innerHTML += obj.innerHTML;
    obj.style.width = iW * iL + 'px';
    for (var i = 0; i < iL; i++) {
        oLi[i].style.width = iW + 'px';
    }

    for (var i = 0; i < iL / 2; i++) {
        str += '<li></li>';
    }
    obj1.innerHTML = str;
    var iW1 = obj1.offsetWidth;
    obj1.style.marginLeft = -iW1 / 2 + 'px';
    aLi[0].classList.add(styleClass);

    if (iNow == 0) {
        iNow = iL / 2;
        css(obj, 'translateX', -iW * iL / 2);
    }
    bind(obj, 'touchstart', fn2);

    function fn2(ev) {
        var ev = ev || event;
        clearInterval(timer);
        iLeft = ev.changedTouches[0].pageX;
        iTop = ev.changedTouches[0].pageY;
        oTime = +new Date();

        iOld = css(obj, 'translateX');
        bind(obj, 'touchmove', pDef);
        bind(obj1, 'touchmove', pDef);
    };

    bind(obj, 'touchmove', fn3);

    function fn3(ev) {
        var ev = ev || event;
        lDis = ev.changedTouches[0].pageX - iLeft;
        tDis = ev.changedTouches[0].pageY - iTop;
        var condition = Math.abs(lDis) - Math.abs(tDis);

        if (condition < 0) {
            unbind(obj, 'touchmove', pDef);
            unbind(obj1, 'touchmove', pDef);
        } else {
            css(obj, 'translateX', iOld + lDis);
        }
    };

    bind(obj, 'touchend', fn4);

    function fn4() {
        var tDis = +new Date() - oTime;

        if (Math.abs(lDis / iW) > 0.3 || tDis < 300 && Math.abs(lDis) > 30) {
            lDis < 0 ? iNow++ : iNow--;
            fn();
            lDis = 0;
        }

        tweenMove(t2, obj, { 'translateX': -iNow * iW }, moveType, function () {
            iOld = css(obj, 'translateX');
        });
        unbind(obj, 'touchmove', pDef);
        unbind(obj1, 'touchmove', pDef);
    };

    bind(document, 'touchmove', goOn);
    bind(document, 'touchend', goOn);

    function goOn() {
        clearTimeout(timer1);
        timer1 = setTimeout(fn1, t3);
    };

    fn1();

    function fn1() {
        clearInterval(timer);
        timer = setInterval(function () {
            iNow++;
            fn();
            tweenMove(t1, obj, { 'translateX': -iNow * iW }, moveType);
        }, t);
    };

    function fn() {
        if (iNow > iL / 2) {
            iNow %= iL / 2;
            css(obj, 'translateX', 0 + lDis);
        } else if (iNow < 1) {
            iNow = iL / 2;
            css(obj, 'translateX', -iW * (iL / 2 + 1) + lDis);
        }
        index = iNow % (iL / 2);
        for (var i = 0; i < aLi.length; i++) {
            aLi[i].classList.remove(styleClass);
        }
        aLi[index].classList.add(styleClass);
    };
};

//手机无缝滚动插件（可以不给左右按钮）
//obj（滚动的父容器）
//msec（定时器发生频率单位毫秒），dis（滚动一次的距离）
//lB,rB（左右按钮，可以暂定和控制滚动方向）
function autoplay1(obj, mses, dis, lB, rB) {
    var oLi = obj.children;
    var iW = oLi[0].offsetWidth;
    var timer = null;

    obj.innerHTML += obj.innerHTML;
    obj.style.width = oLi[0].offsetWidth * oLi.length + 'px';
    fn();

    function fn() {
        timer = setInterval(function () {
            if (obj.offsetLeft < -obj.offsetWidth / 2) {
                obj.style.left = 0 + 'px';
            } else if (obj.offsetLeft > 0) {
                obj.style.left = -obj.offsetWidth / 2 + 'px';
            }
            obj.style.left = obj.offsetLeft + dis + 'px';
        }, mses);
    };

    if (lB && rB) {
        bind(lB, 'click', fn1);

        function fn1() {
            dis = -Math.abs(dis);
            fn3();
        };
        bind(rB, 'click', fn2);

        function fn2() {
            dis = Math.abs(dis);
            fn3();
        };
    }

    function fn3() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        } else {
            fn();
        }
    };
};

//电脑无缝滚动插件
//obj(轮播的父容器)
//prev(上一张的按钮)
//next(下一张的按钮)
//moveType(运动形式)
//t(轮播的间隔时间)
//t1(轮播一次的时间)
function autoplay2(obj, prev, next, moveType, t, t1) {
    var oLi = obj.children;
    var iW = oLi[0].offsetWidth;
    var iNow = 0;
    var over = false;
    var timer = null;

    obj.innerHTML += obj.innerHTML;
    obj.style.width = oLi.length * iW + 'px';
    prev.onclick = function () {
        if (over) return;
        over = true;
        iNow++;
        fn();
    };
    next.onclick = function () {
        if (over) return;
        over = true;
        iNow--;
        fn();
    };
    obj.onmouseover = prev.onmouseover = next.onmouseover = function () {
        clearInterval(timer);
    };
    obj.onmouseout = prev.onmouseout = next.onmouseout = function () {
        fn1();
    };

    fn1();

    function fn1() {
        clearInterval(timer);
        timer = setInterval(prev.onclick, t);
    };

    function fn() {
        if (iNow > oLi.length / 2) {
            iNow %= oLi.length / 2;
            css(obj, 'translateX', 0);
        } else if (iNow < 0) {
            iNow = oLi.length / 2 - 1;
            css(obj, 'translateX', -iW * oLi.length / 2);
        }
        tweenMove(t1, obj, { 'translateX': -iW * iNow }, moveType, function () {
            over = false;
        });
    };
};

//导航栏滑动插件
//obj（要滑动的容器）
//styleClass（高亮选中样式的类名）
//moveType（滑动的运动形式）
//t（每次滑动到达目标的运动时间）
function slide(obj, styleClass, moveType, t) {
    var oA = obj.children;
    var iW = oA[0].offsetWidth;

    obj.style.width = iW * oA.length + 'px';
    for (var i = 0; i < oA.length; i++) {
        oA[i].style.width = iW + 'px';
    }
    var iMin = -(obj.offsetWidth - document.documentElement.clientWidth);

    for (var i = 0; i < oA.length; i++) {
        if (oA[i].className == styleClass) {
            var iNowLeft = -oA[i].offsetLeft;

            if (iNowLeft < iMin) iNowLeft = iMin;
            tweenMove(t, obj, { 'translateX': iNowLeft }, moveType);
        }
    }
    bind(obj, 'touchstart', fn);

    function fn(ev) {
        var ev = ev || event;
        var iLeft = ev.changedTouches[0].pageX - css(obj, 'translateX');

        bind(obj, 'touchmove', fn1);

        function fn1(ev) {
            var ev = ev || event;
            var iDis = ev.changedTouches[0].pageX - iLeft;

            if (iDis > 0) iDis = 0;
            if (iDis < iMin) iDis = iMin;
            tweenMove(t, obj, { 'translateX': iDis }, moveType);
        };
    };
    bind(obj, 'touchmove', pDef);
};

//划屏惯性滚动插件（防隐藏元素）
//obj（要滑动的容器）
//msec（手指抬起时模拟惯性定时器的频率，不写默认为1000/60）
function slide1(obj, msec, n) {
    var oA = obj.children;
    var iW = parseInt(getStyle(oA[0], 'width'));
    var iLeft = 0;
    var iL = 0;
    var iT = 0;
    var iDX = 0;
    var iDX1 = 0;
    var iS = 0;
    var iX = 0;
    var iY = 0;
    var iC = 0;
    var timer = null;

    obj.style.width = iW * oA.length + 'px';
    for (var i = 0; i < oA.length; i++) {
        oA[i].style.width = iW + 'px';
    }
    var iMin = -(parseInt(getStyle(obj, 'width')) - parseInt(getStyle(obj.parentNode, 'width')));

    bind(obj, 'touchstart', fn);

    function fn(ev) {
        var ev = ev || event;

        iLeft = ev.changedTouches[0].pageX - css(obj, 'translateX');
        iL = ev.changedTouches[0].pageX;
        iT = ev.changedTouches[0].pageY;
        bind(obj, 'touchmove', pDef);
    };

    bind(obj, 'touchmove', fn1);

    function fn1(ev) {
        var ev = ev || event;

        iDX = ev.changedTouches[0].pageX - iLeft;
        iX = ev.changedTouches[0].pageX - iL;
        iY = ev.changedTouches[0].pageY - iT;
        iS = iDX - iDX1;
        iDX1 = iDX;
        iC = Math.abs(iX) - Math.abs(iY);

        iC > 0 ? fn3() : unbind(obj, 'touchmove', pDef);
    };

    function fn3() {
        if (iDX > 0) {
            iDX = 0;
            clearInterval(timer);
        }
        if (iDX < iMin) {
            iDX = iMin;
            clearInterval(timer);
        }
        css(obj, 'translateX', iDX);
    };

    bind(obj, 'touchend', fn2);

    function fn2() {
        if (iC > 0) {
            iS = iS * (n || 2);
            clearInterval(timer);
            timer = setInterval(function () {
                iDX += iS;
                iS < 0 ? iS++ : iS--;
                fn3();
                if (Math.abs(iS) < 1) clearInterval(timer);
            }, msec || 1000 / 60);
        }
    };
};

//两点滑动插件
//obj（要滑动的容器）
//t（到最大或最小位置的运动时间，不写默认为500毫秒）
function slide2(obj, t) {
    var iLeft = 0;
    var iLate = 0;
    var iL = 0;
    var iT = 0;
    var iDX = 0;
    var iDX1 = 0;
    var iS = 0;
    var iX = 0;
    var iY = 0;
    var iC = 0;
    var iTime = 0;
    var iW = document.documentElement.clientWidth;
    var iMin = -(obj.offsetWidth - iW);

    bind(obj, 'touchstart', fn);

    function fn(ev) {
        var ev = ev || event;

        iTime = +new Date();
        iLate = css(obj, 'translateX');
        iLeft = ev.changedTouches[0].pageX - iLate;
        iL = ev.changedTouches[0].pageX;
        iT = ev.changedTouches[0].pageY;
        bind(obj, 'touchmove', pDef);
    };

    bind(obj, 'touchmove', fn1);

    function fn1(ev) {
        var ev = ev || event;

        iDX = ev.changedTouches[0].pageX - iLeft;
        iX = ev.changedTouches[0].pageX - iL;
        iY = ev.changedTouches[0].pageY - iT;
        iS = iDX - iDX1;
        iDX1 = iDX;
        iC = Math.abs(iX) - Math.abs(iY);

        iC > 0 ? fn3() : unbind(obj, 'touchmove', pDef);
    };

    function fn3() {
        if (iDX > 0) iDX = 0;
        if (iDX < iMin) iDX = iMin;

        css(obj, 'translateX', iDX);
    };

    bind(obj, 'touchend', fn2);

    function fn2() {
        if (iC > 0) {
            var iDW = 0;
            var tDis = +new Date() - iTime;

            if (Math.abs(iX) > iW / 3 || tDis < 300 && Math.abs(iX) > 30) {
                iDW = iX < 0 ? iMin : 0;
                tweenMove(t || 500, obj, { 'translateX': iDW }, 'linear');
            } else {
                tweenMove(t || 500, obj, { 'translateX': iLate }, 'linear');
            }
        }
    };
};

//手机划屏翻页插件
//obj(轮播图的父容器)，obj1（高亮的小点的父容器），styleClass（高亮小点的样式）
//t（划屏滚动时间）
function slide3(obj, obj1, styleClass, t) {
    var oLi = obj.children;
    var aLi = obj1.children;
    var iW = oLi[0].offsetWidth;
    var iL = oLi.length;
    var iLeft = 0;
    var iTop = 0;
    var lDis = 0;
    var tDis = 0;
    var oTime = 0;
    var iNow = 0;
    var index = 0;
    var iOld = 0;
    var str = '';

    obj.style.width = iW * iL + 'px';
    for (var i = 0; i < iL; i++) {
        oLi[i].style.width = iW + 'px';
    }

    for (var i = 0; i < iL; i++) {
        str += '<li></li>';
    }
    obj1.innerHTML = str;
    var iW1 = obj1.offsetWidth;
    obj1.style.marginLeft = -iW1 / 2 + 'px';
    aLi[0].classList.add(styleClass);

    bind(obj, 'touchstart', fn2);

    function fn2(ev) {
        var ev = ev || event;

        iLeft = ev.changedTouches[0].pageX;
        iTop = ev.changedTouches[0].pageY;
        oTime = +new Date();

        iOld = css(obj, 'translateX');
        bind(obj, 'touchmove', pDef);
        bind(obj1, 'touchmove', pDef);
    };

    bind(obj, 'touchmove', fn3);

    function fn3(ev) {
        var ev = ev || event;
        lDis = ev.changedTouches[0].pageX - iLeft;
        tDis = ev.changedTouches[0].pageY - iTop;
        var condition = Math.abs(lDis) - Math.abs(tDis);

        if (condition < 0) {
            unbind(obj, 'touchmove', pDef);
            unbind(obj1, 'touchmove', pDef);
        } else {
            if (css(obj, 'translateX') >= 0 && lDis > 0 || css(obj, 'translateX') <= -iW * (iL - 1) && lDis < 0) {
                lDis /= 3;
            }
            css(obj, 'translateX', iOld + lDis);
        }
    };

    bind(obj, 'touchend', fn4);

    function fn4() {
        var tDis = +new Date() - oTime;

        if (Math.abs(lDis / iW) > 0.3 || tDis < 300 && Math.abs(lDis) > 30) {
            lDis < 0 ? iNow++ : iNow--;
            fn();
            lDis = 0;
        }

        tweenMove(t, obj, { 'translateX': -iNow * iW }, 'linear', function () {
            iOld = css(obj, 'translateX');
        });
        unbind(obj, 'touchmove', pDef);
        unbind(obj1, 'touchmove', pDef);
    };

    function fn() {
        if (iNow > iL - 1) {
            iNow = iL - 1;
        } else if (iNow < 0) {
            iNow = 0;
        }
        index = iNow;
        for (var i = 0; i < aLi.length; i++) {
            aLi[i].classList.remove(styleClass);
        }
        aLi[index].classList.add(styleClass);
    };
};

//公告滚动插件
//obj(要滚动的父容器)
//moveType(运动形式)
//t(滚动间隔)
//t1(滚动一次的时间)
function autoNotice(obj, moveType, t, t1) {
    var oLi = obj.children;
    var iL = oLi.length * 2;
    var iH = oLi[0].offsetHeight;
    var iNow = 0;

    obj.innerHTML += obj.innerHTML;
    yydTimer(function (clear) {
        iNow++;
        if (iNow > iL / 2) {
            iNow = 1;
            css(obj, 'translateY', 0);
        }
        tweenMove(t1 || 1000, obj, { 'translateY': -iNow * iH }, moveType);
    }, t || 2000);
};

//横向公告滚动插件
//obj(要滚动的父容器)
//dis(每次运动的距离)
//msec(定时器频率)
function autoNotice1(obj, dis, msec) {
    var oLi = obj.children;
    var iL = oLi.length * 2;
    var iW = 0;
    var iNow = 0;

    obj.innerHTML += obj.innerHTML;
    for (var i = 0; i < obj.children.length; i++) {
        iW = obj.children[i].offsetWidth * iL;
    }
    obj.style.width = iW + 'px';

    yydTimer(function (clear) {
        if (css(obj, 'translateX') <= -iW / 2) {
            css(obj, 'translateX', -14);
        }
        css(obj, 'translateX', css(obj, 'translateX') - (dis || 1));
    }, msec || 1000 / 60);
};

//手机模拟滚动插件(body定为一屏幕的高度)
//obj（要滚动的容器）
//sFn（touchstart回调）
//mFn（touchmove回调）
//eFn（touchend回调）
function pageScroll(obj, sFn, mFn, eFn) {
    var iMin = document.documentElement.clientHeight - parseInt(getStyle(obj, 'height'));
    var iTop = 0;
    var iDisY = 0;
    var iY = 0;
    var iY1 = 0;
    var iS = 0;
    var sY = 0;
    var oldY = 0;
    var timer = null;

    bind(obj, 'touchstart', function (ev) {
        var ev = ev || event;
        sY = ev.changedTouches[0].pageY;
        sFn && sFn.call(this, sY);
    });
    bind(obj, 'touchmove', function (ev) {
        var ev = ev || event;
        iDisY = ev.changedTouches[0].pageY - sY;
        iY = ev.changedTouches[0].pageY - sY + oldY;
        iS = iY - iY1;
        iY1 = iY;

        if (css(obj, 'translateY') > 0 || css(obj, 'translateY') < iMin) {
            iDisY /= 5;
        }
        iTop = oldY + iDisY;
        if (iTop > 50) iTop = 50;
        if (iTop < iMin - 50) iTop = iMin - 50;
        css(obj, 'translateY', iTop);
        mFn && mFn.call(this, iTop);
    });

    function fn1() {
        if (iY > 0) {
            iY = 0;
            clearInterval(timer);
        }
        if (iY < iMin) {
            iY = iMin;
            clearInterval(timer);
        }
        css(obj, 'translateY', iY);
    };
    bind(obj, 'touchend', function (ev) {
        var ev = ev || event;

        if (css(obj, 'translateY') > 0) {
            tweenMove(500, obj, { 'translateY': 0 }, 'linear', function () {
                oldY = css(obj, 'translateY');
            });
        } else if (css(obj, 'translateY') < iMin) {
            tweenMove(500, obj, { 'translateY': iMin }, 'linear', function () {
                oldY = css(obj, 'translateY');
            });
        } else {
            oldY = css(obj, 'translateY');
        }

        iS = iS;
        clearInterval(timer);
        timer = setInterval(function () {
            iY += iS;
            iS < 0 ? iS++ : iS--;
            fn1();
            if (Math.abs(iS) < 1) clearInterval(timer);
        }, 1000 / 60);
        eFn && eFn.call(this, oldY, iS);
    });
};

/*
    2.3、特效
*/

//生成变色字体
//obj(包含字体的标签)
//color(变色字左边的颜色)
//color1(变色字右边的颜色)
//width(变色字左边的宽度，带上单位%或px)
function changeColorWords(obj, color, color1, width) {
    var arr = [];
    var str = '';
    var color = color || 'red';
    var color1 = color1 || 'blue';
    var width = width || '50%';
    var reg = /<!--(.|\n)+-->|\/\*(.|\n)+\*\/|\/\/(.|\n)+|\n+|\r|\s/g;

    arr = obj.innerHTML.replace(reg, '').split('');
    for (var i = 0; i < arr.length; i++) {
        str += '<i><b>' + arr[i] + '</b>' + arr[i] + '</i>';
    }
    obj.innerHTML = str;
    var oI = obj.getElementsByTagName('i');
    var oB = obj.getElementsByTagName('b');
    for (var i = 0; i < oI.length; i++) {
        oI[i].style.cssText = 'float:left; height:100%; font-style:normal; color:' + color + '; position:relative;';
        oB[i].style.cssText = 'font-weight:normal; width:' + width + '; height:100%; color:' + color1 + '; position:absolute; left:0; top:0;overflow:hidden;';
    }
};

//模拟水印效果插件
//msec(水印运动的频率)
//obj(产生水印效果的容器)
//iDis(水印每步运动的距离)
//color(水印的颜色)
//color1(水印背景颜色)
//endFn(回调函数用来触发链接)
/*配置waterWave(20,oLi,5,'#ddd','#eee');*/
function waterWave(msec, obj, iDis, color, color1, endFn) {
    var timer = null;
    var timer1 = null;
    var iLeft = 0;
    var iTop = 0;
    var iNum1 = 0;
    var iNum2 = 0;
    var iDate = 0;
    var click = false;

    obj.style.userSelect = 'none';
    bind(obj, 'touchstart', fn1);

    function fn1(ev) {
        clearInterval(timer);
        var ev = ev || event;
        click = false;

        iNum1 = 0;
        iNum2 = 0;
        iLeft = ev.changedTouches[0].pageX - getPos(obj, 'left');
        iTop = ev.changedTouches[0].pageY - getPos(obj, 'top');

        timer = setInterval(function () {
            iNum1 += iDis;
            obj.style.backgroundImage = 'radial-gradient(circle at ' + iLeft + 'px ' + iTop + 'px,' + color + ' ' + (iNum1) + '%, #eee 0%)';
            if (iNum1 >= 100) {
                clearInterval(timer);
                setTimeout(function () {
                    obj.style.background = 'none';
                }, 1000);
            }
        }, msec);
    };

    bind(obj, 'touchmove', function () {
        clearInterval(timer);
        obj.style.background = 'none';
    });

    bind(obj, 'touchend', fn2);

    function fn2() {
        clearInterval(timer);
        clearInterval(timer1);
        iNum2 = 100 - iNum1;
        timer1 = setInterval(function () {
            iNum1 += Math.floor(iNum2 / 5);

            obj.style.background = 'radial-gradient(circle at ' + iLeft + 'px ' + iTop + 'px,' + color + ' ' + (iNum1) + '%, ' + color1 + ' 0%) no-repeat ';
            if (iNum1 >= 100) {
                clearInterval(timer);
                clearInterval(timer1);
                obj.style.background = 'none';
                if (click) {
                    setTimeout(function () {
                        endFn && endFn.call(obj);
                    }, 50);
                }
            }
        }, 20);
    };

    bind(obj, 'contextmenu', pDef);
    bind(obj, 'click', function () {
        click = true;
        fn2();
    });
};

//抛物线运动插件(公式：y=ax^2+bx+c)
//obj(要运动的对象)
//a(曲率，为正开口向下，负开口向上，默认0.001)
//t(抛物线运动的总时间)
//t1(定时器的频率)
//sLeft(运动开始的x轴位置)
//sTop(运动开始的y轴位置)
//eLeft(运动结束的x轴位置)
//eTop(运动结束的y轴位置)
//stepFn(运动过程中的回调函数)
//endFn(运动结束后的回调函数)
function fly(obj, a, t, t1, sLeft, sTop, eLeft, eTop, stepFn, endFn) {
    var a = a || 0.001;
    var sLeft = sLeft || 0;
    var sTop = sTop || 0;
    var eLeft = eLeft || 200;
    var eTop = eTop || 200;

    var timer = null;
    var sT = +new Date();
    var t = t || 500;
    var eT = sT + t;
    var x = eLeft - sLeft;
    var y = eTop - sTop;
    var b = (y - a * x * x) / x;

    obj.style.position = 'absolute';
    obj.style.opacity = 0;
    obj.style.filter = 'alpha(opacity:0)';
    clearInterval(timer);
    timer = setInterval(function () {
        var nT = +new Date();

        obj.style.opacity = 100;
        obj.style.filter = 'alpha(opacity:100)';
        if (nT > eT) { //当前时间大于结束时间就停止运动
            clearInterval(timer);
            css(obj, 'translateX', eLeft);
            css(obj, 'translateY', eTop);
            endFn && endFn.call(this);
        } else {
            var disX = x * (nT - sT) / t;
            var disY = a * disX * disX + b * disX;

            css(obj, 'translateX', sLeft + disX);
            css(obj, 'translateY', sTop + disY);
            stepFn && stepFn.call(this, sLeft + disX, sTop + disY);
        }
    }, t1 || 1000 / 60);
};


//对拟态类名(字符串样式)的操作，必须先用set方法
//该方法是为了在js里替代类似active状态操作类名样式
var yydStyle = {
    set: function (obj, str) {
        if (obj.getAttribute('style')) str = obj.getAttribute('style') + str;
        obj.setAttribute('style', str);
        this.str = str;
    },
    get: function () {
        return this.str;
    },
    remove: function (obj, str) {
        if (this.str) {
            this.str = this.str.replace(str, '');
            obj.setAttribute('style', this.str);
        }
    }
};

//滑动选项卡效果
//obj(选项的一组元素)
//str(可以修改滑动条的样式，样式字符串)
//endFn(回调函数，返回选中的索引，用于切换内容)
function yydTabBar(obj, str, endFn) {
    var oldIndex = 0;
    var obj1 = document.createElement('div');
    var barStyle = 'height: 3px; background-color: #f20532; position: absolute; left: 0; right: 100%; bottom: 0;';
    var forward = 'transition: right 0.3s cubic-bezier(0.61, 0.01, 0.25, 1), left 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s; -webkit-transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1), left 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s;';
    var backward = 'transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s, left 0.3s cubic-bezier(0.35, 0, 0.25, 1); -webkit-transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s, left 0.3s cubic-bezier(0.35, 0, 0.25, 1);';

    if (str) barStyle += str;
    obj1.setAttribute('style', barStyle);
    obj[0].parentNode.appendChild(obj1);
    for (var i = 0; i < obj.length; i++) {
        obj[i].index = i;
    }
    for (var i = 0; i < obj.length; i++) {
        obj[i].onclick = function () {
            var iLeft = this.offsetLeft;
            var iRight = document.documentElement.clientWidth - (this.offsetLeft + this.offsetWidth);
            var index = this.index;

            function clear() {
                for (var i = 0; i < obj.length; i++) {
                    obj[i].classList.remove('active');
                }
            };
            if (index != oldIndex) {
                oldIndex = index;
                clear();
                yydStyle.remove(obj1, forward);
                yydStyle.remove(obj1, backward);
                index > oldIndex ? yydStyle.set(obj1, forward) : yydStyle.set(obj1, backward);
                setTimeout(function () {
                    obj1.style.left = iLeft + 'px';
                    obj1.style.right = iRight + 'px';
                });
                setTimeout(function () {
                    clear();
                    obj[index].classList.add('active');
                }, 300);
                endFn && endFn(index);
            }
        };
    }
};

//文字蛛网效果
//obj(生成蛛网效果文字的父容器)
//scaleC(文字半径的比例，越大影响的文字越多)
//scaleB(文字便宜的比例，越大文字偏移得越大)
function cobweb(obj, scaleC, scaleB) {
    var str = '';
    var iW = parseInt(getStyle(obj, 'width'));
    var iH = parseInt(getStyle(obj, 'height'));
    var text = obj.innerText.trim();

    for (var i = 0; i < text.length; i++) {
        str += '<span>' + text[i] + '</span>';
    };

    obj.style.width = iW + 'px';
    obj.style.height = iH + 'px';
    obj.innerHTML = str;
    layoutChange(obj.children);

    for (var i = 0; i < obj.children.length; i++) {
        obj.children[i].top = obj.children[i].offsetTop;
    }

    obj.onmouseover = function (ev) {
        var sX = ev.clientX;
        var sY = ev.clientY;

        obj.onmousemove = function (ev) {
            var mX = ev.clientX;
            var mY = ev.clientY - sY;

            for (var i = 0; i < obj.children.length; i++) {
                var a = mX - obj.children[i].offsetLeft;
                var c = mY * (scaleC || 3);
                var b = Math.sqrt(c * c - a * a);

                b = mY > 0 ? b : -b;
                var iDis = obj.children[i].top + b * (scaleB || .3);

                obj.children[i].style.top = iDis + 'px';
            }

            obj.onmouseout = function () {
                for (var i = 0; i < obj.children.length; i++) {
                    allMove(300, obj.children[i], { 'top': obj.children[i].top }, 'bounceOut')
                }
            };
        };
    };
};

//照片墙拖拽
//obj(一组图片元素)
//endFn(返回交换位置的两个索引)
function imgDrag(obj, endFn, startFn) {
    var iZIndex = 0;
    var aPos = [];
    var iMin = 0;
    var iMinIndex = -1;
    var aPosIndex = 0;
    var dObj = [];

    for (i = 0; i < obj.length; i++) {
        obj[i].setAttribute('style', '');
        aPos[i] = { left: obj[i].offsetLeft, top: obj[i].offsetTop };
        obj[i].index = i;
    }
    startFn && startFn(aPos);

    window.sessionStorage.setItem('yydImgDragAPos', JSON.stringify(aPos));
    layoutChange(obj);

    function removeItem() {
        window.sessionStorage.removeItem('yydImgDragOnOff');
    };
    window.onunload = removeItem;
    window.onhashchange = removeItem;
    if (window.sessionStorage.getItem('yydImgDragOnOff')) {
        dObj = [obj[obj.length - 1]];
    } else {
        dObj = obj;
    }
    window.sessionStorage.setItem('yydImgDragOnOff', true);

    for (var i = 0; i < dObj.length; i++) {
        drag(dObj[i], null, null, null, null, null, function () {

            iMin = Infinity;
            iMinIndex = -1;

            try {
                obj = obj[0].parentNode.getElementsByClassName(obj[0].className.split(' ')[0]);
                if (iZIndex > 100) {
                    for (i = 0; i < obj.length; i++) {
                        obj[i].style.zIndex = 0;
                    }
                    window.sessionStorage.setItem('yydImgDragIZIndex', 0);
                }
                if (window.sessionStorage.getItem('yydImgDragIZIndex')) {
                    iZIndex = window.sessionStorage.getItem('yydImgDragIZIndex');
                }
                this.style.zIndex = iZIndex++;
                window.sessionStorage.setItem('yydImgDragIZIndex', iZIndex);
            } catch (e) {}

            for (var i = 0; i < obj.length; i++) {
                var a = css(this, 'left') - css(obj[i], 'left');
                var b = css(this, 'top') - css(obj[i], 'top');
                var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

                obj[i].classList.remove('active');
                if (this == obj[i]) {
                    continue;
                } else if (collide(this, obj[i]) && c < iMin) {
                    iMin = c;
                    iMinIndex = i;
                }
            }
            if (iMinIndex != -1) obj[iMinIndex].classList.add('active');
        }, function () {
            var index = this.index;
            var aPosIndex = -1;

            if (window.sessionStorage.getItem('yydImgDragAPos')) {
                aPos = JSON.parse(window.sessionStorage.getItem('yydImgDragAPos'));
            }

            try {
                obj = obj[0].parentNode.getElementsByClassName(obj[0].className.split(' ')[0]);
            } catch (e) {}

            try {
                if (iMinIndex != -1) {
                    aPosIndex = obj[iMinIndex].index;

                    allMove(300, this, { 'left': aPos[aPosIndex].left, 'top': aPos[aPosIndex].top }, 'easeOut');
                    allMove(300, obj[iMinIndex], { 'left': aPos[index].left, 'top': aPos[index].top }, 'easeOut');
                    obj[iMinIndex].classList.remove('active');

                    this.index = aPosIndex;
                    obj[iMinIndex].index = index;
                } else {
                    allMove(300, this, { 'left': aPos[index].left, 'top': aPos[index].top }, 'easeOut');
                }
            } catch (e) {}

            endFn && endFn(index, aPosIndex);
            iMinIndex = -1;
        });
    }
};

//生成3D文字球体，圆锥，圆柱，扭曲圆柱
//str（自定义文字，满42个才会生成，不然显示默认的）
//shape（定义生成球体的形状，0=球体，1=圆锥，2=圆柱，3=扭曲圆柱）
//width（生成容器的宽度，决定球体的相对宽度）
//t（动画定时器每次的时间）
//t1（自运动时间）
function setCss31(obj, attrObj) { //依赖此函数设置样式
    for (var i in attrObj) {
        var newi = i;

        if (newi.indexOf("-") > 0) {
            var num = newi.indexOf("-");

            newi = newi.replace(newi.substr(num, 2), newi.substr(num + 1, 1).toUpperCase());
        }

        obj.style[newi] = attrObj[i];
        newi = newi.replace(newi.charAt(0), newi.charAt(0).toUpperCase());
        obj.style["webkit" + newi] = attrObj[i];
        obj.style["moz" + newi] = attrObj[i];
        obj.style["o" + newi] = attrObj[i];
        obj.style["ms" + newi] = attrObj[i];
    }
};

function solid(str, shape, width, t, t1) {
    var s = '自定义文字一定要满四十二个字 自定义文字一定要满四十二个字 自定义文字一定要满四十二个字 自定义文字一定要满四十二个字 自定义文字一定要满四十二个字 自定义文字一定要满四十二个字';
    if (str && str.length > 41) s = str;
    var oDiv = document.createElement('div');
    var oUl = document.createElement('ul');
    var aLi = oUl.getElementsByTagName('li');
    var r = width / 3 || 100;
    var circleArr = [];
    var coneArr = [];
    var coneNum = 0;
    var wordNum = -1;
    var liNub = 0;
    var theta = 0;
    var phi = 0;
    var layer = 0;
    var num = 0;
    var iTimer2 = 0;
    var graph = 1;
    var columnH = 0;
    var columnNum = 0;

    oDiv.className = 'solid';
    oDiv.style.cssText = 'width:300px;height:300px;margin:0 auto;color:#00a0e9;position:relative;left:0;top:0;';
    oUl.style.cssText = 'margin:0;padding:0;width:100%;height:100%;position: relative;transform-style:preserve-3d;-webkit-transform-style:preserve-3d; perspective-origin:center center;-webkit-perspective-origin:center center;';
    oDiv.style.width = (width || 300) + 'px';
    oDiv.style.height = (width || 300) + 'px';
    oDiv.appendChild(oUl);
    document.body.appendChild(oDiv);

    var iW = oDiv.offsetWidth / 2;
    var dW = document.documentElement.clientWidth * 2;

    start();

    function start() {
        circleArr = [];
        coneArr = [];
        coneNum = 0;
        wordNum = -1;
        liNub = 0;
        theta = 0;
        phi = 0;
        layer = 0;
        num = 0;
        graph = 1;

        for (var i = 4; i < 13; i++) {
            num = i * i + (i + 1) * (i + 1);
            if (num >= s.length) {
                layer = (i - 1) * 2 + 1;
                break;
            }
            layer = (i - 1) * 2 + 1;
        }
        for (var i = 0; i < layer; i++) {
            if (i < (layer + 1) / 2) {
                wordNum += 2;
            } else {
                wordNum -= 2;
            }
            circleArr.push(wordNum);
        }

        num = 0;

        for (var i = 0; i < circleArr.length; i++) {
            theta = Math.PI / circleArr.length;
            phi = 2 * Math.PI / circleArr[i];
            for (var j = 0; j < circleArr[i]; j++) {
                var li = document.createElement('li');

                li.style.cssText = ' list-style:none;line-height:30px;text-align:center;font-size:16px;position:absolute;transition:all 0.5s;-webkit-transition:all 1s;';
                li.innerHTML = s[num];
                num++;
                drawCircle(li, theta, phi, i, j);
                oUl.appendChild(li);
            }
        }

        for (var i = 0; i < aLi.length; i++) {
            coneNum += 2 * i + 1;
            if (coneNum > aLi.length) {
                coneNum -= 2 * i + 1;
                break;
            }
            coneArr.push(2 * i + 1);
        }

        for (var i = 0; i < coneArr.length; i++) {
            phi = 2 * Math.PI / coneArr[i];
            for (var j = 0; j < coneArr[i]; j++) {
                drawCone(aLi[liNub], phi, i, j);
                liNub++;
            }
        }

        liNub = 0;
        columnH = Math.floor(aLi.length / (circleArr.length - 2));
        columnNum = columnH * (circleArr.length - 2);

        for (var i = 0; i < circleArr.length - 1; i++) {
            phi = 2 * Math.PI / columnH;
            for (var j = 0; j < columnH; j++) {
                drawColumn(aLi[liNub], phi, i, j);
                drawColumn2(aLi[liNub], phi, i, j);
                liNub++;
            }
        }

        for (var i = 0; i < aLi.length; i++) {
            setCss31(aLi[i], { transform: 'translate3D(' + aLi[i].circleX + 'px,' + aLi[i].circleY + 'px,' + aLi[i].circleZ + 'px) rotateY(' + aLi[i].circlePhi + 'rad) rotateX(' + (aLi[i].circleTheta - Math.PI / 2) + 'rad)' });
        }
    }

    function drawCircle(obj, theta, phi, i, j) {
        obj.circleX = r * Math.sin(theta * i) * Math.sin(phi * j) + iW;
        obj.circleY = -r * Math.cos(theta * i) + iW;
        obj.circleZ = r * Math.sin(theta * i) * Math.cos(phi * j);
        obj.circleTheta = theta * (circleArr.length - i);
        obj.circlePhi = phi * j;
        obj.bigCircleX = (r + dW) * Math.sin(theta * i) * Math.sin(phi * j) + iW;
        obj.bigCircleY = -(r + dW) * Math.cos(theta * i) + iW;
        obj.bigCircleZ = (r + dW) * Math.sin(theta * i) * Math.cos(phi * j);
        obj.maxX = obj.bigCircleX;
        obj.maxY = obj.bigCircleY;
        obj.maxZ = obj.bigCircleZ;
        obj.maxTheta = obj.circleTheta;
        obj.maxPhi = obj.circlePhi;
    }

    function drawCone(obj, phi, i, j) {
        obj.coneX = (2 * r / coneArr.length) * i * Math.tan(30 * Math.PI / 180) * Math.sin(phi * j) + iW;
        obj.coneY = (2 * r / coneArr.length) * i + r / 2;
        obj.coneZ = (2 * r / coneArr.length) * i * Math.tan(30 * Math.PI / 180) * Math.cos(phi * j);
        obj.coneTheta = Math.PI / 6;
        obj.conePhi = phi * j;
        obj.bigConeX = (2 * (r + dW) / coneArr.length) * i * Math.tan(30 * Math.PI / 180) * Math.sin(phi * j) + iW;
        obj.bigConeY = (2 * (r + dW) / coneArr.length) * i + r / 2 - dW;
        obj.bigConeZ = (2 * (r + dW) / coneArr.length) * i * Math.tan(30 * Math.PI / 180) * Math.cos(phi * j);
    }

    function drawColumn(obj, phi, i, j) {
        obj.columnX = r / 1.5 * Math.sin(phi * j) + iW;
        obj.columnY = (2 * r / (circleArr.length - 2)) * i + r / 2;
        obj.columnZ = (r / 1.5 * Math.cos(phi * j)).toFixed(2);
        obj.columnPhi = phi * j;
        obj.bigColumnX = (r + dW) / 1.5 * Math.sin(phi * j) + iW;
        obj.bigColumnY = (2 * (r + dW) / (circleArr.length - 2)) * i + r / 2 - dW;
        obj.bigColumnZ = ((r + dW) / 1.5 * Math.cos(phi * j)).toFixed(2);
    }

    function drawColumn2(obj, phi, i, j) {
        obj.column2X = r / 1.5 * Math.sin(phi * j + i * Math.PI / 180 * 8) + iW;
        obj.column2Y = (2 * r / (circleArr.length - 2)) * i + r / 2;
        obj.column2Z = (r / 1.5 * Math.cos(phi * j + i * Math.PI / 180 * 8)).toFixed(2);
        obj.column2Phi = phi * j + i * Math.PI / 180 * 8;
        obj.bigColumn2X = (r + dW) / 1.5 * Math.sin(phi * j + i * Math.PI / 180 * 8) + iW;
        obj.bigColumn2Y = (2 * (r + dW) / (circleArr.length - 2)) * i + r / 2 - dW;
        obj.bigColumn2Z = ((r + dW) / 1.5 * Math.cos(phi * j + i * Math.PI / 180 * 8)).toFixed(2);
    }

    function startChange() {
        for (var i = 0; i < aLi.length; i++) {
            setCss31(aLi[i], { transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' + aLi[i].maxPhi + 'rad) rotateX(' + (aLi[i].maxTheta - Math.PI / 2) + 'rad)' });
            aLi[i].style.opacity = 0;
        }
    }

    function changeCircle() {
        for (var i = 0; i < columnNum; i++) {
            aLi[i].maxX = aLi[i].bigCircleX;
            aLi[i].maxY = aLi[i].bigCircleY;
            aLi[i].maxZ = aLi[i].bigCircleZ;
            aLi[i].maxTheta = aLi[i].circleTheta;
            aLi[i].maxPhi = aLi[i].circlePhi;
            setCss31(aLi[i], { transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' + aLi[i].maxPhi + 'rad) rotateX(' + (aLi[i].maxTheta - Math.PI / 2) + 'rad)' });
        }

        setTimeout(function () {
            for (var i = 0; i < aLi.length; i++) {
                aLi[i].style.opacity = 1;
                setCss31(aLi[i], { transform: 'translate3D(' + aLi[i].circleX + 'px,' + aLi[i].circleY + 'px,' + aLi[i].circleZ + 'px) rotateY(' + aLi[i].circlePhi + 'rad) rotateX(' + (aLi[i].circleTheta - Math.PI / 2) + 'rad)' });
            }
        }, t || 100);
    }

    function changeCone() {
        for (var i = 0; i < coneNum; i++) {
            aLi[i].maxX = aLi[i].bigConeX;
            aLi[i].maxY = aLi[i].bigConeY;
            aLi[i].maxZ = aLi[i].bigConeZ;
            aLi[i].maxPhi = aLi[i].conePhi;
            aLi[i].maxTheta = aLi[i].coneTheta;
            setCss31(aLi[i], { transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' + aLi[i].maxPhi + 'rad) rotateX(' + aLi[i].maxTheta + 'rad)' });
        }

        setTimeout(function () {
            for (var i = 0; i < coneNum; i++) {
                aLi[i].style.opacity = 1;
                setCss31(aLi[i], { transform: 'translate3D(' + aLi[i].coneX + 'px,' + aLi[i].coneY + 'px,' + aLi[i].coneZ + 'px) rotateY(' + aLi[i].conePhi + 'rad) rotateX(' + aLi[i].coneTheta + 'rad)' });
            }
        }, t || 100)
    }

    function changeColumn() {
        for (var i = 0; i < columnNum; i++) {
            aLi[i].maxX = aLi[i].bigColumnX;
            aLi[i].maxY = aLi[i].bigColumnY;
            aLi[i].maxZ = aLi[i].bigColumnZ;
            aLi[i].maxTheta = 0;
            aLi[i].maxPhi = aLi[i].columnPhi;
            setCss31(aLi[i], { transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' + aLi[i].maxPhi + 'rad) rotateX(' + aLi[i].maxTheta + 'rad)' });
        }

        setTimeout(function () {
            for (var i = 0; i < columnNum; i++) {
                aLi[i].style.opacity = 1;
                setCss31(aLi[i], { transform: 'translate3D(' + aLi[i].columnX + 'px,' + aLi[i].columnY + 'px,' + aLi[i].columnZ + 'px) rotateY(' + aLi[i].columnPhi + 'rad)' });
            }
        }, t || 100);
    }

    function changeColumn2() {
        for (var i = 0; i < columnNum; i++) {
            aLi[i].maxX = aLi[i].bigColumn2X;
            aLi[i].maxY = aLi[i].bigColumn2Y;
            aLi[i].maxZ = aLi[i].bigColumn2Z;
            aLi[i].maxTheta = 0;
            aLi[i].maxPhi = aLi[i].column2Phi;
            setCss31(aLi[i], { transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' + aLi[i].maxPhi + 'rad) rotateX(' + aLi[i].maxTheta + 'rad)' });
        }

        setTimeout(function () {
            for (var i = 0; i < columnNum; i++) {
                aLi[i].style.opacity = 1;
                setCss31(aLi[i], { transform: 'translate3D(' + aLi[i].column2X + 'px,' + aLi[i].column2Y + 'px,' + aLi[i].column2Z + 'px) rotateY(' + aLi[i].column2Phi + 'rad)' });
            }
        }, t || 100)
    }

    startChange();
    switch (shape) {
        case 0:
            changeCircle();
            break;
        case 1:
            changeCone();
            break;
        case 2:
            changeColumn();
            break;
        case 3:
            changeColumn2();
            break;
        default:
            changeCircle();
    }

    oDiv.onmousedown = function (ev) {
        clearInterval(iTimer);
        var e = ev || event;
        var clickX = e.clientX;
        var clickY = e.clientY;
        var disX = 0;
        var disY = 0;

        document.onmousemove = function (ev) {
            var e = ev || event;
            disX = e.clientX - clickX;
            disY = e.clientY - clickY;
            setCss31(oUl, { transform: 'rotateX(' + (angleX - disY) + 'deg) rotateY(' + (angleY + disX) + 'deg)' });
        }

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            angleX = angleX - disY;
            angleY = angleY + disX;
            if (disY == 0 && disX == 0) {
                disX = -iW;
            }
            iTimer = setInterval(function () {
                angleX -= disY / 100;
                angleY += disX / 100;
                setCss31(oUl, { transform: 'rotateX(' + angleX + 'deg) rotateY(' + angleY + 'deg)' });
            }, t1 || 60);
        }
        return false;
    };

    var angleX = 0;
    var angleY = 0;
    var iTimer = setInterval(function () {
        angleY -= 1;
        setCss31(oUl, { transform: 'rotateX(' + angleX + 'deg) rotateY(' + angleY + 'deg)' });
    }, t1 || 60);
};

/*
    3.1、canvas
*/

//canvas画笔(兼容手机和电脑端)
//obj(canvas标签对象)
//lineWidth(画笔线框)
//color(画笔颜色)
//endFn(在touchend后会输出dataUrl)
function brush(obj, lineWidth, color, endFn) {
    var oGC = obj.getContext('2d');
    //console.dir(oGC);

    oGC.lineWidth = lineWidth || 1;
    oGC.strokeStyle = color || '#000';

    isPhone() ? mo() : pc();

    function mo() {
        bind(obj, 'touchstart', function (ev) {
            var ev = ev || event;

            oGC.moveTo(ev.changedTouches[0].clientX - obj.offsetLeft, ev.changedTouches[0].clientY - obj.offsetTop);
        });

        bind(obj, 'touchmove', function (ev) {
            var ev = ev || event;

            oGC.lineTo(ev.changedTouches[0].clientX - obj.offsetLeft, ev.changedTouches[0].clientY - obj.offsetTop);
            oGC.stroke();
        });

        bind(obj, 'touchend', function () {
            endFn && endFn(obj.toDataURL());
        });
    };

    function pc() {
        obj.onmousedown = function (ev) {
            var ev = ev || event;
            oGC.moveTo(ev.clientX - obj.offsetLeft, ev.clientY - obj.offsetTop);

            if (obj.setCapture) obj.setCapture;
            document.onmousemove = function (ev) {
                var ev = ev || event;

                oGC.lineTo(ev.clientX - obj.offsetLeft, ev.clientY - obj.offsetTop);
                oGC.stroke();
            };
            document.onmouseup = function () {
                document.onmousemove = document.onmouseup = null;
                if (obj.releaseCapture) obj.releaseCapture;
                endFn && endFn(obj.toDataURL());
            };
            return false;
        };
    };
};

//创建canvas时钟
/*
    function clock(){
        var oDate=new Date();
        var oHour=oDate.getHours();
        var oMinute=oDate.getMinutes();
        var oSecond=oDate.getSeconds();
        var aH=(Math.PI/180)*(360/12*(oHour+oMinute/60)-90);
        var aM=(Math.PI/180)*(360/60*oMinute-90);
        var aS=(Math.PI/180)*(360/60*oSecond-90);
        var oC=document.getElementById('canvas');
        var oClock=new CanvasClock(oC);

        oClock.createDial(0)//创建空白时钟
        .createScale(60)//创建分秒刻度
        .createDial(6)//创建白色覆盖层
        .createScale(12)//创建小时刻度
        .createDial(10)//创建白色覆盖层
        .createPointer(aH,5,20)//创建时针
        .createPointer(aM,3,40)//创建分针
        .createPointer(aS,1,60);//创建秒针
    };

    clock();
    setInterval(clock,1000);
*/
function CanvasClock(obj, iX, iY, iR) {
    this.name = 'CanvasClock';
    this.oGC = obj.getContext('2d');
    this.iX = iX || 200;
    this.iY = iY || 200;
    this.iR = iR || 100;
};
CanvasClock.prototype = {
    createDial: function (height) { //生成表盘，也可以用于覆盖刻度
        this.oGC.beginPath();
        this.oGC.fillStyle = '#fff';
        this.oGC.arc(this.iX, this.iY, this.iR - height, 0, Math.PI * 2);
        this.oGC.fill();

        return this;
    },
    createScale: function (divide) { //生成刻度
        var angle = (Math.PI / 180) * (360 / divide);

        this.oGC.beginPath();
        for (var i = 0; i < divide; i++) {
            this.oGC.moveTo(this.iX, this.iY);
            this.oGC.arc(this.iX, this.iY, this.iR, angle * i, angle * (i + 1));
        }
        this.oGC.closePath();
        this.oGC.stroke();

        return this;
    },
    createPointer: function (angle, width, height) { //生成指针
        this.oGC.beginPath();
        this.oGC.lineWidth = width;
        this.oGC.moveTo(this.iX, this.iY);
        this.oGC.arc(this.iX, this.iY, this.iR * (height / 100), angle, angle);
        this.oGC.closePath();
        this.oGC.stroke();

        return this;
    },
};

//canvas获取坐标的rgba值
function getXY(obj, x, y) {
    var w = obj.width;
    var h = obj.height;
    var d = obj.data;
    var color = [];
    color[0] = d[4 * (y * w + x)];
    color[1] = d[4 * (y * w + x) + 1];
    color[2] = d[4 * (y * w + x) + 2];
    color[3] = d[4 * (y * w + x) + 3];
    return color;
};

//canvas设置坐标的rgba颜色
function setXY(obj, x, y, color) {
    var w = obj.width;
    var h = obj.height;
    var d = obj.data;
    d[4 * (y * w + x)] = color[0];
    d[4 * (y * w + x) + 1] = color[1];
    d[4 * (y * w + x) + 2] = color[2];
    d[4 * (y * w + x) + 3] = color[3];
};

//生成canvas图片反色
function cInverse(obj, src) {
    var c = obj;
    var cg = obj.getContext('2d');
    var nImg = new Image();

    nImg.src = src;
    nImg.onload = function () {
        c.width = nImg.width;
        c.height = nImg.height;

        cg.drawImage(nImg, 0, 0);
        var oImg = cg.getImageData(0, 0, nImg.width, nImg.height);
        var iWidth = oImg.width;
        var iHeight = oImg.height;

        for (var i = 0; i < iWidth; i++) {
            for (var j = 0; j < iHeight; j++) {
                var rgba = [];
                var color = getXY(oImg, i, j);

                rgba[0] = 255 - color[0];
                rgba[1] = 255 - color[1];
                rgba[2] = 255 - color[2];
                rgba[3] = 255;
                setXY(oImg, i, j, rgba);
            }
        }
        cg.putImageData(oImg, 0, 0);
    };
};

//生成canvas图片倒影
function cReflection(obj, src) {
    var c = obj;
    var cg = obj.getContext('2d');
    var nImg = new Image();

    nImg.src = src;
    nImg.onload = function () {
        c.width = nImg.width;
        c.height = nImg.height;

        cg.drawImage(nImg, 0, 0);
        var oImg = cg.getImageData(0, 0, nImg.width, nImg.height);
        var iWidth = oImg.width;
        var iHeight = oImg.height;

        var cImg = cg.createImageData(iWidth, iHeight);
        for (var i = 0; i < iWidth; i++) {
            for (var j = 0; j < iHeight; j++) {
                var rgba = [];
                var color = getXY(oImg, i, j);

                rgba[0] = color[0];
                rgba[1] = color[1];
                rgba[2] = color[2];
                rgba[3] = 255;
                setXY(cImg, i, iHeight - j, rgba);
            }
        }
        cg.putImageData(cImg, 0, 0);
    };
};

//生成canvas图片渐变
function cGradient(obj, src) {
    var c = obj;
    var cg = obj.getContext('2d');
    var nImg = new Image();

    nImg.src = src;
    nImg.onload = function () {
        c.width = nImg.width;
        c.height = nImg.height;

        cg.drawImage(nImg, 0, 0);
        var oImg = cg.getImageData(0, 0, nImg.width, nImg.height);
        var iWidth = oImg.width;
        var iHeight = oImg.height;

        var cImg = cg.createImageData(iWidth, iHeight);
        for (var i = 0; i < iWidth; i++) {
            for (var j = 0; j < iHeight; j++) {
                var rgba = [];
                var color = getXY(oImg, i, j);

                rgba[0] = color[0];
                rgba[1] = color[1];
                rgba[2] = color[2];
                rgba[3] = 255 * j / iHeight;
                setXY(cImg, i, j, rgba);
            }
        }
        cg.putImageData(cImg, 0, 0);
    };
};

//生成canvas图片马赛克
function cMosaic(obj, src, m) {
    var c = obj;
    var cg = obj.getContext('2d');
    var nImg = new Image();
    var m = m || 5;

    nImg.src = src;
    nImg.onload = function () {
        c.width = nImg.width;
        c.height = nImg.height;

        cg.drawImage(nImg, 0, 0);
        var oImg = cg.getImageData(0, 0, nImg.width, nImg.height);
        var iWidth = oImg.width;
        var iHeight = oImg.height;
        var cImg = cg.createImageData(iWidth, iHeight);
        var stepW = iWidth / m;
        var stepH = iHeight / m;

        for (var i = 0; i < stepW; i++) {
            for (var j = 0; j < stepH; j++) {
                var color = getXY(oImg, i * m + Math.floor(Math.random() * m), j * m + Math.floor(Math.random() * m));
                for (var k = 0; k < m; k++) {
                    for (var l = 0; l < m; l++) {
                        setXY(cImg, i * m + k, j * m + l, color);
                    }
                }
            }
        }
        cg.putImageData(cImg, 0, 0);
    };
};

/*
    4.1、高德地图相关
*/

//百度地图定位接口(需要引入jq)
//<script src="https://api.map.baidu.com/api?v=2.0"></script>
function getLocation(endFn) {
    $.getScript("https://api.map.baidu.com/api?v=2.0", function () {
        var options = {
            enableHighAccuracy: true,
            maximumAge: 1000
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                //获取经纬度成功(mo浏览器上,调用百度地图接口，传入经纬度获取城市)
                var longitude = position.coords.longitude; //经度
                var latitude = position.coords.latitude; //纬度
                var map = new BMap.Map("allmap");
                var point = new BMap.Point(longitude, latitude);
                var gc = new BMap.Geocoder();

                gc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;

                    if (addComp.city.charAt(addComp.city.length - 1) == '市') {
                        addComp.city = addComp.city.replace('市', '');
                    }
                    endFn && endFn(addComp.city, longitude, latitude);
                });
            }, function (error) { //获取经纬度失败 (pc浏览器上，调用新浪接口获取城市)
                var url = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';

                $.getScript(url, function () {
                    if (remote_ip_info.ret == '1') {
                        endFn && endFn(remote_ip_info.city);
                    }
                });
            }, options);
        } else {
            alert('您的浏览器不支持地理位置定位');
        }
    });
};

//高德定位接口(需要引入jq)
//<script src="https://webapi.amap.com/maps?v=1.3&key=c14b6228b5ae543b1718ab6ebc4d19f5"></script>
function getLocation1(endFn) {
    $.getScript("https://webapi.amap.com/maps?v=1.3&key=c14b6228b5ae543b1718ab6ebc4d19f5", function () {
        function session(key, value) {
            if (arguments.length == 1) {
                return window.sessionStorage.getItem(key);
            }
            if (arguments.length == 2) {
                window.sessionStorage.setItem(key, value);
            }
        };

        yydTimer(function (clear) {
            var city = session('getLocationCity');
            var longitude = session('getLocationLongitude');
            var latitude = session('getLocationLatitude');
            var province = session('getLocationProvince');
            var detail = session('getLocationDetail');
            var condition = city && longitude && latitude && province && detail;

            if (condition) {
                clear();
                endFn && endFn(city, (+longitude), (+latitude), province, detail);
            } else {
                if (Type(AMap.Map) == 'function') {
                    clear();
                    getMap();
                }
            }
        });

        function getMap() {
            var mapObj = new AMap.Map('container');

            mapObj.plugin('AMap.Geolocation', function () {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 10000, //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, //定位结果缓存0毫秒，默认：0
                    convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true, //显示定位按钮，默认：true
                    buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                mapObj.addControl(geolocation);
                AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
                AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息

                function setSession(city, longitude, latitude, province, detail) {
                    session('getLocationCity', city);
                    session('getLocationLongitude', longitude);
                    session('getLocationLatitude', latitude);
                    session('getLocationProvince', province);
                    session('getLocationDetail', detail);
                };

                function onComplete(data) {
                    console.log(data);
                    var city = data.addressComponent ? data.addressComponent.city : '南昌市';
                    var longitude = data.position.lng ? data.position.lng : '115.89';
                    var latitude = data.position.lat ? data.position.lat : '28.68';
                    var province = data.addressComponent ? data.addressComponent.province : '江西省';
                    var detail = data.formattedAddress ? data.formattedAddress : '江西省南昌市卫东';

                    setSession(city, longitude, latitude, province, detail);
                    endFn && endFn(city, longitude, latitude, province, detail); //http纬度为L，https纬度为M
                };

                function onError(data) {
                    console.log(data);
                    setSession('南昌市', 115.89, 28.68, '江西省', '江西省南昌市卫东');
                    endFn && endFn('南昌市', 115.89, 28.68, '江西省', '江西省南昌市卫东');
                };
                //获取当前位置信息
                getCurrentPosition();

                function getCurrentPosition() {
                    geolocation.getCurrentPosition();
                };
                //监控当前位置并获取当前位置信息
                function watchPosition() {
                    geolocation.watchPosition();
                };
            });
        };
    });
};

//生成高德地图多点标注地址
//arr示例[{longitude:'',latitude:'',name:''}]
function createGaodeMapUrl1(arr) {
    var url = 'https://uri.amap.com/marker?callnative=1&markers=';
    var str = '';

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].longitude && arr[i].latitude) {
            str += arr[i].longitude + ',' + arr[i].latitude + ',' + arr[i].name + '|';
        }
    }
    str = str.substring(0, str.length - 1);
    return url + encodeURIComponent(str);
};

//生成高德地图搜索周边地址
//keyword(搜索关键字)
//longitude(中心点经度)
//latitude(中心点纬度)
//city(搜索城市)
function createGaodeMapUrl2(keyword, longitude, latitude, city) {
    var url = 'https://uri.amap.com/search?';
    var str = 'callnative=1&keyword=' + keyword + '&center=' + longitude + ',' + latitude + '&city=' + city;

    return url + str;
};

//生成高德地图导航地址
//start(起始点参数)
//end(终点参数)
function createGaodeMapUrl3(start, end) {
    var url = 'https://m.amap.com/navigation/carmap/saddr=';
    var str = start.longitude + ',' + start.latitude + ',' + start.name + '&daddr=' + end.longitude + ',' + end.latitude + ',' + end.name + '&callnative=1';

    return url + str;
};

//根据经纬度算大圆上两点间距离(假设地球为标准圆)
function getGreatCircleDistance(lng1, lat1, lng2, lat2) {
    var EARTH_RADIUS = 6378137.0; //地球半径单位M
    function getRad(d) {
        return d * Math.PI / 180.0;
    };

    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);
    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000.0;

    return Math.round(s);
};

//根据经纬度算椭圆上两点间距离
function getFlatternDistance(lng1, lat1, lng2, lat2) {
    var EARTH_RADIUS = 6378137.0; //地球半径单位M
    function getRad(d) {
        return d * Math.PI / 180.0;
    };

    var f = getRad((lat1 + lat2) / 2);
    var g = getRad((lat1 - lat2) / 2);
    var l = getRad((lng1 - lng2) / 2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    return Math.round(d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg)));
};

//新浪天气接口(需要引入jq)
function getWeather(city, endFn) {
    var url = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
    var str = city.charAt(city.length - 1);

    switch (str) {
        case '市':
            city = city.substring(0, city.length - 1);
            break;
        case '区':
            city = city.substring(0, city.length - 2);
            break;
    }
    $.getScript(url, function () {
        if (remote_ip_info.ret == '1') {
            $.ajax({
                url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + city,
                type: 'GET',
                data: '',
                success: function (data) {
                    var data1 = JSON.parse(data);

                    if (data1.status == 1000) {
                        var data2 = JSON.parse(data);

                        data2 = data2.data.forecast[0];
                        data2.status = data1.status;
                        console.log('获取' + city + '天气成功！');
                        endFn && endFn(data2);
                    } else {
                        console.log('获取' + city + '天气失败！');
                    }
                }
            });
        }
    });
};

/*
    5.1、微信支付与微信sdk调用
*/

//获取微信code
var WXCode = {
    //appid（微信公众号的appid）
    //componentAppid（第三方合作的appid）
    //userinfo（是否是用户授权模式）
    //注意：执行get方法之前需先执行listen方法
    get: function (appid, componentAppid, userinfo) {
        if (!isWeixin()) return;
        var wxCode = cookie.get('wxCode');
        var appid = appid || 'wxd9b3d678e7ae9181';
        var componentAppid = componentAppid ? '&component_appid=' + componentAppid : '';
        var url = encodeURIComponent(window.location.href);

        if (!wxCode) {
            //获得微信基本权限的code（无需授权）
            var snsapi_base = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_base' + componentAppid + '#wechat_redirect';
            //获得微信最高权限的code（需要授权）
            var snsapi_userinfo = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo' + componentAppid + '&state=STATE#wechat_redirect';
            var accredit = !userinfo ? snsapi_base : snsapi_userinfo;

            window.location.replace(accredit);
        } else {
            return wxCode;
        }
    },
    //parent（vue对象，非必填）
    //如果是vue中用，最好放在router.afterEach里进行监听保存code。
    listen: function (parent) {
        if (!isWeixin()) return;
        var wxCode = cookie.get('wxCode');
        var code = getSearch('code');

        if (!wxCode && code) {
            cookie.set('wxCode', code, 300);

            //此段代码主要用于vue项目地址去掉search的传参
            if (parent) {
                var currentRoute = parent.$router.currentRoute;
                var path = currentRoute.path;
                var query = currentRoute.query;

                window.history.replaceState(null, null, 'index.html');
                parent.$router.replace({
                    path: path,
                    query: query,
                });
            }
        }
    },
};

/*微信内置支付对象封装*/
function WXPay(params, successFn, failFn, finallyFn) {
    function onBridgeReady() {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                'appId': params.appId, //公众号名称，由商户传入
                'timeStamp': params.timeStamp, //时间戳，自1970年以来的秒数
                'nonceStr': params.nonceStr, //随机串
                'package': params.package,
                'signType': params.signType, //微信签名方式：
                'paySign': params.paySign, //微信签名
            },
            function (res) {
                //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                if (res.err_msg == 'get_brand_wcpay_request:ok') {
                    successFn && successFn(res);
                } else {
                    alerts('微信支付失败，请重试！');
                    console.log(res);
                    failFn && failFn(res);
                }
                finallyFn && finallyFn(res);
            }
        );
    };

    if (Type(WeixinJSBridge) == 'undefined') {
        bind('WeixinJSBridgeReady', onBridgeReady);
    } else {
        onBridgeReady();
    }
};

//微信sdk调用微信api
/*
    config:权限验证配置
    type:微信接口类型
    params:微信接口参数
    readyFn:ready好了，可以在此函数中可以调用微信的api

    所有接口通过wx对象(也可使用jWeixin对象)来调用，参数是一个对象，除了每个接口本身需要传的参数之外，还有以下通用参数：
    1.success：接口调用成功时执行的回调函数。
    2.fail：接口调用失败时执行的回调函数。
    3.complete：接口调用完成时执行的回调函数，无论成功或失败都会执行。
    4.cancel：用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
    5.trigger: 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。

    备注：不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回。
    以上几个函数都带有一个参数，类型为对象，其中除了每个接口本身返回的数据之外，还有一个通用属性errMsg，其值格式如下：
    调用成功时："xxx:ok" ，其中xxx为调用的接口名
    用户取消时："xxx:cancel"，其中xxx为调用的接口名
    调用失败时：其值为具体错误信息
*/
function WXSDK(config, type, params, readyFn) {
    var params = params || {};
    var type = type || 'share';
    var config = config || {};
    var readyFn = readyFn || function () {};

    createScript('https://res.wx.qq.com/open/js/jweixin-1.4.0.js', function () {
        var dataJson = {
            share: { //微信分享
                jsApiList: [
                    'updateAppMessageShareData', //1.4.0
                    'updateTimelineShareData', //1.4.0
                    'onMenuShareWeibo',
                ],
                template: {
                    title: params.title || '分享标题', //分享标题
                    desc: params.desc || '分享内容', //分享描述
                    link: params.link || window.location.href, //分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: params.imgUrl || 'https://www.muyouche.com/static/images/logoBg.png', //分享图标
                    success: params.success || function () {
                        //设置成功
                        console.log('分享成功');
                    },
                },
            },
            openLocation: { //微信地图
                jsApiList: [
                    'openLocation',
                ],
                template: {
                    latitude: params.latitude || 0, //纬度，浮点数，范围为90 ~ -90
                    longitude: params.longitude || 0, //经度，浮点数，范围为180 ~ -180。
                    name: params.name || '位置名', //位置名
                    address: params.address || '地址详情说明', //地址详情说明
                    scale: params.scale || 17, //地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: params.infoUrl || `http://map.baidu.com/?latlng=${params.latitude},${params.longitude}&title=${params.name}&content=${params.address}&output=html`, //在查看位置界面底部显示的超链接,可点击跳转
                },
            },
            getLocation: { //微信地理位置
                jsApiList: [
                    'getLocation',
                ],
                template: {
                    type: params.type || 'wgs84', //默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: params.success || function (res) {
                        /*
                            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            var speed = res.speed; // 速度，以米/每秒计
                            var accuracy = res.accuracy; // 位置精度
                        */
                        console.log(res);
                    },
                },
            },
            scanQRCode: { //微信扫一扫
                jsApiList: [
                    'scanQRCode',
                ],
                template: {
                    needResult: params.needResult || 0, //默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: params.scanType || ["qrCode", "barCode"], //可以指定扫二维码还是一维码，默认二者都有
                    success: params.success || function (res) {
                        /*
                            var result = res.resultStr;// 当needResult 为 1 时，扫码返回的结果
                        */
                        console.log(res);
                    },
                },
            },
            chooseWXPay: { //微信支付
                jsApiList: [
                    'chooseWXPay',
                ],
                template: {
                    appId: params.appId, //公众号名称，由商户传入
                    timestamp: params.timestamp, //支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。
                    nonceStr: params.nonceStr, //支付签名随机串，不长于 32 位
                    package: params.package, //统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                    signType: params.signType, //签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: params.paySign, //支付签名
                    success: params.success || function (res) {
                        //支付成功后的回调函数
                    },
                    fail: params.fail || function (res) {
                        //支付失败后的回调函数
                        alerts('微信支付失败，请重试！');
                        console.log(res);
                    },
                },
            },
        };
        var json = dataJson[type];
        var jsApiList = copyJson(json.jsApiList);
        var template = json.template;

        for (var attr in params) {
            template[attr] = params[attr];
        }

        wx.config({
            debug: false, //开启调试模式,仅在pc端时才会打印。
            appId: config.appId, //必填，公众号的唯一标识
            timestamp: config.timestamp, //必填，生成签名的时间戳
            nonceStr: config.nonceStr, //必填，生成签名的随机串
            signature: config.signature, //必填，签名，见附录1
            jsApiList: copyJson(json.jsApiList), //必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        //备注：checkJsApi接口是客户端6.0.2新引入的一个预留接口，第一期开放的接口均可不使用checkJsApi来检测。
        wx.checkJsApi({
            jsApiList: copyJson(json.jsApiList), // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function (res) {
                //以键值对的形式返回，可用的api值true，不可用为false
                console.log('可用接口', res);
            },
        });

        wx.ready(function () {
            for (var i = 0; i < jsApiList.length; i++) {
                wx[jsApiList[i]](template);
            }
            readyFn && readyFn();
        });

        wx.error(function (res) {
            console.log('错误', res);
        });
    });
};

/*
    6.1、各种参考函数
*/

//foreach改良(加上this.break()方法用来跳出循环)
function foreach(arr, fn) {
    var oError = new Error('StopIteration');

    arr.break = function () {
        throw oError;
    };

    try {
        arr.forEach(function (item, index, array) {
            fn && fn.call(arr, item, index, array);
        });
    } catch (e) {
        if (e === oError) {
            return;
        } else {
            throw e;
        }

    }
};

//十六进制颜色转rgb颜色
//hex为字符串
function HEXToRGB(hex) {
    var hex = hex.replace('#', '0x');
    var hex256 = '0xff';
    var r = hex >> 16;
    var g = hex >> 8 & hex256;
    var b = hex & hex256;

    return 'rgb(' + r + ',' + g + ',' + b + ')';
};

//rgb颜色转十六进制颜色
//rgb为字符串
function RGBToHEX(rgb) {
    var reg = /[^\d]+/;
    var arr = rgb.split(reg);
    var hex = arr[1] << 16 | arr[2] << 8 | arr[3];

    return '#' + hex.toString(16);
};

//布局转换
function layoutChange(obj) {
    for (var i = 0; i < obj.length; i++) {
        obj[i].style.left = obj[i].offsetLeft + 'px';
        obj[i].style.top = obj[i].offsetTop + 'px';
    }
    for (var i = 0; i < obj.length; i++) {
        obj[i].style.position = 'absolute';
        obj[i].style.margin = '0';
    }
};

//获取数组最小值
function getMin(arr) {
    var iMin = +Infinity;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < iMin) {
            iMin = arr[i];
        }
    }
    return iMin;
};

//获取数组最大值
function getMax(arr) {
    var iMax = -Infinity;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > iMax) {
            iMax = arr[i];
        }
    }
    return iMax;
};

//数组去重
function noRepeat(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {
                arr.splice(j, 1);
                j--;
            }
        }
    }
};

//数组去重(利用json)
function noRepeat1(arr) {
    var json = {};
    var result = [];

    for (var i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
            json[arr[i]] = 1; //不为0就行，为真就可以
            result.push(arr[i]);
        }
    }
    return result;
};

//获取多个任意class(class之间用逗号隔开)
function getClass(parent, tagN, classN) {
    var allTag = parent.getElementsByTagName(tagN),
        arrClass = classN.split(','),
        arr = [];
    for (var i = 0; i < allTag.length; i++) {
        var aClass = allTag[i].className.split(' ');
        for (var j = 0; j < arrClass.length; j++) {
            for (var k = 0; k < aClass.length; k++) {
                if (aClass[k] == arrClass[j]) {
                    arr.push(allTag[i]);
                    break;
                }
            }
        }
    }
    return arr;
};

//配合正则获取单个class
function getByClass(parent, tagN, classN) {
    var allTag = parent.getElementsByTagName(tagN);
    var arr = [];
    var re = new RegExp('\\b' + classN + '\\b', 'i');
    var i = 0;
    for (var i = 0; i < allTag.length; i++) {
        if (re.test(allTag[i].className)) {
            arr.push(allTag[i]);
        }
    }
    return arr;
};

//添加任意class
function addClass(obj, classN) {
    if (!obj.className) {
        obj.className = classN;
    } else {
        var arrClass = obj.className.split(' '),
            index = arrIndexOf(arrClass, classN);
        if (!index) {
            obj.className += ' ' + classN;
        }
    }
};

//移除任意class
function removeClass(obj, classN) {
    if (obj.className) {
        var arrClass = obj.className.split(' '),
            index = arrIndexOf(arrClass, classN);
        if (index) {
            arrClass.splice(index, 1);
            obj.className = arrClass.join(' ');
        }
    }
};

//根据设备宽度来改变viewport默认缩放
function metaViewport() {
    function change() {
        var oHead = document.getElementsByTagName('head')[0];
        var oMeta = document.getElementsByTagName('meta');
        var str = 'width=device-width,maximum-scale=1.0,user-scalable=yes,';
        var iWidth = window.screen.width;
        var onOff = true;

        if (isPhone()) {
            if (iWidth < 1200) {
                str += 'initial-scale=' + iWidth / 1200;
            }
        } else {
            str += 'initial-scale=0';
        }
        for (var i = 0; i < oMeta.length; i++) {
            if (oMeta[i].getAttribute('name') == 'viewport') {
                oMeta = oMeta[i];
                oMeta.setAttribute('content', str);
                onOff = false;
                break;
            }
        }
        if (onOff) {
            oMeta = document.createElement('meta');
            oMeta.setAttribute('name', 'viewport');
            oMeta.setAttribute('content', str);
            oHead.appendChild(oMeta);
        }
    }
    change();
    window.onresize = change;
};

//简单实现路由
//配置函数放在所有dom后面执行（否则onload不触发路由回调函数）
//Router.when('/',function(){});
//Router.when('/blue',function(){});
function router() {
    function Router() {
        this.routes = {};
        this.currentUrl = '';
        this.init();
    };
    Router.prototype = {
        init: function () {
            bind(window, 'load', this.refresh.bind(this));
            bind(window, 'hashchange', this.refresh.bind(this));
        },
        when: function (path, callback) {
            this.routes[path] = callback || function () {};
        },
        refresh: function () {
            this.currentUrl = window.location.hash.replace('#', '') || '/';
            this.routes[this.currentUrl]();
        }
    };
    window.Router = new Router(); //把路由配置函数挂载到window对象下
};

//自己实现双向数据绑定
/*
    var $yydModel=yydModel();//数据映射对象返回在该函数上

    $yydModel.watch(function(newValue,oldValue){//必须写在set前面才能监听set的变化
        console.log(newValue,oldValue);
    });
    $yydModel.set('aaa','双向数据绑定');
    $yydModel.set('b','厉害了');
*/
function yydModel() {
    var oAllModel = QSA('input[yyd-model],textarea[yyd-model]');
    var reg = /{{[^(}})]+}}/g;
    var reg1 = /\s+/g;
    var reg2 = /{{|}}/g;
    var matchArr = [];
    var obj = {};
    var objMap = {};

    function setMatchTextNode(childNodes) {
        if (!childNodes || childNodes.length == 0) return;

        for (var i = 0; i < childNodes.length; i++) {
            var matchResult = childNodes[i].data && childNodes[i].data.match(reg);

            if (childNodes[i].nodeType == 3 && childNodes[i].data && matchResult) {
                var result = childNodes[i].data.replace(reg1, '').split(reg2);

                for (var j = 0; j < matchResult.length; j++) {
                    var str = matchResult[i].replace(reg2, '');

                    matchResult[i] = str;
                    if (!~matchArr.indexOf(str)) {
                        matchArr.push(str);
                    }
                }

                childNodes[i].yydModel = result;
                childNodes[i].yydModelStr = [];
                childNodes[i].rawData = childNodes[i].data;
                childNodes[i].data = '';
            }

            setMatchTextNode(childNodes[i].childNodes);
        }
    };
    setMatchTextNode(document.body.childNodes);

    function setModelData(childNodes, key, newVal) {
        if (!childNodes || childNodes.length == 0) return;

        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].yydModel) {
                var arr = [].concat(childNodes[i].yydModel);
                var yydModelStr = [].concat(arr);
                var oldStr = [].concat(childNodes[i].yydModelStr);

                for (var j = 0; j < arr.length; j++) {
                    var index = arr.indexOf(key);
                    var index1 = ~matchArr.indexOf(arr[j]) ? j : -1;

                    if (index != -1) {
                        yydModelStr[index] = newVal;
                        arr[index] = '';
                    } else if (index1 != -1) {
                        yydModelStr[index1] = oldStr[index1] ? oldStr[index1] : '';
                        arr[index1] = '';
                    }
                }

                childNodes[i].yydModelStr = yydModelStr;
                childNodes[i].data = yydModelStr.join('');
            }

            setModelData(childNodes[i].childNodes, key, newVal);
        }
    };

    function definePropertyFn(obj, key) {
        Object.defineProperty(obj, key, {
            set: function (newVal) {
                var allSelect = QSA('input[yyd-model=' + key + '],textarea[yyd-model=' + key + ']');
                var oldObjMap = copyJson(objMap);

                for (var j = 0; j < allSelect.length; j++) {
                    allSelect[j].value = newVal;
                }

                setModelData(document.body.childNodes, key, newVal);
                objMap[key] = newVal;

                customEvent.emit('yydModelDefinePropertySet', {
                    newVal: copyJson(objMap),
                    oldVal: oldObjMap,
                });
            }
        });
    };

    for (var i = 0; i < oAllModel.length; i++) {
        var key = oAllModel[i].getAttribute('yyd-model');

        obj[key] = oAllModel[i].value;

        (function (i, key) {
            if (!objMap[key]) {
                definePropertyFn(obj, key);
            }
        })(i, key);

        bind(oAllModel[i], 'input', function () {
            var key = this.getAttribute('yyd-model');

            obj[key] = this.value;
            objMap[key] = this.value;
        });
    }

    objMap.watch = function (endFn) {
        customEvent.on('yydModelDefinePropertySet', function (data) {
            var newVal = data.newVal;
            var oldVal = data.oldVal;

            endFn && endFn(newVal, oldVal);
        });
    };

    objMap.set = function (key, value) {
        definePropertyFn(obj, key);
        obj[key] = value;
    };

    return objMap;
};

//实现promise对象
function Prom(fn) {
    this.status = 'unchanged';
    this.resolveFn = [];
    this.rejectFn = null;
    this.finallyFn = null;

    fn && fn(this.resolve.bind(this), this.reject.bind(this));
    return this;
};
Prom.prototype = {
    resolve: function (data) {
        if (this.status == 'rejected') this.catch('promise is only once change,but it was rejected');
        if (this.status != 'unchanged') return;
        this.status = 'resolved';

        var This = this;

        function nextThen(resultFn) {
            if (resultFn instanceof Prom) {
                resultFn.resolveFn = This.resolveFn;
            }
        };

        setTimeout(function () {
            This.finallyFn && This.finallyFn();

            var headFn = null;
            var resultFn = null;

            headFn = This.resolveFn.shift()
            headFn && (resultFn = headFn(data));
            resultFn && nextThen(resultFn);
        });
        return this;
    },
    reject: function (data) {
        if (this.status == 'resolved') this.catch('promise is only once change,but it was resolved');
        if (this.status != 'unchanged') return;
        this.status = 'rejected';

        var This = this;

        setTimeout(function () {
            This.finallyFn && This.finallyFn();

            This.rejectFn('promise is reject:' + data);
        });
        return this;
    },
    then: function (fn1, fn2) {
        fn1 && this.resolveFn.push(fn1);
        fn2 && (this.rejectFn = fn2);
        return this;
    },
    catch: function (error) {
        console.error(error);
        return this;
    },
    finally: function (fn) {
        fn && (this.finallyFn = fn);
    }
};

//包装成一个promise对象
function setPromise(fn, ag1, ag2) {
    return new Promise(function (resolve, reject) {
        if (fn) {
            fn.resolve = resolve;
            arguments.length == 2 ? fn(ag1) : fn(ag1, ag2);
        }
        //传入的函数加入return [函数名].resolve(data);//因为resolve后面的不会再走了，加上return明确点
    });
};

//钟摆运动判断示例
//obj(钟摆运动的对象)
//disX(钟摆运动X轴的最大位置)
//disY(钟摆运动Y轴的最大位置)
//sX（钟摆运动X轴的加速度）
//msec(钟摆运动的定时器频率)
function pendulum(obj, disX, disY, sX, msec) {
    var speedX = 0;
    var speedY = 0;
    var disX = disX || 300;
    var disY = disY || 10;
    var sX = sX || 5;
    var timer = null;

    timer = setInterval(function () {
        var x = parseInt(getStyle(aDiv, 'left'));
        var y = parseInt(getStyle(aDiv, 'top'));

        speedX = x < disX ? speedX += sX : speedX -= sX;
        aDiv.style.left = x + speedX + 'px';

        if (x < disX && speedX > 0 || x > disX && speedX < 0) { //往右运动或者往左运动的时候y轴往下运动
            speedY = disY;
            console.log(1);
        } else if (x > disX && speedX > 0 || x < disX && speedX < 0) { //到达最右边端点或者最左边端点时往上运动
            speedY = -disY;
            console.log(2);
        }
        aDiv.style.top = y + speedY + 'px';
    }, msec || 50);
};

//添加删除遮罩层
function mask(zIndex, onOff) {
    if (!document.getElementById('yydMask') && onOff) {
        var oMask = document.createElement('div');
        oMask.id = 'yydMask';

        oMask.style.cssText = 'width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); position: fixed; top: 0; left: 0; z-index: 1000;';
        oMask.style.zIndex = zIndex;
        document.body.appendChild(oMask);
    }

    if (document.getElementById('yydMask') && !onOff) {
        document.body.removeChild(document.getElementById('yydMask'));
    }
};

//创建一个loading样式
//mask(是否能看见遮罩)
//onOff(创建还是删除loading)
//scale(样式的大小比例)
//msec(旋转定时器的频率)
//zIndex(设置层级)
function loadingMask(mask, onOff, scale, msec, zIndex) {
    if (!document.getElementById('yydLoading') && onOff) {
        var oUl = document.createElement('i');
        var oli = oUl.getElementsByTagName('i');
        var sLi = '';
        var iNum = 0;
        var timer = null;

        oUl.style.cssText = 'margin:auto; width:40px; height:40px; position: absolute; left:0; right:0; top:0; bottom:0;';
        oUl.id = 'yydLoading';
        oUl.style.transform = 'scale(' + (scale || 1) + ',' + (scale || 1) + ')';
        oUl.style.WebkitTransform = 'scale(' + (scale || 1) + ',' + (scale || 1) + ')';

        for (var i = 0; i < 12; i++) {
            sLi += '<i></i>';
        }
        oUl.innerHTML = sLi;

        for (var i = 0; i < 12; i++) {
            oli[i].style.cssText = 'list-style:none; width:4px; height:10px; background-color:rgba(255,255,255,0.5); position:absolute; left:20px; top:0; transform-origin:0 20px; -webkit-transform-origin:0 20px; border-radius:2px 2px 0 0;';
        }

        var oDiv = document.createElement('div');

        oDiv.style.cssText = 'width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); position: fixed; top: 0; left: 0;';
        oDiv.id = 'yydMask1';
        oDiv.style.zIndex = zIndex || 1000;

        oDiv.appendChild(oUl);
        document.body.appendChild(oDiv);
        if (!mask) {
            oDiv.style.backgroundColor = 'rgba(0,0,0,0)';
        }

        for (var i = 0; i < 12; i++) {
            oli[i].style.transform = 'rotate(' + i * 30 + 'deg)';
            oli[i].style.WebkitTransform = 'rotate(' + i * 30 + 'deg)';
        }

        fn1();
        timer = setInterval(fn1, msec || 100);

        function fn1() {
            iNum++;

            for (var i = 0; i < 12; i++) {
                oli[i].style.backgroundColor = 'rgba(155,155,155,0.5)';
            }
            oli[iNum % 12].style.backgroundColor = 'rgba(55,55,55,0.9)';
            oli[(iNum + 1) % 12].style.backgroundColor = 'rgba(55,55,55,0.8)';
            oli[(iNum + 2) % 12].style.backgroundColor = 'rgba(55,55,55,0.7)';
            oli[(iNum + 3) % 12].style.backgroundColor = 'rgba(55,55,55,0.6)';
            oli[(iNum + 4) % 12].style.backgroundColor = 'rgba(55,55,55,0.5)';
            oli[(iNum + 5) % 12].style.backgroundColor = 'rgba(55,55,55,0.4)';
        };
    }

    if (document.getElementById('yydLoading') && !onOff) {
        clearInterval(timer);
        document.body.removeChild(document.getElementById('yydMask1'));
    }
};

//键盘控制物体连续移动
function kMove(obj, dis) {
    var Move = {
        'l': false,
        't': false,
        'r': false,
        'b': false,
    };
    var timer = null;

    timer = setInterval(function () {
        if (Move.l) obj.style.left = obj.offsetLeft - dis + 'px';
        if (Move.t) obj.style.top = obj.offsetTop - dis + 'px';
        if (Move.r) obj.style.left = obj.offsetLeft + dis + 'px';
        if (Move.b) obj.style.top = obj.offsetTop + dis + 'px';
    }, 1000 / 60);

    bind(document, 'keydown', keydownFn);

    function keydownFn(ev) {
        var ev = ev || event;
        switch (ev.keyCode) {
            case 37:
                Move.l = true;
                break;
            case 38:
                Move.t = true;
                break;
            case 39:
                Move.r = true;
                break;
            case 40:
                Move.b = true;
        }
    };

    bind(document, 'keyup', keyupFn);

    function keyupFn(ev) {
        var ev = ev || event;
        switch (ev.keyCode) {
            case 37:
                Move.l = false;
                break;
            case 38:
                Move.t = false;
                break;
            case 39:
                Move.r = false;
                break;
            case 40:
                Move.b = false;
        }
    };
};

//面向对象：拖拽原型
function Drag(object) {
    var This = this;
    this.obj = object;
    this.disX = 0;
    this.disY = 0;
    this.obj.onmousedown = function (ev) {
        This.fnDown(ev);
        return false;
    };
};
Drag.prototype.fnDown = function (ev) {
    var This = this;
    var ev = ev || event;
    this.disX = ev.clientX - this.obj.offsetLeft;
    this.disY = ev.clientY - this.obj.offsetTop;
    document.onmousemove = function (ev) {
        This.fnMove(ev);
    };
    document.onmouseup = function () {
        This.fnUp();
    };
};
Drag.prototype.fnMove = function (ev) {
    var ev = ev || event;
    this.obj.style.left = ev.clientX - this.disX + 'px';
    this.obj.style.top = ev.clientY - this.disY + 'px';
};
Drag.prototype.fnUp = function () {
    document.onmousemove = document.onmouseup = null;
};

//面向对象：继承并加上拖拽限制
function LimitDrag(object) {
    Drag.call(this, object);
};
for (var i in Drag.prototype) {
    LimitDrag.prototype[i] = Drag.prototype[i];
}
LimitDrag.prototype.fnMove = function (ev) {
    var ev = ev || event;
    var l = ev.clientX - this.disX;
    var t = ev.clientY - this.disY;
    var iMaxL = document.documentElement.clientWidth - this.obj.offsetWidth;
    var iMaxT = document.documentElement.clientHeight - this.obj.offsetHeight;

    if (l < 0) l = 0;
    if (l > iMaxL) l = iMaxL;
    if (t < 0) t = 0;
    if (t > iMaxT) t > iMaxT;

    this.obj.style.left = l + 'px';
    this.obj.style.top = t + 'px';
};

//旋转360核心函数
//根据半径和角度获得x和y的坐标
function circleGetXY(radius, angle) {
    return { x: Math.round(Math.sin(angle * Math.PI / 180) * radius), y: Math.round(Math.cos(angle * Math.PI / 180) * radius) }
};
//过渡结束时候初始化属性
function transitionEndFn() {
    this.style.transition = '50ms 100ms';
    this.style.transform = 'scale(1) rotate(-720deg)';
    this.style.opacity = 1;
    this.style.filter = 'alpha(opacity:1)';
    removeEnd(this);
};
//元素过渡结束的时候加上transitionEndFn函数
function addEnd(obj) {
    bind(obj, 'transitionend', transitionEndFn);
    bind(obj, 'webkitTransitionEnd', transitionEndFn);
};
//元素过渡结束的时候再删除transitionEndFn函数
function removeEnd(obj) {
    unbind(obj, 'transitionend', transitionEndFn);
    unbind(obj, 'webkitTransitionEnd', transitionEndFn);
};

/*
    7.1、排序算法
*/

//冒泡排序法（万次排序200ms）
//fn为对比值大小的函数，function(a,b){return b-a;}
//算法描述：数组往后作对比，前一个值如果小于后一个值，则交换位置（升序）
function bubbleSort(arr, fn) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr.length - i - 1; j++) {
            if (fn(arr[j], arr[j + 1]) < 0) {
                var oCurrent = arr[j];

                arr[j] = arr[j + 1];
                arr[j + 1] = oCurrent;
            }
        }
    }
};

//选择排序法（万次排序160ms）
//bool（false或不传，从小到大，true，从大到小）
//算法描述：每次取出数组的最小值按顺序放入数组（升序）
function selectSort(arr, bool) {
    var originArr = [].concat(arr);

    function arrGetValue(index, key) {
        var value = Math[key].apply(null, originArr);

        originArr.splice(originArr.indexOf(value), 1);
        arr[index] = value;
    };

    for (var i = 0; i < arr.length; i++) {
        arrGetValue(i, !bool ? 'min' : 'max');
    }
};

//插入排序法（万次排序100ms）
//bool（false或不传，从小到大，true，从大到小）
//算法描述：从索引1开始，数组往前做对比，如果数组当前索引的值比前一个索引的值小，则替换该索引的值为前一个值，小值往前插入（升序）
function insertSort(arr, bool) {
    for (var i = 1; i < arr.length; i++) {
        var temp = arr[i];

        for (var j = i; j > 0 && (!bool ? temp < arr[j - 1] : temp > arr[j - 1]); j--) {
            arr[j] = arr[j - 1];
        }
        arr[j] = temp;
    }
};

//希尔排序法（万次排序40ms）
//bool（false或不传，从小到大，true，从大到小）
//算法描述：插入排序的优化版，对比值先用比较大的间隔，到最后再用插入排序，减少很多位置交换的情况
function shellSort(arr, bool) {
    var gaps = [5, 3, 1];

    for (var i = 0; i < gaps.length; i++) {
        for (var j = gaps[i]; j < arr.length; j++) {
            var temp = arr[j];

            for (var k = j; k >= gaps[i] && (!bool ? temp < arr[k - gaps[i]] : temp > arr[k - gaps[i]]); k -= gaps[i]) {
                arr[k] = arr[k - gaps[i]];
            }
            arr[k] = temp;
        }
    }
};

//快速排序法（万次排序20ms）
//bool（false或不传，从小到大，true，从大到小）
//注意：排序结果是return出来的
//算法描述：以数组第0个为基准值，分出一个比该值小的数组和比该值大的数组，分别递归小值数组和大值数组，递归完成之后把小值数组、基准值和大值数组合并
function quickSort(arr, bool) {
    if (arr.length == 0) return [];
    var minArr = [];
    var maxArr = [];
    var basicValue = arr[0];

    for (var i = 1; i < arr.length; i++) {
        if (!bool ? arr[i] < basicValue : arr[i] > basicValue) {
            minArr.push(arr[i]);
        } else {
            maxArr.push(arr[i]);
        }
    }
    return quickSort(minArr, bool).concat(basicValue, quickSort(maxArr, bool));
};

//归并排序法（万次排序10ms）
//bool（false或不传，从小到大，true，从大到小）
//算法描述：数组拆分成子数组，然后子数组进行排序合并，直到合成最终排序完成的数组，用到哨兵值的技巧
function mergeSort(arr, bool) {
    function mergeArr(arr, l, sL, r, sR) {
        var lArr = new Array(sL - l + 1);
        var rArr = new Array(sR - r + 1);
        var iCount = '';
        var m = 0;
        var n = 0;
        var sentryValue = !bool ? +Infinity : -Infinity;

        iCount = l;
        for (var i = 0; i < lArr.length - 1; i++) {
            lArr[i] = arr[iCount];
            iCount++;
        }

        iCount = r;
        for (var i = 0; i < rArr.length - 1; i++) {
            rArr[i] = arr[iCount];
            iCount++;
        }

        lArr[lArr.length - 1] = sentryValue;
        rArr[rArr.length - 1] = sentryValue;

        for (var i = l; i < sR; i++) {
            if (!bool ? lArr[m] <= rArr[n] : lArr[m] >= rArr[n]) {
                arr[i] = lArr[m];
                m++
            } else {
                arr[i] = rArr[n];
                n++;
            }
        }
    };

    if (arr.length < 2) return;
    var step = 1;
    var iL = '';
    var iR = '';

    while (step < arr.length) {
        iL = 0;
        iR = step;

        while (iR + step <= arr.length) {
            mergeArr(arr, iL, iL + step, iR, iR + step);
            iL = iR + step;
            iR = iL + step;
        }
        if (iR < arr.length) mergeArr(arr, iL, iL + step, iR, arr.length);
        step *= 2;
    }
};

/*
    7.2、其它算法
*/

//对js中的5钟主要数据类型进行值复制（包括Number、String、Object、Array、Boolean）
function clone(obj) {
    //判断是对象，就进行循环复制
    if (typeof obj === 'object' && typeof obj !== 'null') {
        //区分是数组还是对象，创建空的数组或对象
        var o = Object.prototype.toString.call(obj).slice(8, -1) === "Array" ? [] : {};

        for (var k in obj) {
            //如果属性对应的值为对象，则递归复制
            if (typeof obj[k] === 'object' && typeof obj[k] !== 'null') {
                o[k] = clone(obj[k]);
            } else {
                o[k] = obj[k];
            }
        }
    } else { //不为对象，直接把值返回
        return obj;
    }
    return o;
};

//进制转换器
//value（要转换的值，字符串类型）
//current（要转换的值的当前进制）
//target（要转的值的目标进制）
function sysConvert(value, current, target) {
    var value = +value;

    if (!value && value !== 0) return value;

    if (current == 10) {
        value = value.toString(target);
    } else if (target == 10) {
        value = parseInt(value, current);
    } else {
        value = parseInt(value, current).toString(target);
    }

    return value;
};

//二进制与十进制的转换（toString和parseInt已实现各种进制转换，这里只是说明思路）
//value（要转换的值）
//bool（false：十进制转二进制，true：二进制转十进制
function changeSystem(value, bool) {
    var result = !bool ? '' : 0;
    var value = !bool ? +value : value + '';

    if (!bool) {
        function recursion(value) {
            if (value == 0) return;

            var remainder = Math.floor(value / 2);

            result += value - remainder * 2;
            recursion(remainder);
        };

        recursion(value);
    } else {
        var arr = value.split('').reverse();

        for (var i = 0; i < arr.length; i++) {
            result += arr[i] * Math.pow(2, i);
        }
    }

    return result;
};

//计算排列函数(arrange)
function arrange(m, n) {
    var f = hierarchy;

    return f(m) / f(m - n);
};

//计算组合的函数(combination)
function combination(m, n) {
    var f = hierarchy;

    return f(m) / (f(m - n) * f(n));
};

//递归计算阶层
function hierarchy(num) {
    if (num <= 1) {
        return 1;
    }
    return num * hierarchy(num - 1);
};

//递归计算阶层(尾递归)
//做到只调用自身，把所有用到的内部变量改写成函数的参数
function hierarchy1(num, total) {
    'use strict'; //尾递归优化只在严格模式下有效
    if (num <= 1) {
        return total;
    }
    return hierarchy1(num - 1, num * total);
};

//作为trampoline函数的参数
function trampolineFn(num, total) {
    if (num <= 1) {
        return total;
    }
    return trampolineFn.bind(null, num - 1, num * total);
};

//递归计算阶层(改为循环，减少调用栈)
//蹦床函数，可以将递归执行转为循环执行
//trampoline(trampolineFn(5,1)); //120
function trampoline(fn) {
    while (fn && fn instanceof Function) {
        fn = fn();
    }
    return fn;
};

//作为tco函数的参数
function tcoFn(num, total) {
    if (num <= 1) {
        return total;
    }
    return tcoFn(num - 1, num * total);
}

//递归计算阶层(循环实现尾递归优化)
function tco(fn) {
    var value;
    var active = false;
    var arr = [];

    return function accumulator() {
        arr.push(arguments);
        if (!active) {
            active = true;
            while (arr.length) {
                value = fn.apply(this, arr.shift());
            }
            active = false;
            return value;
        }
    };
};

//最终合成的函数
var tcoResultFn = tco(tcoFn);

//数组螺旋矩阵
function changeXY(size) {
    var arr = [];
    var len = size * size;
    var row = 0;
    var col = 0;
    var min = 0;
    var max = size - 1;

    for (var i = 0; i < len; i++) {
        arr.push(row * size + col);
        if (row == min && col < max) {
            col = col + 1;
        } else if (col == max && row < max) {
            row = row + 1;
        } else if (row == max && col > min) {
            col = col - 1;
        } else if (col == min && row > min) {
            row = row - 1;
        }
        if (row - 1 == min && col == min) {
            min = min + 1;
            max = max - 1;
        }
    }
    return arr;
};

//数组行列矩阵互换
function changeXY1(arr, size) {
    var newArr = [];
    var iNow = 0;

    (function () {
        if (iNow == size) {
            return;
        }
        for (var i = 0; i < arr.length; i++) {
            if (i % size == iNow) {
                newArr.push(arr[i]);
            }
        }
        iNow++;
        arguments.callee(); //递归调用自执行函数本身
    })();
    return newArr;
}

//简单实现约瑟夫环
//total(玩游戏人的总数)
//step(数到多少人开始杀人)
function ysfh(total, step) {
    var arr = [];
    var iNum = 0;
    var count = 0;
    var total = total || 100;
    var step = step || 5;

    for (var i = 1; i <= 100; i++) {
        arr.push(i);
    }
    while (arr.length > step - 1) {
        iNum++;
        count++;
        if (count == step) {
            count = 0;
            var position = arr.splice(iNum - 1, 1);
            console.log('被杀的位置是：' + position);
            iNum--;
        }
        if (iNum == arr.length) {
            iNum = 0;
        }
    }
    console.log(arr);
};

//双向循环列表（遍历时请注意判断next是否为head）
function Node(ele) { //建立链表节点，不需要用到
    this.ele = ele;
    this.prev = null;
    this.next = null;
};

function DList() { //建立一个双向循环链表对象
    this.head = new Node('head');
    this.head.prev = null;
    this.head.next = this.head;
    this.length = 0;
    this.currentNode = this.head;
};
DList.prototype = {
    find: function (ele) { //寻找链表的某个元素
        var currentNode = this.head;

        while (currentNode.ele != ele) {
            currentNode = currentNode.next;
        }
        return currentNode;
    },
    insert: function (newEle, ele) { //插入一个新元素到链表的指定元素之后
        var newNode = new Node(newEle);
        var currentNode = this.find(ele);

        newNode.prev = currentNode;
        newNode.next = currentNode.next;
        currentNode.next = newNode;
        this.length++;
    },
    remove: function (ele) { //删除链表的某个元素
        var currentNode = this.find(ele);
        var prevNode = currentNode.prev;
        var nextNode = currentNode.next;

        prevNode.next = nextNode;
        nextNode.prev = prevNode;
        this.length--;
    },
    showList: function () { //返回整个链表
        var currentNode = this.head;
        var result = [];

        while (currentNode.next != null && currentNode.next.ele != 'head') {
            result.push(currentNode.next);
            currentNode = currentNode.next;
        }
        return result;
    },
    showArr: function () { //返回链表的ele组成的数组
        var currentNode = this.head;
        var result = [];

        while (currentNode.next != null && currentNode.next.ele != 'head') {
            result.push(currentNode.next.ele);
            currentNode = currentNode.next;
        }
        return result;
    },
    prev: function (step) { //链表指针向前移动指定次数
        var currentNode = this.currentNode;

        while (step > 0 && currentNode.prev) {
            if (currentNode.ele != 'head') step--;
            currentNode = currentNode.prev;
        }
        this.currentNode = currentNode;
    },
    next: function (step) { //链表指针向后移动指定次数
        var currentNode = this.currentNode;

        while (step > 0 && currentNode.next) {
            if (currentNode.ele != 'head') step--;
            currentNode = currentNode.next;
        }
        this.currentNode = currentNode;
    },
    show: function () { //显示当前指针的节点
        return this.currentNode;
    }
};

//链表递归实现约舍夫环
function killGame(num, step) {
    var people = new DList();

    people.insert(1, 'head');
    for (var i = 1; i < num; i++) {
        people.insert(i + 1, i);
    }

    var iNow = 0;
    var dir = 'head';

    function whileFn() {
        if (people.length < step) {
            return;
        }

        iNow++;
        dir = people.find(dir).next.ele;

        if (dir == 'head') {
            dir = people.find(dir).next.ele;
        }

        if (iNow == step) {
            var removeDir = dir;

            dir = people.find(dir).prev.ele;
            people.remove(removeDir);
            iNow = 0;
        }
        whileFn();
    };

    whileFn();

    console.log('幸存的位置是:' + people.showArr());
};

//循环链表实现约舍夫环
function killGame1(num, step) {
    var people = new DList();

    people.insert(1, 'head');
    for (var i = 1; i < num; i++) {
        people.insert(i + 1, i);
    }

    var iNum = 0;
    var pos = 'head';

    while (people.length >= step) {
        var rNode = people.find(pos).next.ele;

        if (rNode == 'head') rNode = people.find(rNode).next.ele;
        pos = rNode;

        iNum++;
        if (iNum == 3) {
            pos = people.find(rNode).prev.ele;
            if (pos == 'head') pos = people.find(pos).prev.ele;

            people.remove(rNode);
            iNum = 0;
        }
    }

    console.log('幸存的位置是:' + people.showArr());
};

/*
    7.3、设计模式
*/

//装饰者模式，在函数之前添加操作
//fn（原函数）
//beforeFn（添加在原函数之前的函数）
function before(fn, beforeFn) {
    return function () {
        beforeFn.apply(this, arguments);
        fn.apply(this, arguments);
    };
};

//装饰者模式，在函数之后添加操作
//fn（原函数）
//afterFn（添加在原函数之后的函数）
function after(fn, afterFn) {
    return function () {
        fn.apply(this, arguments);
        afterFn.apply(this, arguments);
    };
};

/*
    8.1、vue项目中用到
*/

//vue上拉加载插件
//This(vue对象)
//apiFn(获取数据的函数)
//json(提交给apiFn的json)
//list(vue对象里要改变的数组名字'')
//endFn1(第一次获取到数据后的回调，只走一次)
//endFn2(每次上拉加载完毕数据的回调函数)
//dataName(接口中数据的名字，默认是data)
//path(如果传入的path与当前的path相同，就不会触发hashchange清除scroll事件)
//iDis(上拉加载时，列表的位置会加上这个距离作为上拉位置的判断)
//以下是样式代码
// <div class="loading">
//  <span>正在加载中...</span>
//  <em>全部加载完毕...</em>
// </div>
// .loading{ width: 100%; height: 50px; line-height: 50px; text-align: center; background-color: #fff; position:relative; display: none;}
// .loading span,.loading em{ display: block; width: 120px; margin: 0 auto;  color: #666; font-size: 12px; display: none;}
// .loading span{ padding-left: 40px; background:url('/static/images/loading.gif') no-repeat 5px center; background-size:30px;}
// .loading.active,.loading.active1{ display: block;}
// .loading.active span{ display: block;}
// .loading.active1 em{ display: block;}
var pullLoading = function (This, apiFn, json, list, endFn1, endFn2, dataName, path, iDis) {
    //json克隆副本
    function Json(json) {
        return JSON.parse(JSON.stringify(json));
    };
    var loadOver = true;
    var getList = function (endFn, endFn1) {
        apiFn(json, function (data) {
            console.log(data);
            endFn1 && endFn1(data);
            setTimeout(function () {
                loadOver = true;
            }, 300);

            //加载完毕回调函数
            if (endFn2) {
                endFn2(endFn, data);
            } else {
                if (dataName) {
                    if (!data[dataName].length) {
                        endFn && endFn();
                        return;
                    }
                    This[list] = This[list].concat(Json(data[dataName]));
                } else {
                    if (!data.data.length) {
                        endFn && endFn();
                        return;
                    }
                    This[list] = This[list].concat(Json(data.data));
                }
            }
        });
    };
    getList(null, endFn1);

    $(document).on('scroll', scroll);

    function scroll() {
        var iSH = $(document).scrollTop() + document.documentElement.clientHeight;
        //有个报错
        if ($('.option.active').offset()) {
            var iEH = $('.option.active').offset().top + $('.option.active').height() + (iDis || 0);
        }

        if (iSH >= iEH && loadOver) {
            $('.loading').addClass('active');

            json.PageIndex += 1;
            json.nowpage += 1; //一期排行榜的页码
            if (loadOver) {
                loadOver = false;
                getList(function () {
                    $('.loading').addClass('active1');
                }, null, endFn2);
            }
        }
    }

    $(document).on('touchend', touchend);

    function touchend() {
        $('.loading').removeClass('active');
        $('.loading').removeClass('active1');
    }

    $(window).on('hashchange', function () {
        if (This.$router.currentRoute.path != path) {
            $(document).off('scroll', scroll);
            $(document).off('touchend', touchend);
        }
    });
};

/*
    9.1、react项目中用到
*/

//改变react内部state
function changeState(This, key, value) {
    This.setState({
        [key]: [value],
    });
};

//react单选框
//reactRadio(this,'radioValue',ev)
function reactRadio(This, key, ev) {
    var checked = ev.currentTarget.checked;
    var value = ev.currentTarget.value;

    This.setState({
        [key]: checked ? value : '',
    });
};

//react复选框
//普通：reactCheck(this,'checkArr',ev)
//全选：reactCheck(this,'checkArr',ev,'allCheck','checkPrefix',this.checkLength,true)
//选项控制全选:reactCheck(this,'checkArr',ev,'allCheck','allCheckValue',this.checkLength,false)
function reactCheck(This, key, ev, allCheck, prefix, checkLength, isAllCheck) {
    var checked = ev.currentTarget.checked;
    var value = ev.currentTarget.value;
    var checkArr = This.state[key];
    var allCheckValue = '';

    if (isAllCheck) {
        if (checked) {
            for (var i = 0; i < checkLength; i++) {
                if (checkArr.indexOf(prefix + i) == -1) checkArr.push(prefix + i);
            }
        } else {
            checkArr = [];
        }
    } else {
        if (checked && checkArr.indexOf(value) == -1) {
            checkArr.push(value);
        } else {
            checkArr = checkArr.filter((item, index) => item != value);
        }
    }

    if (isAllCheck && checked) {
        allCheckValue = value;
    } else if (checkArr.length >= checkLength) {
        allCheckValue = prefix;
    }
    This.setState({
        [allCheck]: allCheckValue,
        [key]: checkArr,
    });
};

//react下拉框
//单选：Type(key)=='string'
//多选：Type(key)=='array'
function reactSelect(This, key, ev) {
    var value = ev.target.value;
    var options = ev.target.options;
    var optionArr = [];

    if (Type(This.state[key]) == 'array') {
        optionArr = Object.values(options)
            .filter((item, index) => item.selected === true)
            .map((item1, index1) => item1.value);
    }

    This.setState({
        [key]: Type(This.state[key]) == 'array' ? optionArr : value,
    });
};

/*
    10.1、严格模式使用规则
*/

//严格模式使用规则
/*
    总结：
    一：禁用报错
    1、八进制表示法
    2、eval、arguments、es6新增的关键字做变量
    3、eval函数、with语句、函数下callee/caller

    二：删除报错
    1、系统内置属性
    2、var 声明的变量
    3、不可删除的属性

    三：语法报错
    1、对象有重名属性，函数有重名参数
    2、对象的只读属性进行赋值，禁止扩展的对象添加新属性
    3、变量必须声明，函数写在if或for内，外部调用

    四：差异
    1、arguments严格定义为参数，不再与形参绑定
    2、call/apply/bind的第一个参数不包装为对象，第一个参数为null/undefined时，this也为null/undefined

    查看列子：
    var examples=useStrictRule();

    examples['1'].example();//执行对应例子，去掉//'use strict';的注释，切换到严格模式对比两种模式的差异
*/
function useStrictRule() {
    var rule = {
        'a-Use': '严格模式的使用很简单，只有在代码首部加入字符串  "use strict"。必须在首部即首部指其前面没有任何有效js代码除注释，否则无效',
        'b-notes': {
            1: {
                description: '不使用var声明变量严格模式中将不通过，在循环中如果没有声明变量在非严格模式中很危险，i 会不小心溢出成为全局变量，但在严格模式中会报错，严格模式中变量必须显示声明(var/let/const)',
                example: function () {
                    //'use strict';

                    a = 1;
                    console.log(a);
                },
            },
            2: {
                description: 'JS中作用域有两种，全局作用域和函数作用域。严格模式带来了第三种作用域：eval作用域，则任何使用"eval"的操作都会被禁止,(eval() 函数可计算某个字符串，并执行其中的的 JavaScript 代码,不常用容易报错)，在严格模式下，arguments和eval是关键字，不能被修改，不能做变量处理',
                example: function () {
                    //'use strict';

                    var arguments;
                    var eval;
                    console.log(arguments, eval);
                },
            },
            3: {
                description: 'with()被禁用:with 语句用于设置代码在特定对象中的作用域。with 语句是运行缓慢的代码块，尤其是在已设置了属性值时。大多数情况下，如果可能，最好避免使用它。',
                example: function () {
                    //'use strict';

                    var json = { a: 1, b: 2 };

                    with(json) {
                        a = 2;
                        b = 3;
                    }
                    console.log(json);
                },
            },
            4: {
                description: 'callee/caller 被禁用',
                example: function () {
                    //'use strict';

                    function foo(num, result) {
                        if (num > 10) return result;
                        var result = result || 0;

                        result += num;
                        num++;
                        return arguments.callee(num, result);
                    };
                    console.log(foo(1));
                },
            },
            5: {
                description: '对禁止扩展的对象添加新属性会报错：Object.seal(obj)或者Object.preventExtensions(obj)；然后对obj增加属性则会报错',
                example: function () {
                    //'use strict';

                    var obj = {};

                    Object.preventExtensions(obj);
                    obj.a = 1;
                    console.log(obj);
                },
            },
            6: {
                description: '删除系统内置的属性会报错',
                example: function () {
                    //'use strict';

                    delete window.document;
                    console.log(document);
                },
            },
            7: {
                description: 'delete使用var声明的变量或挂在window上的变量报错',
                example: function () {
                    //'use strict';

                    var a = 1;

                    delete a;
                    console.log(a);
                },
            },
            8: {
                description: 'delete不可删除属性(isSealed或isFrozen)的对象时报错(Object.isSealed() 方法判断一个对象是否被密封。Object.isFrozen()方法判断一个对象是否被冻结。)',
                example: function () {
                    //'use strict';

                    var obj = { a: 1 };

                    Object.freeze(obj);
                    delete obj.a;
                    console.log(obj);
                },
            },
            9: {
                description: '对一个对象的只读属性进行赋值将报错,（Object.defineProperty(obj, "a", {value: 1, writable: false})然后对obj属性修改则会报错）',
                example: function () {
                    //'use strict';

                    var obj = { a: 1 };

                    Object.defineProperty(obj, 'a', {
                        value: 2,
                        writable: false,
                    });
                    obj.a = 3;
                    console.log(obj);
                },
            },
            10: {
                description: '对象有重名的属性将报错',
                example: function () {
                    //'use strict';

                    var obj = { a: 1, a: 2 };

                    console.log(obj);
                },
            },
            11: {
                description: '函数有重名的参数将报错，在严格模式下，函数的形参也不可以同名',
                example: function () {
                    //'use strict';

                    function foo(a, a) {
                        console.log(a);
                    };
                    foo(1, 2);
                },
            },
            12: {
                description: '八进制表示法被禁用，八进制最大为3位数',
                example: function () {
                    //'use strict';

                    var number = 070;

                    number = number.toString();
                    console.log(number);
                },
            },
            13: {
                description: 'arguments严格定义为参数，不再与形参绑定',
                example: function () {
                    //'use strict';

                    function foo(a, b) {
                        arguments[1] = 3
                        console.log(arguments);
                        console.log(b);
                    };
                    foo(1, 2);
                },
            },
            14: {
                description: '一般函数声明都在最顶层，ES5前的JS宽松，你可以写在if或for内（强烈鄙视这种写法）。当然Firefox的解析方式与其他浏览器不同，而在严格模式中这些写法将直接报错',
                example: function () {
                    //'use strict';

                    if (1) {
                        function foo() {
                            console.log(111);
                        };
                    }
                    foo();
                },
            },
            15: {
                description: 'ES6里新增的关键字不能当做变量标示符使用，如implements, interface, let, package, private, protected, public, static, yield',
                example: function () {
                    //'use strict';

                    var implements;
                    var interface;
                    var
                    let;
                    var package;
                    var private;
                    var protected;
                    var public;
                    var static;
                    var yield;
                },
            },
            16: {
                description: 'call/apply/bind的第一个参数直接传入不包装为对象',
                example: function () {
                    //'use strict';

                    function foo() {
                        console.log(this);
                    };
                    foo.call(1);
                },
            },
            17: {
                description: 'call/apply/bind的第一个参数为null/undefined时，this为null/undefined',
                example: function () {
                    //'use strict';

                    function foo() {
                        console.log(this);
                    };
                    foo.call(null);
                    foo.call(undefined);
                },
            },
        },
    };

    console.log(rule);
    return rule['b-notes'];
};