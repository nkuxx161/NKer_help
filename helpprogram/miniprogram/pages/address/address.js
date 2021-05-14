// pages/address/address.js
const DB = wx.cloud.database()
const db = DB.collection('addressSet')
import toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowAllContent: false,
    img:'cloud://xiongxiao-9g0m49qp0514cda7.7869-xiongxiao-9g0m49qp0514cda7-1305534329/images/defaultImg.png',
    radio: 0,
    openid:'',
    addressInfo:[],
    displaydata:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.cloud.callFunction({
      name: 'getOpenID',
    })
    .then(res => {
      this.setData({
        openid: res.result.openid
      })
      db.where({
        _openid: this.data.openid
      }).get()
      .then(res => {
        if(res.data.length==0)
        toast("暂无地址，请新增地址")
          this.setData({
            addressInfo: this.data.addressInfo.concat(res.data)
          })
          for(var i = 0; i < this.data.addressInfo.length; i++) {
            if(this.data.addressInfo[i].ifdefault)
            {
              [this.data.addressInfo[0],this.data.addressInfo[i]]= [this.data.addressInfo[i],this.data.addressInfo[0]]
            }
          }
          this.setData({
            displaydata: this.data.displaydata.concat(this.data.addressInfo)
          })
          console.log(this.data.displaydata)
      }
      )
      .catch(err => {
        
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
    wx.hideHomeButton({
      success: (res) => {},
    })
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
    var id1=this.data.displaydata[0]._id
    var id2=this.data.displaydata[this.data.radio]._id
    db.doc(id1).update({
      data:{
        ifdefault:false
      },
      success: function (res) {
        db.doc(id2).update({
          data:{
            ifdefault:true
          },
          success: function (res) {
            toast.success("修改成功")
          }
        });
      }
    });
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
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
   
    
  },
  addAdderss:function(){
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },
  deleteaddress:function(e){ 
    
        Dialog.confirm({
          title: '确认删除',
          message: '是否确认删除地址',
        })
          .then(() => {
            db.doc(this.data.displaydata[e.currentTarget.dataset.id]._id).remove({
              success: function (res) {
                toast.success("删除成功")
                wx.redirectTo({
                  url: '../address/address',
                })
              },
              fail: function(err){
                toast.fail("删除失败")
              }
            })
          })
          .catch(() => {
            
          });
      
    
  },
  editaddress:function(e){ 
    wx.navigateTo({
      url: '../addAddress/addAddress?data='+JSON.stringify(this.data.displaydata[e.currentTarget.dataset.id]),
    })
}
})