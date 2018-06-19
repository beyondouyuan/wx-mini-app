const app = getApp()

import { requestAccountInfo, requestPowers, requestPowerRecord, requestProductImage } from '../../api/index'

import { showShareAppMessage, parseTime, showMessageToast } from '../../utils/util'

Page({
  data: {
    userInfo: {},
    sessionId: '',
    hasUserInfo: false,
    modalHide: true,
    powersTotal: 0,
    spiritImg: '',
    powersList: [],
    currentPage: 1,
    lastPage: 2,
    product_image: ''
  },
  onShareAppMessage: function(res) {
    return showShareAppMessage()
  },
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }
    this.fetchPowers()
    this.fetchProductImage()
  },
  fetchPowers: function() {
    const sessionId = wx.getStorageSync('sessionId')
    requestPowers(sessionId).then(res => {
      this.setData({
        powersTotal: res
      })
    }).catch(e => {
      console.log(e)
    })
  },
  fetchPowerRecord: function() {
    const sessionId = wx.getStorageSync('sessionId')
    const page = this.data.currentPage
    requestPowerRecord(sessionId, page).then(res => {
        const { current_page, data, last_page } = res
        const list = data.map((item, index) => {
          item.created_at = parseTime(item.created_at, '{y}-{m}-{d}')
          return item
        })
        this.setData({
          lastPage: last_page,
          powersList: this.data.powersList.concat(list)
        })
      })
  },
  fetchProductImage: function() {
    requestProductImage().then(res => {
      if (!res.errMsg) {
        this.setData({
          product_image: res.product_image
        })
      }
    })
  },
  handleShowRecord: function() {
    this.setData({
      modalHide: false,
      currentPage: 1,
      powersList: []
    })
    this.fetchPowerRecord()
  },
  lower: function() {
    if (this.data.currentPage >= this.data.lastPage) {
      showMessageToast('没有更多数据了！' , 'none')
      return;
    } else {
      this.setData({
        currentPage: this.data.currentPage + 1
      }, () => {
        this.fetchPowerRecord()
      })
    }
  },
  modalOk: function() {
    this.setData({
      modalHide: true
    })
  }
})

