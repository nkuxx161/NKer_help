// miniprogram/pages/createOrder/createOrder.js
const DB = wx.cloud.database()
const db = DB.collection('orderInfo')
const userdb = DB.collection('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //订单表
    // _id
    openid: '',
    sendStudentID: '',
    receiveStudentID: '',
    title: '',
    image: '',
    description: '',
    start: '八里台校区',
    end: '八里台校区',
    goodsPlace: '',
    dealPlace: '',
    type: '',
    date: '',
    contact: '',
    status: '',
    reward: '',

    show: false,

    minHour: 0,
    maxHour: 24,
    minDate: new Date().getTime(),
    // 手动设置的maxDate
    maxDate: new Date(2025, 10, 1).getTime(),
    currentDate: new Date().getTime(),

    businessType: [
      { text: '外卖', value: 0 },
      { text: '快递', value: 1 },
      { text: '代购', value: 2 },
      { text: '其他', value: 3 },
    ],
    allCampus: [
      { text: '八里台校区', value: 0},
      { text: '津南校区', value: 1},
      { text: '泰达校区', value: 2},
    ],
  },

  changeType(e){
    switch(e.detail){
      case 0:{
        this.setData({
          type: '外卖'
        })
        break;
      }
      case 1:{
        this.setData({
          type: '快递'
        })
        break;
      }
      case 2:{
        this.setData({
          type: '代购'
        })
        break;
      }
      case 3:{
        this.setData({
          type: '其他'
        })
        break;
      }
    }
  },

  changeStart(e){
    switch(e.detail){
      case 0:{
        this.setData({
          start: '八里台校区'
        })
        break;
      }
      case 1:{
        this.setData({
          start: '津南校区'
        })
        break;
      }
      case 2:{
        this.setData({
          start: '泰达校区'
        })
        break;
      }
    }
  },
  changeEnd(e){
    switch(e.detail){
      case 0:{
        this.setData({
          end: '八里台校区'
        })
        break;
      }
      case 1:{
        this.setData({
          end: '津南校区'
        })
        break;
      }
      case 2:{
        this.setData({
          end: '泰达校区'
        })
        break;
      }
    }
  },

  // onDisplay() {
  //   this.setData({ show: true });
  // },
  // onClose() {
  //   this.setData({ show: false });
  // },
  formatDate(date) {
    date = new Date(date);
    console.log(date)
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  // onConfirm(event) {
  //   console.log(event.detail)
  //   this.setData({
  //     show: false,
  //     date: this.formatDate(event.detail),
  //   });
  // },

  onInputDate(event) {
    this.setData({
      currentDate: event.detail,
      date: this.formatDate(event.detail),
    });
  },

  submit(e){
    console.log(this.data)
    db.add({
      data:{
        sendStudentID: this.data.sendStudentID,
        receiveStudentID: this.data.receiveStudentID,
        title: this.data.title,
        image: this.data.image,
        description: this.data.description,
        start: this.data.start,
        end: this.data.end,
        goodsPlace: this.data.goodsPlace,
        dealPlace: this.data.dealPlace,
        type: this.data.type,
        date: this.data.date,
        contact: this.data.contact,
        status: 0,
        reward: this.data.reward,
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户openid
    wx.cloud.callFunction({
      name: 'getOpenID',
    })
    .then(res=>{
      // console.log(res.result.event.userInfo.openId)
      this.setData({
        openid: res.result.event._openid
      })
    })
    .catch(err=>{
      console.log(err)
    })
    // 获取用户学号
    userdb.where({'_openid':this.data.openid}).get()
    .then(res=>{
      // console.log(res.data[0].studentID)
      this.setData({
        sendStudentID: res.data[0].studentID
      })
    }).catch(err=>{
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