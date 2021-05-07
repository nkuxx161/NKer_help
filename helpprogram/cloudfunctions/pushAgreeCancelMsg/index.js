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
        thing1: {
          value: event.title
        },
        character_string2: {
          value: event.orderId
        },
        phrase11: {
          value: '已取消'
        },
        thing15: {
          value: event.description
        }
      },
      templateId: 'mVQCWb63Fa1nGEDlNU4GHgVlEOmiKyH6_wlWQr4ijxY'//模板id
    })
    return result
  } catch (err) {
    return err
  }
}