/**
 * Created by zyq on 15-5-18.
 */

//================jquery extensions================

var $flag;
$flag = true;
var xmlPath = '/Content/tips/tips.html';
$.ajaxSetup({ cache: false });
//token
$.ajaxSetup({
    beforeSend: function (xhr) {
        xhr.setRequestHeader('Delivery-Token', $('meta[name="delivery-token"]').attr('content'));
    }
});
$.extend({
    //清空表单
    domClaer: function (selector) {
        selector = selector || [];
        for (var key = 0; key < selector.length; key++) {
            $(selector[key]).val('').html('');
        }
    },
    setPlace: function (selector) {
        selector = selector || [];
        var keyVal = [];
        for (var key = 0; key < selector.length; key++) {
            var val = $(selector[key]).val();
            keyVal.push({ key: selector[key], val: val });
            $(selector[key]).focus(function () {
                var currentVal;
                for (var i = 0; i < keyVal.length; i++) {
                    var k = '#' + $(this).attr('id');
                    if (k == keyVal[i].key) {
                        currentVal = keyVal[i].val;
                    }
                }
                if ($(this).val() == currentVal || $(this).val().length == 0) {
                    $(this).val('');
                }
            });
            $(selector[key]).blur(function () {
                var currentVal;
                for (var i = 0; i < keyVal.length; i++) {
                    var k = '#' + $(this).attr('id');
                    if (k == keyVal[i].key) {
                        currentVal = keyVal[i].val;
                    }
                }
                if ($(this).val() == currentVal || $(this).val().length == 0) {
                    $(this).val(currentVal);
                }
            });
        }
    },
    bindEnter: function (id) {
        document.onkeydown = function (event) {
            e = event ? event : (window.event ? window.event : null);
            if (e.keyCode == 13) {
                $(id).click();
            }
        }
    },
    toRed: function (content, keyword) {
        if (content == null || content == '' || keyword == null || keyword == '')
            return content;
        return content.replace(keyword, '<span style="color:red">' + keyword + '</span>');
    },
    toDate: function (str, format) {
        //example: $.toDate("yyyy-MM-dd HH:mm")
        if (str == null || str == "" || /Date\(\D\d+\)/.test(str)) {
            return str;
        } else if (str.charAt(0) != '/') {
            return new Date(str).format(format);
        } else {
            return new Date((str.replace(/^\/Date\((\d+).*\/$/i, "$1")) - 0).format(format);
        }
    },
    cookieSetting: {
        setCookie: function (objName, objValue, objHours) {
            var str = objName + "=" + escape(objValue);
            if (objHours > 0) {//else不设定过期时间，浏览器关闭时cookie自动消失
                var date = new Date();
                var ms = objHours * 3600 * 1000;
                date.setTime(date.getTime() + ms);
                str += "; expires=" + date.toGMTString();
            }
            document.cookie = str;
        },
        delCookie: function (name) {
            document.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
        },
        getCookie: function (objName) {
            var arrStr = document.cookie.split("; ");
            for (var i = 0; i < arrStr.length; i++) {
                var temp = arrStr[i].split("=");
                if (temp[0] == objName) return unescape(temp[1]);
            }
            return null;
        }
    },
    getData: function (url, data, type) {
        type = type || 'post';
        var returnVal;
        $.ajax({
            url: url,
            type: type,
            data: data,
            async: false,
            success: function (jData) {
                returnVal = jData;
            },
            error: function (e) {
                alert(e);
            }
        });
        return returnVal;
    },
    http: function (url, data, callBack, selector) {
        if (!$flag) {
            return false;
        } else {
            $.ajax({
                url: url,
                type: 'post',
                data: data,
                beforeSend: function () {
                    $flag = false;
                    if (!selector)
                        selector = 'body';
                    message.tip(selector);
                },
                success: callBack,
                error: callBack,
                complete: function () { 
                    $flag = true;
                    message.removeTip();
                }
            });
        }
    },
    /*jquery1.5+*/
    tips: function (key) {
        var xmlDoc = $.parseXML($.getData(xmlPath, '', 'get'));
        var $xml;
        $xml = $(xmlDoc);
        return $xml.find(key).text();
    }
});

$.fn.extend({
    tip: function (msg, img) {
        if (msg == '' || msg == undefined) {
            msg = '正在加载，请稍后...';
        }
        if (img == '' || img == undefined) {
            var tips = '<div><img src="http://gagahi.com/Content/blue/images/load.gif" />' + msg + '</div>'
        } else {
            var tips = '<div><img src="img" />' + msg + '</div>'
        }
        $(this).append(tips);
    },
    removeTip: function () {

    },
    trim: function () {
        return $.trim($(this).val());
    }
});

var message;
message = {
    tips: '',
    tip: function (selector, msg, img) {
        if (!selector) {
        } else {
            if (msg == '' || msg == undefined) {
                msg = '正在加载，请稍后...';
            }
            if (img == '' || img == undefined) {
                this.tips = '<div id="lazy_load" style="position: absolute; top: 50%; left: 50%; border: #e3e3e3 solid 1px; background-color: #f6f7fb; padding: 4px; text-align: center; line-height: 175%; margin: 4px; font-size: 14px; color: #333; display: block;"><strong style="height: 32px; line-height: 32px; width: auto; height: 28px; line-height: 28px; display: block; margin: 0 auto; font-size: 14px; overflow: hidden; font-weight: bold;"><var style="width: 18px; height: 20px; font-style: normal; background-image: url(/Content/images/load.gif); background-repeat: no-repeat; vertical-align: middle; display: inline-block; background-position: left top;"></var>' + msg + '</strong></div>';
            } else {
                this.tips = '<div><img id="lazy_load" src="img" />' + msg + '</div>'
            }
            $(selector).append(this.tips);
        }
    },
    removeTip: function () {
        if (0 < this.tips.length) {
            $(this.tips).remove();
            $('#lazy_load').remove();
        }
    }
};



/*Date*/
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "u65e5",
        "1": "u4e00",
        "2": "u4e8c",
        "3": "u4e09",
        "4": "u56db",
        "5": "u4e94",
        "6": "u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "u661fu671f" : "u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};