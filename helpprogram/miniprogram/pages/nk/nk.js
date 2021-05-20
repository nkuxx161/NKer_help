// pages/nk/nk.js
const DB = wx.cloud.database()
const db = DB.collection('userInfo')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
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
    Toast.loading({
      duration: 1,
      message: '认证中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    wx.cloud.callFunction({
      name: 'identityAuthentication',
      data: {
        userid: this.data.userid,
        password: this.data.password
      },
      success: (res) => {
        console.log(res)
        if (res.result.message === "Success") {
            db.where({
              _id:this.data.userid
            }).get()
            .then(res=>{
              
              if(res.data.length != 0){
                Toast.clear()
                Toast.success("认证成功")
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
                    userIcon: "0",
                    sendCountUnreviewed: 0,
                    receiveCountUnreviewed: 0
                  }
                })
                wx.navigateBack({
                  delta: 1,
                })
                wx.redirectTo({
                  url: '../userInfo/userInfo',
                })
              }
              else{
                Toast.clear()
                Toast.fail("该学号已经注册，请联系客服进行处理！(点击认证界面下面的@Nker Helper)")
              }
            })
          .catch(err => {
            console.log(err)
          })
        } else {
          Toast.clear()
          Toast.fail("账号或者密码错误")
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