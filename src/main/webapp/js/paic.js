window.paic = Function;
var paic = {
    isDebug: false,
    __loadedUrls: [],
    baseUrl: function () {
        if (document && document.getElementsByTagName) {
            var scripts = document.getElementsByTagName("script");
            var rePkg = /paic\.js(\W|$)/i;
            for (var i = 0; i < scripts.length; i++) {
                var src = scripts[i].getAttribute("src");
                if (!src) {
                    continue
                }
                var m = src.match(rePkg);
                if (m) {
                    return src.substring(0, m.index);
                }
            }
        }
    }(),
    browser: function () {
        var u = navigator.userAgent,
            app = navigator.appVersion,
            name = navigator.appName;
        return {
            userAgent: u,
            appVersion: app,
            language: (navigator.browserLanguage || navigator.language).toLowerCase(),
            trident: /(Trident)/i.test(u), //IE内核
            presto: /(Presto)/i.test(u), //opera内核
            webKit: /(AppleWebKit)/i.test(u), //苹果、谷歌内核
            gecko: /(Gecko)/i.test(u) && !/(KHTML)/i.test(u), //火狐内核
            mobile: /(iPhone|iPad|iPod|iOS|Android)/i.test(u), //是否为移动终端
            ios: /(iPhone|iPad|iPod|iOS|)/i.test(u), //ios终端
            android: /(Android|Linux)/i.test(u), //android终端或uc浏览器
            iPhone: /(iPhone)/i.test(u), //是否为iPhone或者QQHD浏览器
            iPad: /(iPad)/i.test(u), //是否iPad
            webApp: /(Safari)/i.test(u), //是否web应该程序，没有头部与底部
            ieVersion: function () {
                if (name == "Microsoft Internet Explorer" && app.match(/11./i) == "11.") {
                    return 11;
                } else if (name == "Microsoft Internet Explorer" && app.match(/10./i) == "10.") {
                    return 10;
                } else if (name == "Microsoft Internet Explorer" && app.match(/9./i) == "9.") {
                    return 9;
                } else if (name == "Microsoft Internet Explorer" && app.match(/8./i) == "8.") {
                    return 8;
                } else if (name == "Microsoft Internet Explorer" && app.match(/7./i) == "7.") {
                    return 7;
                } else if (name == "Microsoft Internet Explorer" && app.match(/6./i) == "6.") {
                    return 6;
                } else if (name == "Microsoft Internet Explorer" && app.match(/5./i) == "5.") {
                    return 5;
                } else {
                    return name;
                }
            }()
        }
    }(),
    HttpRequest: function () {
        var xmlHttpRequest;
        if (window.XMLHttpRequest) {
            xmlHttpRequest = new XMLHttpRequest();
            if (xmlHttpRequest.overrideMimeType) {
                xmlHttpRequest.overrideMimeType("text/xml");
            }
        } else if (paic.browser.ieVersion < 9) {
            var activexName = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
            for (var i = 0; i < activexName.length; i++) {
                try {
                    xmlHttpRequest = new ActiveXObject(activexName[i]);
                    if (xmlHttpRequest) {
                        break;
                    }
                } catch (e) {
                }
            }
        }
        return xmlHttpRequest;
    }(),
}
paic.$ = function () {
    var elements = new Array();
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (typeof element == 'string') {
            element = document.getElementById(element)
        } else {
            elements.push(element)
        }
        if (arguments.length == 1) {
            return element
        }
        elements.push(element)
    }
    return elements
}
paic.eval = function (code) {
    if (paic.browser.ieVersion <= 10) {
        execScript(code);
    } else {
        window.eval(code);
    }
};
paic.post = function (param) {
    param = param ? param : {};
    param.url = param.url || "";
    param.data = param.data || {};
    param.async = param.async != "undefined" ? param.async : true;
    param.cache = param.cache != "undefined" ? param.cache : false;
    if (!(param.success && typeof param.success == "function"))  param.success = function (data, textStatus) {
        if (paic.isDebug) {
            console.log("POST[success]: url[" + param.url + "],data[" + JSON.stringify(data) + "]");
        }
        return;
    };
    if (!(param.error && typeof param.error == "function"))  param.error = function (textstatus, e) {
        if (swal) swal("系统错误", "请联系管理员!", "error");
        if (paic.isDebug) {
            throw new Error("POST[error]: url[" + param.url + "],data[" + JSON.stringify(param.data) + "]");
        }
        paic.logoutPrompt();
    };
    if (!(param.complete && typeof param.complete == "function"))  param.complete = function (XMLHttpRequest, status) {
        if (status == "timeout") {
            method.abort();
            if (swal) swal("连接超时", "请稍候再试..", "error");
            if (paic.isDebug) {
                throw new Error("POST[complete]: url[" + param.url + "],data[" + JSON.stringify(param.data) + "]");
            }
            paic.logoutPrompt();
        }
    };
    if (paic.isDebug) {
        console.log("POST: url[" + param.url + "],data[" + JSON.stringify(param.data) + "]");
    }
    paic.require("util/uuidTools.js");
    param.data.reqId = paic.util.uuidTools.crate();
    var method = $.ajax({
        type: "post",
        url: param.url,
        timeout: 200000,//5000 200000 调试
        data: JSON.stringify(param.data),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        async: param.async,
        error: function (textstatus, e) {
            param.error(textstatus, e);
        },
        complete: function (XMLHttpRequest, status) {
            param.complete(XMLHttpRequest, status);
        },
        success: function (data, textStatus) {
            param.success(data, textStatus);
        }
    });
};
paic.get = function (url, callback, async) {
    async = async != 'undefined' ? async : true;
    var req = paic.HttpRequest;
    if (req) {
        req.open("GET", url, async);
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    callback(req.responseText);
                } else {
                    if (paic.isDebug) {
                        throw new Error("GET ERROR [" + url + "]")
                    }
                }
            }
        }
        req.send(null);
    }
};
paic.registerNamespace = function (namespacePath) {
    var rootObject = window;
    var namespaceParts = namespacePath.split('.');
    for (var i = 0; i < namespaceParts.length; i++) {
        var currentPart = namespaceParts[i];
        var ns = rootObject[currentPart];
        if (!ns) {
            rootObject[currentPart] = new Object();
            ns = rootObject[currentPart]
            if (paic.isDebug) {
                console.log("registerNamespace[" + namespacePath + "]");
            }
        }
        rootObject = ns
    }
};
paic.unNamespace = function (namespacePath) {
    if (typeof namespacePath == 'object') {
        namespacePath = null;
        if (paic.isDebug) {
            console.log("unNamespace[" + namespacePath + "]");
        }
        return;
    } else if (typeof namespacePath == 'string') {
        var rootObject = window;
        var namespaceParts = namespacePath.split('.');
        for (var i = 0; i < namespaceParts.length; i++) {
            var currentPart = namespaceParts[i];
            if (i == namespaceParts.length - 1) {
                rootObject[currentPart] = null;
                if (paic.isDebug) {
                    console.log("unNamespace[" + namespacePath + "]");
                }
            }
        }
    }
};
paic.getloadUri = function (moduleName, resourceType) {
    var uri = "";
    var path = paic.baseUrl;
    var relpath = moduleName;
    if (relpath.charAt(0) == '.') {
        relpath = relpath.substr(1);
        path += "..";
    }
    var ext = "";
    if (!relpath.match(/\.js/) && !relpath.match(/\.css/)) {
        ext = resourceType == 1 ? ".css" : ".js";
    }
    uri = path + relpath + ext;
    return uri;
};
paic.addLoadedUri = function (uri) {
    var len = paic.__loadedUrls.length;
    for (var i = 0; i < len; i++) {
        if (paic.__loadedUrls[i] == uri) {
            return
        }
    }
    paic.__loadedUrls.push(uri)
};
paic.require = function (moduleName, callback, isUrl) {
    if (typeof moduleName == "object") {
        for (var i = 0; i < moduleName.length; i++) {
            paic.require(moduleName[i], callback, isUrl)
        }
        return
    }
    if (moduleName == "") {
        return
    }
    if (moduleName.indexOf(".css") != -1) {
        return paic.importCss(moduleName, isUrl);
    }
    var uri = isUrl ? moduleName : paic.getloadUri(moduleName);
    for (var i = 0; i < paic.__loadedUrls.length; i++) {
        if (paic.__loadedUrls[i] == uri) {
            if (typeof callback == "function") {
                callback();
            } else {
                return
            }
        }
    }
    if (paic.isDebug) {
        console.log("require[" + uri + "] start");
    }
    var async = false;
    if (typeof callback == "function") {
        async = true;
    }
    paic.get(uri, function (str) {
        if (str == null || str == "" || str.charAt(0) == "<") {
            return
        }
        try {
            if (paic.isDebug) {
                console.log("require[" + uri + "] end");
            }
            paic.eval(str);
            if (typeof callback == "function") callback();
        } catch (e) {
            if (paic.isDebug) {
                console.log("require ERROR[" + uri + "]", e);
            }
        }
    }, async);
    paic.addLoadedUri(uri);
};
paic.importCss = function (moduleName, isUrl) {
    if (typeof moduleName == "object") {
        for (var i = 0; i < moduleName.length; i++) {
            paic.importCss(moduleName[i])
        }
        return
    }
    if (moduleName == "") {
        return
    }
    var uri = isUrl ? moduleName : paic.getloadUri(moduleName, 1);
    for (var i = 0; i < paic.__loadedUrls.length; i++) {
        if (paic.__loadedUrls[i] == uri) {
            return
        }
    }
    var head = document.getElementsByTagName('head').item(0);
    var css = document.createElement('link');
    css.href = uri;
    css.rel = 'stylesheet';
    css.type = 'text/css';
    head.appendChild(css);
    paic.addLoadedUri(uri);
    if (paic.isDebug) {
        console.log("importCss[" + uri + "]");
    }
};
paic.logoutPrompt = function() {
    swal({
        title: "页面已失效，请重新登录!",
        text: "系统即将跳转至登录页面。",
        type: "info",
        timer: 500,
        showConfirmButton: false
    },function () {
        setTimeout("window.top.location.href = window.top.location.href.substring(0, window.top.location.href.lastIndexOf('/')) + '/login.html'",2000);
    });
};
if (paic.browser.ieVersion < 9) {
    paic.require("jquery.min.js");
} else {
    paic.require("jquery.min.js");
}
