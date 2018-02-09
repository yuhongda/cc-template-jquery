// 用法
// 1、引入JS
// 测试
// <script src="//assets.vc.jd.com/resources/analytics.js"></script>
// 生产
// <script src="/sub_assets/resources/analytics.js"></script>

// <script type="text/javascript">
// 2、页面初始化调用
// var parameter = {
// app : "vc",
// version : "1.0",
// loginUser : "vc_user1",
// funcPath : "vc.index.btn.click"
// }
// $al(parameter, true).initGather();
//	
// 3、ajax请求，或按钮点击调用 ，以下方法需先执行页面初始化调用。
// function ajaxUse() {
// var parameter = {
// app : "vc",
// version : "1.0",
// loginUser : "vc_user1",
// funcPath : "vc.index.btn.click1"
// }
// $al(parameter, false).initGather();
// }
// </script>

var $al = function(parameter, initneed) {
	var baseObj = $al.prototype.init();
	if (parameter) {
		baseObj.app = parameter.app;
		baseObj.version = parameter.version;
		baseObj.loginUser = parameter.loginUser;
		baseObj.funcPath = parameter.funcPath;
	}

	if (!baseObj.isNull(initneed)) {
		if (initneed) {
			baseObj.initHtml();
		}
		baseObj.isFinished = true;
	}

	return baseObj;
}
$al.prototype = {
	isNull : function(val) {
		if (val == "" || val == "undefined" || val == undefined || val == null
				|| val == "null") {
			return true;
		}
		return false;
	},
	isFinished : false,
	initHtml : function() {
		var bodyObj = document.getElementsByTagName("body")[0];

		var frameObj;

		var isIE7 = (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion
				.match(/7./i) == "7.");

		if (isIE7) {
			frameObj = document
					.createElement("<iframe name=\"myframe\" id=\"myframe\"></iframe>");
		} else {
			frameObj = document.createElement("iframe");
			frameObj.name = "myframe";
			frameObj.id = "myframe";
		}

		if (frameObj) {
			frameObj.src = "";
			frameObj.style.display = "none";
			frameObj.width = "0";
			frameObj.height = "0";
			bodyObj.appendChild(frameObj);

			var formObj = document.createElement("form");
			formObj.method = "post";
			formObj.action = "https://analytics.jd.com/logs/";
			formObj.id = "myform";
			formObj.name = "myform";
			formObj.target = "myframe";

			function initInputObj(name) {
				var inputObj = document.createElement("input");
				inputObj.type = "hidden";
				inputObj.name = name;
				inputObj.id = name;
				inputObj.value = "";

				return inputObj;
			}

			var inputData = ["login_user", "login_ip", "url", "click_time",
					"app", "func_path", "server_ip", "version", "ua"];

			for (var i = 0; i < inputData.length; i++) {
				formObj.appendChild(initInputObj(inputData[i]));
			}

			bodyObj.appendChild(formObj);
		} else {
			this.isFinished = false;
		}

	},
	init : function() {
		return this;
	},
	clickTime : function() {
		var dd = new Date();
		var y = dd.getFullYear();
		var m = dd.getMonth() + 1;// 获取当前月份的日期
		var d = dd.getDate();
		if (m < 10) {
			m = "0" + m;
		}
		if (d < 10) {
			d = "0" + d;
		}
		var h = dd.getHours();
		if (h < 10) {
			h = "0" + h;
		}
		var mi = dd.getMinutes();
		if (mi < 10) {
			mi = "0" + mi;
		}
		var s = dd.getSeconds();
		if (s < 10) {
			s = "0" + s;
		}
		return y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s;
	},
	// 开始搜集
	initGather : function() {
		if (this.isFinished) {
			document.getElementById("login_user").value = escape(this.loginUser).replace(/\%/g,"^");
			document.getElementById("url").value = this.url;
			document.getElementById("click_time").value = this.clickTime();
			document.getElementById("func_path").value = this.funcPath;
			document.getElementById("app").value = this.app;
			document.getElementById("version").value = this.version;
			document.getElementById("ua").value = this.ua;
			document.getElementById("myform").submit();
		}
	},
	loginUser : "",// 登陆名
	loginIp : "",//
	url : window.location.href,// 当前URL地址
	app : "",// 搜集应用
	funcPath : "",
	serverIp : "",
	version : "",// 版本
	ua : window.navigator.userAgent
	// 客户端信息
}
$al.prototype.init.prototype = $al.prototype;