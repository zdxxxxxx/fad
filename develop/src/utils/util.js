export default class Util {
    constructor() {

    }
    serialize(obj) {
        let params = '';
        for (let key in obj) {
            let value;
            if (Object.prototype.toString.call(obj[key]) == '[object Object]') {
                value = JSON.stringify(obj[key]);
            } else {
                value = obj[key];
            }
            params += key + '=' + value + '&';
        }
        params = params.substring(0, params.length - 1);
        return params;
    }
    isEmptyObjectobj(obj) {
        for (let key in obj) {
            return false
        }
        return true;
    }
    isContain(large, small) {
        let flag = false;
        if (!large instanceof Array || !small instanceof Array) {
            var err = new Error('not Array');
            throw err;
        }
        for (let i = 0; i < small.length; i++) {
            if (large.indexOf(small[i]) > -1) {
                flag = true;
            }
        }
        return flag;
    }
}