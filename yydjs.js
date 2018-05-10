// JavaScript Document

//防止网页被iframe嵌套
//if(window.top!=window.self)window.top.location=window.self.location;

//工具函数-->
//原生常用方法封装
function Id(id){
	return document.getElementById(id);
};
function Class(Class){
	return document.getElementsByClassName(Class);
};
function Tag(tag){
	return document.getElementsByTagName(tag);
};
function QS(Class){//带上选择符号(包括属性)，只能选一组中的一个元素
	return document.querySelector(Class);
};
function QSA(Class){//带上选择符号(包括属性)，能选一组元素
	return document.querySelectorAll(Class);
};
function Create(tag){
	return document.createElement(tag);
};
function Add(obj,obj1){
	obj.appendChild(obj1);
};
function Insert(obj,obj1,obj2){//父元素，要插入的元素，插入元素的后一个兄弟元素
	obj.insertBefore(obj1,obj2);
};
function Remove(obj,obj1){
	obj.removeChild(obj1);
};
function AddClass(obj,className){
	obj.classList.add(className);
};
function RemoveClass(obj,className){
	obj.classList.remove(className);
};
function ToggleClass(obj,className){
	obj.classList.toggle(className);
};
function HasClass(obj,className){
	return obj.classList.contains(className);
};
function parent(obj){
	return obj.parentElement||obj.parentNode;
};
function prevSibling(obj){
	return obj.previousElementSibling||obj.previousSibling;
};
function nextSibling(obj){
	return obj.nextElementSibling||obj.nextSibling;
};
function firstChild(obj){
	return obj.firstElementChild||obj.firstChild;
};
function lastChild(obj){
	return obj.lastElementChild||obj.lastChild;
};
function Scroll(obj,position,dis){
	var position='scroll'+position.toLowerCase().replace(/^[a-z]{1}/,position.charAt(0).toUpperCase());

	if(obj===document||obj===document.body){
		document.documentElement[position]=document.body[position]=dis;
	}else{
		obj[position]=dis;
	}
};

//开发与线上控制台模式切换
//arr(数组里面选定的都不输出)
function consoleNull(arr){
	for(var i=0;i<arr.length;i++){
		window.console[arr[i]]=function(){};
	}
};

//路由切换回到顶部防闪屏（用于单页应用）
function routerChange(){
	document.body.style.display='none';
    setTimeout(function(){
        document.body.style.display='block';
        document.documentElement.scrollTop=document.body.scrollTop=0;
    });
};

//判断数据类型的方法（对typeof的增强，7种常用类型的判断，返回小写字符串）
function Type(obj){
	var arr=['null','nan','function','number','string','array','object'];
	if(obj===null){
		return 'null';
	}
	if(obj!==obj){
		return 'nan';
	}
	if(typeof Array.isArray==='function'){
		if(Array.isArray(obj)){	//浏览器支持则使用isArray()方法
			return 'array';
		}
	}else{  					//否则使用toString方法
		if(Object.prototype.toString.call(obj)==='[object Array]'){
			return 'array';
		}
	}
	return (typeof obj).toLowerCase();
};

//判断数据类型的方法（对typeof的增强，9种类型的判断，返回小写字符串）
function Type1(obj){
	var arr=['null','nan','function','number','string','array','object','date','regexp'];
	var t,c,n;

	if(obj===null){
		return 'null';
	}
	if(obj!==obj){
		return 'nan';
	}
	if((t=typeof obj)!=='object'){
		return t.toLowerCase();
	}
	if((c=classof(obj))!=='Object'){
		return c.toLowerCase();
	}
	if(obj.constructor&&typeof obj.constructor==='function'&&(n=getName(obj))){
		return n.toLowerCase();
	}
	function classof(obj){
		return Object.prototype.toString.call(obj).slice(8,-1);
	};
	function getName(obj){
		if('name' in obj)return obj.name;
		return obj.name=obj.constructor.toString().match(/function\s*([^(]*)\(/)[1];
	};
	return 'object';
};

//数字四舍五入为指定位数的数字
function toFixed0(value,length,closeRound){
	var oldValue=value;
	var value=value+'';
	var arr=value.split('.');
	var length=length||0;
	var zero='';
	var rNum='';

	for(var i=0;i<length;i++){
		zero+='0';
	}

	if(Type(oldValue)=='number'){
		arr[1]=arr[1]?arr[1]+zero:zero;
		rNum=arr[1].substring(0,length);
		arr[1]=rNum+'.'+arr[1].substring(length,arr[1].length);

		if(Type(+arr[1])=='number'){
			if(!closeRound){
				arr[1]=Math.round(arr[1]);
			}else{
				arr[1]=arr[1].split('.')[0];
			}
		}

		if((arr[1]+'').length==1){
			rNum=rNum.split('');
			rNum[length-1]=arr[1];
			rNum=rNum.join('');
		}else{
			rNum=arr[1];
		}

		arr[1]=(rNum+zero).substring(0,length);
		arr=arr.join('.');
	}else{
		arr=oldValue;
	}

	return arr;
};

//获取对象样式
function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
};

//获取对象所有样式
function getAllStyle(obj){
	return obj.currentStyle?obj.currentStyle:getComputedStyle(obj,false);
};

//绑定事件，可重复绑定('事件名称'必须加引号)
function bind(obj,evname,fn){
	if(obj.addEventListener){
		obj.addEventListener(evname,fn,false);
		if(evname=='mousewheel'){
			obj.addEventListener('DOMMouseScroll',fn,false);
		}
	}else{
		obj.attachEvent('on'+evname,function(){
			fn.call(obj);
		});
	}
};

//取消绑定，可重复取消('事件名称'必须加引号)
function unbind(obj,evname,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(evname,fn,false);
	}else{
		obj.detachEvent('on'+evname,fn);
	}
};

//dom加载完毕执行函数
function domLoad(fn){
	var onOff=true;

	setTimeout(function(){
		if(document.readyState=='complete'){
			onOff&&fn&&fn('readyState');
			onOff=false;
		}
	});
	bind(document,'DOMContentLoaded',function(){
		onOff&&fn('DOMContentLoaded');
		onOff=false;
	});
	bind(document,'onreadystatechange',function(){
		onOff&&fn('onreadystatechange');
		onOff=false;
	});
	bind(window,'load',function(){
		onOff&&fn('load');
		onOff=false;
	});
};

//根据数据模板创建元素(防止xss攻击)
//el:元素名称string
//children:子元素array
function htmlTemplate(json){
	var parent=null;
	var children=json.children;
	var filterArr=['el','children'];
	var domArr=['class','checked','selected','readonly','disabled','innerText','outerText','innerHTML','outerHTML'];
	var noAttrArr=['innerText','outerText','innerHTML','outerHTML'];
	var reg=/^on/;

	parent=creatDom(json);
	function creatDom(json){
		var obj=document.createElement(json.el||'div');

		for(var attr in json){
			if(filterArr.indexOf(attr)==-1){
				if(domArr.indexOf(attr)!=-1||attr.match(reg)){
					obj[attr=='class'?attr+'Name':attr]=json[attr];
				}else if(noAttrArr.indexOf(attr)==-1){
					obj.setAttribute(attr,json[attr]);
				}
			}
		}

		return obj;
	};

	creatChild(parent,children);
	function creatChild(currentParent,children){
		if(!children)return;

		for(var i=0;i<children.length;i++){
			var childDom=creatDom(children[i]);

			currentParent.appendChild(childDom);
			creatChild(childDom,children[i].children);
		}
	};

	return parent;
};

//科学运算（解决js处理浮点不正确的问题）
//num1（要进行运算的第一个数字）
//operator（运算符号,+,-,*,/）
//num2（要进行运算的第二个数字）
function computed(num1,operator,num2){
	var length1=(num1+'').split('.')[1];
	length1=length1?length1.length:0;
	var length2=(num2+'').split('.')[1];
	length2=length2?length2.length:0;

	var integer1=Math.pow(10,length1);
	var integer2=Math.pow(10,length2);
	var iMax=Math.max(integer1,integer2);
	var result='';

	switch(operator){
		case '+':
				num1=num1*iMax;
				num2=num2*iMax;
				result=(num1+num2)/iMax;
			break;
		case '-':
				num1=num1*iMax;
				num2=num2*iMax;
				result=(num1-num2)/iMax;
			break;
		case '*':
				num1=num1*integer1;
				num2=num2*integer2;
				result=(num1*num2)/integer1;
				result=result/integer2;
			break;
		case '/':
				num1=num1*integer1;
				num2=num2*integer2;
				result=(num1/num2)/integer1;
				result=result/integer2;
			break;
	}
	return result;
};

//网络处理
function networkHandle(onlineFn,offlineFn){
	var oMask=document.createElement('div');
	var oWrap=document.createElement('div');
	var textArr=['当前无网络连接！','网络连接已恢复！'];

	oMask.style.cssText='width:100%; height:100%; background-color:rgba(0,0,0,0.6); position:fixed; left:0; top:0; z-index:999999999;';
	oWrap.style.cssText='width:200px; height:50px; line-height:50px; text-align:center; border-radius:5px; background-color:#fff; font-size:16px; position:absolute; left:0; top:0; right:0; bottom:0; margin:auto; z-index:10;';
	oMask.appendChild(oWrap);

	window.onoffline=function(){
		oWrap.innerHTML=textArr[0];
		document.body.appendChild(oMask);
		offlineFn&&offlineFn();
	};
	window.ononline=function(){
		oWrap.innerHTML=textArr[1];
		setTimeout(function(){
			document.body.removeChild(oMask);
			window.location.reload();
		},3000);
		onlineFn&&onlineFn();
	};
};

//限制输入类型
//oninput="inputType(this,0)"
function inputType(This,index){
	var arr=[
				This.value.replace(/[^\d]+/g,''),//数字类型0
				This.value.replace(/[^a-zA-Z]+/g,''),//字母类型1
				This.value.replace(/[^a-zA-Z]+/g,'').toLowerCase(),//字母类型小写2
				This.value.replace(/[^a-zA-Z]+/g,'').toUpperCase(),//字母类型大写3
				This.value.replace(/[^\w]+/g,''),//数字和字母类型4
				This.value.replace(/[^\w]+/g,'').toLowerCase(),//数字和字母类型小写5
				This.value.replace(/[^\w]+/g,'').toUpperCase(),//数字和字母类型大写6
				This.value.replace(/[^\u2E80-\u9FFFa-zA-Z]+/g,''),//汉字和英文7
			];
	This.value=arr[index||0];
};

//自动点击事件
function autoEvent(obj,event){
	if(document.createEvent){
        var evObj=document.createEvent('MouseEvents');

        evObj.initEvent(event,true,false);
        obj.dispatchEvent(evObj);
	}else if(document.createEventObject){
  		obj.fireEvent(event);
	}
};

//自定义事件的实现
var customEvent={
	json:{},
	on:function(evName,fn){
		if(Type(this.json[evName])!='object'){
			this.json[evName]={};
		}
		if(Type(fn)=='function'){
			fn.id=soleString32();
			this.json[evName][fn.id]=fn;
		}
		return this;
	},
	emit:function(evName,data){
		var evFnArr=this.json[evName];

		if(Type(evFnArr)=='object'){
			for(var attr in this.json[evName]){
				if(Type(this.json[evName][attr])=='function'){
					this.json[evName][attr](data);
				}
			}
		}
		return this;
	},
	remove:function(evName,fn){
		var evFnArr=this.json[evName];

		if(Type(evName)=='string'&&Type(evFnArr)=='object'){
			if(Type(fn)=='function'){
				if(fn.id){
					delete this.json[evName][fn.id];
				}else{
					for(var attr in this.json[evName]){
						if(this.json[evName][attr]+''===fn+''){
							delete this.json[evName][attr];
							break;
						}
					}
				}
			}else{
				delete this.json[evName];
			}
		}
		return this;
	}
};

//自定义dom事件的实现
//emit发送的data在obj的emitData属性里
var customDomEvent={
	on:function(obj,evName,fn){
		//console.dir(obj);
		if(obj['on'+evName]===undefined){
			if(Type(obj[evName])!='object'){
				obj[evName]={};
			}
			if(Type(fn)=='function'){
				fn.id=soleString32();
				obj[evName][fn.id]=fn;
			}
		}else{
			bind(obj,evName,fn);
		}
		return this;
	},
	emit:function(obj,evName,data){
		var evFnArr=obj[evName];

		if(obj['on'+evName]===undefined){
			if(Type(evFnArr)=='object'){
				for(var attr in obj[evName]){
					if(Type(obj[evName][attr])=='function'){
						obj[evName][attr](data);
					}
				}
			}
		}else{
			obj.emitData=data;
			autoEvent(obj,evName);
		}
		return this;
	},
	remove:function(obj,evName,fn){
		var evFnArr=obj[evName];

		if(obj['on'+evName]===undefined){
			if(Type(evName)=='string'&&Type(evFnArr)=='object'){
				if(Type(fn)=='function'){
					if(fn.id){
						delete obj[evName][fn.id];
					}else{
						for(var attr in obj[evName]){
							if(obj[evName][attr]+''===fn+''){
								delete obj[evName][attr];
								break;
							}
						}
					}
				}else{
					delete obj[evName];
				}
			}
		}else{
			unbind(obj,evName,fn);
		}
		return this;
	}
};

//js全屏模式api(注意，必须要用户点击事件触发，自动触发的事件和mouseover无效)
//obj(进入全屏模式的元素)
//enter(进入全屏模式)
//exit(退出全屏模式)
//fullElement(全屏显示的网页元素)
//IsFullScreen(是否是全屏模式，ie下无效)
function getFullscreenAPI(obj){
	var dE=obj||document.documentElement;
	var arr=['requestFullscreen','mozRequestFullScreen','webkitRequestFullscreen','msRequestFullscreen'];
	var arr1=['','moz','webkit','ms'];
	var arr2=['exit','mozCancel','webkitExit','msExit'];
	var api={};

	for(var i=0;i<arr.length;i++){
		if(dE[arr[i]]){
			api={
				enterK:arr1[i]+(arr1[i]?'R':'r')+'equestFullscreen',
				exitK:arr2[i]+'Fullscreen',
				elementK:arr1[i]+(arr1[i]?'F':'f')+'ullscreenElement',
				isFullScreen:arr1[i]+(arr1[i]?'I':'i')+'sFullScreen'
			};
			break;
		}
	}

	if(api){
		api.enter=function(){ dE[api.enterK]()};
		api.exit=function(){ return document[api.exitK]()};
		api.fullElement=function(){ return document[api.elementK]};
		api.IsFullScreen=function(){ return document[api.isFullScreen]};
	}
	return api;
};

//浏览器文本操作方法，复制，剪辑有效
function textHandle(obj,index){
	var arr=['Copy','Cut'];
	obj.select();
	document.execCommand(arr[index||0]);
};

//浏览器通知
//Notification.permission属性，用于读取用户给予的权限，它是一个只读属性，它有三种状态。
//default：用户还没有做出任何许可，因此不会弹出通知。
//granted：用户明确同意接收通知。
//denied：用户明确拒绝接收通知。

//json(通知的配置项)
//title：通知标题
//body：通知内容
//tag：通知的ID，格式为字符串。一组相同tag的通知，不会同时显示，只会在用户关闭前一个通知后，在原位置显示
//icon：图表的URL，用来显示在通知上
//dir：文字方向，可能的值为auto、ltr（从左到右）和rtl（从右到左），一般是继承浏览器的设置
//lang：使用的语种，比如en-US、zh-CN

//json1(通知的事件)
//show：通知显示给用户时触发
//click：用户点击通知时触发
//close：用户关闭通知时触发
//error：通知出错时触发（大多数发生在通知无法正确显示时）
function notification(json,json1){
	json.title=json.title||'无标题';
	json.body=json.body||'无内容';

	if(window.Notification&&Notification.permission!=="denied"){
		Notification.requestPermission(function(status){
			var n=new Notification(json.title,json);

			for(var attr in json1){
				n[attr]=json1[attr];
			}
		});
	}
};

//获取到document的位置
function getPos(obj,attr){
	var obj1=obj;
	var value=0;
	var iPos=0;
	var i=0;

	while(obj){
		iPos=attr=='left'?obj.offsetLeft:iPos=obj.offsetTop;
		value+=iPos;
		obj=obj.offsetParent;
		i++;
	}
	return value;
};

//获取到document的位置1(返回一个包含left,top的json)
function getPos1(obj){
	var obj1=obj;
	var left=0;
	var top=0;
	var i=0;

	while(obj){
		left+=obj.offsetLeft;
		top+=obj.offsetTop;
		obj=obj.offsetParent;
		i++;
	}
	return {'left':left,'top':top};
};

//碰撞检测(配合定时器使用)
function collide(obj1,obj2){
	var l1=obj1.offsetLeft;
	var r1=obj1.offsetLeft+obj1.offsetWidth;
	var t1=obj1.offsetTop;
	var b1=obj1.offsetTop+obj1.offsetHeight;

	var l2=obj2.offsetLeft;
	var r2=obj2.offsetLeft+obj2.offsetWidth;
	var t2=obj2.offsetTop;
	var b2=obj2.offsetTop+obj2.offsetHeight;

	return r1<l2||l1>r2||b1<t2||t1>b2?false:true;
};

//生成32位唯一字符串(大小写字母数字组合)
function soleString32(){
	var str='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var timestamp=+new Date()+Math.floor(Math.random()*10);
	var resultStr='';

	for(var i=0;i<19;i++){
		resultStr+=str.charAt(Math.floor(Math.random()*str.length));
	}
	resultStr+=timestamp;

	resultStr=resultStr.split('');
	resultStr.sort(function(a,b){
		return Math.random()-0.5;
	});
	resultStr=resultStr.join('');
	return resultStr;
};

//实时监测两组物体碰撞并返回数据(性能良好：小于或等于2500次循环，性能上限：大于或等于10000次循环)
//class1，一组要做碰撞检测的元素的选择器字符串
//class2，另一组要做碰撞检测的元素的选择器字符串
//endFn，回调函数(处理逻辑)
//data[//返回的数据包
//	{
//		exist1:true,//碰撞元素1是否存在于碰撞数组
//		exist2:true,//碰撞元素2是否存在于碰撞数组
//		isRemove:true,//是否可以安全删除两个元素(两个元素都不存在于碰撞数组)
//		obj1:obj1,//碰撞到的元素1
//		obj2:obj2,//碰撞到的元素2
//		pos1:{//碰撞元素1的位置
//			left:left,
//			top:top,
//		},
//		pos2:{//碰撞元素2的位置
//			left:left,
//			top:top,
//		},
//	}
//];
function watchObjectPZ(class1,class2,endFn){
	var colJson={};//保留准备处理的id

	yydTimer(function(){
		var data=[];

		for(var i=0;i<QSA(class1).length;i++){
			for(var j=0;j<QSA(class2).length;j++){
				if(collide(QSA(class1)[i],QSA(class2)[j])){
					var exist1=false;
					var exist2=false;
					var condition=!colJson[QSA(class1)[i].id]&&!colJson[QSA(class2)[j].id];

					//元素是否存在于碰撞数组里
					if(colJson[QSA(class1)[i].id])exist1=true;
					if(colJson[QSA(class2)[j].id])exist2=true;

					//用来存储碰撞后的id，以备下次判断使用
					if(condition)colJson[QSA(class1)[i].id]=1;
					if(condition)colJson[QSA(class2)[j].id]=1;

					data.push({
						exist1:exist1,
						exist2:exist2,
						isRemove:condition,
						obj1:QSA(class1)[i],
						obj2:QSA(class2)[j],
						pos1:{
							left:QSA(class1)[i].offsetLeft,
							top:QSA(class1)[i].offsetTop,
						},
						pos2:{
							left:QSA(class2)[j].offsetLeft,
							top:QSA(class2)[j].offsetTop,
						},
					});
					if(condition)break;
				}
			}
		}
		if(data.length){
			endFn&&endFn(data);
		}
	},1000/60);
};

//foreach改良(加上this.break()方法用来跳出循环)
function foreach(arr,fn){
	var oError=new Error('StopIteration');

	arr.break=function(){
		throw oError;
	};

	try{
		arr.forEach(function(item,index,array){
			fn&&fn.call(arr,item,index,array);
		});
	}catch(e){
		if(e===oError){
			return;
		}else{
			throw e;
		}

	}
};

//时间变成两位数
function toTwo(n){
	return n<10? '0'+n: ''+n;
};

//传入日期和当前日期的差
function countDtime(time){
	var reg=/\-+/g;
	var time=time.replace(reg,'/');
	var dTime=0;

	dTime=new Date(time)-new Date(dateFormat0(new Date(),'yyyy/MM/dd'));
	return dTime;
};

//输入未来时间,返回倒计时json
function getDown(year,month,date,hours,minutes,seconds){
	var future=new Date(year+' '+month+' '+date+' '+hours+':'+minutes+':'+seconds).getTime();
	var now=new Date().getTime();
	var t=Math.floor( (future-now)/1000);
	return {'d':Math.floor(t/86400),'h':Math.floor(t%86400/3600),'m':Math.floor(t%86400%3600/60),'s':t%60};
};

//算出本月天数
function manyDay(year,month){
	var nextMonth=new Date(year,month,0);//本月第0天就是最后一天，-1=倒数第二天
	return nextMonth.getDate();
};

//正常化日期
function normalDate(oDate){
	var oDate=oDate;
	var reg=/\-+/g;

	if(Type(oDate)=='string'){
		oDate=oDate.split('.')[0];//解决ie浏览器对yyyy-MM-dd HH:mm:ss.S格式的不兼容
		oDate=oDate.replace(reg,'/');//解决苹果浏览器对yyyy-MM-dd格式的不兼容性
	}

	oDate=new Date(oDate);
	return oDate;
};

//日期格式化函数
//oDate（时间戳或字符串日期都支持）
//fmt（格式匹配）
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//dateFormat0(new Date(),'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
//dateFormat0(new Date(),'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
function dateFormat0(oDate,fmt){
	var fmt=fmt||'yyyy/MM/dd hh:mm:ss';
	var oDate=normalDate(oDate);
	var date={
		"M+":oDate.getMonth()+1,                 //月份
		"d+":oDate.getDate(),                    //日
		"h+":oDate.getHours(),                   //小时
		"m+":oDate.getMinutes(),                 //分
		"s+":oDate.getSeconds(),                 //秒
		"q+":Math.floor((oDate.getMonth()+3)/3), //季度，+3为了好取整
		"S":oDate.getMilliseconds()              //毫秒
	};

	if(/(y+)/.test(fmt)){//RegExp.$1(正则表达式的第一个匹配，一共有99个匹配)
		fmt=fmt.replace(RegExp.$1,(oDate.getFullYear()+'').substr(4-RegExp.$1.length));
	}

	for(var attr in date){
		if(new RegExp('('+attr+')').test(fmt)){
			fmt=fmt.replace(RegExp.$1,RegExp.$1.length==1?date[attr]:('00'+date[attr]).substring((date[attr]+'').length));
		}
	}

	return fmt;
};

//时间格式化(主要用于格式化历史时间到当前时间是多少秒到多少年前)
//oDate（时间戳或字符串日期都支持）
function dateFormat1(oDate){
	var oDate=normalDate(oDate);

	if(+oDate>=+new Date()){
		return '刚刚';
	}
	var lookTime=+new Date()-(+oDate);
	var	seconds=Math.floor(lookTime/(1000));
	var minutes=Math.floor(lookTime/(1000*60));
	var hours=Math.floor(lookTime/(1000*60*60));
	var days=Math.floor(lookTime/(1000*60*60*24));
	var months=Math.floor(lookTime/(1000*60*60*24*30));
	var years=Math.floor(lookTime/(1000*60*60*24*30*12));

	if(seconds<60){
		lookTime=seconds+'秒前';
	}else if(minutes<60){
		lookTime=minutes+'分钟前';
	}else if(hours<24){
		lookTime=hours+'小时前';
	}else if(days<30){
		lookTime=days+'天前';
	}else if(months<12){
		lookTime=months+'个月前';
	}else{
		lookTime=years+'年前';
	}
	return lookTime;
};

//金额格式化
function amountFormat0(value,length){
	var oldValue=value;
	var value=+value;
	var arr=[];
	var length=length||2;
	var zero='';

	for(var i=0;i<length;i++){
		zero+='0';
	}

	if(Type(value)=='number'){
		value+='';
		value=value.split('.');
		value[0]=value[0].split('');
		value[1]=(value[1]||'')+zero;
		value[1]=value[1].substring(0,length);

		arr.unshift('.',value[1]);
		while(value[0].length>3){
			arr.unshift(',',value[0].splice(value[0].length-3,3).join(''));
		}

		arr=value[0].join('')+arr.join('');
	}else{
		arr=oldValue;
	}

	if(arr&&arr.length)arr=arr.replace('-,','-');
	return arr;
};

//定时器增强requestAnimationFrame与setInterval兼容
function yydTimer(fn,msec){
	var id=null;
	var lastT=null;
	var msec=msec||1000/60;

	if(msec<17.1)msec=17.1;//解决间隔小于17.1的BUG
	if(window.requestAnimationFrame){
		function animate(time){
			id=requestAnimationFrame(animate);

			if(lastT==null){
				lastT=parseInt(time);
			}
			if(parseInt(time)%msec<lastT){
				fn&&fn(clear,id);
			}
			lastT=parseInt(time)%msec;

			function clear(){
				cancelAnimationFrame(id);
			};
			window.onhashchange=function(){
				clear();
			};
		};
		id=requestAnimationFrame(animate);
	}else{
		id=setInterval(function(){
			fn&&fn(clear,id);
		},msec);

		function clear(){
			clearInterval(id);
		};
		window.onhashchange=function(){
			clear();
		};
	}
};

//模仿animation的动画插件
//obj(要做动画的对象)
//json(做动画的样式)
//var show={
//			0.1:{
//				transform:'rotateX(-120deg)',
//			},
//			1:{
//				transform:'rotateX(0deg)',
//			},
//		};
//mesc(动画执行的总时间，单位毫秒)
//type(动画的运动类型)
function keyframes(obj,json,mesc,type){
	var mesc=mesc||1000;
	var type=type||'linear';

	for(var attr in json){
		(function(attr,json){
			setTimeout(function(){
				var json1=json[attr];

				obj.style.transition='all '+attr*mesc+'ms '+type;
				obj.style.WebkitTransition='all '+attr*mesc+'ms '+type;
				for(var attr1 in json1){
					obj.style[attr1]=json1[attr1];
				}
			},attr*mesc);
		})(attr,json);
	}
};

//布局转换
function layoutChange(obj){
	for(var i=0;i<obj.length;i++){
		obj[i].style.left=obj[i].offsetLeft+'px';
		obj[i].style.top=obj[i].offsetTop+'px';
	}
	for(var i=0;i<obj.length;i++){
		obj[i].style.position='absolute';
		obj[i].style.margin='0';
	}
};

//获取数组最小值
function getMin(arr){
	var iMin=+Infinity;

	for(var i=0;i<arr.length;i++){
		if(arr[i]<iMin){
			iMin=arr[i];
		}
	}
	return iMin;
};

//获取数组最大值
function getMax(arr){
	var iMax=-Infinity;

	for(var i=0;i<arr.length;i++){
		if(arr[i]>iMax){
			iMax=arr[i];
		}
	}
	return iMax;
};

//数组去重
function noRepeat(arr){
	for(var i=0;i<arr.length;i++){
		for(var j=i+1;j<arr.length;j++){
			if(arr[i]==arr[j]){
				arr.splice(j,1);
				j--;
			}
		}
	}
};

//数组去重(利用json)
function noRepeat1(arr){
	var json={};
	var result=[];

	for(var i=0;i<arr.length;i++){
		if(!json[arr[i]]){
			json[arr[i]]=1;//不为0就行，为真就可以
			result.push(arr[i]);
		}
	}
	return result;
};

//选中文字兼容
function selectText(){
	return 	document.selection? document.selection.createRange().text //ie下
								:window.getSelection().toString(); //标准下
};

//获取对象URL兼容
function createObjectURL(blob){
	if(window.URL){
		return window.URL.createObjectURL(blob);
	}else if(window.webkitURL){
		return window.webkitURL.createObjectURL(blob);
	}else{
		return null;
	}
};

//图片上传预览
function preview(oInp,oImg){
	for(var i=0;i<oInp.length;i++){
		oInp[i].index=i;
		oInp[i].onchange=function(){
			oImg[this.index].src=createObjectURL(this.files[0]);
		};
	}
};

//重置file文件
//obj(file文件对象)
function resetFile(obj){
	var oFrom=document.createElement('form');
	var oParent=obj.parentNode;

	oFrom.appendChild(obj);
	oFrom.reset();
	oParent.appendChild(obj);
};

//canvas画笔(兼容手机和电脑端)
//obj(canvas标签对象)
//lineWidth(画笔线框)
//color(画笔颜色)
//endFn(在touchend后会输出dataUrl)
function brush(obj,lineWidth,color,endFn){
	var oGC=obj.getContext('2d');
	//console.dir(oGC);

	oGC.lineWidth=lineWidth||1;
	oGC.strokeStyle=color||'#000';

	isPhone()?mo():pc();

	function mo(){
		bind(obj,'touchstart',function(ev){
			var ev=ev||event;

			oGC.moveTo(ev.changedTouches[0].clientX-obj.offsetLeft,ev.changedTouches[0].clientY-obj.offsetTop);
		});

		bind(obj,'touchmove',function(ev){
			var ev=ev||event;

			oGC.lineTo(ev.changedTouches[0].clientX-obj.offsetLeft,ev.changedTouches[0].clientY-obj.offsetTop);
			oGC.stroke();
		});

		bind(obj,'touchend',function(){
			endFn&&endFn(obj.toDataURL());
		});
	};

	function pc(){
		obj.onmousedown=function(ev){
			var ev=ev||event;
			oGC.moveTo(ev.clientX-obj.offsetLeft,ev.clientY-obj.offsetTop);

			if(obj.setCapture)obj.setCapture;
			document.onmousemove=function(ev){
				var ev=ev||event;

				oGC.lineTo(ev.clientX-obj.offsetLeft,ev.clientY-obj.offsetTop);
				oGC.stroke();
			};
			document.onmouseup=function(){
				document.onmousemove=document.onmouseup=null;
				if(obj.releaseCapture)obj.releaseCapture;
				endFn&&endFn(obj.toDataURL());
			};
			return false;
		};
	};
};

//canvas获取坐标的rgba值
function getXY(obj,x,y){
	var w=obj.width;
	var h=obj.height;
	var d=obj.data;
	var color=[];
	color[0]=d[4*(y*w+x)];
	color[1]=d[4*(y*w+x)+1];
	color[2]=d[4*(y*w+x)+2];
	color[3]=d[4*(y*w+x)+3];
	return color;
};

//canvas设置坐标的rgba颜色
function setXY(obj,x,y,color){
	var w=obj.width;
	var h=obj.height;
	var d=obj.data;
	d[4*(y*w+x)]=color[0];
	d[4*(y*w+x)+1]=color[1];
	d[4*(y*w+x)+2]=color[2];
	d[4*(y*w+x)+3]=color[3];
};

//生成canvas图片反色
function cInverse(obj,src){
	var c=obj;
	var cg=obj.getContext('2d');
	var nImg=new Image();

	nImg.src=src;
	nImg.onload=function(){
		c.width=nImg.width;
		c.height=nImg.height;

		cg.drawImage(nImg,0,0);
		var oImg=cg.getImageData(0,0,nImg.width,nImg.height);
		var iWidth=oImg.width;
		var iHeight=oImg.height;

		for(var i=0;i<iWidth;i++){
			for(var j=0;j<iHeight;j++){
				var rgba=[];
				var color=getXY(oImg,i,j);

				rgba[0]=255-color[0];
				rgba[1]=255-color[1];
				rgba[2]=255-color[2];
				rgba[3]=255;
				setXY(oImg,i,j,rgba);
			}
		}
		cg.putImageData(oImg,0,0);
	};
};

//生成canvas图片倒影
function cReflection(obj,src){
	var c=obj;
	var cg=obj.getContext('2d');
	var nImg=new Image();

	nImg.src=src;
	nImg.onload=function(){
		c.width=nImg.width;
		c.height=nImg.height;

		cg.drawImage(nImg,0,0);
		var oImg=cg.getImageData(0,0,nImg.width,nImg.height);
		var iWidth=oImg.width;
		var iHeight=oImg.height;

		var cImg=cg.createImageData(iWidth,iHeight);
		for(var i=0;i<iWidth;i++){
			for(var j=0;j<iHeight;j++){
				var rgba=[];
				var color=getXY(oImg,i,j);

				rgba[0]=color[0];
				rgba[1]=color[1];
				rgba[2]=color[2];
				rgba[3]=255;
				setXY(cImg,i,iHeight-j,rgba);
			}
		}
		cg.putImageData(cImg,0,0);
	};
};

//生成canvas图片渐变
function cGradient(obj,src){
	var c=obj;
	var cg=obj.getContext('2d');
	var nImg=new Image();

	nImg.src=src;
	nImg.onload=function(){
		c.width=nImg.width;
		c.height=nImg.height;

		cg.drawImage(nImg,0,0);
		var oImg=cg.getImageData(0,0,nImg.width,nImg.height);
		var iWidth=oImg.width;
		var iHeight=oImg.height;

		var cImg=cg.createImageData(iWidth,iHeight);
		for(var i=0;i<iWidth;i++){
			for(var j=0;j<iHeight;j++){
				var rgba=[];
				var color=getXY(oImg,i,j);

				rgba[0]=color[0];
				rgba[1]=color[1];
				rgba[2]=color[2];
				rgba[3]=255*j/iHeight;
				setXY(cImg,i,j,rgba);
			}
		}
		cg.putImageData(cImg,0,0);
	};
};

//生成canvas图片马赛克
function cMosaic(obj,src,m){
	var c=obj;
	var cg=obj.getContext('2d');
	var nImg=new Image();
	var m=m||5;

	nImg.src=src;
	nImg.onload=function(){
		c.width=nImg.width;
		c.height=nImg.height;

		cg.drawImage(nImg,0,0);
		var oImg=cg.getImageData(0,0,nImg.width,nImg.height);
		var iWidth=oImg.width;
		var iHeight=oImg.height;
		var cImg=cg.createImageData(iWidth,iHeight);
		var stepW=iWidth/m;
		var stepH=iHeight/m;

		for(var i=0;i<stepW;i++){
			for(var j=0;j<stepH;j++){
				var color=getXY(oImg,i*m+Math.floor(Math.random()*m),j*m+Math.floor(Math.random()*m));
				for(var k=0;k<m;k++){
					for(var l=0;l<m;l++){
						setXY(cImg,i*m+k,j*m+l,color);
					}
				}
			}
		}
		cg.putImageData(cImg,0,0);
	};
};

//内核前缀查询
function getPrefix(){
	var style=document.body.style||document.documentElement.style;
	var arr=['webkit','khtml','moz','ms','o'];
	for(var i=0;i<arr.length;i++){
		if (typeof style[arr[i]+'Transition']=='string'){
			document.title='内核前缀：-'+arr[i];
		}
	}
};

//判断是否是手机浏览器
function isPhone(){
	var reg=/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
	return window.navigator.userAgent.match(reg)?true:false;
};

//判断是否是微信浏览器
function isWeixin(){
	var ua=navigator.userAgent.toLowerCase();
 	return ua.match(/MicroMessenger/i)=='micromessenger'?true:false;
};

var cookie={
	set:function(key,value,mesc){//设置cookie
		var oDate=new Date();

		oDate.setSeconds(oDate.getSeconds()+(mesc||60*60*24*30));//不传过期秒数默认30天过期
		document.cookie=key+'='+encodeURIComponent(value)+';expires='+oDate;
	},
	get:function(key){//获取cookie
		var str=document.cookie;
		var reg1=/\=+/g;
		var reg2=/\;+/g;

		str=str.replace(reg1,'":"');
		str=str.replace(reg2,'","');
		str='{"'+str;
		str+='"}';
		str=JSON.parse(str);
		return decodeURIComponent(str[key]);
	},
	remove:function(key){//删除cookie
		var oDate=new Date();

		oDate.setDate(oDate.getDate()-1);
		document.cookie=key+'='+''+';expires='+oDate.toGMTString();
	},
};

var Store=function(){
	this.name='Store';
};

Store.prototype={
	init:function(options){
		this.store=function(){
			return options.type;
		};
		return this;
	},
	set:function(key,value){
		var type=Type(value);

		switch(type){
			case 'object':
							this.store().setItem(key,JSON.stringify(value));
						break;
			case 'array':
							this.store().setItem(key,'['+value+']');
						break;
			case 'function'://如果是函数先用eval()计算执行js代码
							this.store().setItem(key,value);
						break;
			default :
							this.store().setItem(key,value);
		}

	},
	get:function(key){
		var value=this.store().getItem(key);

		try{
			value=JSON.parse(value);
		}catch(e){}
		return value;
	},
	getAll:function(){
		var json={};
		var value='';

		for(var attr in this.store()){
			try{
				value=JSON.parse(this.store()[attr]);
			}catch(e){}
			json[attr]=value;
		}
		return 	json;
	},
	remove:function(key){
		this.store().removeItem(key);
	},
	clear:function(){
		this.store().clear();
	},
};

var lStore=new Store().init({
	'type':window.localStorage,
});

var sStore=new Store().init({
	'type':window.sessionStorage,
});

//获取多个任意class(class之间用逗号隔开)
function getClass(parent,tagN,classN){
var allTag=parent.getElementsByTagName(tagN),
 	arrClass=classN.split(','),
	arr=[];
	for(var i=0;i<allTag.length;i++){
	var aClass=allTag[i].className.split(' ');
		for(var j=0;j<arrClass.length;j++){
			for(var k=0;k<aClass.length;k++){
				if(aClass[k]==arrClass[j]){
				arr.push(allTag[i]);
				break;
				}
			}
		}
	}
	return arr;
};

//配合正则获取单个class
function getByClass(parent,tagN,classN){
	var allTag=parent.getElementsByTagName(tagN);
	var arr=[];
	var re=new RegExp('\\b'+classN+'\\b','i');
	var i=0;
	for(var i=0;i<allTag.length;i++){
		if(re.test(allTag[i].className)){
			arr.push(allTag[i]);
		}
	}
	return arr;
};

//添加任意class
function addClass(obj,classN){
	if(!obj.className){
	obj.className=classN;
	}else{
	var arrClass=obj.className.split(' '),
		index=arrIndexOf(arrClass,classN);
		if(!index){
		obj.className+=' '+classN;
		}
	}
};

//移除任意class
function removeClass(obj,classN){
	if(obj.className){
	var arrClass=obj.className.split(' '),
		index=arrIndexOf(arrClass,classN);
		if(index){
		arrClass.splice(index,1);
		obj.className=arrClass.join(' ');
		}
	}
};

//用js修改样式表
//linkHref（样式表完整名称）
//className(想要修改的选择器完整名称)
//json(json格式去写样式)
function jsStyle(linkHref,className,json){
	var sheets=document.styleSheets;//拿到所有样式表
	var sheet=null;

	for(var i=0;i<sheets.length;i++){
		if(sheets[i].href){
			var sHref=sheets[i].href;
			sHref=sHref.substring(sHref.lastIndexOf('/')+1,sHref.length);

			if(sHref==linkHref){
				sheet=sheets[i];//拿到样式表对象
			}
		}
	}

	var rules=sheet.cssRules||sheet.rules;//拿到所有的样式
	var rule=null;

	for(var i=0;i<rules.length;i++){
		if(rules[i].selectorText==className){
			rule=rules[i];//拿到想要操作的那条样式
			for(var attr in json){
				rule.style[attr]=json[attr];
			}
		}
	}
	return rule.cssText;
};

//返回当前地址?后面的参数的json格式(用于submit提交的str='1'&str1='2'格式)
function strToJson(str){
	var str=str||window.location.search;
	var reg=/&+/g;
	var reg1=/=+/g;

	str=decodeURI(str);
	str=str.replace('?','');
	str=str.replace(reg,'","');
	str=str.replace(reg1,'":"');
	str='{"'+str+'"}';
	str=JSON.parse(str);
	return str;
};

//返回当前地址?后面的参数的json格式(用于自己拼接的str={}&str1={}格式)
//注意要拼接标准json格式
function strToJson1(str){
	var str=str||window.location.search;
	var reg=/&+/g;
	var reg1=/=+/g;
	var reg2=/^\?$/;

	str=decodeURI(str);
	str=reg2.test(str)?str.replace('?','"'):'"'+str;
	str=str.replace(reg,',"');
	str=str.replace(reg1,'":');
	str='{'+str+'}';
	str=JSON.parse(str);
	return str;
};

//传入json，转换成带?的表单格式的url地址
//json(要转换的对象)
//arr(要删除json的key的数组)
//href(要定制的href)
function jsonToStr(json,arr,href){
	var str='';
	var href=href||(window.location.origin+window.location.pathname);

	for(var i=0;i<arr.length;i++){
		delete json[arr[i]];
	}
	for(var attr in json){
		str+=attr+'='+json[attr]+'&';
	}
	str=href+'?'+str.substr(0,str.length-1);
	return str;
};

//对象截取增强方法，返回截取后的对象，非变异方法(string,array,object)
//obj(要截取的对象)
//posiCut(根据[start,end]位置截取)
//indexCut(按索引删除)
//bool(为true时，如果是json则按key名删除)
function yydCut(obj,posiCut,indexCut,bool){
	var type=Type(obj);
	var obj=obj;
	var json={};
	var arr=[];
	var str='';

	switch(type){
		case 'string':
				if(Type(posiCut)=='array'){
					obj=obj.slice(posiCut[0],posiCut[1]+1);
				}
				if(Type(indexCut)=='array'){
					for(var i=0;i<obj.length;i++){
						json[i]=obj[i];
					}
					for(var i=0;i<indexCut.length;i++){
						delete json[indexCut[i]];
					}
					for(var attr in json){
						str+=json[attr];
					}
					obj=str;
				}
			break;
		case 'array':
				if(Type(posiCut)=='array'){
					obj=obj.slice(posiCut[0],posiCut[1]+1);
				}
				if(Type(indexCut)=='array'){
					for(var i=0;i<obj.length;i++){
						json[i]=obj[i];
					}
					for(var i=0;i<indexCut.length;i++){
						delete json[indexCut[i]];
					}
					for(var attr in json){
						arr.push(json[attr]);
					}
					obj=arr;
				}
			break;
		case 'object':
				if(Type(posiCut)=='array'){
					for(var attr in obj){
						arr.push(attr);
					}
					arr=arr.slice(posiCut[0],posiCut[1]+1);
					for(var i=0;i<arr.length;i++){
						json[arr[i]]=obj[arr[i]];
					}
					obj=json;
				}
				if(Type(indexCut)=='array'){
					if(bool){
						for(var i=0;i<indexCut.length;i++){
							delete obj[indexCut[i]];
						}
					}else{
						arr=[];
						json={};
						var json1={};

						for(var attr in obj){
							arr.push(attr);
						}
						for(var i=0;i<arr.length;i++){
							json[i]=arr[i];
						}
						for(var i=0;i<indexCut.length;i++){
							delete json[indexCut[i]];
						}
						for(var attr in json){
							json1[json[attr]]=obj[json[attr]];
						}
						obj=json1;
					}
				}
			break;
	}
	return obj;
};

//json克隆副本
function Json(json){
	return json?JSON.parse(JSON.stringify(json)):'';
};

//判断设备跳转不同地址
function goPage(moHref,pcHref){
	var reg=/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;

	window.location.href=navigator.userAgent.match(reg)?moHref:pcHref;
};

//根据设备宽度来写相对布局,
//最小1rem=100px(宽度为375px屏幕下),3.75rem=100%;
//根据375屏幕下换算来布局
//小于375屏幕根节点字体大小与375屏幕保持一致，注意宽度的溢出
function htmlFontSize(){
	function change(){
		var fontSize=document.documentElement.clientWidth/3.75;

		if(fontSize<100)fontSize=100;
		if(fontSize>288)fontSize=288;
		document.getElementsByTagName('html')[0].style.fontSize=fontSize+'px';
	};
	change();
	window.onresize=change;
};

//根据设备宽度来改变viewport默认缩放
function metaViewport(){
	function change(){
		var oHead=document.getElementsByTagName('head')[0];
		var oMeta=document.getElementsByTagName('meta');
		var str='width=device-width,maximum-scale=1.0,user-scalable=yes,';
		var iWidth=window.screen.width;
		var onOff=true;

		if(isPhone()){
			if(iWidth<1200){
				str+='initial-scale='+iWidth/1200;
			}
		}else{
			str+='initial-scale=0';
		}
		for(var i=0;i<oMeta.length;i++){
			if(oMeta[i].getAttribute('name')=='viewport'){
				oMeta=oMeta[i];
				oMeta.setAttribute('content',str);
				onOff=false;
				break;
			}
		}
		if(onOff){
			oMeta=document.createElement('meta');
			oMeta.setAttribute('name','viewport');
			oMeta.setAttribute('content',str);
			oHead.appendChild(oMeta);
		}
	}
	change();
	window.onresize=change;
};

//简单实现路由
//配置函数放在所有dom后面执行（否则onload不触发路由回调函数）
//Router.when('/',function(){});
//Router.when('/blue',function(){});
function router(){
	function Router(){
		this.routes={};
		this.currentUrl='';
		this.init();
	};
	Router.prototype={
		init:function(){
			bind(window,'load',this.refresh.bind(this));
			bind(window,'hashchange',this.refresh.bind(this));
		},
		when:function(path,callback){
			this.routes[path]=callback||function(){};
		},
		refresh:function(){
			this.currentUrl=window.location.hash.replace('#','')||'/';
			this.routes[this.currentUrl]();
		}
	};
	window.Router=new Router();//把路由配置函数挂载到window对象下
};

//自己实现双向数据绑定
//var $yydModel=yydModel();//数据对象返回在该函数上
function yydModel(){
	var oAllModel=QSA('input[yyd-model],textarea[yyd-model]');
	var obj={};
	var aAttr=[];

	for(var i=0;i<document.all.length;i++){
		if(document.all[i].tagName.toLowerCase()!='script'&&document.all[i].innerHTML&&document.all[i].innerHTML==document.all[i].innerText&&document.all[i].innerText.match(/^{{(.|\n)+}}$/g)){
			document.all[i].setAttribute('yyd-model',document.all[i].innerText.substring(2,document.all[i].innerText.length-2));
			document.all[i].innerText='';
		}
	}

	for(var i=0;i<oAllModel.length;i++){
		var attr=oAllModel[i].getAttribute('yyd-model');

		aAttr.push(attr);
	}

	for(var i=0;i<oAllModel.length;i++){
		(function(index){
			var onOff=false;

			Object.defineProperty(obj,aAttr[index],{
				set:function(newVal){
					for(var j=0;j<QSA('[yyd-model='+aAttr[index]+']').length;j++){
						var lowTagName=QSA('[yyd-model='+aAttr[index]+']')[j].tagName.toLowerCase();
						if(lowTagName=='input'){
							QSA('[yyd-model='+aAttr[index]+']')[j].value=newVal;
						}else{
							QSA('[yyd-model='+aAttr[index]+']')[j].innerText=newVal;
						}
					}
				}
			});
		})(i)

		if(oAllModel[i].value){
			obj[oAllModel[i].getAttribute('yyd-model')]=oAllModel[i].value;
		}

		bind(oAllModel[i],'input',function(){
			obj[this.getAttribute('yyd-model')]=this.value;
		});
	}
	return obj;
};

//旋转360核心函数
//根据半径和角度获得x和y的坐标
function circleGetXY(radius,angle){
	return{x:Math.round(Math.sin(angle*Math.PI/180)*radius),y:Math.round(Math.cos(angle*Math.PI/180)*radius)}
};
//过渡结束时候初始化属性
function transitionEndFn(){
	this.style.transition='50ms 100ms';
	this.style.transform='scale(1) rotate(-720deg)';
	this.style.opacity=1;
	this.style.filter='alpha(opacity:1)';
	removeEnd(this)	;
};
//元素过渡结束的时候加上transitionEndFn函数
function addEnd(obj){
	bind(obj,'transitionend',transitionEndFn);
	bind(obj,'webkitTransitionEnd',transitionEndFn);
};
//元素过渡结束的时候再删除transitionEndFn函数
function removeEnd(obj){
	unbind(obj,'transitionend',transitionEndFn);
	unbind(obj,'webkitTransitionEnd',transitionEndFn);
};

//查看键值修正版
function keyCode(){
	document.onkeyup=function(ev){
		var ev=ev||event;
		var oP=document.createElement('p');
		var aString=String.fromCharCode(ev.keyCode);
		var json={27:'Esc',112:'F1',113:'F2',114:'F3',115:'F4',116:'F5',117:'F6',118:'F7',119:'F8',120:'F9',121:'F10',122:'F11',123:'F12',44:'PrtScr',145:'Scroll',19:'Pause',192:'`',189:'-',187:'=',8:'←删除',45:'Insert',36:'Home',33:'PgUp',144:'数字区 NumLock',111:'数字区 /',106:'数字区 *',109:'数字区 -',9:'Tab',219:'[',221:']',13:'Enter',46:'Delete',35:'End',34:'PgDn',103:'数字区 7',104:'数字区 8',105:'数字区 9',107:'数字区 +',20:'Capslock',186:'：',222:'’',220:'｜',100:'数字区 4',101:'数字区 5',102:'数字区 6',16:'Shift',188:'，',190:'。',191:'/',38:'方向↑',97:'数字区 1',98:'数字区 2',99:'数字区 3',17:'Ctrl',91:'左Window',92:'右Window',18:'Alt',32:'空格',93:'打印',37:'方向←',40:'方向↓',39:'方向→',96:'数字区 0',110:'数字区 .'};

		if(json[ev.keyCode]){
			aString=json[ev.keyCode];
		}
		oP.innerHTML='按键'+':'+aString+' '+'键值'+':'+ev.keyCode;
		document.body.appendChild(oP);
	};
};



//算法函数-->
//计算排列函数(arrange)
function A(m,n){
	return f(m)/f(m-n);
};
//计算组合的函数(combination)
function C(m,n){
	return f(m)/(f(m-n)*f(n));
};
//递归计算阶层
function f(num){
	if(num<=1){
		return 1;
	}
	return num*f(num-1);
};
//递归计算阶层(尾递归)
//做到只调用自身，把所有用到的内部变量改写成函数的参数
function f1(num,total){
	'use strict';//尾递归优化只在严格模式下有效
	if(num<=1){
		return total;
	}
	return f1(num-1,num*total);
};
//递归计算阶层(改为循环，减少调用栈)
function trampoline(fn){//蹦床函数，可以将递归执行转为循环执行
	while (fn&&fn instanceof Function){
		fn=fn();
	}
	return fn;
};
function f2(num,total){
	if(num<=1){
		return total;
	}
	return f2.bind(null,num-1,num*total);//每一步返回另一个函数
};
//递归计算阶层(循环实现尾递归优化)
function tco(fn){
	var value;
	var active=false;
	var arr=[];

	return function accumulator(){
		arr.push(arguments);
		if(!active){
			active=true;
			while(arr.length){
				value=fn.apply(this,arr.shift());
			}
			active=false;
			return value;
		}
	};
};
var f3=tco(function(num,total){
	if(num<=1){
		return total;
	}
	return f3(num-1,num*total);
});

//数组螺旋矩阵
function changeXY(size){
	var arr=[];
	var len=size*size;
	var row = 0;
	var col = 0;
	var min = 0;
	var max = size - 1;

	for(var i=0;i<len;i++){
		arr.push(row*size+col);
		if(row==min&&col<max){
			col=col+1;
		}
		else if(col==max&&row<max){
			row=row+1;
		}
		else if(row==max&&col>min){
			col=col-1;
		}
		else if(col==min&&row>min){
			row=row-1;
		}
		if(row-1==min&&col==min){
			min=min+1;
			max=max-1;
		}
	}
	return arr;
};

//数组行列矩阵互换
function changeXY1(arr,size){
	var newArr=[];
	var iNow=0;

	(function(){
		if(iNow==size){
			return;
		}
		for(var i=0;i<arr.length;i++){
			if(i%size==iNow){
				newArr.push(arr[i]);
			}
		}
		iNow++;
		arguments.callee();//递归调用自执行函数本身
	})();
	return newArr;
}

//简单实现约瑟夫环
//total(玩游戏人的总数)
//step(数到多少人开始杀人)
function ysfh(total,step){
	var arr=[];
	var iNum=0;
	var count=0;
	var total=total||100;
	var step=step||5;

	for(var i=1;i<=100;i++){
		arr.push(i);
	}
	while(arr.length>step-1){
		iNum++;
		count++;
		if(count==step){
			count=0;
			var position=arr.splice(iNum-1,1);
			console.log('被杀的位置是：'+position);
			iNum--;
		}
		if(iNum==arr.length){
			iNum=0;
		}
	}
	console.log(arr);
};

//冒泡排序法
function bubbleSort(arr,fn){
	for(var i=0;i<arr.length;i++){
		for(var j=0;j<arr.length-i-1;j++){
			if(fn(arr[j],arr[j+1])<0){
				var oCurrent=arr[j];

				arr[j]=arr[j+1];
				arr[j+1]=oCurrent;
			}
		}
	}
};

//双向循环列表（遍历时请注意判断next是否为head）
function Node(ele){//建立链表节点，不需要用到
	this.ele=ele;
	this.prev=null;
	this.next=null;
};
function DList(){//建立一个双向循环链表对象
	this.head=new Node('head');
	this.head.prev=null;
	this.head.next=this.head;
	this.length=0;
	this.currentNode=this.head;
};
DList.prototype={
	find:function(ele){//寻找链表的某个元素
		var currentNode=this.head;

		while(currentNode.ele!=ele){
			currentNode=currentNode.next;
		}
		return currentNode;
	},
	insert:function(newEle,ele){//插入一个新元素到链表的指定元素之后
		var newNode=new Node(newEle);
		var currentNode=this.find(ele);

		newNode.prev=currentNode;
		newNode.next=currentNode.next;
		currentNode.next=newNode;
		this.length++;
	},
	remove:function(ele){//删除链表的某个元素
		var currentNode=this.find(ele);
		var prevNode=currentNode.prev;
		var nextNode=currentNode.next;

		prevNode.next=nextNode;
		nextNode.prev=prevNode;
		this.length--;
	},
	showList:function(){//返回整个链表
		var currentNode=this.head;
		var result=[];

		while(currentNode.next!=null&&currentNode.next.ele!='head'){
			result.push(currentNode.next);
			currentNode=currentNode.next;
		}
		return result;
	},
	showArr:function(){//返回链表的ele组成的数组
		var currentNode=this.head;
		var result=[];

		while(currentNode.next!=null&&currentNode.next.ele!='head'){
			result.push(currentNode.next.ele);
			currentNode=currentNode.next;
		}
		return result;
	},
	prev:function(step){//链表指针向前移动指定次数
		var currentNode=this.currentNode;

		while(step>0&&currentNode.prev){
			if(currentNode.ele!='head')step--;
			currentNode=currentNode.prev;
		}
		this.currentNode=currentNode;
	},
	next:function(step){//链表指针向后移动指定次数
		var currentNode=this.currentNode;

		while(step>0&&currentNode.next){
			if(currentNode.ele!='head')step--;
			currentNode=currentNode.next;
		}
		this.currentNode=currentNode;
	},
	show:function(){//显示当前指针的节点
		return this.currentNode;
	}
};

//链表递归实现约舍夫环
function killGame(num,step){
	var people=new DList();

	people.insert(1,'head');
	for(var i=1;i<num;i++){
		people.insert(i+1,i);
	}

	var iNow=0;
	var dir='head';

	function whileFn(){
		if(people.length<step){
			return;
		}

		iNow++;
		dir=people.find(dir).next.ele;

		if(dir=='head'){
			dir=people.find(dir).next.ele;
		}

		if(iNow==step){
			var removeDir=dir;

			dir=people.find(dir).prev.ele;
			people.remove(removeDir);
			iNow=0;
		}
		whileFn();
	};

	whileFn();

	console.log('幸存的位置是:' + people.showArr());
};

//循环链表实现约舍夫环
function killGame1(num,step){
	var people=new DList();

	people.insert(1,'head');
	for(var i=1;i<num;i++){
		people.insert(i+1,i);
	}

	var iNum=0;
	var pos='head';

	while(people.length>=step){
		var rNode=people.find(pos).next.ele;

		if(rNode=='head')rNode=people.find(rNode).next.ele;
		pos=rNode;

		iNum++;
		if(iNum==3){
			pos=people.find(rNode).prev.ele;
			if(pos=='head')pos=people.find(pos).prev.ele;

			people.remove(rNode);
			iNum=0;
		}
	}

	console.log('幸存的位置是:' + people.showArr());
};



//参考函数-->
//对js中的5钟主要数据类型进行值复制（包括Number、String、Object、Array、Boolean）
function clone(obj){
	//判断是对象，就进行循环复制
	if(typeof obj==='object'&&typeof obj!=='null'){
		//区分是数组还是对象，创建空的数组或对象
		var o=Object.prototype.toString.call(obj).slice(8,-1)==="Array"?[]:{};

		for(var k in obj){
			//如果属性对应的值为对象，则递归复制
			if(typeof obj[k]==='object'&&typeof obj[k]!=='null'){
				o[k]=clone(obj[k]);
			}else{
				o[k]=obj[k];
			}
		}
	}else{//不为对象，直接把值返回
		return obj;
	}
	return o;
};

//实现promise对象
function Prom(fn){
	this.status='unchanged';
	this.resolveFn=[];
	this.rejectFn=null;
	this.finallyFn=null;

	fn&&fn(this.resolve.bind(this),this.reject.bind(this));
	return this;
};
Prom.prototype={
	resolve:function(data){
		if(this.status=='rejected')this.catch('promise is only once change,but it was rejected');
		if(this.status!='unchanged')return;
		this.status='resolved';

		var This=this;

		function nextThen(resultFn){
			if(resultFn instanceof Prom){
				resultFn.resolveFn=This.resolveFn;
			}
		};

		setTimeout(function(){
			This.finallyFn&&This.finallyFn();

			var headFn=null;
			var resultFn=null;

			headFn=This.resolveFn.shift()
			headFn&&(resultFn=headFn(data));
			resultFn&&nextThen(resultFn);
		});
		return this;
	},
	reject:function(data){
		if(this.status=='resolved')this.catch('promise is only once change,but it was resolved');
		if(this.status!='unchanged')return;
		this.status='rejected';

		var This=this;

		setTimeout(function(){
			This.finallyFn&&This.finallyFn();

			This.rejectFn('promise is reject:'+data);
		});
		return this;
	},
	then:function(fn1,fn2){
		fn1&&this.resolveFn.push(fn1);
		fn2&&(this.rejectFn=fn2);
		return this;
	},
	catch:function(error){
		console.error(error);
		return this;
	},
	finally:function(fn){
		fn&&(this.finallyFn=fn);
	}
};

//包装成一个promise对象
function setPromise(fn,ag1,ag2){
	return new Promise(function(resolve,reject){
		if(fn){
			fn.resolve=resolve;
			arguments.length==2?fn(ag1):fn(ag1,ag2);
		}
		//传入的函数加入return [函数名].resolve(data);//因为resolve后面的不会再走了，加上return明确点
	});
};

//钟摆运动判断示例
//obj(钟摆运动的对象)
//disX(钟摆运动X轴的最大位置)
//disY(钟摆运动Y轴的最大位置)
//sX（钟摆运动X轴的加速度）
//mesc(钟摆运动的定时器频率)
function pendulum(obj,disX,disY,sX,mesc){
	var speedX=0;
	var speedY=0;
	var disX=disX||300;
	var disY=disY||10;
	var sX=sX||5;
	var timer=null;

	timer=setInterval(function(){
		var x=parseInt(getStyle(aDiv,'left'));
		var y=parseInt(getStyle(aDiv,'top'));

		speedX=x<disX?speedX+=sX:speedX-=sX;
		aDiv.style.left=x+speedX+'px';

		if(x<disX&&speedX>0||x>disX&&speedX<0){//往右运动或者往左运动的时候y轴往下运动
			speedY=disY;
			console.log(1);
		}else if(x>disX&&speedX>0||x<disX&&speedX<0){//到达最右边端点或者最左边端点时往上运动
			speedY=-disY;
			console.log(2);
		}
		aDiv.style.top=y+speedY+'px';
	},mesc||50);
};

//文字蛛网效果
//obj(生成蛛网效果文字的父容器)
//scaleC(文字半径的比例，越大影响的文字越多)
//scaleB(文字便宜的比例，越大文字偏移得越大)
function cobweb(obj,scaleC,scaleB){
	var str='';
	var iW=parseInt(getStyle(obj,'width'));
	var iH=parseInt(getStyle(obj,'height'));
	var text=obj.innerText.trim();

	for(var i=0;i<text.length;i++){
		str+='<span>'+text[i]+'</span>';
	};

	obj.style.width=iW+'px';
	obj.style.height=iH+'px';
	obj.innerHTML=str;
	layoutChange(obj.children);

	for(var i=0;i<obj.children.length;i++){
		obj.children[i].top=obj.children[i].offsetTop;
	}

	obj.onmouseover=function(ev){
		var sX=ev.clientX;
		var sY=ev.clientY;

		obj.onmousemove=function(ev){
			var mX=ev.clientX;
			var mY=ev.clientY-sY;

			for(var i=0;i<obj.children.length;i++){
				var a=mX-obj.children[i].offsetLeft;
				var c=mY*(scaleC||3);
				var b=Math.sqrt(c*c-a*a);

				b=mY>0?b:-b;
				var iDis=obj.children[i].top+b*(scaleB||.3);

				obj.children[i].style.top=iDis+'px';
			}

			obj.onmouseout=function(){
				for(var i=0;i<obj.children.length;i++){
					allMove(300,obj.children[i],{'top':obj.children[i].top},'bounceOut')
				}
			};
		};
	};
};

//兼容手机和pc端的拖拽事件方法(该方法不进行拖拽，只封装事件)
//option{
	//obj:obj,//被拖拽的对象
	//start:function(position,ev){},//拖拽开始的函数
	//move:function(position,ev){},//拖拽中的函数
	//end:function(position,ev){},//拖拽结束的函数
	//preventDefault:true,//是否阻止系统默认拖拽事件
//}
function onDrag(option){
	var obj=option.obj;
	var start=option.start;
	var move=option.move;
	var end=option.end;
	var preventDefault=option.preventDefault;
	var position={
		sX:0,
		sY:0,
		mX:0,
		mY:0,
		eX:0,
		eY:0,
	};

	isPhone()?mo():pc();

	function mo(){
		bind(obj,'touchstart',fn1);
		function fn1(ev){
			var ev=ev||event;

			position.sX=ev.changedTouches[0].clientX;
			position.sY=ev.changedTouches[0].clientY;
			start&&start.call(obj,position,ev);
		};
		bind(obj,'touchmove',fn2);
		function fn2(ev){
			var ev=ev||event;

			position.mX=ev.changedTouches[0].clientX;
			position.mY=ev.changedTouches[0].clientY;
			move&&move.call(obj,position,ev);
		};
		bind(obj,'touchend',fn3);
		function fn3(){
			var ev=ev||event;

			position.eX=ev.changedTouches[0].clientX;
			position.eY=ev.changedTouches[0].clientY;
			end&&end.call(obj,position,ev);
		};
	};

	function pc(){
		obj.onmousedown=function(ev){
			var ev=ev||event;

			position.sX=ev.clientX;
			position.sY=ev.clientY;

			if(obj.setCapture)obj.setCapture;
			start&&start.call(obj,position,ev);
			document.onmousemove=function(ev){
				var ev=ev||event;

				position.mX=ev.clientX;
				position.mY=ev.clientY;
				move&&move.call(obj,position,ev);
			};
			document.onmouseup=function(){
				document.onmousemove=document.onmouseup=null;
				if(obj.releaseCapture)obj.releaseCapture;
				var ev=ev||event;

				position.eX=ev.clientX;
				position.eY=ev.clientY;
				end&&end.call(obj,position,ev);
			};
			return false;
		};
	};

	if(preventDefault)bind(obj,'touchmove',pDef);
	document.onselectstart=function(){
		return false;
	};
};

//下拉刷新页面
function pullReload(){
	var oWrap=document.createElement('div');
	var oDiv=document.createElement('div');
	var oSpan=document.createElement('span');

	oWrap.style.cssText=' margin:0; padding:0; width:100%; height:100%; position:fixed; left:0; top:0; right:0; bottom:0; margin:auto; z-index:999999999; display:none;';
	oDiv.style.cssText=' margin:0; padding:0; width:100px; height:100px; position:absolute; left:0; top:0; right:0; bottom:0; margin:auto; overflow:hidden;';
	oSpan.style.cssText=' margin:0; padding:0; width:80px; height:30px; line-height:30px; text-align:center; font-size:12px; background-color:rgba(255,255,255,0.9); color:#999; box-shadow:0 0 4px rgba(0,0,0,0.3); border:1px solid #ddd; border-radius:5px; position:absolute; left:0; top:-150px; right:0; bottom:0; margin:auto;';

	document.body.appendChild(oWrap);
	oWrap.appendChild(oDiv);
	oDiv.appendChild(oSpan);

	var iTop=parseInt(getStyle(oSpan,'top'));
	var pY=0;
	var scrollY=0;
	var iDisY=0;

	bind(document,'touchmove',pDef);
	onDrag({
		obj:document,
		start:function(position,ev){

		},
		move:function(position,ev){
			scrollY=document.documentElement.scrollTop||document.body.scrollTop;
			iDisY=position.mY-position.sY;

			if(scrollY==0){
				oWrap.style.display='block';
				document.body.style.overflow='hidden';
			}
			if(iDisY>0){
				bind(document,'touchmove',pDef);
				document.body.style.overflow='hidden';
				pY=iTop+iDisY/2;
			}else{
				unbind(document,'touchmove',pDef);
				document.body.style.overflow='auto';
				pY=iTop+iDisY/1;
			}
			if(pY<-150){
				pY=-150;
				document.body.style.overflow='auto';
			}
			if(pY>60){
				pY=60;
			}
			if(pY>-50){
				oSpan.innerHTML='松开刷新';
				oSpan.style.color='#0479cc';
			}else{
				oSpan.innerHTML='下拉刷新';
				oSpan.style.color='#999';
			}
			oSpan.style.top=pY+'px';
		},
		end:function(position,ev){
			bind(document,'touchmove',pDef);
			document.body.style.overflow='auto';
			allMove(300,oSpan,{'top':-150},'easeIn',function(){
				oWrap.style.display='none';
				if(scrollY==0&&pY>-50){
					window.location.reload();
				}
			});
		},
	});
};

//兼容手机和电脑端的拖拽方法
function drag(obj,lMin,lMax,tMin,tMax,sFn,mFn,endFn){
	var disX=0;
	var disY=0;
	var lMin=lMin||0;
	var lMax=lMax||Math.max(document.documentElement.clientWidth,parseInt(getStyle(document.body,'width')))-parseInt(getStyle(obj,'width'));
	var tMin=tMin||0;
	var tMax=tMax||Math.max(document.documentElement.clientHeight,parseInt(getStyle(document.body,'height')))-parseInt(getStyle(obj,'height'));

	isPhone()?mo():pc();

	function mo(){
		bind(obj,'touchstart',fn1);
		function fn1(ev){
			var ev=ev||event;

			disX=ev.changedTouches[0].clientX-css(obj,'left');
			disY=ev.changedTouches[0].clientY-css(obj,'top');
			sFn&&sFn.call(obj,disX,disY);
		};
		bind(obj,'touchmove',fn2);
		function fn2(ev){
			var ev=ev||event;
			var l=ev.changedTouches[0].clientX-disX;
			var t=ev.changedTouches[0].clientY-disY;

			if(l<lMin)l=lMin;
			if(l>lMax)l=lMax;
			if(t<tMin)t=tMin;
			if(t>tMax)t=tMax;
			css(obj,'left',l+'px');
			css(obj,'top',t+'px');
			mFn&&mFn.call(obj,l,t);
		};
		bind(obj,'touchend',fn3);
		function fn3(){
			endFn&&endFn.call(obj);
		};
	};

	function pc(){
		obj.onmousedown=function(ev){
			var ev=ev||event;
			disX=ev.clientX-css(obj,'left');
			disY=ev.clientY-css(obj,'top');

			if(obj.setCapture)obj.setCapture;
			sFn&&sFn.call(obj,disX,disY);
			document.onmousemove=function(ev){
				var ev=ev||event;
				var l=ev.clientX-disX;
				var t=ev.clientY-disY;

				if(l<lMin)l=lMin;
				if(l>lMax)l=lMax;
				if(t<tMin)t=tMin;
				if(t>tMax)t=tMax;
				css(obj,'left',l+'px');
				css(obj,'top',t+'px');
				mFn&&mFn.call(obj,l,t);
			};
			document.onmouseup=function(){
				document.onmousemove=document.onmouseup=null;
				if(obj.releaseCapture)obj.releaseCapture;
				endFn&&endFn.call(obj);
			};
			return false;
		};
	};

	bind(obj,'touchmove',pDef);
	document.onselectstart=function(){
		return false;
	};
};

//照片墙拖拽
//obj(一组图片元素)
//endFn(返回交换位置的两个索引)
function imgDrag(obj,endFn,startFn){
	var iZIndex=0;
	var aPos=[];
	var iMin=0;
	var iMinIndex=-1;
	var aPosIndex=0;
	var dObj=[];

	for(i=0;i<obj.length;i++){
		obj[i].setAttribute('style','');
		aPos[i]={left:obj[i].offsetLeft,top:obj[i].offsetTop};
		obj[i].index=i;
	}
	startFn&&startFn(aPos);

	window.sessionStorage.setItem('yydImgDragAPos',JSON.stringify(aPos));
	layoutChange(obj);

	function removeItem(){
		window.sessionStorage.removeItem('yydImgDragOnOff');
	};
	window.onunload=removeItem;
	window.onhashchange=removeItem;
	if(window.sessionStorage.getItem('yydImgDragOnOff')){
		dObj=[obj[obj.length-1]];
	}else{
		dObj=obj;
	}
	window.sessionStorage.setItem('yydImgDragOnOff',true);

	for(var i=0;i<dObj.length;i++){
		drag(dObj[i],null,null,null,null,null,function(){

			iMin=Infinity;
			iMinIndex=-1;

			try{
				obj=obj[0].parentNode.getElementsByClassName(obj[0].className.split(' ')[0]);
				if(iZIndex>100){
					for(i=0;i<obj.length;i++){
						obj[i].style.zIndex=0;
					}
					window.sessionStorage.setItem('yydImgDragIZIndex',0);
				}
				if(window.sessionStorage.getItem('yydImgDragIZIndex')){
					iZIndex=window.sessionStorage.getItem('yydImgDragIZIndex');
				}
				this.style.zIndex=iZIndex++;
				window.sessionStorage.setItem('yydImgDragIZIndex',iZIndex);
			}catch(e){}

			for(var i=0;i<obj.length;i++){
				var a=css(this,'left')-css(obj[i],'left');
				var b=css(this,'top')-css(obj[i],'top');
				var c=Math.sqrt(Math.pow(a,2)+Math.pow(b,2));

				obj[i].classList.remove('active');
				if(this==obj[i]){
					continue;
				}else if(collide(this,obj[i])&&c<iMin){
					iMin=c;
					iMinIndex=i;
				}
			}
			if(iMinIndex!=-1)obj[iMinIndex].classList.add('active');
		},function(){
			var index=this.index;
			var aPosIndex=-1;

			if(window.sessionStorage.getItem('yydImgDragAPos')){
				aPos=JSON.parse(window.sessionStorage.getItem('yydImgDragAPos'));
			}

			try{
				obj=obj[0].parentNode.getElementsByClassName(obj[0].className.split(' ')[0]);
			}catch(e){}

			try{
				if(iMinIndex!=-1){
					aPosIndex=obj[iMinIndex].index;

					allMove(300,this,{'left':aPos[aPosIndex].left,'top':aPos[aPosIndex].top},'easeOut');
					allMove(300,obj[iMinIndex],{'left':aPos[index].left,'top':aPos[index].top},'easeOut');
					obj[iMinIndex].classList.remove('active');

					this.index=aPosIndex;
					obj[iMinIndex].index=index;
				}else{
					allMove(300,this,{'left':aPos[index].left,'top':aPos[index].top},'easeOut');
				}
			}catch(e){}

			endFn&&endFn(index,aPosIndex);
			iMinIndex=-1;
		});
	}
};

//鼠标滚轮事件兼容
function MouseWheel(obj,upFn,downFn){
	obj.onmousewheel=fn1;
	bind(obj,'DOMMouseScroll',fn1);
	function fn1(ev){
		var ev=ev||event;
		var up=true;
		if(ev.wheelDelta){
			up=ev.wheelDelta>0?true:false;
		}else{
			up=ev.detail<0?true:false;
		}
		up?upFn&&upFn.call(obj):downFn&&downFn.call(obj);
		if(ev.preventDefault)ev.preventDefault();
		return false;
	};
};

//鼠标滚轮控制物体+事件
function mouseWheel(obj,attr,dis,minTarget,maxTarget,fn){
	document.onmousewheel=fn1;
	bind(document,'DOMMouseScroll',fn1);
	function fn1(ev){
		var ev=ev||event;
		var up=true;
		var value=0;
		var outcome=0;
		if(ev.wheelDelta){
			up=ev.wheelDelta>0?true:false;
		}else{
			up=ev.detail<0?true:false;
		}
		value=up?-dis:dis;
		switch(attr){
			case 'left':outcome=obj.offsetLeft+value;break;
			case 'top':outcome=obj.offsetTop+value;break;
			case 'width':outcome=obj.offsetWidth+value;break;
			case 'height':outcome=obj.offsetHeight+value;break;
			case 'opacity':outcome=getStyle(obj,attr)*100+value;break;
		}
		if(outcome<minTarget)outcome=minTarget;
		if(outcome>maxTarget)outcome=maxTarget;
		if(attr=='opacity'){
			obj.style.opacity=outcome/100;
			obj.style.filter='alpha(opacity:'+outcome+')';
		}else{
			obj.style[attr]=outcome+'px';
		}
		fn&&fn.call(obj);
		if(ev.preventDefault)ev.preventDefault();
		return false;
	};
};

//键盘控制物体连续移动
function kMove(obj,dis){
	var Move={'l':null,'t':null,'r':null,'b':null};
	var timer=null;

	timer=setInterval(function(){
		if(Move.l)obj.style.left=obj.offsetLeft-dis+'px';
		if(Move.t)obj.style.top=obj.offsetTop-dis+'px';
		if(Move.r)obj.style.left=obj.offsetLeft+dis+'px';
		if(Move.b)obj.style.top=obj.offsetTop+dis+'px';
	},20)
	document.onkeydown=function(ev){
		var ev=ev||event;
		switch(ev.keyCode){
			case 37:Move.l=true;break;
			case 38:Move.t=true;break;
			case 39:Move.r=true;break;
			case 40:Move.b=true;
		}
	};
	document.onkeyup=function(ev){
		var ev=ev||event;
		switch(ev.keyCode){
			case 37:Move.l=false;break;
			case 38:Move.t=false;break;
			case 39:Move.r=false;break;
			case 40:Move.b=false;
		}
	};
};

//面向对象：拖拽原型
function Drag(object){
	var This=this;
	this.obj=object;
	this.disX=0;
	this.disY=0;
	this.obj.onmousedown=function(ev){
		This.fnDown(ev);
		return false;
	};
};
Drag.prototype.fnDown=function(ev){
	var This=this;
	var ev=ev||event;
	this.disX=ev.clientX-this.obj.offsetLeft;
	this.disY=ev.clientY-this.obj.offsetTop;
	document.onmousemove=function(ev){
		This.fnMove(ev);
	};
	document.onmouseup=function(){
		This.fnUp();
	};
};
Drag.prototype.fnMove=function(ev){
	var ev=ev||event;
	this.obj.style.left=ev.clientX-this.disX+'px';
	this.obj.style.top=ev.clientY-this.disY+'px';
};
Drag.prototype.fnUp=function(){
	document.onmousemove=document.onmouseup=null;
};

//面向对象：继承并加上拖拽限制
function LimitDrag(object){
	Drag.call(this,object);
};
for(var i in Drag.prototype){
	LimitDrag.prototype[i]=Drag.prototype[i];
}
LimitDrag.prototype.fnMove=function(ev){
	var ev=ev||event;
	var l=ev.clientX-this.disX;
	var t=ev.clientY-this.disY;
	var iMaxL=document.documentElement.clientWidth-this.obj.offsetWidth;
	var iMaxT=document.documentElement.clientHeight-this.obj.offsetHeight;

	if(l<0)l=0;
	if(l>iMaxL)l=iMaxL;
	if(t<0)t=0;
	if(t>iMaxT)t>iMaxT;

	this.obj.style.left=l+'px';
	this.obj.style.top=t+'px';
};



//常用框架-->
//匀速链式运动框架
function move(msec,obj,attr,dis,target,endFn){
	clearInterval(obj.move);
	var arr=[];
	var num=0;
	var onOff=false;
	var position=parseInt(getStyle(obj,attr.split('/').join('')));
		for(var i=target;i>0;i-=dis) {
			arr.push(i,-i);
		}
		arr.push(0);
		if(attr=='/left'||attr=='/top'){
			onOff=true;
		}else if(attr=='opacity'){
			var dis=getStyle(obj,attr)*100<target?dis:-dis;
		}else{
			var dis=parseInt(getStyle(obj,attr))<target?dis:-dis;
		}
	obj.move=setInterval(function (){
		if(onOff){
			attr=attr.split('/').join('');
		}else if(attr=='opacity'){
			var outcome=getStyle(obj,attr)*100+dis;
		}else{
			var outcome=parseInt(getStyle(obj,attr))+dis;
		}
		if(outcome>target&&dis>0||outcome<target&&dis<0)outcome=target;
		if(onOff){
			obj.style[attr]=position+arr[num]+'px';
			num++;
			}else if(attr=='opacity'){
			obj.style.opacity=outcome/100;
			obj.style.filter='alpha(opacity:'+outcome+')';
		}else{
			obj.style[attr]=outcome+'px';
		}
		if(outcome==target||num==arr.length){
			clearInterval(obj.move);
			endFn&&endFn.call(obj);
		}
	},msec);
};

//匀速同步运动框架
function manyMove(msec,obj,json,dis,endFn){
	clearInterval(obj.manyMove);
	obj.manyMove=setInterval(function (){
	var over=true;
		for(var attr in json){
			var target=json[attr];
			if(attr=='opacity'){
				var speed=getStyle(obj,attr)*100<target?dis:-dis;
				var outcome=getStyle(obj,attr)*100+speed;
			}else{
				var speed=parseInt(getStyle(obj,attr))<target?dis:-dis;
				var outcome=parseInt(getStyle(obj,attr))+speed;
			}
			if(outcome>target&&speed>0||outcome<target&&speed<0)outcome=target;
			if(attr=='opacity'){
				obj.style.opacity=outcome/100;
				obj.style.filter='alpha(opacity:'+outcome+')';
			}else{
				obj.style[attr]=outcome+'px';
			}
			if(outcome!=target)over=false;
		}
		if(over){
			clearInterval(obj.manyMove);
			endFn&&endFn.call(obj);
		}
	},msec);
};

//综合类型同步运动框架
function allMove(time,obj,json,type,endFn){
	clearInterval(obj.allMove);
	var Default={};
	var startTime=new Date().getTime();
	for(var attr in json){
	Default[attr]=0;
	Default[attr]=attr=='opacity'? Math.round(getStyle(obj,attr)*100)
								   :parseInt(getStyle(obj,attr));
	}
	obj.allMove=setInterval(function(){
		var changeTime=new Date().getTime()-startTime;
		var t=time-Math.max(0,time-changeTime);
		for(var attr in json){
			var value=moveType[type](t,Default[attr],json[attr]-Default[attr],time);
			if(attr=='opacity'){
				obj.style.opacity=value/100;
				obj.style.filter='alpha(opacity='+value+')';
			} else {
				obj.style[attr]=value+'px';
			}
		}
		if(t==time){
			clearInterval(obj.allMove);
			endFn&&endFn.call(obj);
		}
	},1000/60)
};

var moveType={
	//t:运动消耗的时间 b:初始值 c:目标值 d:设定的总时间 return:返回是随运动变化的结果值
	'linear':function (t,b,c,d){  //匀速运动
		return c*(t/d)+b;
	},
	'easeIn':function(t,b,c,d){  //加速运动
		return c*(t/=d)*t+b;
	},
	'easeOut':function(t,b,c,d){  //减速运动
		return c*(t/=d)*(2-t)+b;
	},
	'easeBoth':function(t,b,c,d){  //加速减速运动
		return (t/=d/2)<1?c/2*t*t+b :c/2*((t-=1)*(2-t)+1)+b;
	},
	'easeInStrong':function(t,b,c,d){  //加加速运动
		return c*(t/=d)*t*t+b;
	},
	'easeOutStrong':function(t,b,c,d){  //减减速运动
		return c*(1-(t=1-t/d)*t*t)+b;
	},
	'easeBothStrong':function(t,b,c,d){  //加加速减减速运动
		return (t/=d/2)<1?c/2*t*t*t+b :c/2*((t-=2)*t*t+2)+b;
	},
	'elasticIn':function(t,b,c,d,a,p){  //弹性加速
		if (t==0) return b;
		if ((t/=d)==1) return b+c;
		if (!p) p=d*0.3;
		if (!a||a<Math.abs(c)) a=c;
		var s=!a||a<Math.abs(c)?p/4 :s=p/(2*Math.PI)*Math.asin(c/a);
		return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
	},
	'elasticOut':function(t,b,c,d,a,p){  //加速弹性
		if (t==0) return b;
		if ((t/=d)==1) return b+c;
		if (!p)p=d*0.3;
		if (!a||a<Math.abs(c)) a=c;
		var s=!a||a<Math.abs(c)?p/4 :s=p/(2*Math.PI)*Math.asin(c/a);
		return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;
	},
	'elasticBoth':function(t,b,c,d,a,p){  //弹性加速弹性
		if(t==0) return b;
		if((t/=d/2)==2) return b+c;
		if (!p) p=d*(0.3*1.5);
		if (!a||a<Math.abs(c)) a=c;
		var s=!a||a<Math.abs(c)?p/4: s=p/(2*Math.PI)*Math.asin(c/a);
		return 	t<1? -0.5*(a*Math.pow(2,10*(t-=1))* Math.sin( (t*d-s)*(2*Math.PI)/p))+b :a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b;
	},
	'backIn':function(t,b,c,d){  //回退加速
		var s=1.70158;
		return c*(t/=d)*t*((s+1)*t-s)+b;
	},
	'backOut':function(t,b,c,d){	  //加速回退
		var s=3.70158;
		return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;
	},
	'backBoth':function(t,b,c,d){  //回退加速回退
		var s=1.70158;
		return	(t/=d/2)<1? c/2*(t*t*(((s*=(1.525))+1)*t-s))+b
							:c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s)+2)+b;
	},
	'bounceIn':function(t,b,c,d){  //弹球加速
		return c-moveType['bounceOut'](d-t, 0, c, d)+b;
	},
	'bounceOut':function(t,b,c,d){  //加速弹球
		if ((t/=d)<(1/2.75)) return c*(7.5625*t*t)+b;
		if (t<(2/2.75)) return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b;
		if (t<(2.5/2.75)) return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b;
		return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b;
	},
	'bounceBoth':function(t,b,c,d){  //弹球加速弹球
		return t<d/2? moveType['bounceIn'](t*2,0,c,d)*0.5+b
					   :moveType['bounceOut'](t*2-d,0,c,d)*0.5+c*0.5+b;
	}
};

//基于css()函数的运动框架
function tweenMove(time,obj,json,type,endFn){
	var fn=moveType[type];
	var t=0;
	var b={};
	var c={};
	var d=time/24;
	var attr='';
	clearInterval(obj.timer);
	for(attr in json){
		b[attr]=css(obj,attr);
		c[attr]=json[attr]-b[attr];
	}
	if(time<30){
		for(attr in json){
			css(obj,attr,json[attr]);
		}
	}else{
		obj.timer=setInterval(function(){
			if(t<d){
				t++;
				for(attr in json){
					css(obj,attr,fn(t,b[attr],c[attr],d));
				}
			}else{
				for(attr in json){
					css(obj,attr,json[attr]);
				}
				clearInterval(obj.timer);
				endFn&&endFn.call(obj);
			}
		},1000/60);
	}
};

//设置css样式
function css(obj,attr,value){
	if(arguments.length==2){
		if(attr=='scale'|| attr=='rotate'|| attr=='rotateX'||attr=='rotateY'||attr=='scaleX'||attr=='scaleY'||attr=='translateY'||attr=='translateX'){
			if(!obj.$Transform)obj.$Transform={};
			switch(attr){
				case 'scale':
				case 'scaleX':
				case 'scaleY':
					return typeof(obj.$Transform[attr])=='number'?obj.$Transform[attr]:100;
					break;
				default:
					return obj.$Transform[attr]?obj.$Transform[attr]:0;
			}
		}
		var current=getStyle(obj,attr);
		return attr=='opacity'?Math.round(parseFloat(current)*100):parseInt(current);
	}else if(arguments.length==3){
		switch(attr){
			case 'scale':
			case 'scaleX':
			case 'scaleY':
			case 'rotate':
			case 'rotateX':
			case 'rotateY':
			case 'translateZ':
			case 'translateX':
			case 'translateY':
				setCss3(obj,attr,value);
				break;
			case 'width':
			case 'height':
			case 'paddingLeft':
			case 'paddingTop':
			case 'paddingRight':
			case 'paddingBottom':
				value=Math.max(value,0);
			case 'left':
			case 'top':
			case 'marginLeft':
			case 'marginTop':
			case 'marginRight':
			case 'marginBottom':
				obj.style[attr]=typeof(value)=='string'?value:value+'px';
				break;
			case 'opacity':
				obj.style.filter="alpha(opacity:"+value+")";
				obj.style.opacity=value/100;
				break;
			default:
				obj.style[attr]=value;
		}
	}
	return function(attr_in,value_in){css(obj,attr_in,value_in)};
};

//兼容css3样式
function setCss3(obj, attr, value){
	var str='';
	var val='';
	var arr=['Webkit','Moz','O','ms',''];
	if(!obj['$Transform']){
		obj['$Transform']={};
	}
	obj['$Transform'][attr]=parseInt(value);
	for(str in obj['$Transform']){
		switch(str){
			case 'scale':
			case 'scaleX':
			case 'scaleY':
				val+=str+'('+(obj['$Transform'][str]/100)+')';
				break;
			case 'rotate':
			case 'rotateX':
			case 'rotateY':
				val+=str+'('+(obj['$Transform'][str])+'deg)';
				break;
			case 'translateX':
			case 'translateY':
			case 'translateZ':
				val+=str+'('+(obj['$Transform'][str])+'px)';
				break;
		}
	}
	for(var i=0;i<arr.length;i++){
		obj.style[arr[i]+'Transform']=val;
	}
};

//ajax
//ajax({//示例
//	url:'',
//	type:'post',
//	data:'',
//	contentType:'',
//	closeToForm:false,
//	dataType:'json',
//	headers:{},
//	xhr:function(xhr){
//		console.log(xhr);
//	},
//	progress:function(ev){
//		console.log(ev);
//	},
//	success:function(data){
//		console.log(data);
//	},
//	error:function(data){
//		console.log(data);
//	},
//});
function ajax(json){
	var str='';

	json.type=json.type.toLowerCase()||'get';
	json.dataType=json.dataType.toLowerCase()||'json';

	if(!json.closeToForm&&json.data&&Type(json.data)=='object'){
		for(var attr in json.data){
			str+=attr+'='+json.data[attr]+'&';
		}
		json.data=str.substring(0,str.length-1);
	}

	var xhr=null;

	try{
		xhr=new XMLHttpRequest();
	}catch(e){
		xhr=new ActiveXObject('Microsoft.XMLHTTP');
	}

	if(json.xhr&&Type(json.xhr)=='function'){
		xhr=json.xhr(xhr);
	}

	if(xhr.upload&&json.progress&&Type(json.progress)=='function'){
		bind(xhr.upload,'progress',json.progress);
	}

	if(json.type=='get'&&json.data){
		json.url+='?'+json.data;
	}

	xhr.open(json.type,json.url,true);

	if(json.type=='get'){
		xhr.send();
	}else{
		if(!json.closeToForm)xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
		if(json.headers&&Type(json.headers)=='object'){
			for(var attr in json.headers){
				xhr.setRequestHeader(attr,json.headers[attr]);
			}
		}
		xhr.send(json.data);
	}

	xhr.onreadystatechange=function(){
		var data=null;

		if(xhr.readyState==4){
			if(xhr.status==200){
				try{
					switch(json.dataType){
						case 'text':
								data=xhr.responseText;
							break;
						case 'json':
								data=JSON.parse(xhr.responseText);
							break;
						case 'html':
								var oDiv=document.createElement('div');

								oDiv.setAttribute('dataType','html');
								oDiv.innerHTML=xhr.responseText;
								data=oDiv;
							break;
						case 'script':
								var oScript=document.createElement('script');

								oScript.setAttribute('dataType','script');
								oScript.innerHTML=xhr.responseText;
								document.body.appendChild(oScript);
								data=oScript;
							break;
					}

				}catch(e){
					console.log(e);
				}
				json.success&&Type(json.success)=='function'&&json.success(data);
			}else{
				json.error&&Type(json.error)=='function'&&json.error(xhr.status);
			}
		}
	};
};

//对项目返回参数的处理，对ajax的再次封装
function ajaxWrap(json){
	ajax({
		url:json.url,
		type:json.type,
		data:json.data,
		closeToForm:json.closeToForm,
		dataType:json.dataType,
		headers:json.headers,
		xhr:json.xhr,
		progress:json.progress,
		before:function(xhr){
			//loading显示处理
		},
		after:function(xhr){
			//loading隐藏处理
		},
		success:function(data){
			//成功code已经失败code处理
			if(Type(data)=="object"){
                if(data.code=='0000'){
                    json.success&&json.success(data);
                    return;
                }else if(data.msg){
                    alerts(data.msg);
                    return;
                }
                alerts("网络异常");
            }
		},
		error:json.error,
	});
};



//项目常用插件-->
//手机无缝轮播划屏插件
//obj(轮播图的父容器)，obj1（高亮的小点的父容器），styleClass（高亮小点的样式）
//moveType(运动类型)'linear' 'easeIn' 'easeOut' 'easeBoth' 'easeInStrong' 'easeOutStrong' 'easeBothStrong'-
//-'elasticIn' 'elasticOut' 'elasticBoth' 'backIn' 'backOut' 'backBoth' 'bounceIn' 'bounceOut' 'bounceBoth'
//t（轮播间隔），t1(轮播滚动时间)，t2（划屏滚动时间），t3（划屏后轮播延迟时间）
function autoplay(obj,obj1,styleClass,moveType,t,t1,t2,t3){
	var oLi=obj.children;
	var aLi=obj1.children;
	var iW=oLi[0].offsetWidth;
	var iL=oLi.length*2;
	var iLeft=0;
	var iTop=0;
	var lDis=0;
	var tDis=0;
	var oTime=0;
	var iNow=0;
	var	index=0;
	var iOld=0;
	var str='';
	var timer=null;
	var timer1=null;

	obj.innerHTML+=obj.innerHTML;
	obj.style.width=iW*iL+'px';
	for(var i=0;i<iL;i++){
		oLi[i].style.width=iW+'px';
	}

	for(var i=0;i<iL/2;i++){
		str+='<li></li>';
	}
	obj1.innerHTML=str;
	var iW1=obj1.offsetWidth;
	obj1.style.marginLeft=-iW1/2+'px';
	aLi[0].classList.add(styleClass);

	if(iNow==0){
		iNow=iL/2;
		css(obj,'translateX',-iW*iL/2);
	}
	bind(obj,'touchstart',fn2);
	function fn2(ev){
		var ev=ev||event;
		clearInterval(timer);
		iLeft=ev.changedTouches[0].pageX;
		iTop=ev.changedTouches[0].pageY;
		oTime=Date.now();

		iOld=css(obj,'translateX');
		bind(obj,'touchmove',pDef);
		bind(obj1,'touchmove',pDef);
	};

	bind(obj,'touchmove',fn3);
	function fn3(ev){
		var ev=ev||event;
		lDis=ev.changedTouches[0].pageX-iLeft;
		tDis=ev.changedTouches[0].pageY-iTop;
		var condition=Math.abs(lDis)-Math.abs(tDis);

		if(condition<0){
			unbind(obj,'touchmove',pDef);
			unbind(obj1,'touchmove',pDef);
		}else{
			css(obj,'translateX',iOld+lDis);
		}
	};

	bind(obj,'touchend',fn4);
	function fn4(){
		var tDis=Date.now()-oTime;

		if(Math.abs(lDis/iW)>0.3||tDis<300&&Math.abs(lDis)>30){
			lDis<0?iNow++:iNow--;
			fn();
			lDis=0;
		}

		tweenMove(t2,obj,{'translateX':-iNow*iW},moveType,function(){
			iOld=css(obj,'translateX');
		});
		unbind(obj,'touchmove',pDef);
		unbind(obj1,'touchmove',pDef);
	};

	bind(document,'touchmove',goOn);
	bind(document,'touchend',goOn);
	function goOn(){
		clearTimeout(timer1);
		timer1=setTimeout(fn1,t3);
	};

	fn1();
	function fn1(){
		clearInterval(timer);
		timer=setInterval(function(){
			iNow++;
			fn();
			tweenMove(t1,obj,{'translateX':-iNow*iW},moveType);
		},t);
	};

	function fn(){
		if(iNow>iL/2){
			iNow%=iL/2;
			css(obj,'translateX',0+lDis);
		}else if(iNow<1){
			iNow=iL/2;
			css(obj,'translateX',-iW*(iL/2+1)+lDis );
		}
		index=iNow%(iL/2);
		for(var	i=0;i<aLi.length;i++){
			aLi[i].classList.remove(styleClass);
		}
		aLi[index].classList.add(styleClass);
	};
};

//绑定的方式阻止事件冒泡
function cBub(ev){
	var ev=ev||event;
	if(ev.stopPropagation)ev.stopPropagation();	//标准
	ev.cancelBubble=true;//ie
};

//绑定的方式阻止默认事件
function pDef(ev){
	var ev=ev||event;
	if(ev.preventDefault)ev.preventDefault();	//标准
	ev.returnValue=false;//ie
};

//兼容之前用到的fix函数
function fix(ev){
	pDef(ev);
};

//手机弹出菜单插件
//bt(控制按钮)，obj(遮罩层)，obj1（遮罩层包裹的菜单）
//json(菜单弹出时的属性)，json1（菜单收回时的属性）
//moveType（运动形式，推荐easeOut）
//t（遮罩层淡入淡出时间），t1（菜单弹出收回时间）
function menu(bt,obj,obj1,json,json1,moveType,t,t1){
	var oBody=document.getElementsByTagName('body')[0];
	obj.style.height=document.documentElement.clientHeight*2+'px';
	obj.style.opacity=0;
	obj.style.filter='alpha(opacity:0)';

	bind(bt,'touchend',fn);
	function fn(){
		oBody.style.overflowY='hidden';
		obj.style.display='block';
		for(attr in json1){
			css(obj1,attr,json1[attr]);
		}
		tweenMove(t,obj,{'opacity':100},moveType,function(){
			tweenMove(t1,obj1,json,moveType);
		});
	};

	bind(obj,'touchstart',fn2);
	function fn2(ev){
		var ev=ev||event;
		var iTop=ev.changedTouches[0].pageY;

		bind(obj,'touchend',fn1);
		function fn1(ev){
			var ev=ev||event;
			var iDis=ev.changedTouches[0].pageY-iTop;

			if(ev.target==obj&&Math.abs(iDis)==0){
				tweenMove(t1,obj1,json1,moveType,function(){
					tweenMove(t,obj,{'opacity':0},moveType,function(){
						obj.style.display='none';
						oBody.style.overflowY='auto';
					});
				});
			}
		};
	};

	bind(obj,'touchmove',pDef);
};

//电脑弹出菜单插件
//bt(控制按钮)，obj(遮罩层)，obj1（遮罩层包裹的菜单）
//json(菜单弹出时的属性)，json1（菜单收回时的属性）
//moveType（运动形式，推荐easeOut）
//t（遮罩层淡入淡出时间），t1（菜单弹出收回时间）
function menu1(bt,obj,obj1,json,json1,moveType,t,t1,Fn){
	var oBody=document.getElementsByTagName('body')[0];
	obj.style.height=document.documentElement.clientHeight*2+'px';
	obj.style.opacity=0;
	obj.style.filter='alpha(opacity:0)';

	bind(bt,'mousedown',fn);
	function fn(){
		oBody.style.overflowY='hidden';
		obj.style.display='block';
		for(attr in json1){
			css(obj1,attr,json1[attr]);
		}
		tweenMove(t,obj,{'opacity':100},moveType,function(){
			tweenMove(t1,obj1,json,moveType);
		});
		Fn&&Fn.call(bt);
	};

	bind(obj,'mousedown',fn2);
	function fn2(ev){
		var ev=ev||event;
		var iTop=ev.clientY;

		bind(obj,'mouseup',fn1);
		function fn1(ev){
			var ev=ev||event;
			var iDis=ev.clientY-iTop;
			if(ev.target==obj&&Math.abs(iDis)==0){
				tweenMove(t1,obj1,json1,moveType,function(){
					tweenMove(t,obj,{'opacity':0},moveType,function(){
						obj.style.display='none';
						oBody.style.overflowY='auto';
					});
				});
			}
		};
	};

	bind(obj,'mousemove',pDef);
};

//简单显示隐藏选项卡插件
//obj（选项卡控制按钮）
//obj1（选项卡显示隐藏的一组节点）
//styleClass（选项卡选中高亮的class名称）
function tab(obj,obj1,styleClass){
	for(var i=0;i<obj.length;i++){
		bind(obj[i],'click',fn);
	}
	function fn(){
		for(var i=0;i<obj.length;i++){
			obj[i].classList.remove(styleClass);
			obj1[i].style.display='none';
			obj[i].index=i;
		}
		obj[this.index].classList.add(styleClass);
		obj1[this.index].style.display='block';
	};
};

//全选插件
//obj（全选按钮）
//obj1（所有选项的元素集合）
function allChecked(obj,obj1){
	bind(obj,'change',fn);
	function fn(){
		if(obj.checked==true){
			for(var i=0;i<obj1.length;i++){
				obj1[i].checked=true;
			}
		}else{
			for(var i=0;i<obj1.length;i++){
				obj1[i].checked=false;
			}
		}
	};

	for(var i=0;i<obj1.length;i++){
		bind(obj1[i],'change',fn1);
	}
	fn1();
	function fn1(){
		for(var i=0;i<obj1.length;i++){
			if(obj1[i].checked==false){
				obj.checked=false;
				return;
			}
			obj.checked=true;
		}
	};
};

//回到顶部插件
//obj（回到顶部按钮）
//showPos（按钮出现的位置，默认一屏幕）
function goTop(obj,showPos){
	var iH=document.documentElement.scrollHeight||document.body.scrollHeight;
	var iCH=document.documentElement.clientHeight;
	var oScrollTop=0;
	var onOff=false;

	document.onscroll=function(){
		oScrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		var oDisplay=getStyle(obj,'display');

		if(oScrollTop>(showPos||iCH)){
			if(oDisplay=='none'){
				obj.style.display='block';
				obj.style.opacity='0';
				obj.style.filter='alpha(opacity:0)';
				allMove(300,obj,{'opacity':100},'linear');
			}
		}else{
			if(oDisplay=='block'){
				if(onOff)return;
				onOff=true;
				obj.style.opacity='100';
				obj.style.filter='alpha(opacity:100)';
				allMove(300,obj,{'opacity':0},'linear',function(){
					obj.style.display='none';
					onOff=false;
				});
			}
		}
	};

	bind(obj,'click',fn);
	function fn(){
		document.documentElement.scrollTop=document.body.scrollTop=0;
	};
};

//label自定义样式绑定单选框插件（配合样式）
//obj（一组label标签的元素）
//classStyle（切换后的active样式）
//注意：label标签里面必须要有元素，而且块状化才能支持宽高
function labelFor(obj,classStyle){
	for(var i=0;i<obj.length;i++){
		obj[i].onchange=function(){
			for(var i=0;i<obj.length;i++){
				obj[i].classList.remove(classStyle);
			}

			if(this.children[0].checked){
				this.classList.add(classStyle);
			}
		};
	}
};

//label自定义样式绑定复选框框插件（配合样式）
function labelFor1(obj,classStyle){
	for(var i=0;i<obj.length;i++){
		obj[i].onchange=function(){
			this.children[0].checked?this.classList.add(classStyle):this.classList.remove(classStyle);
		};
	}
};

//手机无缝滚动插件（可以不给左右按钮）
//obj（滚动的父容器）
//msec（定时器发生频率单位毫秒），dis（滚动一次的距离）
//lB,rB（左右按钮，可以暂定和控制滚动方向）
function autoplay1(obj,mses,dis,lB,rB){
	var oLi=obj.children;
	var iW=oLi[0].offsetWidth;
	var timer=null;

	obj.innerHTML+=obj.innerHTML;
	obj.style.width=oLi[0].offsetWidth*oLi.length+'px';
	fn();
	function fn(){
		timer=setInterval(function(){
			if(obj.offsetLeft<-obj.offsetWidth/2){
				obj.style.left=0+'px';
			}else if(obj.offsetLeft>0){
				obj.style.left=-obj.offsetWidth/2+'px';
			}
			obj.style.left=obj.offsetLeft+dis+'px';
		},mses);
	};

	if(lB&&rB){
		bind(lB,'click',fn1);
		function fn1(){
			dis=-Math.abs(dis);
			fn3();
		};
		bind(rB,'click',fn2);
		function fn2(){
			dis=Math.abs(dis);
			fn3();
		};
	}
	function fn3(){
		if(timer){
			clearInterval(timer);
			timer=null;
		}else{
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
function autoplay2(obj,prev,next,moveType,t,t1){
	var oLi=obj.children;
	var iW=oLi[0].offsetWidth;
	var iNow=0;
	var over=false;
	var timer=null;

	obj.innerHTML+=obj.innerHTML;
	obj.style.width=oLi.length*iW+'px';
	prev.onclick=function(){
		if(over)return;
		over=true;
		iNow++;
		fn();
	};
	next.onclick=function(){
		if(over)return;
		over=true;
		iNow--;
		fn();
	};
	obj.onmouseover=prev.onmouseover=next.onmouseover=function(){
		clearInterval(timer);
	};
	obj.onmouseout=prev.onmouseout=next.onmouseout=function(){
		fn1();
	};

	fn1();
	function fn1(){
		clearInterval(timer);
		timer=setInterval(prev.onclick,t);
	};
	function fn(){
		if(iNow>oLi.length/2){
			iNow%=oLi.length/2;
			css(obj,'translateX',0);
		}else if(iNow<0){
			iNow=oLi.length/2-1;
			css(obj,'translateX',-iW*oLi.length/2);
		}
		tweenMove(t1,obj,{'translateX':-iW*iNow},moveType,function(){
			over=false;
		});
	};
};

//提示框插件
//str（提示的字符串）
//msec（提示框消失的时间，默认3秒）
function alerts(str,msec){
	var oWrap=document.createElement('div');
	var msec=msec||3000;

	oWrap.style.cssText='box-sizing:border-box;min-width:140px;max-width:100%;padding:0 20px;height:50px;line-height:50px;text-align:center;border-radius:5px;background:rgba(0,0,0,0.6);color:#fff;font-size:14px;position:fixed;top:20%;left:50%;z-index:99999;transform:translate3d(-50%,0,0);-webkit-transform:translate3d(-50%,0,0);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity 3s ease-in 0s;-webkit-transition:opacity 3s ease-in 0s;opacity:1;';
	oWrap.innerHTML=str;
	oWrap.style.transitionDuration=(msec/1000/2)+'s';

	document.body.appendChild(oWrap);

	setTimeout(function(){
		oWrap.style.opacity=0;
	},msec/2);

	setTimeout(function(){
		document.body.removeChild(oWrap);
	},msec);
};

//提示框插件（成功和失败）
//str（提示的字符串）
//bool（true成功提示，false失败提示）
//msec（提示框消失的时间，默认3秒）
function toast(str,bool,msec){
	var oWrap=document.createElement('div');
	var oIcon=document.createElement('div');
	var oText=document.createElement('div');
	var msec=msec||3000;

	oWrap.style.cssText='box-sizing:border-box;width:260px;padding:20px;text-align:center;background-color:#fff;border-radius:5px;box-shadow:0 10px 20px rgba(0,0,0,0.2);position:fixed;left:50%;top:50%;z-index:99999;transform:translate3d(-50%,-50%,0);-webkit-transform:translate3d(-50%,-50%,0);transition:opacity 3s ease-in 0s;-webkit-transition:opacity 3s ease-in 0s;opacity:1;';
	oIcon.style.cssText='box-sizing:border-box;color:'+(bool?'#56a786':'#da596d')+';font-size:40px;';
	oText.style.cssText='box-sizing:border-box;padding-top:20px;line-height:20px;';
	oText.innerHTML=str;

	oWrap.style.transitionDuration=(msec/1000/2)+'s';

	AddClass(oIcon,'iconfont');
	AddClass(oIcon,bool?'icon-Shape':'icon-Shapefuben');

	oWrap.appendChild(oIcon);
	oWrap.appendChild(oText);
	document.body.appendChild(oWrap);

	setTimeout(function(){
		oWrap.style.opacity=0;
	},msec/2);

	setTimeout(function(){
		document.body.removeChild(oWrap);
	},msec);
};

//提示框带多条件阻止
//优先级reg>type>if（校验类型只生效一个）
//arr[{if:'','reg':/^$/,type:'number','value':,'str':''}]
//if（提示触发的条件）
//reg（正则匹配）
//type（已定义类型正则匹配）
//value（正则验证的值）
//hint（提示的字符串）
//endFn（全部验证通过后才走的回调函数）
//msec（提示框消失的时间，默认3秒）
function alertss(arr,endFn,msec){
	var onOff=true;
	var regJson={//所有type类型
        number:{
            name:'数字',
            reg:/^[0-9]+$/,
        },
        aa:{
            name:'小写字母',
            reg:/^[a-z]+$/,
        },
        AA:{
            nmae:'大写字母',
            reg:/^[A-Z]+$/,
        },
        aA:{
            name:'字母',
            reg:/^[a-zA-Z]+$/,
        },
        aa1:{
            name:'小写字母或数字',
            reg:/^[a-z0-9]+$/,
        },
        AA1:{
            name:'大写字母或数字',
            reg:/^[A-Z0-9]+$/,
        },
        aA1:{
            name:'字母和数字',
            reg:/^\w+$/,
        },
        zh:{
            name:'中文',
            reg:/^[\u2E80-\u9FFF]+$/,
        },
        zhEn:{
            name:'中文或英文',
            reg:/^[\u2E80-\u9FFFa-zA-Z]+$/,
        },
        mobile:{
            name:'手机号',
            reg:/^1[3-9]{1}\d{9}$/,
        },
        identity:{
            name:'身份证号码',
            reg:/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
        },
        bankCard:{
            name:'银行卡号',
            reg:/^[0-9]{8,28}$/,
        },
        user:{
            name:'用户名',
            reg:/^[a-z0-9_-]{3,16}$/,
        },
        password:{
            name:'密码',
            reg:/^[a-z0-9_-]{6,18}$/,
        },
        email:{
            name:'邮箱',
            reg:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        },
    };

	for(var i=0;i<arr.length;i++){
		if(arr[i].reg){
			if(!arr[i].reg.test(arr[i].value)){
				alerts(arr[i].hint,msec);
				onOff=false;
				break;
			}
		}else if(arr[i].type){
			if(regJson[arr[i].type]&&!regJson[arr[i].type].reg.test(arr[i].value)){
				alerts(arr[i].hint||'请输入有效的'+regJson[arr[i].type].name,msec);
				onOff=false;
				break;
			}
		}else if(arr[i].if){
			alerts(arr[i].hint,msec);
			onOff=false;
			break;
		}
	}
	onOff&&endFn&&endFn();
};

//判断数组、json、字符串是否所有值都不为空
function allHaveValue(obj){
	var bool=true;

	if(Type(obj)=='array'){
		for(var i=0;i<obj.length;i++){
			if(!obj[i]||obj[i]==0){
				bool=false;
				break;
			}
		}
	}else if(Type(obj)=='object'){
		for(var attr in obj){
			if(!obj[attr]||obj[i]==0){
				bool=false;
				break;
			}
		}
	}else{
		if(!obj||obj==0){
			bool=false;
		}
	}
	return bool;
};

//导航栏滑动插件
//obj（要滑动的容器）
//styleClass（高亮选中样式的类名）
//moveType（滑动的运动形式）
//t（每次滑动到达目标的运动时间）
function slide(obj,styleClass,moveType,t){
	var oA=obj.children;
	var iW=oA[0].offsetWidth;

	obj.style.width=iW*oA.length+'px';
	for(var i=0;i<oA.length;i++){
		oA[i].style.width=iW+'px';
	}
	var iMin=-(obj.offsetWidth-document.documentElement.clientWidth);

	for(var i=0;i<oA.length;i++){
		if(oA[i].className==styleClass){
			var iNowLeft=-oA[i].offsetLeft;

			if(iNowLeft<iMin)iNowLeft=iMin;
			tweenMove(t,obj,{'translateX':iNowLeft},moveType);
		}
	}
	bind(obj,'touchstart',fn);
	function fn(ev){
		var ev=ev||event;
		var iLeft=ev.changedTouches[0].pageX-css(obj,'translateX');

		bind(obj,'touchmove',fn1);
		function fn1(ev){
			var ev=ev||event;
			var iDis=ev.changedTouches[0].pageX-iLeft;

			if(iDis>0)iDis=0;
			if(iDis<iMin)iDis=iMin;
			tweenMove(t,obj,{'translateX':iDis},moveType);
		};
	};
	bind(obj,'touchmove',pDef);
};

//划屏惯性滚动插件（防隐藏元素）
//obj（要滑动的容器）
//msec（手指抬起时模拟惯性定时器的频率，不写默认为1000/60）
function slide1(obj,msec,n){
	var oA=obj.children;
	var iW=parseInt(getStyle(oA[0],'width'));
	var iLeft=0;
	var iL=0;
	var iT=0;
	var iDX=0;
	var iDX1=0;
	var iS=0;
	var iX=0;
	var iY=0;
	var iC=0;
	var timer=null;

	obj.style.width=iW*oA.length+'px';
	for(var i=0;i<oA.length;i++){
		oA[i].style.width=iW+'px';
	}
	var iMin=-(parseInt(getStyle(obj,'width'))-parseInt(getStyle(obj.parentNode,'width')) );

	bind(obj,'touchstart',fn);
	function fn(ev){
		var ev=ev||event;

		iLeft=ev.changedTouches[0].pageX-css(obj,'translateX');
		iL=ev.changedTouches[0].pageX;
		iT=ev.changedTouches[0].pageY;
		bind(obj,'touchmove',pDef);
	};

	bind(obj,'touchmove',fn1);
	function fn1(ev){
		var ev=ev||event;

		iDX=ev.changedTouches[0].pageX-iLeft;
		iX=ev.changedTouches[0].pageX-iL;
		iY=ev.changedTouches[0].pageY-iT;
		iS=iDX-iDX1;
		iDX1=iDX;
		iC=Math.abs(iX)-Math.abs(iY);

		iC>0?fn3():unbind(obj,'touchmove',pDef);
	};
	function fn3(){
		if(iDX>0){
			iDX=0;
			clearInterval(timer);
		}
		if(iDX<iMin){
			iDX=iMin;
			clearInterval(timer);
		}
		css(obj,'translateX',iDX);
	};

	bind(obj,'touchend',fn2);
	function fn2(){
		if(iC>0){
			iS=iS*(n||2);
			clearInterval(timer);
			timer=setInterval(function(){
				iDX+=iS;
				iS<0?iS++:iS--;
				fn3();
				if(Math.abs(iS)<1)clearInterval(timer);
			},msec||1000/60);
		}
	};
};

//两点滑动插件
//obj（要滑动的容器）
//t（到最大或最小位置的运动时间，不写默认为500毫秒）
function slide2(obj,t){
	var iLeft=0;
	var iLate=0;
	var iL=0;
	var iT=0;
	var iDX=0;
	var iDX1=0;
	var iS=0;
	var iX=0;
	var iY=0;
	var iC=0;
	var iTime=0;
	var iW=document.documentElement.clientWidth;
	var iMin=-(obj.offsetWidth-iW);

	bind(obj,'touchstart',fn);
	function fn(ev){
		var ev=ev||event;

		iTime=Date.now();
		iLate=css(obj,'translateX');
		iLeft=ev.changedTouches[0].pageX-iLate;
		iL=ev.changedTouches[0].pageX;
		iT=ev.changedTouches[0].pageY;
		bind(obj,'touchmove',pDef);
	};

	bind(obj,'touchmove',fn1);
	function fn1(ev){
		var ev=ev||event;

		iDX=ev.changedTouches[0].pageX-iLeft;
		iX=ev.changedTouches[0].pageX-iL;
		iY=ev.changedTouches[0].pageY-iT;
		iS=iDX-iDX1;
		iDX1=iDX;
		iC=Math.abs(iX)-Math.abs(iY);

		iC>0?fn3():unbind(obj,'touchmove',pDef);
	};
	function fn3(){
		if(iDX>0)iDX=0;
		if(iDX<iMin)iDX=iMin;

		css(obj,'translateX',iDX);
	};

	bind(obj,'touchend',fn2);
	function fn2(){
		if(iC>0){
			var iDW=0;
			var tDis=Date.now()-iTime;

			if(Math.abs(iX)>iW/3||tDis<300&&Math.abs(iX)>30){
				iDW=iX<0?iMin:0;
				tweenMove(t||500,obj,{'translateX':iDW},'linear');
			}else{
				tweenMove(t||500,obj,{'translateX':iLate},'linear');
			}
		}
	};
};

//手机划屏翻页插件
//obj(轮播图的父容器)，obj1（高亮的小点的父容器），styleClass（高亮小点的样式）
//t（划屏滚动时间）
function slide3(obj,obj1,styleClass,t){
	var oLi=obj.children;
	var aLi=obj1.children;
	var iW=oLi[0].offsetWidth;
	var iL=oLi.length;
	var iLeft=0;
	var iTop=0;
	var lDis=0;
	var tDis=0;
	var oTime=0;
	var iNow=0;
	var	index=0;
	var iOld=0;
	var str='';

	obj.style.width=iW*iL+'px';
	for(var i=0;i<iL;i++){
		oLi[i].style.width=iW+'px';
	}

	for(var i=0;i<iL;i++){
		str+='<li></li>';
	}
	obj1.innerHTML=str;
	var iW1=obj1.offsetWidth;
	obj1.style.marginLeft=-iW1/2+'px';
	aLi[0].classList.add(styleClass);

	bind(obj,'touchstart',fn2);
	function fn2(ev){
		var ev=ev||event;

		iLeft=ev.changedTouches[0].pageX;
		iTop=ev.changedTouches[0].pageY;
		oTime=Date.now();

		iOld=css(obj,'translateX');
		bind(obj,'touchmove',pDef);
		bind(obj1,'touchmove',pDef);
	};

	bind(obj,'touchmove',fn3);
	function fn3(ev){
		var ev=ev||event;
		lDis=ev.changedTouches[0].pageX-iLeft;
		tDis=ev.changedTouches[0].pageY-iTop;
		var condition=Math.abs(lDis)-Math.abs(tDis);

		if(condition<0){
			unbind(obj,'touchmove',pDef);
			unbind(obj1,'touchmove',pDef);
		}else{
			if(css(obj,'translateX')>=0&&lDis>0||css(obj,'translateX')<=-iW*(iL-1)&&lDis<0){
				lDis/=3;
			}
			css(obj,'translateX',iOld+lDis);
		}
	};

	bind(obj,'touchend',fn4);
	function fn4(){
		var tDis=Date.now()-oTime;

		if(Math.abs(lDis/iW)>0.3||tDis<300&&Math.abs(lDis)>30){
			lDis<0?iNow++:iNow--;
			fn();
			lDis=0;
		}

		tweenMove(t,obj,{'translateX':-iNow*iW},'linear',function(){
			iOld=css(obj,'translateX');
		});
		unbind(obj,'touchmove',pDef);
		unbind(obj1,'touchmove',pDef);
	};

	function fn(){
		if(iNow>iL-1){
			iNow=iL-1;
		}else if(iNow<0){
			iNow=0;
		}
		index=iNow;
		for(var	i=0;i<aLi.length;i++){
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
function autoNotice(obj,moveType,t,t1){
	var oLi=obj.children;
	var iL=oLi.length*2;
	var iH=oLi[0].offsetHeight;
	var iNow=0;

	obj.innerHTML+=obj.innerHTML;
	yydTimer(function(clear){
		iNow++;
		if(iNow>iL/2){
			iNow=1;
			css(obj,'translateY',0);
		}
		tweenMove(t1||1000,obj,{'translateY':-iNow*iH},moveType);
	},t||2000);
};

//横向公告滚动插件
//obj(要滚动的父容器)
//dis(每次运动的距离)
//msec(定时器频率)
function autoNotice1(obj,dis,msec){
	var oLi=obj.children;
	var iL=oLi.length*2;
	var iW=0;
	var iNow=0;

	obj.innerHTML+=obj.innerHTML;
	for(var i=0;i<obj.children.length;i++){
		iW=obj.children[i].offsetWidth*iL;
	}
	obj.style.width=iW+'px';

	yydTimer(function(clear){
		if(css(obj,'translateX')<=-iW/2){
			css(obj,'translateX',-14);
		}
		css(obj,'translateX',css(obj,'translateX')-(dis||1));
	},msec||1000/60);
};

//模拟水印效果插件
//msec(水印运动的频率)
//obj(产生水印效果的容器)
//iDis(水印每步运动的距离)
//color(水印的颜色)
//color1(水印背景颜色)
//endFn(回调函数用来触发链接)
/*配置waterWave(20,oLi,5,'#ddd','#eee');*/
function waterWave(msec,obj,iDis,color,color1,endFn){
	var timer=null;
	var timer1=null;
	var iLeft=0;
	var iTop=0;
	var iNum1=0;
	var iNum2=0;
	var iDate=0;
	var click=false;

	bind(obj,'touchstart',fn1);
	function fn1(ev){
		clearInterval(timer);
		var ev=ev||event;
		click=false;

		iNum1=0;
		iNum2=0;
		iLeft=ev.changedTouches[0].pageX-getPos(obj,'left');
		iTop=ev.changedTouches[0].pageY-getPos(obj,'top');

		timer=setInterval(function(){
			iNum1+=iDis;
			obj.style.backgroundImage='radial-gradient(circle at '+iLeft+'px '+iTop+'px,'+color+' '+(iNum1)+'%, #eee 0%)';
			if(iNum1>=100){
				clearInterval(timer);
				setTimeout(function(){
					obj.style.background='none';
				},1000);
			}
		},msec);
	};

	bind(obj,'touchmove',function(){
		clearInterval(timer);
		obj.style.background='none';
	});

	bind(obj,'touchend',fn2);
	function fn2(){
		clearInterval(timer);
		clearInterval(timer1);
		iNum2=100-iNum1;
		timer1=setInterval(function(){
			iNum1+=Math.floor(iNum2/5);

			obj.style.background='radial-gradient(circle at '+iLeft+'px '+iTop+'px,'+color+' '+(iNum1)+'%, '+color1+' 0%) no-repeat ';
			if(iNum1>=100){
				clearInterval(timer);
				clearInterval(timer1);
				obj.style.background='none';
				if(click){
					setTimeout(function(){
						endFn&&endFn.call(obj);
					},50);
				}
			}
		},20);
	};

	bind(obj,'contextmenu',pDef);
	bind(obj,'click',function(){
		click=true;
		fn2();
	});
};

//生成变色字体
//obj(包含字体的标签)
//color(变色字左边的颜色)
//color1(变色字右边的颜色)
//width(变色字左边的宽度，带上单位%或px)
function changeColorWords(obj,color,color1,width){
	var arr=[];
	var str='';
	var color=color||'red';
	var color1=color1||'blue';
	var width=width||'50%';
	var reg=/<!--(.|\n)+-->|\/\*(.|\n)+\*\/|\/\/(.|\n)+|\n+|\r|\s/g;

	arr=obj.innerHTML.replace(reg,'').split('');
	for(var i=0;i<arr.length;i++){
		str+='<i><b>'+arr[i]+'</b>'+arr[i]+'</i>';
	}
	obj.innerHTML=str;
	var oI=obj.getElementsByTagName('i');
	var oB=obj.getElementsByTagName('b');
	for(var i=0;i<oI.length;i++){
		oI[i].style.cssText='float:left; height:100%; font-style:normal; color:'+color+'; position:relative;';
		oB[i].style.cssText='font-weight:normal; width:'+width+'; height:100%; color:'+color1+'; position:absolute; left:0; top:0;overflow:hidden;';
	}
};

//手机模拟滚动插件(body定为一屏幕的高度)
//obj（要滚动的容器）
//sFn（touchstart回调）
//mFn（touchmove回调）
//eFn（touchend回调）
function pageScroll(obj,sFn,mFn,eFn){
	var iMin=document.documentElement.clientHeight-parseInt(getStyle(obj,'height'));
	var iTop=0;
	var iDisY=0;
	var iY=0;
	var iY1=0;
	var iS=0;
	var sY=0;
	var oldY=0;
	var timer=null;

	bind(obj,'touchstart',function(ev){
		var ev=ev||event;
		sY=ev.changedTouches[0].pageY;
		sFn&&sFn.call(this,sY);
	});
	bind(obj,'touchmove',function(ev){
		var ev=ev||event;
		iDisY=ev.changedTouches[0].pageY-sY;
		iY=ev.changedTouches[0].pageY-sY+oldY;
		iS=iY-iY1;
		iY1=iY;

		if(css(obj,'translateY')>0||css(obj,'translateY')<iMin){
			iDisY/=5;
		}
		iTop=oldY+iDisY;
		if(iTop>50)iTop=50;
		if(iTop<iMin-50)iTop=iMin-50;
		css(obj,'translateY',iTop);
		mFn&&mFn.call(this,iTop);
	});
	function fn1(){
		if(iY>0){
			iY=0;
			clearInterval(timer);
		}
		if(iY<iMin){
			iY=iMin;
			clearInterval(timer);
		}
		css(obj,'translateY',iY);
	};
	bind(obj,'touchend',function(ev){
		var ev=ev||event;

		if(css(obj,'translateY')>0){
			tweenMove(500,obj,{'translateY':0},'linear',function(){
				oldY=css(obj,'translateY');
			});
		}else if(css(obj,'translateY')<iMin){
			tweenMove(500,obj,{'translateY':iMin},'linear',function(){
				oldY=css(obj,'translateY');
			});
		}else{
			oldY=css(obj,'translateY');
		}

		iS=iS;
		clearInterval(timer);
		timer=setInterval(function(){
			iY+=iS;
			iS<0?iS++:iS--;
			fn1();
			if(Math.abs(iS)<1)clearInterval(timer);
		},1000/60);
		eFn&&eFn.call(this,oldY,iS);
	});
};

//添加删除遮罩层
function mask(zIndex,onOff){
	if(!document.getElementById('yydMask')&&onOff){
		var oMask=document.createElement('div');
		oMask.id='yydMask';

		oMask.style.cssText='width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); position: fixed; top: 0; left: 0; z-index: 10;';
		oMask.style.zIndex=zIndex;
		document.body.appendChild(oMask);
	}

	if(document.getElementById('yydMask')&&!onOff){
		document.body.removeChild(document.getElementById('yydMask'));
	}
};

//创建一个loading样式
//mask(是否能看见遮罩)
//onOff(创建还是删除loading)
//scale(样式的大小比例)
//msec(旋转定时器的频率)
//zIndex(设置层级)
function loadingMask(mask,onOff,scale,msec,zIndex){
	if(!document.getElementById('yydLoading')&&onOff){
		var oUl=document.createElement('i');
		var oli=oUl.getElementsByTagName('i');
		var sLi='';
		var iNum=0;
		var timer=null;

		oUl.style.cssText='margin:auto; width:40px; height:40px; position: absolute; left:0; right:0; top:0; bottom:0;';
		oUl.id='yydLoading';
		oUl.style.transform='scale('+(scale||1)+','+(scale||1)+')';
		oUl.style.WebkitTransform='scale('+(scale||1)+','+(scale||1)+')';

		for(var i=0;i<12;i++){
			sLi+='<i></i>';
		}
		oUl.innerHTML=sLi;

		for(var i=0;i<12;i++){
			oli[i].style.cssText='list-style:none; width:4px; height:10px; background-color:rgba(255,255,255,0.5); position:absolute; left:20px; top:0; transform-origin:0 20px; -webkit-transform-origin:0 20px; border-radius:2px 2px 0 0;';
		}

		var oDiv=document.createElement('div');

		oDiv.style.cssText='width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); position: fixed; top: 0; left: 0;';
		oDiv.id='yydMask1';
		oDiv.style.zIndex=zIndex||10;

		oDiv.appendChild(oUl);
		document.body.appendChild(oDiv);
		if(!mask){
			oDiv.style.backgroundColor='rgba(0,0,0,0)';
		}

		for(var i=0;i<12;i++){
			oli[i].style.transform='rotate('+i*30+'deg)';
			oli[i].style.WebkitTransform='rotate('+i*30+'deg)';
		}

		fn1();
		timer=setInterval(fn1,msec||100);

		function fn1(){
			iNum++;

			for(var i=0;i<12;i++){
				oli[i].style.backgroundColor='rgba(155,155,155,0.5)';
			}
			oli[iNum%12].style.backgroundColor='rgba(55,55,55,0.9)';
			oli[(iNum+1)%12].style.backgroundColor='rgba(55,55,55,0.8)';
			oli[(iNum+2)%12].style.backgroundColor='rgba(55,55,55,0.7)';
			oli[(iNum+3)%12].style.backgroundColor='rgba(55,55,55,0.6)';
			oli[(iNum+4)%12].style.backgroundColor='rgba(55,55,55,0.5)';
			oli[(iNum+5)%12].style.backgroundColor='rgba(55,55,55,0.4)';
		};
	}

	if(document.getElementById('yydLoading')&&!onOff){
		clearInterval(timer);
		document.body.removeChild(document.getElementById('yydMask1'));
	}
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
function UnReload(option){
	this.option=option;
	for(var i=0;i<option.length;i++){
		option[i].iNum=0;
		option[i].timer=null;
		this.Click(option[i]);
		this.exist(option[i]);
		this.Unload();
	}
};
UnReload.prototype={
	start:function(option){
		var This=this;
		clearInterval(option.obj.timer);
		option.obj.classList.add('active');
		option.obj.innerHTML=((option.num+1)||60)-option.iNum+(option.str2||'s后重新发送');

		option.obj.timer=setInterval(function(){
			option.iNum++;

			if(option.iNum>=((option.num+1)||60)){
				clearInterval(option.obj.timer);
				option.obj.classList.remove('active');
				option.obj.innerHTML=option.str1||'获取验证码';
				option.iNum=0;
			}else{
				option.obj.innerHTML=((option.num+1)||60)-option.iNum+(option.str2||'s后重新发送');
			}
		},1000);
	},
	Click:function(option){
		var This=this;

		option.obj.onclick=function(){
			if(option.iNum>0&&option.iNum<((option.num+1)||60))return;
			if(option.obj1){
				if(!option.obj1.value){
					alerts('请填写手机号！');
					return;
				}else{
					var reg=/^1[3-9]{1}\d{9}$/;

					if(!reg.test(option.obj1.value)){
						alerts('手机号格式错误！');
						return;
					}
				}
			}
			if(document.getElementById('yydTXM')&&!document.getElementById('yydTXM').value){
				alerts('请输入图形验证码！');
				return;
			}
			option.endFn&&option.endFn.call(option.obj);
			option.iNum=1;
			This.start(option);
		};
	},
	exist:function(option){
		var yydNum=+(window.localStorage.getItem(option.lNum||'yydNum'));
		var yydTime=+(window.localStorage.getItem(option.lTime||'yydTime'));

		if(yydNum){
			var nTime=Math.round((+new Date()-yydTime)/1000);

			option.iNum=((+yydNum)+(+nTime));
			if(option.iNum>0&&option.iNum<=((option.num+1)||60)){
				this.start(option);
			}
		}
	},
	Unload:function(){
		var This=this;
		window.onunload=function(){
			for(var i=0;i<This.option.length;i++){
				window.localStorage.setItem(This.option[i].lNum||'yydNum',+This.option[i].iNum);
				window.localStorage.setItem(This.option[i].lTime||'yydTime',+new Date());
			}
		};
	}
};

//抛物线运动插件(公式：y=ax^2+bx^2+c)
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
function fly(obj,a,t,t1,sLeft,sTop,eLeft,eTop,stepFn,endFn){
	var a=a||0.001;
	var sLeft=sLeft||0;
	var sTop=sTop||0;
	var eLeft=eLeft||200;
	var eTop=eTop||200;

	var timer=null;
	var	sT=+new Date();
	var t=t||500;
	var eT=sT+t;
	var x=eLeft-sLeft;
	var y=eTop-sTop;
	var b=(y-a*x*x)/x;

	obj.style.position='absolute';
	obj.style.opacity=0;
	obj.style.filter='alpha(opacity:0)';
	clearInterval(timer);
	timer=setInterval(function(){
		var nT=+new Date();

		obj.style.opacity=100;
		obj.style.filter='alpha(opacity:100)';
		if(nT>eT){//当前时间大于结束时间就停止运动
			clearInterval(timer);
			css(obj,'translateX',eLeft);
			css(obj,'translateY',eTop);
			endFn&&endFn.call(this);
		}else{
			var disX=x*(nT-sT)/t;
			var disY=a*disX*disX+b*disX;

			css(obj,'translateX',sLeft+disX);
			css(obj,'translateY',sTop+disY);
			stepFn&&stepFn.call(this,sLeft+disX,sTop+disY);
		}
	},t1||1000/60);
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
function autoClipImage(option){
	var json={'png':'image/png','jpg':'image/jpeg','gif':'image/gif','icon':'image/x-icon'};
	var iW=option.width;
	var iH=option.height;

	var obj=option.obj;
	var sWidth=option.sWidth||640;
	var width=option.width;
	var height=option.height;
	var position=option.position||'center';
	var type=option.type||'png';
	var quality=option.quality||1;
	var endFn=option.endFn||null;

	obj.onchange=function(){
		if(!this.files.length)return;//没选择文件则不执行
		var file=this.files[0];
		var reader=new FileReader();
		var onOff=false;

		reader.readAsDataURL(file);
		reader.onload=function(){
			for(var attr in json){
				if(file.type==json[attr]){
					onOff=true;
					break;
				}
			}
			if(!onOff){
				alerts('请上传图片文件！');
				resetFile(obj);
				console.log('文件类型为：'+file.type+'，不是正确的图片类型：'+JSON.stringify(json),file);
				return;
			}
			setImageURL(reader.result,file);
		};
	};

	function setImageURL(url,file){
		var image=new Image();
		var oWrap=document.createElement('div');
		var oC=document.createElement('canvas');

		image.src=url;
		image.style.cssText='width:auto!important;height:auto!important;max-width:none!important;min-width:none!important;max-height:none!important;min-height:none!important;opacity:0;filter:alpha(opacity:0)';
		oWrap.style.cssText='position:absolute;';
		oWrap.appendChild(image);
		document.body.appendChild(oWrap);

		image.onload=function(){
			var iWidth=parseFloat(getStyle(image,'width'));
			var iHeight=parseFloat(getStyle(image,'height'));

			if(iWidth>sWidth){//根据宽度限制进行预压缩
				var maxWidth=iWidth;
				var maxHeight=iHeight;

				iWidth=sWidth;
				iHeight=iHeight*sWidth/maxWidth;

				var oC1=document.createElement('canvas');

				oC1.width=iWidth;
				oC1.height=iHeight;
				oWrap.appendChild(oC1);

				var oGC1=oC1.getContext('2d');

				oGC1.drawImage(image,0,0,maxWidth,maxHeight,0,0,iWidth,iHeight);
				image.src=oC1.toDataURL(json[type]);
				image.onload=function(){
					clip();
				};
			}else{
				clip();
			}

			function clip(){//判断希望的图片尺寸进行压缩和裁剪
				if(width&&height){
					if(width<=1&&height<=1){
						width=iWidth*width;
						height=iWidth*height;
					}
					if(width>iWidth&&height<=width*iHeight/iWidth){
						image.style.width=width+'px';
						image.style.height='auto';
					}else if(height>iHeight&&width<=height*iWidth/iHeight){
						image.style.width='auto';
						image.style.height=height+'px';
					}
				}else if(width&&!height){
					if(width>iWidth){
						image.style.width=width+'px';
					}
					height=iHeight;
				}else if(!width&&height){
					if(height>iHeight){
						image.style.height=height+'px';
					}
					width=iWidth;
				}else{
					width=iWidth;
					height=iHeight;
				}

				var iWidth1=parseFloat(getStyle(image,'width'));
				var iHeight1=parseFloat(getStyle(image,'height'));

				oWrap.style.width=iWidth1+'px';
				oWrap.style.height=iHeight1+'px';

				oC.style.cssText='position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;z-index:10;';
				switch(position){
					case 'top':
								oC.style.left='50%';
								oC.style.marginLeft=-width/2+'px';
								oC.style.right='auto';
								oC.style.bottom='auto';
								break;
					case 'bottom':
								oC.style.left='50%';
								oC.style.marginLeft=-width/2+'px';
								oC.style.right='auto';
								oC.style.top='auto';
								break;
					case 'left':
								oC.style.top='50%';
								oC.style.marginTop=-height/2+'px';
								oC.style.right='auto';
								oC.style.bottom='auto';
								break;
					case 'right':
								oC.style.top='50%';
								oC.style.marginTop=-height/2+'px';
								oC.style.left='auto';
								oC.style.bottom='auto';
								break;
				}
				oC.width=width;
				oC.height=height;
				oWrap.appendChild(oC);

				var iLeft=oC.offsetLeft;
				var iTop=oC.offsetTop;
				oWrap&&document.body.removeChild(oWrap);

				var oGC=oC.getContext('2d');
				oGC.drawImage(image,iLeft*iWidth/iWidth1,iTop*iHeight/iHeight1,width*iWidth/iWidth1,height*iHeight/iHeight1,0,0,width,height);

				width=iW;
				height=iH;

				resetFile(obj);
				endFn&&endFn(oC.toDataURL(json[type],quality),file);
			};
		};
	};
};

//对拟态类名(字符串样式)的操作，必须先用set方法
//该方法是为了在js里替代类似active状态操作类名样式
var yydStyle={
	set:function(obj,str){
		if(obj.getAttribute('style'))str=obj.getAttribute('style')+str;
		obj.setAttribute('style',str);
		this.str=str;
	},
	get:function(){
		return this.str;
	},
	remove:function(obj,str){
		if(this.str){
			this.str=this.str.replace(str,'');
			obj.setAttribute('style',this.str);
		}
	}
};

//滑动选项卡效果
//obj(选项的一组元素)
//str(可以修改滑动条的样式，样式字符串)
//endFn(回调函数，返回选中的索引，用于切换内容)
function yydTabBar(obj,str,endFn){
	var oldIndex=0;
	var obj1=document.createElement('div');
	var barStyle='height: 3px; background-color: #f20532; position: absolute; left: 0; right: 100%; bottom: 0;';
	var forward='transition: right 0.3s cubic-bezier(0.61, 0.01, 0.25, 1), left 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s; -webkit-transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1), left 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s;';
	var backward='transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s, left 0.3s cubic-bezier(0.35, 0, 0.25, 1); -webkit-transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s, left 0.3s cubic-bezier(0.35, 0, 0.25, 1);';

	if(str)barStyle+=str;
	obj1.setAttribute('style',barStyle);
	obj[0].parentNode.appendChild(obj1);
	for(var i=0;i<obj.length;i++){
		obj[i].index=i;
	}
	for(var i=0;i<obj.length;i++){
		obj[i].onclick=function(){
			var iLeft=this.offsetLeft;
			var iRight=document.documentElement.clientWidth-(this.offsetLeft+this.offsetWidth);
			var index=this.index;

			function clear(){
				for(var i=0;i<obj.length;i++){
					obj[i].classList.remove('active');
				}
			};
			if(index!=oldIndex){
				oldIndex=index;
				clear();
				yydStyle.remove(obj1,forward);
				yydStyle.remove(obj1,backward);
				index>oldIndex?yydStyle.set(obj1,forward):yydStyle.set(obj1,backward);
				setTimeout(function(){
					obj1.style.left=iLeft+'px';
					obj1.style.right=iRight+'px';
				});
				setTimeout(function(){
					clear();
					obj[index].classList.add('active');
				},300);
				endFn&&endFn(index);
			}
		};
	}
};

//百度地图定位接口(需要引入jq)
//<script src="https://api.map.baidu.com/api?v=2.0"></script>
function getLocation(endFn) {
	$.getScript("https://api.map.baidu.com/api?v=2.0", function(){
		var options={
			enableHighAccuracy:true,
			maximumAge:1000
		};

		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				//获取经纬度成功(mo浏览器上,调用百度地图接口，传入经纬度获取城市)
				var longitude=position.coords.longitude;//经度
				var latitude=position.coords.latitude;//纬度
				var map=new BMap.Map("allmap");
				var point=new BMap.Point(longitude,latitude);
				var gc=new BMap.Geocoder();

				gc.getLocation(point,function(rs){
					var addComp=rs.addressComponents;

					if(addComp.city.charAt(addComp.city.length-1)=='市'){
						addComp.city=addComp.city.replace('市','');
					}
					endFn&&endFn(addComp.city,longitude,latitude);
				});
			},function(error){//获取经纬度失败 (pc浏览器上，调用新浪接口获取城市)
				var url='http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';

				$.getScript(url,function(){
					if(remote_ip_info.ret=='1'){
						endFn&&endFn(remote_ip_info.city);
					}
				});
			},options);
		}else{
			alert('您的浏览器不支持地理位置定位');
		}
	});
};

//高德定位接口(需要引入jq)
//<script src="https://webapi.amap.com/maps?v=1.3&key=c14b6228b5ae543b1718ab6ebc4d19f5"></script>
function getLocation1(endFn) {
	$.getScript("https://webapi.amap.com/maps?v=1.3&key=c14b6228b5ae543b1718ab6ebc4d19f5", function(){
		function session(key,value){
			if(arguments.length==1){
			  return window.sessionStorage.getItem(key);
			}
			if(arguments.length==2){
			  window.sessionStorage.setItem(key,value);
			}
		};

		yydTimer(function(clear){
			var city=session('getLocationCity');
			var longitude=session('getLocationLongitude');
			var latitude=session('getLocationLatitude');
			var province=session('getLocationProvince');
			var detail=session('getLocationDetail');
			var condition=city&&longitude&&latitude&&province&&detail;

			if(condition){
				clear();
				endFn&&endFn(city,(+longitude),(+latitude),province,detail);
			}else{
				if(Type(AMap.Map)=='function'){
					clear();
					getMap();
				}
			}
		});

		function getMap(){
			var mapObj = new AMap.Map('container');

		    mapObj.plugin('AMap.Geolocation', function () {
		    	var geolocation = new AMap.Geolocation({
			        enableHighAccuracy: true,//是否使用高精度定位，默认:true
			        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
			        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
			        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
			        showButton: true,        //显示定位按钮，默认：true
			        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
			        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
			        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
			        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
			        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
		    	});
				mapObj.addControl(geolocation);
				AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
				AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息

				function setSession(city,longitude,latitude,province,detail){
					session('getLocationCity',city);
					session('getLocationLongitude',longitude);
					session('getLocationLatitude',latitude);
					session('getLocationProvince',province);
					session('getLocationDetail',detail);
				};
				function onComplete(data){
					console.log(data);
					var city=data.addressComponent?data.addressComponent.city:'南昌市';
					var longitude=data.position.lng?data.position.lng:'115.89';
					var latitude=data.position.lat?data.position.lat:'28.68';
					var province=data.addressComponent?data.addressComponent.province:'江西省';
					var detail=data.formattedAddress?data.formattedAddress:'江西省南昌市卫东';

					setSession(city,longitude,latitude,province,detail);
					endFn&&endFn(city,longitude,latitude,province,detail);//http纬度为L，https纬度为M
				};
				function onError(data){
					console.log(data);
					setSession('南昌市',115.89,28.68,'江西省','江西省南昌市卫东');
					endFn&&endFn('南昌市',115.89,28.68,'江西省','江西省南昌市卫东');
				};
				//获取当前位置信息
				getCurrentPosition();
				function getCurrentPosition () {
					geolocation.getCurrentPosition();
				};
				//监控当前位置并获取当前位置信息
				function watchPosition () {
					geolocation.watchPosition();
				};
		    });
		};
    });
};

//生成高德地图多点标注地址
//arr示例[{longitude:'',latitude:'',name:''}]
function createGaodeMapUrl1(arr){
	var url='https://uri.amap.com/marker?callnative=1&markers=';
	var str='';

	for(var i=0;i<arr.length;i++){
		if(arr[i].longitude&&arr[i].latitude){
			str+=arr[i].longitude+','+arr[i].latitude+','+arr[i].name+'|';
		}
	}
	str=str.substring(0,str.length-1);
	return url+encodeURIComponent(str);
};

//生成高德地图搜索周边地址
//keyword(搜索关键字)
//longitude(中心点经度)
//latitude(中心点纬度)
//city(搜索城市)
function createGaodeMapUrl2(keyword,longitude,latitude,city){
	var url='https://uri.amap.com/search?';
	var str='callnative=1&keyword='+keyword+'&center='+longitude+','+latitude+'&city='+city;

	return url+str;
};

//生成高德地图导航地址
//start(起始点参数)
//end(终点参数)
function createGaodeMapUrl3(start,end){
	var url='https://m.amap.com/navigation/carmap/saddr=';
	var str=start.longitude+','+start.latitude+','+start.name+'&daddr='+end.longitude+','+end.latitude+','+end.name+'&callnative=1';

	return url+str;
};

//根据经纬度算大圆上两点间距离(假设地球为标准圆)
function getGreatCircleDistance(lng1,lat1,lng2,lat2){
	var EARTH_RADIUS = 6378137.0;    //地球半径单位M
	function getRad(d){
		return d*Math.PI/180.0;
	};

    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);
    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);

    var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s*EARTH_RADIUS;
    s = Math.round(s*10000)/10000.0;

    return Math.round(s);
};

//根据经纬度算椭圆上两点间距离
function getFlatternDistance(lng1,lat1,lng2,lat2){
	var EARTH_RADIUS = 6378137.0;    //地球半径单位M
	function getRad(d){
		return d*Math.PI/180.0;
	};

    var f = getRad((lat1 + lat2)/2);
    var g = getRad((lat1 - lat2)/2);
    var l = getRad((lng1 - lng2)/2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s,c,w,r,d,h1,h2;
    var a = EARTH_RADIUS;
    var fl = 1/298.257;

    sg = sg*sg;
    sl = sl*sl;
    sf = sf*sf;

    s = sg*(1-sl) + (1-sf)*sl;
    c = (1-sg)*(1-sl) + sf*sl;

    w = Math.atan(Math.sqrt(s/c));
    r = Math.sqrt(s*c)/w;
    d = 2*w*a;
    h1 = (3*r -1)/2/c;
    h2 = (3*r +1)/2/s;

    return Math.round(d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg)));
};

//新浪天气接口(需要引入jq)
function getWeather(city,endFn){
	var url='http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
	var str=city.charAt(city.length-1);

	switch(str){
		case '市':
			city=city.substring(0,city.length-1);
			break;
		case '区':
			city=city.substring(0,city.length-2);
			break;
	}
	$.getScript(url,function(){
		if(remote_ip_info.ret=='1'){
			$.ajax({
				url:'http://wthrcdn.etouch.cn/weather_mini?city='+city,
				type:'GET',
				data:'',
				success:function(data){
					var data1=JSON.parse(data);

					if(data1.status==1000){
						var data2=JSON.parse(data);

						data2=data2.data.forecast[0];
						data2.status=data1.status;
						console.log('获取'+city+'天气成功！');
						endFn&&endFn(data2);
					}else{
						console.log('获取'+city+'天气失败！');
					}
				}
			});
		}
	});
};



/*微信相关*/
/*获取微信openId*/
function getOpenId(url,endFn){
	//获得微信基本权限的code（无需授权）
	var snsapi_base='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd9b3d678e7ae9181&redirect_uri='+url+'&response_type=code&scope=snsapi_base#wechat_redirect';

	//获得微信最高权限的code（需要授权）
	var snsapi_userinfo='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd9b3d678e7ae9181&redirect_uri='+url+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

	//如果在本地存储中没有发现openId再进行获取操作
	if(!store.get('yydOpenId')){
		if(!window.location.search.match('code')){
			window.location.href=snsapi_base;
		}else{
			var json={};

			json.wxcode=strToJson().code;
			json.appid='wxd9b3d678e7ae9181';

			$.ajax({
				url:URL+'/action/GetWXOpenID.ashx',
				data:json,
				type:'POST',
				dataType:'json',
				success:function(data){
					if(data.code=='sucess'){
						store.set('yydOpenId',data.openid);
					}
					endFn&&endFn(data);
				}
			});
		}
	}else{
		endFn&&endFn();
	}
};

/*微信内置对象封装*/
function WXFZ(json,endFn){
	function onBridgeReady(){
	   WeixinJSBridge.invoke(
	       'getBrandWCPayRequest',{
	           "appId":json.appId,     			    //公众号名称，由商户传入
	           "timeStamp":json.timeStamp,          //时间戳，自1970年以来的秒数
	           "nonceStr":json.nonceStr, 			//随机串
	           "package":json.package,
	           "signType":json.signType,         	//微信签名方式：
	           "paySign":json.paySign 				//微信签名
	       },
	       function(res){
				//使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
	           if(res.err_msg=='get_brand_wcpay_request:ok') {
	           		window.location.href=json.url;
	           }else{
	           		alerts('微信支付失败，请重试！');
	           }
	           endFn&&endFn(res);
	       }
	   );
	}
	if(typeof WeixinJSBridge=="undefined"){
	   if(document.addEventListener){
	       document.addEventListener('WeixinJSBridgeReady',onBridgeReady,false);
	   }else if(document.attachEvent){
	       document.attachEvent('WeixinJSBridgeReady',onBridgeReady);
	       document.attachEvent('onWeixinJSBridgeReady',onBridgeReady);
	   }
	}else{
	   onBridgeReady();
	}
};

/*微信支付最终封装(多接口)*/
function endPayWXAll(index,endUrl){
	var url=window.location.href;
	var arr=[];
	arr[0]='/action/wxpay/WXPayUnite.ashx';//微信统一支付
	arr[1]='/action/wxpay/WXPayUniteMemberUpgrade.ashx';//会员升级
	arr[2]='/action/wxpay/WXPayBailUnite.ashx';//二手车支付保证金
	arr[3]='/action/wxpay/WXPaySecondBailUnite.ashx';//收车方
	arr[4]='/action/wxpay/WXPaySecondBailSellerUnite.ashx';//卖车方

	getOpenId(url,function(data){
		//console.log(data);
		var json={};

		json.trade_type='JSAPI';
		json.id=strToJson().id;
		json.openid=store.get('yydOpenId');
		//console.log(json);

		/*微信支付后端集成后数据接口*/
		$.ajax({
			url:URL+arr[index],
			data:json,
			type:'POST',
			dataType:'json',
			success:function(data1){
				//console.log(data1);
				if(data1.code=='sucess'){
					var json={};

					json.appId=data1.appId;
					json.timeStamp=data1.timeStamp;
					json.nonceStr=data1.nonceStr;
					json.package=data1.package;
					json.signType=data1.signType;
					json.paySign=data1.paySign;
					json.url=endUrl||'zzzzfPaySuccess.html';
					WXFZ(json);
				}else{
					alerts(data1.message);
				}
			}
		});
	});
};

//微信分享
// json{
//     title: '', // 分享标题
//     desc: '', // 分享描述
//     imgUrl: '', // 分享图标
//     link: '', // 分享链接，默认地址
//     success: function () { //默认
//        // 用户确认分享后执行的回调函数
//     },
//     cancel: function () { //默认
//        // 用户取消分享后执行的回调函数
//     }
// }
function wxShare(json){
	$.getScript('https://res.wx.qq.com/open/js/jweixin-1.2.0.js',function(){
		var json1={};

		json1.url=window.location.href.split('#')[0];
		var arr=[
			    	'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'onMenuShareQZone'
				];
		wxJsApiSign(json1,function(data){
			//console.log(data);
			var data=data.data||{};

			wx.config({
			    debug: false, // 开启调试模式,仅在pc端时才会打印。
			    appId: data.appId||'appId', // 必填，公众号的唯一标识
			    timestamp: data.timestamp||'timestamp', // 必填，生成签名的时间戳
			    nonceStr: data.nonceStr||'nonceStr', // 必填，生成签名的随机串
			    signature: data.signature||'signature',// 必填，签名，见附录1
			    jsApiList: [].concat(arr) // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		});

		wx.checkJsApi({
		    jsApiList: [].concat(arr), // 需要检测的JS接口列表，所有JS接口列表见附录2,
		    success: function(res) {
		        // 以键值对的形式返回，可用的api值true，不可用为false
		        console.log('可用接口',res);
		    }
		});

		var json2={
	    	title: '分享标题', // 分享标题
	    	desc: '分享内容', // 分享内容
		    imgUrl: window.location.origin+'/static/images/logoBg.png', // 分享图标
		    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    success: function () {
		        // 用户确认分享后执行的回调函数
		        console.log('成功');
		    },
		    cancel: function () {
		        // 用户取消分享后执行的回调函数
		        console.log('失败');
		    }
	    };

	    if(json){
	    	for(var attr in json){
	    		console.log(attr,json[attr]);
	    		json2[attr]=json[attr];
	   		}
	    }

		wx.ready(function(){
		    for(var i=0;i<arr.length;i++){
		    	wx[arr[i]](json2);
		    }
		});
		wx.error(function(res){
		    console.log('错误',res);
		});
	});
};

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
// 	<span>正在加载中...</span>
// 	<em>全部加载完毕...</em>
// </div>
// .loading{ width: 100%; height: 50px; line-height: 50px; text-align: center; background-color: #fff; position:relative; display: none;}
// .loading span,.loading em{ display: block; width: 120px; margin: 0 auto;  color: #666; font-size: 12px; display: none;}
// .loading span{ padding-left: 40px; background:url('/static/images/loading.gif') no-repeat 5px center; background-size:30px;}
// .loading.active,.loading.active1{ display: block;}
// .loading.active span{ display: block;}
// .loading.active1 em{ display: block;}
var pullLoading=function(This,apiFn,json,list,endFn1,endFn2,dataName,path,iDis){
	//json克隆副本
	function Json(json){
		return JSON.parse(JSON.stringify(json));
	};
	var loadOver=true;
	var getList=function(endFn,endFn1){
		apiFn(json,function(data){
			console.log(data);
			endFn1&&endFn1(data);
			setTimeout(function(){
				loadOver=true;
			},300);

			//加载完毕回调函数
			if(endFn2){
				endFn2(endFn,data);
			}else{
				if(dataName){
					if(!data[dataName].length){
						endFn&&endFn();
						return;
					}
					This[list]=This[list].concat(Json(data[dataName]));
				}else{
					if(!data.data.length){
						endFn&&endFn();
						return;
					}
					This[list]=This[list].concat(Json(data.data));
				}
			}
		});
	};
	getList(null,endFn1);

	$(document).on('scroll',scroll);
	function scroll(){
		var iSH=$(document).scrollTop()+document.documentElement.clientHeight;
		//有个报错
		if($('.option.active').offset()){
			var iEH=$('.option.active').offset().top+$('.option.active').height()+(iDis||0);
		}

		if(iSH>=iEH&&loadOver){
			$('.loading').addClass('active');

			json.PageIndex+=1;
			json.nowpage+=1;//一期排行榜的页码
			if(loadOver){
				loadOver=false;
				getList(function(){
					$('.loading').addClass('active1');
				},null,endFn2);
			}
		}
	}

	$(document).on('touchend',touchend);
	function touchend(){
		$('.loading').removeClass('active');
		$('.loading').removeClass('active1');
	}

	$(window).on('hashchange',function(){
		if(This.$router.currentRoute.path!=path){
			$(document).off('scroll',scroll);
			$(document).off('touchend',touchend);
		}
	});
};



//react系列
//改变react内部state
function changeState(This,key,value){
	This.setState({
		[key]:[value],
	});
};

//react单选框
//reactRadio(this,'radioValue',ev)
function reactRadio(This,key,ev){
	var checked=ev.currentTarget.checked;
	var value=ev.currentTarget.value;

	This.setState({
		[key]:checked?value:'',
	});
};

//react复选框
//普通：reactCheck(this,'checkArr',ev)
//全选：reactCheck(this,'checkArr',ev,'allCheck','checkPrefix',this.checkLength,true)
//选项控制全选:reactCheck(this,'checkArr',ev,'allCheck','allCheckValue',this.checkLength,false)
function reactCheck(This,key,ev,allCheck,prefix,checkLength,isAllCheck){
	var checked=ev.currentTarget.checked;
	var value=ev.currentTarget.value;
	var checkArr=This.state[key];
	var allCheckValue='';

	if(isAllCheck){
		if(checked){
			for(var i=0;i<checkLength;i++){
				if(checkArr.indexOf(prefix+i)==-1)checkArr.push(prefix+i);
			}
		}else{
			checkArr=[];
		}
	}else{
		if(checked&&checkArr.indexOf(value)==-1){
			checkArr.push(value);
		}else{
			checkArr=checkArr.filter((item,index)=>item!=value);
		}
	}

	if(isAllCheck&&checked){
		allCheckValue=value;
	}else if(checkArr.length>=checkLength){
		allCheckValue=prefix;
	}
	This.setState({
		[allCheck]:allCheckValue,
		[key]:checkArr,
	});
};

//react下拉框
//单选：Type(key)=='string'
//多选：Type(key)=='array'
function reactSelect(This,key,ev){
	var value=ev.target.value;
	var options=ev.target.options;
	var optionArr=[];

	if(Type(This.state[key])=='array'){
		optionArr=Object.values(options)
		.filter((item,index)=>item.selected===true)
		.map((item1,index1)=>item1.value);
	}

	This.setState({
		[key]:Type(This.state[key])=='array'?optionArr:value,
	});
};



//不常用插件-->
//预加载插件
//arr(预加载的一组图片地址)
function preload(arr,endFn){
    var newimages=[];
    var iNum=0;

    function loadOver(){
        iNum++;
        if(iNum==arr.length){
            endFn&&endFn(newimages);
        }
    }
    for(var i=0;i<arr.length;i++){
        newimages[i]=new Image();
        newimages[i].src=arr[i];
        newimages[i].onload=function(){
            loadOver();
        }
        newimages[i].onerror=function(){
            loadOver();
        }
    }
};

//懒加载插件(图片无地址时)
//img(页面上需要懒加载图片的集合))
//dataSrc(后台调的路径)
//dis(页面滚动到距离图片多少开始加载，默认0
function lazyLoading(img,dataSrc,dis){
	var dis=dis||0;

	document.onscroll=fn;
	fn();
	function fn(){
		var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		var dH=document.documentElement.clientHeight+scrollTop;
		var lH=0;
		var index=0;

		for(var i=0;i<img.length;i++){
			lH=getPos(img[i],'top');
			if(dH>lH-dis){
				index=i;
			}
		}
		for(var i=0;i<index+1;i++){
			img[i].src=img[i].getAttribute(dataSrc);
		}
	};
};

//懒加载插件(图片有地址时)
//img(页面上需要懒加载图片的集合)
//dis(页面滚动到距离图片多少开始加载，默认0)
function lazyLoading1(img,dis){
	var dis=dis||0;

	for(var i=0;i<img.length;i++){
		img[i].setAttribute('dataSrc',img[i].src);
		img[i].src='';
	}
	document.onscroll=fn;
	fn();
	function fn(){
		var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		var dH=document.documentElement.clientHeight+scrollTop;
		var lH=0;
		var index=0;

		for(var i=0;i<img.length;i++){
			lH=getPos(img[i],'top');
			if(dH>lH-dis){
				index=i;
			}
		}
		for(var i=0;i<index+1;i++){
			img[i].src=img[i].getAttribute('dataSrc');
		}
	};
};

//ajax
function ajax1(method,url,data,success){
	var xhr=null;
	try{
		xhr=new XMLHttpRequest();
	}catch(e){
		xhr=new ActiveXObject('Microsoft.XMLHTTP');
	}
	if(method=='get'&&data)url+='?'+data;
	xhr.open(method,url,true);
	if(method=='get'){
		xhr.send();
	}else{
		xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
		xhr.send(data);
	}

	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			xhr.status==200?success&&success(xhr.responseText):console.log('出错了,Err'+xhr.status);
		}
	}
};

//利用原生ajax的瀑布流做法
//obj（存放加载列表元素的父容器）
//url（定义好echo json格式字符串的php文件）
//page（所有页的数据，问号后面到=iNum前面的一串字符）
//dis（下拉时滚动条与底部的距离数值为多少开始加载）
//endFn（没有数据时的返还函数）
function ajaxLoad(obj,url,page,dis,endFn){
	var aLi=obj.children;
	var iNum=0;
	var over=true;

	//初始化数据处理
	getList();
	function getList(){
		ajax1('get',url,page+'='+iNum,function(data){
			var data=JSON.parse(data);
			//console.log(data);

			if(!data.length ){
				//后续没有数据了
				endFn&&endFn.call(obj);
				return;
			}
			for (var i=0;i<data.length;i++){
				//获取高度最短的li
				var _index=getShort();

				//瀑布流写法
				/*var oDiv=document.createElement('div');

				oDiv.innerHTML+='<a href="'+data[i].url+'"><img src="'+data[i].image+'"/><p>'+data[i].title+'</p>';
				aLi[_index].appendChild(oDiv);*/

				//普通写法
				obj.innerHTML+='<li><a href="'+data[i].url+'"><img src="'+data[i].img+'"/><div><h3>'+data[i].title+'</h3><p>'+data[i].time+'</p></div></a></li>';
			}
			over=true;
		});
	};

	document.onscroll=function(){
		var _index=getShort();
		var oLi=aLi[_index];
		var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		var dH=document.documentElement.clientHeight+scrollTop;
		var lH=oLi.offsetHeight+getPos(oLi,'top');

		if (dH>lH-dis){
			if (over){
				over=false;
				iNum++;
				getList();
			}
		}
	};

	//获取最短li的索引值
	function getShort(){
		var index=0;
		var ih=aLi[index].offsetHeight;
		for (var i=1;i<aLi.length;i++) {
			if(aLi[i].offsetHeight<ih) {
				index=i;
				ih=aLi[i].offsetHeight;
			}
		}
		return index;
	}
};

//canvas封装-->
/*var c=document.getElementById('c');
cv.init({//初始化函数
	obj:c,
	width:500,
	height:500,
	background:'#eee'
});
cv.boxShadow({//加阴影
	boxShadow:[10,10,20,'rgba(0,0,0,0.6)']
});
cv.fillRect({//画填充矩形
	xy:[10,10],
	width:100,
	height:100,
	background:'#ff0000',
	linearGradient:{
			startXY:[0,0],
			endXY:[100,0],
			color:[[0,'#000'],[0.5,'#ff0000'],[0.8,'#fff'],[1,'green']]
	},
	radialGradient:{
			startXYR:[50,50,5],
			endXYR:[60,60,100],
			color:[[0,'#ff0000'],[1,'#fff']]
	}
});
cv.strokeRect({//画线框矩形
	xy:[120,10],
	width:100,
	height:100,
	border:[2,'#ff0000'],
	linearGradient:{
			startXY:[0,0],
			endXY:[100,0],
			color:[[0,'#000'],[0.5,'#ff0000'],[0.8,'#fff'],[1,'green']]
	},
	radialGradient:{
			startXYR:[50,50,5],
			endXYR:[60,60,100],
			color:[[0,'#ff0000'],[1,'#fff']]
	}
});
cv.lineFill({//画填充线
	xyArr:[[0,110],[0,210],[100,210],[0,110],[120,120],[120,220]],
	background:'#ff0000',
});
cv.lineStroke({//画线
	border:[3,'#ff0000'],
	xyArr:[[0,210],[0,310],[100,310],[100,350]],
});
cv.arcFill({//画填充圆形
	background:'red',
	xyr:[250,150,100],
	sAngle:0,
	eAngle:30,
	clock:false
});
cv.arcStroke({//画线框圆形
	line:true,
	border:[4,'#ff0000'],
	xyr:[250,250,100],
	sAngle:0,
	eAngle:30,
	clock:false
});
cv.arcTo({//带圆角过渡的线框
	border:[5,'#ff0000'],
	sTo:[20,20],
	mTo:[100,20],
	eTo:[150,120],
	xyx1y1r:[150,20,150,70,50],
	sAngle:0,
	eAngle:30,
});*/
var cv={
	init:function(json){
		this.c=json.obj;
		this.c.width=json.width;
		this.c.height=json.height;
		this.c.style.background=json.background;
		this.cg=this.c.getContext('2d');
	},

	boxShadow:function(json){
		this.cg.shadowOffsetX=json.boxShadow[0];
		this.cg.shadowOffsetY=json.boxShadow[1];
		this.cg.shadowBlur=json.boxShadow[2];
		this.cg.shadowColor=json.boxShadow[3];
	},

	fillRect:function(json){
		//背景色
		this.cg.fillStyle=json.background;

		//线性渐变
		if(json.linearGradient){
			var gradient=this.cg.createLinearGradient(json.linearGradient.startXY[0],json.linearGradient.startXY[1],json.linearGradient.endXY[0],json.linearGradient.endXY[1]);
			for(var i=0;i<json.linearGradient.color.length;i++){
				gradient.addColorStop(json.linearGradient.color[i][0],json.linearGradient.color[i][1]);
			}
			this.cg.fillStyle=gradient;
		}

		//环形渐变
		if(json.radialGradient){
			var gradient=this.cg.createRadialGradient(json.radialGradient.startXYR[0],json.radialGradient.startXYR[1],json.radialGradient.startXYR[2],json.radialGradient.endXYR[0],json.radialGradient.endXYR[1],json.radialGradient.endXYR[2]);
			for(var i=0;i<json.radialGradient.color.length;i++){
				gradient.addColorStop(json.radialGradient.color[i][0],json.radialGradient.color[i][1]);
			}
			this.cg.fillStyle=gradient;
		}

		//填充
		this.cg.fillRect(json.xy[0],json.xy[1],json.width,json.height);
	},

	strokeRect:function(json){
		//边框
		this.cg.lineWidth=json.border[0];
		this.cg.strokeStyle=json.border[1];

		//线性渐变
		if(json.linearGradient){
			var gradient=this.cg.createLinearGradient(json.linearGradient.startXY[0],json.linearGradient.startXY[1],json.linearGradient.endXY[0],json.linearGradient.endXY[1]);
			for(var i=0;i<json.linearGradient.color.length;i++){
				gradient.addColorStop(json.linearGradient.color[i][0],json.linearGradient.color[i][1]);
			}
			this.cg.strokeStyle=gradient;
		}

		//环形渐变
		if(json.radialGradient){
			var gradient=this.cg.createRadialGradient(json.radialGradient.startXYR[0],json.radialGradient.startXYR[1],json.radialGradient.startXYR[2],json.radialGradient.endXYR[0],json.radialGradient.endXYR[1],json.radialGradient.endXYR[2]);
			for(var i=0;i<json.radialGradient.color.length;i++){
				gradient.addColorStop(json.radialGradient.color[i][0],json.radialGradient.color[i][1]);
			}
			this.cg.strokeStyle=gradient;
		}

		//填充
		this.cg.strokeRect(json.xy[0],json.xy[1],json.width,json.height);
	},

	lineFill:function(json){
		//背景色
		this.cg.fillStyle=json.background;

		//画线
		this.cg.beginPath();
		for(var i=0;i<json.xyArr.length;i++){
			this.cg.lineTo(json.xyArr[i][0],json.xyArr[i][1]);
		}
		this.cg.closePath();
		this.cg.fill();
	},

	lineStroke:function(json){
		//边框
		this.cg.lineWidth=json.border[0];
		this.cg.strokeStyle=json.border[1];

		//画线
		this.cg.beginPath();
		for(var i=0;i<json.xyArr.length;i++){
			this.cg.lineTo(json.xyArr[i][0],json.xyArr[i][1]);
			this.cg.stroke();
		}
		this.cg.closePath();
	},

	arcFill:function(json){
		//背景色
		this.cg.fillStyle=json.background;

		this.cg.beginPath();
		this.cg.lineTo(json.xyr[0],json.xyr[1]);
		this.cg.arc(json.xyr[0],json.xyr[1],json.xyr[2],json.sAngle*Math.PI/180,json.eAngle*Math.PI/180,json.clock);
		this.cg.fill();
		this.cg.closePath();
	},

	arcStroke:function(json){
		//边框
		this.cg.lineWidth=json.border[0];
		this.cg.strokeStyle=json.border[1];

		this.cg.beginPath();
		if(json.line){
			this.cg.lineTo(json.xyr[0],json.xyr[1]);
		}
		this.cg.arc(json.xyr[0],json.xyr[1],json.xyr[2],json.sAngle*Math.PI/180,json.eAngle*Math.PI/180,json.clock);
		this.cg.stroke();
		this.cg.closePath();
	},

	arcTo:function(json){
		//边框
		this.cg.lineWidth=json.border[0];
		this.cg.strokeStyle=json.border[1];

		this.cg.beginPath();
		this.cg.lineTo(json.sTo[0],json.sTo[1]);
		this.cg.lineTo(json.mTo[0],json.mTo[1]);
		this.cg.arcTo(json.xyx1y1r[0],json.xyx1y1r[1],json.xyx1y1r[2],json.xyx1y1r[3],json.xyx1y1r[4]);
		this.cg.lineTo(json.eTo[0],json.eTo[1]);
		this.cg.stroke();
		this.cg.closePath();
	}
};

//生成3D文字球体，圆锥，圆柱，扭曲圆柱
//str（自定义文字，满42个才会生成，不然显示默认的）
//shape（定义生成球体的形状，0=球体，1=圆锥，2=圆柱，3=扭曲圆柱）
//width（生成容器的宽度，决定球体的相对宽度）
//t（动画定时器每次的时间）
//t1（自运动时间）
function setCss31(obj,attrObj){//依赖此函数设置样式
	for (var i in attrObj) {
		var newi=i;

		if(newi.indexOf("-")>0){
		var num=newi.indexOf("-");

		newi=newi.replace(newi.substr(num,2),newi.substr(num+1,1).toUpperCase());
		}

		obj.style[newi]=attrObj[i];
		newi=newi.replace(newi.charAt(0),newi.charAt(0).toUpperCase());
		obj.style["webkit"+newi]=attrObj[i];
		obj.style["moz"+newi]=attrObj[i];
		obj.style["o"+newi]=attrObj[i];
		obj.style["ms"+newi]=attrObj[i];
	}
};
function solid(str,shape,width,t,t1){
	var s = '自定义文字一定要满四十二个字 自定义文字一定要满四十二个字 自定义文字一定要满四十二个字 自定义文字一定要满四十二个字 自定义文字一定要满四十二个字 自定义文字一定要满四十二个字';
	if(str&&str.length>41)s = str;
	var oDiv = document.createElement('div');
	var oUl = document.createElement('ul');
	var aLi = oUl.getElementsByTagName('li');
	var r = width/3||100;
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

	oDiv.className='solid';
	oDiv.style.cssText='width:300px;height:300px;margin:0 auto;color:#00a0e9;position:relative;left:0;top:0;';
	oUl.style.cssText='margin:0;padding:0;width:100%;height:100%;position: relative;transform-style:preserve-3d;-webkit-transform-style:preserve-3d; perspective-origin:center center;-webkit-perspective-origin:center center;';
	oDiv.style.width=(width||300)+'px';
	oDiv.style.height=(width||300)+'px';
	oDiv.appendChild(oUl);
	document.body.appendChild(oDiv);

	var iW=oDiv.offsetWidth/2;
	var dW=document.documentElement.clientWidth*2;

	star();
	function star(){
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

		for(var i=4; i<13; i++){
			num = i*i + (i+1)*(i+1);
			if(num >= s.length){
				layer = (i-1)*2+1;
				break;
			}
			layer = (i-1)*2+1;
		}
		for(var i=0; i<layer; i++){
			if(i<(layer+1)/2){
				wordNum+=2;
			}else{
				wordNum-=2;
			}
			circleArr.push(wordNum);
		}

		num = 0;

		for(var i=0; i<circleArr.length; i++){
			theta = Math.PI/circleArr.length;
			phi = 2*Math.PI/circleArr[i];
			for(var j=0; j<circleArr[i]; j++){
				var li = document.createElement('li');

				li.style.cssText=' list-style:none;line-height:30px;text-align:center;font-size:16px;position:absolute;transition:all 0.5s;-webkit-transition:all 1s;';
				li.innerHTML = s[num];
				num++;
				drawCircle(li,theta,phi,i,j);
				oUl.appendChild(li);
			}
		}

		for(var i=0; i<aLi.length; i++){
			coneNum += 2*i+1;
			if(coneNum>aLi.length){
				coneNum -= 2*i+1;
				break;
			}
			coneArr.push(2*i+1);
		}

		for(var i=0; i<coneArr.length; i++){
			phi = 2*Math.PI/coneArr[i];
			for(var j=0; j<coneArr[i]; j++){
				drawCone(aLi[liNub],phi,i,j);
				liNub++;
			}
		}

		liNub = 0;
		columnH = Math.floor(aLi.length/(circleArr.length-2));
		columnNum = columnH*(circleArr.length-2);

		for(var i=0; i<circleArr.length-1; i++){
			phi = 2*Math.PI/columnH;
			for(var j=0; j<columnH; j++){
				drawColumn(aLi[liNub],phi,i,j);
				drawColumn2(aLi[liNub],phi,i,j);
				liNub++;
			}
		}

		for(var i=0; i<aLi.length; i++){
			setCss31(aLi[i],{transform:'translate3D('+ aLi[i].circleX +'px,'+ aLi[i].circleY +'px,'+ aLi[i].circleZ +'px) rotateY('+ aLi[i].circlePhi +'rad) rotateX('+ (aLi[i].circleTheta-Math.PI/2) +'rad)'});
		}
	}

	function drawCircle(obj,theta,phi,i,j){
		obj.circleX = r*Math.sin(theta*i)*Math.sin(phi*j) + iW;
		obj.circleY = -r*Math.cos(theta*i) + iW;
		obj.circleZ = r*Math.sin(theta*i)*Math.cos(phi*j);
		obj.circleTheta = theta*(circleArr.length-i);
		obj.circlePhi = phi*j;
		obj.bigCircleX = (r+dW)*Math.sin(theta*i)*Math.sin(phi*j) + iW;
		obj.bigCircleY = -(r+dW)*Math.cos(theta*i) + iW;
		obj.bigCircleZ = (r+dW)*Math.sin(theta*i)*Math.cos(phi*j);
		obj.maxX = obj.bigCircleX;
		obj.maxY = obj.bigCircleY;
		obj.maxZ = obj.bigCircleZ;
		obj.maxTheta = obj.circleTheta;
		obj.maxPhi = obj.circlePhi;
	}

	function drawCone(obj,phi,i,j){
		obj.coneX = (2*r/coneArr.length)*i*Math.tan(30*Math.PI/180)*Math.sin(phi*j) + iW;
		obj.coneY = (2*r/coneArr.length)*i + r/2;
		obj.coneZ = (2*r/coneArr.length)*i*Math.tan(30*Math.PI/180)*Math.cos(phi*j);
		obj.coneTheta = Math.PI/6;
		obj.conePhi = phi*j;
		obj.bigConeX = (2*(r+dW)/coneArr.length)*i*Math.tan(30*Math.PI/180)*Math.sin(phi*j) + iW;
		obj.bigConeY = (2*(r+dW)/coneArr.length)*i + r/2-dW;
		obj.bigConeZ = (2*(r+dW)/coneArr.length)*i*Math.tan(30*Math.PI/180)*Math.cos(phi*j);
	}

	function drawColumn(obj,phi,i,j){
		obj.columnX = r/1.5*Math.sin(phi*j) + iW;
		obj.columnY = (2*r/(circleArr.length-2))*i + r/2;
		obj.columnZ = (r/1.5*Math.cos(phi*j)).toFixed(2);
		obj.columnPhi = phi*j;
		obj.bigColumnX = (r+dW)/1.5*Math.sin(phi*j) + iW;
		obj.bigColumnY = (2*(r+dW)/(circleArr.length-2))*i + r/2-dW;
		obj.bigColumnZ = ((r+dW)/1.5*Math.cos(phi*j)).toFixed(2);
	}

	function drawColumn2(obj,phi,i,j){
		obj.column2X = r/1.5*Math.sin(phi*j+i*Math.PI/180*8) + iW;
		obj.column2Y = (2*r/(circleArr.length-2))*i + r/2;
		obj.column2Z = (r/1.5*Math.cos(phi*j+i*Math.PI/180*8)).toFixed(2);
		obj.column2Phi = phi*j+i*Math.PI/180*8;
		obj.bigColumn2X = (r+dW)/1.5*Math.sin(phi*j+i*Math.PI/180*8) + iW;
		obj.bigColumn2Y = (2*(r+dW)/(circleArr.length-2))*i + r/2-dW;
		obj.bigColumn2Z = ((r+dW)/1.5*Math.cos(phi*j+i*Math.PI/180*8)).toFixed(2);
	}

	function startChange(){
		for(var i=0; i<aLi.length; i++) {
			setCss31(aLi[i], {transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' + aLi[i].maxPhi + 'rad) rotateX(' + (aLi[i].maxTheta - Math.PI / 2) + 'rad)'});
			aLi[i].style.opacity = 0;
		}
	}

	function changeCircle(){
		for(var i=0; i<columnNum; i++){
			aLi[i].maxX = aLi[i].bigCircleX;
			aLi[i].maxY = aLi[i].bigCircleY;
			aLi[i].maxZ = aLi[i].bigCircleZ;
			aLi[i].maxTheta = aLi[i].circleTheta;
			aLi[i].maxPhi = aLi[i].circlePhi;
			setCss31(aLi[i], {transform: 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' + aLi[i].maxPhi + 'rad) rotateX(' + (aLi[i].maxTheta - Math.PI / 2) + 'rad)'});
		}

		setTimeout(function() {
			for (var i = 0; i < aLi.length; i++) {
				aLi[i].style.opacity = 1;
				setCss31(aLi[i], {transform: 'translate3D(' + aLi[i].circleX + 'px,' + aLi[i].circleY + 'px,' + aLi[i].circleZ + 'px) rotateY(' + aLi[i].circlePhi + 'rad) rotateX(' + (aLi[i].circleTheta - Math.PI / 2) + 'rad)'});
			}
		},t||100);
	}

	function changeCone(){
		for(var i=0; i<coneNum; i++){
			aLi[i].maxX = aLi[i].bigConeX;
			aLi[i].maxY = aLi[i].bigConeY;
			aLi[i].maxZ = aLi[i].bigConeZ;
			aLi[i].maxPhi = aLi[i].conePhi;
			aLi[i].maxTheta = aLi[i].coneTheta;
			setCss31(aLi[i],{transform:'translate3D('+ aLi[i].maxX +'px,'+ aLi[i].maxY +'px,'+ aLi[i].maxZ +'px) rotateY('+ aLi[i].maxPhi +'rad) rotateX('+ aLi[i].maxTheta +'rad)'});
		}

		setTimeout(function(){
			for(var i=0; i<coneNum; i++){
				aLi[i].style.opacity = 1;
				setCss31(aLi[i],{transform:'translate3D('+ aLi[i].coneX +'px,'+ aLi[i].coneY +'px,'+ aLi[i].coneZ +'px) rotateY('+ aLi[i].conePhi +'rad) rotateX('+ aLi[i].coneTheta +'rad)'});
			}
		},t||100)
	}

	function changeColumn(){
		for(var i=0; i<columnNum; i++){
			aLi[i].maxX = aLi[i].bigColumnX;
			aLi[i].maxY = aLi[i].bigColumnY;
			aLi[i].maxZ = aLi[i].bigColumnZ;
			aLi[i].maxTheta = 0;
			aLi[i].maxPhi = aLi[i].columnPhi;
			setCss31(aLi[i],{transform:'translate3D('+ aLi[i].maxX +'px,'+ aLi[i].maxY +'px,'+ aLi[i].maxZ +'px) rotateY('+ aLi[i].maxPhi +'rad) rotateX('+ aLi[i].maxTheta +'rad)'});
		}

		setTimeout(function(){
			for(var i=0; i<columnNum; i++){
				aLi[i].style.opacity = 1;
				setCss31(aLi[i], {transform: 'translate3D(' + aLi[i].columnX + 'px,' + aLi[i].columnY + 'px,' + aLi[i].columnZ + 'px) rotateY(' + aLi[i].columnPhi + 'rad)'});
			}
		},t||100);
	}

	function changeColumn2(){
		for(var i=0; i<columnNum; i++){
			aLi[i].maxX = aLi[i].bigColumn2X;
			aLi[i].maxY = aLi[i].bigColumn2Y;
			aLi[i].maxZ = aLi[i].bigColumn2Z;
			aLi[i].maxTheta = 0;
			aLi[i].maxPhi = aLi[i].column2Phi;
			setCss31(aLi[i],{transform:'translate3D('+ aLi[i].maxX +'px,'+ aLi[i].maxY +'px,'+ aLi[i].maxZ +'px) rotateY('+ aLi[i].maxPhi +'rad) rotateX('+ aLi[i].maxTheta +'rad)'});
		}

		setTimeout(function() {
			for (var i = 0; i < columnNum; i++) {
				aLi[i].style.opacity = 1;
				setCss31(aLi[i], {transform: 'translate3D(' + aLi[i].column2X + 'px,' + aLi[i].column2Y + 'px,' + aLi[i].column2Z + 'px) rotateY(' + aLi[i].column2Phi + 'rad)'});
			}
		},t||100)
	}

	startChange();
	switch(shape){
		case 0:changeCircle();break;
		case 1:changeCone();break;
		case 2:changeColumn();break;
		case 3:changeColumn2();break;
		default:changeCircle();
	}

	oDiv.onmousedown = function(ev){
		clearInterval(iTimer);
		var e = ev || event;
		var clickX = e.clientX;
		var clickY = e.clientY;
		var disX = 0;
		var disY = 0;

		document.onmousemove = function(ev){
			var e = ev || event;
			disX = e.clientX - clickX;
			disY = e.clientY - clickY;
			setCss31(oUl,{ transform: 'rotateX('+ (angleX-disY) +'deg) rotateY('+ (angleY+disX) +'deg)' });
		}

		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
			angleX = angleX-disY;
			angleY = angleY+disX;
			if(disY==0 && disX==0){
				disX = -iW;
			}
			iTimer = setInterval(function(){
				angleX -= disY/100;
				angleY += disX/100;
				setCss31(oUl,{ transform: 'rotateX('+ angleX +'deg) rotateY('+ angleY +'deg)' });
			},t1||60);
		}
		return false;
	};

	var angleX = 0;
	var angleY = 0;
	var iTimer = setInterval(function(){
		angleY -= 1;
		setCss31(oUl,{ transform: 'rotateX('+ angleX +'deg) rotateY('+ angleY +'deg)' });
	},t1||60);
};