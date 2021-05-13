// pages/nk/nk.js
const DB = wx.cloud.database()
const db = DB.collection('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus:false,
    passwordType:'password',
    src: 'https://webvpn.nankai.edu.cn/',
    userid: '',
    password: '',
    userName: '',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  getUserId(event) {
    // console.log('userid:', event.detail.value)
    this.setData({
      userid: event.detail.value
    })
  },

  getPassword(event) {
    // console.log('password:', event.detail.value)
    this.setData({
      password: event.detail.value
    })
  },

  getUserName(event) {
    // console.log('userName:', event.detail.value)
    this.setData({
      userName: event.detail.value
    })
  },

  submit() {
    wx.cloud.callFunction({
      name: 'identityAuthentication',
      data: {
        userid: this.data.userid,
        password: this.data.password
      },
      success: (res) => {
        console.log(res)
        if (res.result.message === "Success") {
          wx.showToast({
            title: '身份验证成功',
            icon: 'success'
          })
          db.add({
            data: {
              college: "未设置",
              defaultCampus: "未设置",
              email: "未设置",
              phoneNumber: "未设置",
              receiveCount: 0,
              receiveScore: 0,
              sendCount: 0,
              sendScore: 0,
              studentID: this.data.userid,
              studentName: "请输入一个名字",
              userIcon: "0"
            }
          })
          wx.navigateBack({
            delta: 1,
          })
          wx.redirectTo({
            url: '../userInfo/userInfo',
          })({
            delta: 1,
          })
        } else {
          wx.showToast({
            title: '账号或密码错误',
            icon: 'fail'
          })
        }

      },
      complete: res => {},
    })
  },
  showpassword:function(){
    if(this.data.passwordType=='password')
    this.setData({
      passwordType:'text',
      focus:true
    })
    else
    this.setData({
      passwordType:'password',
      focus:true
    })
  }
})