const cloud = require('wx-server-sdk')
// var request = require('request')
var request = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    
    return new Promise((resolve, reject) => {
        request({
            url: 'http://wx.nankai.edu.cn/home/unbind',
            method: "POST",
            json: true,
            form: {
                "urpid": event.userid,
                "urppwd": event.password
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest'
            },
        }, function (error, response, body) {
            console.log("响应"+body)
            resolve(body)
            if (!error && response.statusCode == 200) {
                try {
    
                } catch (e) {
                    reject()
                }
            }
        })
    })
}