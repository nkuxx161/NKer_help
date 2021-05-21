// miniprogram/pages/showUserInfo/showUserInfo.js
const DB = wx.cloud.database()
const db = DB.collection('orderInfo')
const userdb = DB.collection('userInfo')
const _ = wx.cloud.database().command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentID:'',
    img: '',
    userID: '',
    user: [],
    rRate: '',
    sRate: '',
  },

  onClickSend(e) {
    wx.navigateTo({
      url: '../showRtoS/showRtoS?studentID=' + this.data.studentID,
    })
  },

  onClickReceive(e) {
    wx.navigateTo({
      url: '../showStoR/showStoR?studentID=' + this.data.studentID,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userID: options.userID,
      img: 'cloud://xiongxiao-9g0m49qp0514cda7.7869-xiongxiao-9g0m49qp0514cda7-1305534329/images/defaultImg.png',
    })
    console.log(this.data.userID)

    userdb.where({
      _openid: this.data.userID
    }).get()
    .then(res => {
      this.setData({
        user: res.data[0]
      })
      if(this.data.user.receiveCount == 0){
        this.setData({
          rRate: 0
        })
      } else {
        this.setData({
          rRate: (this.data.user.receiveScore/this.data.user.receiveCount)
        })
      }
      if(this.data.user.sendCount == 0){
        this.setData({
          sRate: 0
        })
      } else {
        this.setData({
          sRate: (this.data.user.sendScore/this.data.user.sendCount)
        })
      }
      this.setData({
        studentID: this.data.user.studentID
      })
    })
    .catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})