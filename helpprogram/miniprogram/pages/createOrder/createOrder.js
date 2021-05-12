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
    type: 0,
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

  initOrder(){
    this.setData({
      sendStudentID: this.data.currentOrder.sendStudentID,
      title: this.data.currentOrder.title,
      fileList: [].concat(JSON.parse('{"url":'+"\""+this.data.currentOrder.image+"\"}")),
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
      isRtoSReviewed: false
    })
    console.log('init',this.data.fileList)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(JSON.stringify(options)!="{}"){
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

  },

  changeType(e) {
    switch (e.detail) {
      case 0: {
        this.setData({
          type: '外卖'
        })
        break;
      }
      case 1: {
        this.setData({
          type: '快递'
        })
        break;
      }
      case 2: {
        this.setData({
          type: '代购'
        })
        break;
      }
      case 3: {
        this.setData({
          type: '其他'
        })
        break;
      }
    }
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
    if (this.data.fileList.length === 0) {//当不上传图片时
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
          isRtoSReviewed: false
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
              isRtoSReviewed: false
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
    console.log('fileList',this.data.fileList)
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

})