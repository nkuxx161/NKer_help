// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数 要5个参数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openId, //要推送给那个用户
      page: event.url, //要跳转到那个小程序页面
      data: { //推送的内容
        character_string19: {
          value: event.orderId
        },
        thing11: {
          value: event.type
        },
        thing7: {
          value: event.title
        },
        thing5: {
          value: '在收到货品前，请勿提前转账'
        }
      },
      templateId: 'NlnbaJpPf3MWlCKcFOpr55Q2MHN91ChLUX1P9WdxM_8'//模板id
    })
    return result
  } catch (err) {
    return err
  }
}