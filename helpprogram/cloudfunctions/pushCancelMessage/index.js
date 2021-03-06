// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openId, //要推送给那个用户
      page: event.url, //要跳转到那个小程序页面
      data: { //推送的内容
        thing2: {
          value: event.title
        },
        character_string6: {
          value: event.orderId
        },
        thing4: {
          value: event.reason
        },
        thing1: {
          value: event.type
        }
      },
      templateId: 'XgpA413z8X4ki83NugtAKcIYXWSUJaYyKvpxhABWoTE'//模板id
    })
    return result
  } catch (err) {
    return err
  }
}