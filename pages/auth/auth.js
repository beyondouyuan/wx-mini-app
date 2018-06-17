import {
  requestSession,
  requestUpdateuserInfo
} from '../../api/index'
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    sessionId: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function () {
    if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync('userInfo', res.userInfo)
        const params = {
          userInfo: res.userInfo,
          sessionId: wx.getStorageSync('sessionId')
        }
        requestUpdateuserInfo(params).then(res => {
          console.log(res)
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index',
            success: function (e) {
              console.log(e)
                const page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onShow();
              }
          })
        }, 600)
      }
      app.sessionIdReadyCallback = res => {
        this.setData({
          sessionId: res.sessionId
        })
        console.log(res)
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
          const params = {
            userInfo: res.userInfo,
            sessionId: wx.getStorageSync('sessionId')
          }
          requestUpdateuserInfo(params).then(res => {
            console.log(res)
          })
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index',
              success: function (e) {
                const page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onShow();
              }
            })
          }, 600)
        }
      })
    }
  },
  getUserInfo: function(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('userInfo', e.detail.userInfo)
      const params = {
        userInfo: e.detail.userInfo,
        sessionId: wx.getStorageSync('sessionId')
      }
      requestUpdateuserInfo(params).then(res => {
        console.log(res)
      })
      // 自动返回首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index',
          success: function (e) {
            console.log(e)
                const page = getCurrentPages().pop();
                console.log(page)
                if (page == undefined || page == null) return;
                page.onLoad();
              }
        })
      }, 600)
    }
  }
})
