

//数字泛化
export const normalize = (val, max, min) => {
        if (max - min === 0)
                return 1;
        return (val - min) / (max - min);
};

export const arrayChunk = (arr, size) => {
        let newArr = [];
        for (let i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
        }

        return newArr;
}


// eslint-disable-next-line no-extend-native
Date.prototype.format = function (fmt) {
        var o = {
                "M+": this.getMonth() + 1,                 //月份
                "d+": this.getDate(),                    //日
                "h+": this.getHours(),                   //小时
                "m+": this.getMinutes(),                 //分
                "s+": this.getSeconds(),                 //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
        }
        return fmt;
};

export const generateGUID = (len = 12, _radix = 16) => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        const uuid = [];
        let radix = _radix || chars.length;

        if (len) {
                // Compact form
                for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
                // rfc4122, version 4 form
                let r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (let i = 0; i < 36; i++) {
                        if (!uuid[i]) {
                                r = 0 | Math.random() * 16;
                                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                        }
                }
        }

        return uuid.join('');

};

export const getUrlkey = (url) => {
        let params = {}, arr = url.split("?");
        if (arr.length <= 1) return url;
        arr = arr[1].split("&");
        for (let i = 0, l = arr.length; i < l; i++) {
                let a = arr[i].split("=");
                params[a[0]] = a[1];
        }
        return params;
};

export const encodeUri = (data) => {
        var arr = [];
        for (var item in data) {
                arr.push(item + "=" + data[item]);
        }
        return arr.join("&");
};

export const stringDivider = (str, width, spaceReplacer) => {
        if (str.length > width) {
                let p = width;
                while (p > 0 && (str[p] !== ' ' && str[p] !== '-')) {
                        p--;
                }
                if (p > 0) {
                        let left;
                        if (str.substring(p, p + 1) === '-') {
                                left = str.substring(0, p + 1);
                        } else {
                                left = str.substring(0, p);
                        }
                        let right = str.substring(p + 1);
                        return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
                }
        }
        return str;
};

export const setReqDateParam = (days) => {
        let endDateValue =new Date();
        let startDateValue =new Date(endDateValue.getTime() - days *24 *60 *60 *1000);
        return {
                start: new Date(startDateValue).format('yyyy-MM-dd hh:mm:ss'),
                end: new Date(endDateValue).format('yyyy-MM-dd hh:mm:ss')
        }
};

export const replaceSpecialChar = (str) => {
        const specialCharArr = ['\\+', '/', '\\?', '%', '#', '&', '=', ' '];
        specialCharArr.forEach(item =>{
                let obj = {
                        '+': '%2B',
                        '/': '%2F',
                        '?': '%3F',
                        '%': '%25',
                        '#': '%23',
                        '&': '%26',
                        '=': '%3D',
                        ' ': '%20'
                };
                const reg = new RegExp(item, 'i');
                str = str.toString().replace(new RegExp(reg, 'g'), obj[item]);
        });
        return str
};

