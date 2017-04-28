import fetch from 'dva/fetch';
import util from './util.js';
import Lodash from 'lodash';

export default class Sync {
    /**
     * 构造函数
     */
    constructor() {
        this.fetch = fetch;
    }
    /**
     * GET请求
     * @param url 请求地址
     * @param data 参数
     * @returns {*}
     */
    get(url, data, throwError) {
        let conf = this.getConf('get', data);
        let curl_url = url + "?" + util.serialize(data);
        return this.request(curl_url, conf, throwError);
    }
    /**
     * POST请求
     * @param url 请求地址
     * @param data 参数
     * @returns {*}
     */
    post(url, data, throwError) {
        let conf = this.getConf('post', data);
        return this.request(url, conf, throwError);
    }
    /**
     * DELETE请求
     * @param url 地址
     * @param data 参数
     * @returns {*}
     */
    "delete" (url, data, throwError) {
        let conf = this.getConf('delete', data);
        return this.request(url, conf, throwError);
    }
    /**
     * PATCH请求
     * @param url 请求地址
     * @param data 参数
     * @returns {*}
     */
    patch(url, data, throwError) {
        let conf = this.getConf('patch', data);
        return this.request(url, conf, throwError);
    }
    /**
     * 文件上传
     */
    upload(url, file, query) {
        let xhr_url = url + '?' + util.serialize(query);
        let xhr = new XMLHttpRequest();
        let result, error;
        let promise = new Promise(function (resolve, reject) {
            xhr.open("POST", xhr_url);
            xhr.send(file);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    result = JSON.parse(xhr.responseText);
                    resolve(result);
                } else if (xhr.readyState == 4 && (xhr.status >= 300 || xhr.status < 200)) {
                    error = JSON.parse(xhr.responseText);
                    reject(error);
                }
            };
        });
        return promise.then((data) => {
            return {
                status: 'success',
                data
            }
        }, (err) => {
            return {
                status: 'fail',
                data: err || {
                    field: '未知',
                    code: 'SERVER_ERROR',
                    message: "上传失败!"
                }
            }
        })
    }

    /**
     * 获取reqwest配置
     * @param method 请求方式
     * @param data 参数
     * @returns {{}}
     */
    getConf(method, data) {
        let conf = {
            credentials: 'include'
        };
        switch (method) {
            case 'get':
                conf = Object.assign({}, conf, {
                    method: 'GET'
                });
                break;
            case 'post':
                conf = Object.assign({}, conf, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                break;
            case 'patch':
                conf = Object.assign({}, conf, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                break;
            case 'delete':
                conf = Object.assign({}, conf, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                break;
            default:
                conf = Object.assign({}, conf, {
                    method: 'GET'
                });
                break;
        }
        return conf;
    }

    /**
     * 失败回调
     * @param data 失败响应数据
     * @returns {{code: string, message: string}}
     */
    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
    /**
     * json
     */
    parseJSON(response) {
        try {
            return response.json();
        } catch (e) {

        }
    }
    /**
     * 发送请求
     * @param conf 配置信息
     * @returns {deferred.promise|{then}}
     */
    request(url, conf, throwError = false) {
        return this.fetch(url, conf)
            .then(this.checkStatus.bind(this))
            .then(this.parseJSON.bind(this))
            .then((data) => ({
                status: 'success',
                data
            }))
            .catch((err) => {
                if (throwError) {
                    throw err;
                } else {
                    return err.response.json().then((data) => {
                        let error = Lodash.extend({}, {
                            field: '未知',
                            code: 'SERVER_ERROR',
                            message: "服务端异常"
                        }, data);
                        return {
                            status: 'fail',
                            data: error
                        }
                    })
                }
            })
    }
}