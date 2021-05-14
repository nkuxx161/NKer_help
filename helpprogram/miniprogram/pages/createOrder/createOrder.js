import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

const DB = wx.cloud.database()
const db = DB.collection('orderInfo')
const userdb = DB.collection('userInfo')
let file = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //订单表
    currentOrder: '',
    openid: '',
    sendStudentID: '',
    receiveStudentID: '',
    title: '',
    fileList: [],
    image: "",
    description: '',
    start: '八里台校区',
    end: '八里台校区',
    goodsPlace: '',
    dealPlace: '',
    address: '',
    allAddressJson: [],
    currentAddress: [],
    type: '外卖',
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

    showTitle: false,
    showDate: false,
    showCampus: false,
    showAddress: false,
    showReward: false,
    showDescription: false,
    img:'cloud://xiongxiao-9g0m49qp0514cda7.7869-xiongxiao-9g0m49qp0514cda7-1305534329/images/defaultImg.png',

    businessType: [{
        text: '外卖',
        value: 0
      },
      {
        text: '快递',
        value: 1
      },
      {
        text: '代购',
        value: 2
      },
      {
        text: '其他',
        value: 3
      },
    ],
    allCampus: [{
        text: '八里台校区',
        value: 0
      },
      {
        text: '津南校区',
        value: 1
      },
      {
        text: '泰达校区',
        value: 2
      },
    ],
  },

  initOrder() {
    this.setData({
      sendStudentID: this.data.currentOrder.sendStudentID,
      title: this.data.currentOrder.title,
      fileList: [].concat(JSON.parse('{"url":' + "\"" + this.data.currentOrder.image + "\"}")),
      description: this.data.currentOrder.description,
      start: this.data.currentOrder.start,
      end: this.data.currentOrder.end,
      goodsPlace: this.data.currentOrder.goodsPlace,
      dealPlace: this.data.currentOrder.dealPlace,
      type: this.data.currentOrder.type,
      date: this.data.currentOrder.date,
      contact: this.data.currentOrder.contact,
      status: 0,
      reward: this.data.currentOrder.reward,
      isStoRReviewed: false,
      isRtoSReviewed: false,
      cancelPerson: ''
    })
    console.log('init', this.data.fileList)
  },

  getMyAllAddress() {
    wx.cloud.database().collection('addressSet').where({
      _openid: this.data.openid
    }).get().then(res => {
      console.log(res)
      this.setData({
        allAddressJson: res.data
      })
      for (var i = 0; i < this.data.allAddressJson.length; i++) {
        let a = this.data.allAddressJson[i]
        if(a.ifdefault == true){
          this.setData({
            currentAddress: [a]
          })
        }
        
      }
      console.log('current',this.data.currentAddress)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (JSON.stringify(options) != "{}") {
      this.setData({
        currentOrder: JSON.parse(options.order)
      })
      this.initOrder()
    }
    // 获取用户openid
    wx.cloud.callFunction({
        name: 'getOpenID',
      })
      .then(res => {
        // console.log(res.result.event.userInfo.openId)
        this.setData({
          openid: res.result.event.userInfo.openId
        })
        // 获取用户学号
        userdb.where({
            '_openid': this.data.openid
          }).get()
          .then(res => {
            // console.log(res.data[0].studentID)
            this.setData({
              sendStudentID: res.data[0].studentID
            })
          }).catch(err => {
            console.log(err)
          })
        this.getMyAllAddress()
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
    this.getMyAllAddress()
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

  changeStart(e) {
    switch (e.detail) {
      case 0: {
        this.setData({
          start: '八里台校区'
        })
        break;
      }
      case 1: {
        this.setData({
          start: '津南校区'
        })
        break;
      }
      case 2: {
        this.setData({
          start: '泰达校区'
        })
        break;
      }
    }
  },
  changeEnd(e) {
    switch (e.detail) {
      case 0: {
        this.setData({
          end: '八里台校区'
        })
        break;
      }
      case 1: {
        this.setData({
          end: '津南校区'
        })
        break;
      }
      case 2: {
        this.setData({
          end: '泰达校区'
        })
        break;
      }
    }
  },

  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  },

  onInputDate(event) {
    this.setData({
      currentDate: event.detail,
      date: this.formatDate(event.detail),
    });
  },

  //让用户获取消息推送的授权
  getAccess() {
    wx.requestSubscribeMessage({
      tmplIds: ['XgpA413z8X4ki83NugtAKcIYXWSUJaYyKvpxhABWoTE'],
      success: (res) => {
        console.log('授权成功', res)
      },
      fail: (err) => {
        console.log('授权失败', err)
      }
    })
  },

  //向数据库提交订单信息
  submit(e) {
    this.getAccess()
    if (this.data.fileList.length === 0) { //当不上传图片时
      // console.log(this.data)
      db.add({
        data: {
          sendStudentID: this.data.sendStudentID,
          receiveStudentID: this.data.receiveStudentID,
          title: this.data.title,
          image: 'cloud://xiongxiao-9g0m49qp0514cda7.7869-xiongxiao-9g0m49qp0514cda7-1305534329/images/defaultGoods.png',
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
          isStoRReviewed: false,
          isRtoSReviewed: false,
          cancelPerson: ''
        }
      })
    } else {
      let imageName = this.data.openid + this.randomString(10)
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      wx.cloud.uploadFile({
        cloudPath: 'images/' + imageName,
        filePath: file.url,
        success: res => {
          this.setData({
            image: res.fileID
          })
          // console.log(this.data)
          db.add({
            data: {
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
              isStoRReviewed: false,
              isRtoSReviewed: false,
              cancelPerson: ''
            }
          })
          Toast({
            type: 'success',
            message: '提交成功',
            onClose: () => { //待实现比如说跳转界面等
              console.log('执行OnClose函数');
            },
          });
        },
        fail: err => {
          wx.showToast({
            title: '提交订单失败',
            icon: 'fail',
            duration: 1000
          })
        }
      })
    }
  },

  //选择图片的回调函数
  afterRead(event) {
    file = event.detail.file
    // console.log(file) 
    this.setData({
      fileList: [].concat(file)
    })
    console.log('fileList', this.data.fileList)
  },

  //删除选择的图片
  deleteImage(event) {
    // console.log(event.detail)
    this.setData({
      fileList: []
    })
  },

  //随机生成图片名字
  randomString(length) {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
      result += str[Math.floor(Math.random() * str.length)];
    return result;
  },

  //标题
  toShowTitle() {
    this.setData({
      showTitle: true
    })
  },
  closeShowTitle() {
    this.setData({
      showTitle: false,
      title: ''
    })
  },
  comfirmTitle() {
    this.setData({
      showTitle: false
    })
  },
  changeTitle(e) {
    this.setData({
      title: e.detail
    })
  },

  //类型
  toShowType() {
    this.setData({
      showType: true
    })
  },
  closeShowType() {
    this.setData({
      showType: false,
      type: ''
    })
  },
  comfirmType() {
    this.setData({
      showType: false
    })
  },
  changeType(e) {
    this.setData({
      type: e.detail.value.text
    })
  },

  //校区
  toShowCampus() {
    this.setData({
      showCampus: true
    })
  },
  closeShowCampus() {
    this.setData({
      showCampus: false,
    })
  },
  comfirmCampus() {
    this.setData({
      showCampus: false,
    })
  },


  toShowAddress() {
    // this.setData({
    //   showAddress: true
    // })
    wx.navigateTo({
      url: '../chooseAddress/chooseAddress?address='+JSON.stringify(this.data.allAddressJson),
    })
  },
  closeShowAddress() {
    this.setData({
      showAddress: false,
      // currentDate:  new Date().getTime(),
    })
  },

  changeAddress(e) {
    console.log(e)
    // this.setData({
    //   showAddress: false,
    //   currentAddress: 
    // })
  },
  toAddAddress(){
    wx.navigateTo({
      url: '../addAddress/addAddress?toAddAddressFlag=true',
    })
  },

  //日期
  toShowDate() {
    this.setData({
      showDate: true
    })
  },
  closeShowDate() {
    this.setData({
      showDate: false,
      currentDate: new Date().getTime(),
    })
  },
  comfirmDate() {
    this.setData({
      showDate: false
    })
  },

  toShowReward() {
    this.setData({
      showReward: true
    })
  },
  closeShowReward() {
    this.setData({
      showReward: false,
    })
  },
  comfirmReward() {
    this.setData({
      showReward: false
    })
  },
  changeReward(e) {
    this.setData({
      reward: e.detail
    })
  },

  toShowDescription() {
    this.setData({
      showDescription: true
    })
  },
  closeShowDescription() {
    this.setData({
      showDescription: false,
    })
  },
  comfirmDescription() {
    this.setData({
      showDescription: false
    })
  },
  changeDescription(e) {
    this.setData({
      description: e.detail
    })
  },

})