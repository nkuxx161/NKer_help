// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.type == 'sender') { //更新完成但未评价的发单数
    return cloud.database().collection('userInfo')
      .doc(event.userId)
      .update({
        data: {
          sendCountUnreviewed: event.sendCountUnreviewed,
        }
      })
  } else { //更新完成但未评价的接单数
    return cloud.database().collection('userInfo')
      .doc(event.userId)
      .update({
        data: {
          receiveCountUnreviewed: event.receiveCountUnreviewed,
        }
      })
  }

}