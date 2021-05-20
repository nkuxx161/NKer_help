// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数 要6个参数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openId, //要推送给那个用户
      page: event.url, //要跳转到那个小程序页面
      data: { //推送的内容
        character_string1: {
          value: event.orderId
        },
        thing2: {
          value: event.title
        },
        thing3: {
          value: event.goodsPlace
        },
        thing4: {
          value: event.dealPlace
        }
      },
      templateId: 'TAJUXfIcw4LyLGaJuPiI0FLJu4jg-iNguvvFdoEjpbI'//模板id
    })
    return result
  } catch (err) {
    return err
  }
}