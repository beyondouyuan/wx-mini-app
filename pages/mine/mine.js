const app = getApp()

import { requestAccountInfo, requestSpirit } from '../../api/index'

import { showShareAppMessage } from '../../utils/util'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    modalHide: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    spiritTotal: '',
    spiritImg: '',
    spiritList: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShareAppMessage: function(res) {
    return showShareAppMessage()
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      // 更新用户信息
       wx.setStorageSync('userInfo', app.globalData.userInfo)
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
         wx.setStorageSync('userInfo', res.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.setStorageSync('userInfo', res.userInfo)
        }
      })
    }
    this.fetchAccountInfo()
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.setStorageSync('userInfo', e.detail.userInfo)
    console.log(wx.getStorageSync('userInfo'))
    // 自动返回首页
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }, 2000)
  },
  fetchAccountInfo: function() {
    requestAccountInfo().then(res => {
      if (res.code == '200') {
        this.setData({
          spiritTotal: res.spiritTotal,
          spiritImg: res.img
        })
      } else {
        console.log('请求出错')
      }
    }).catch(e => {
      console.log(e)
    })
  },
  fetchSpirit: function() {
    requestSpirit().then(res => {
      if (res.code == '200') {
        this.setData({
          spiritList: res.list
        })
      } else {
        console.log('请求出错')
      }
    }).catch(e => {
      console.log(e)
    })
  },
  handleShowRecord: function() {
    this.setData({
      modalHide: false
    })
    this.fetchSpirit()
  },
  modalOk: function() {
    this.setData({
      modalHide: true
    })
  },
  // feedback: function() {
  //   wx.navigateTo({
  //     url: '/pages/index/index',
  //   })
  // }
})

