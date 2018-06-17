const app = getApp()

import {
  requestPerImage,
  requestQuote
} from '../../api/index'
import {
  showSuccessToast,
  showMessageToast,
  showErrorToast,
  showGroupShareAppMessage,
  showShareAppMessage,
  showLoadingToast
} from '../../utils/util'
import promise from '../../utils/promise'
Page({
  data: {
    stepTotal: 0,
    punchTotal: 0,
    quoteTxt: '',
    joinTxt: '已打卡',
    runTxt: '累计',
    qrcodeTxt: '扫码一起加入打卡',
    shareTempImg: '',
    cWidth: '0', // canvas初始值必须设计 否则安卓具有兼容问题 发生变形
    cHeight: '0',
    doShare: false,
    avatarUrl: '',
    canvasBg: '',
    // canvasBg: '../../assets/images/bgimage.png',
    qrcode: 'http://alicliimg.clewm.net/weapp/2018/06/11/50dda0d9d76556cca646dfb1eb0537ac1528656525.png'
  },
  onLoad: function() {
     wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
    this.fetchSignImg()
    // const {
    //   avatarUrl
    // } = app.globalData.userInfo
    // this.setData({
    //   avatarUrl: avatarUrl
    // })
    const {
      stepTotal,
      punchTotal
    } = app.globalData
    console.log(stepTotal)
    this.setData({
      stepTotal: stepTotal,
      punchTotal: punchTotal
    })
    this.fetchQuote()
  },
  onShareAppMessage: function(option) {
    if (this.data.doShare) {
      if (option.from == 'button') {
        return showGroupShareAppMessage()
      }
    } else {
        return showShareAppMessage()
    }

  },
  fetchSignImg: function() {
    requestPerImage().then(res => {
      this.setData({
        canvasBg: res.per_image
      })
    })
  },
  fetchQuote: function() {
    requestQuote().then(res => {
      this.setData({
        quoteTxt: res.quote
      })
    })
  },
  handleSaveCard: function(e) {
    // 上下文
    const self = this
    showLoadingToast('正在生成图片...', 'none')
    const promisefyImageInfo = promise(wx.getImageInfo)
    // 设备信息
    const promisefySystemInfo = promise(wx.getSystemInfo)
    const promisefyDownload = promise(wx.downloadFile)
    const qrcode = `http://alicliimg.clewm.net/weapp/2018/06/11/50dda0d9d76556cca646dfb1eb0537ac1528656525.png`
    // const {
    //   avatarUrl
    // } = app.globalData.userInfo
    // 若是本地图片则无需异步读取图片信息
    const promisefyImageInfoData = promisefyImageInfo({
      // src: self.data.signData.bg
      src: self.data.canvasBg
    })
    // const qrcodeData = promisefyImageInfo({
    //   src: qrcode
    // })
    // const avatarUrlData = promisefyImageInfo({
    //   src: avatarUrl
    // })
    const promisefySystemInfoData = promisefySystemInfo()

    // Promise.all([promisefyImageInfoData, promisefySystemInfoData, qrcodeData, avatarUrlData])
    Promise.all([promisefyImageInfoData, promisefySystemInfoData])
      .then(res => {
        console.log(res)
        const {
          windowHeight,
          windowWidth
        } = res[1]
        this.setData({
          cWidth: `${windowWidth * 2}rpx`,
          cHeight: `${windowHeight * 2}rpx`
        })
        const drawParams = {
          windowHeight,
          windowWidth,
          res
        }
        this.handleDrawCard(drawParams)
      })
  },
  handleDrawCard: function(paramas) {
    const {
      windowWidth,
      windowHeight,
      res
    } = paramas
    // 上下文
    const self = this
    const ctx = wx.createCanvasContext('shareImg')
    // 底图
    this.handleDrawImage({
      ctx,
      path: res[0].path,
      xOffset: 0,
      yOffset: 0,
      wsize: windowWidth,
      hsize: windowHeight,
    })
    // 设置文字选项
    ctx.setFillStyle('#ffffff')
    ctx.setTextAlign('left')
    ctx.setFontSize(14)
    // 测量尺寸
    // 行向偏移量以每行12个字签名为基准做测量
    const ts = this.data.quoteTxt.substr(0, 12)
    console.log(ts)
    const textWidth = ctx.measureText(ts)
    const textWidthM = Math.ceil(textWidth.width)

    let yOffset = 90
    // let xOffset = (windowWidth - textWidthM/2) / 2
    let xOffset = (windowWidth - textWidthM) / 2
    const t = this.handleDrawMultipleText({
      text: this.data.quoteTxt,
      yOffset,
      xOffset,
      ctx
    })
    // 重新定位纵向偏移量
    yOffset = t + 30

    // 绘制加入天数文字
    const joinParams = {
      text: this.data.joinTxt,
      yOffset,
      xOffset,
      ctx
    }
    this.handleDrawText(joinParams)
    const joinTxt = ctx.measureText(this.data.joinTxt)
    const joinTxtW = Math.ceil(joinTxt.width)
    xOffset += joinTxtW
    // “天数设置额外样式”
    ctx.setFontSize(28)
    const punchTotalParams = {
      text: this.data.punchTotal,
      yOffset,
      xOffset,
      ctx
    }
    this.handleDrawText(punchTotalParams)
    // 测量偏移量 重新定位画笔偏移量
    const punchTotal = ctx.measureText(this.data.punchTotal)
    const punchTotalW = Math.ceil(punchTotal.width)
    xOffset += punchTotalW
    ctx.setFontSize(14)
    this.handleDrawText({
      text: '天',
      yOffset,
      xOffset,
      ctx
    })

    // 绘制累计步数文字

    yOffset += 40
    // xOffset = (windowWidth - textWidthM/2) / 2
    xOffset = (windowWidth - textWidthM) / 2

    const runTxtParams = {
      text: this.data.runTxt,
      yOffset,
      xOffset,
      ctx
    }
    this.handleDrawText(runTxtParams)
    const runTxt = ctx.measureText(this.data.runTxt)
    const runTxtW = Math.ceil(runTxt.width)
    xOffset += runTxtW
    ctx.setFontSize(28)
    const stepTotalParams = {
      text: this.data.stepTotal,
      yOffset,
      xOffset,
      ctx
    }
    this.handleDrawText(stepTotalParams)
    const stepTotal = ctx.measureText(this.data.stepTotal)
    const stepTotalW = Math.ceil(stepTotal.width)
    xOffset += stepTotalW
    ctx.setFontSize(14)
    this.handleDrawText({
      text: '步',
      yOffset,
      xOffset,
      ctx
    })
    const qrImgSize = 125
    const avatarSize = 32
    yOffset += qrImgSize
    // 绘制小程序码
    // this.handleDrawImage({
    //   ctx,
    //   path: res[2].path,
    //   xOffset: ((windowWidth / 2) - qrImgSize / 2),
    //   yOffset,
    //   wsize: qrImgSize,
    //   hsize: qrImgSize,
    // })
    yOffset += 62.5
    ctx.setFontSize(14)
    const qrcodeWidth = ctx.measureText(this.data.qrcodeTxt)
    const qrcodeWidthM = Math.ceil(qrcodeWidth.width)
    const qrOffset = (windowWidth - qrcodeWidthM) / 2
    this.handleDrawText({
      text: this.data.qrcodeTxt,
      yOffset: yOffset + 95,
      xOffset: qrOffset,
      ctx
    })
    ctx.save()
    // 构建圆形闭环
    // ctx.beginPath()
    // ctx.arc((windowWidth / 2), yOffset, avatarSize / 2, 0, 2 * Math.PI)
    // ctx.clip()
    // 绘制头像
    // this.handleDrawImage({
    //   ctx,
    //   path: res[3].path,
    //   xOffset: (windowWidth / 2) - avatarSize / 2,
    //   yOffset: yOffset - avatarSize / 2,
    //   wsize: avatarSize,
    //   hsize: avatarSize,
    // })

    ctx.restore()

    ctx.stroke()
    const saveParamas = {
      cWidth: this.data.cWidth,
      cHeight: this.data.cHeight
    }

    ctx.draw(false, function() {
      setTimeout(function() {
        self.handlePreviewCard(saveParamas)
      }, 300)
    })
  },
  // 绘制单行文字
  handleDrawText: function(paramas) {
    const {
      ctx,
      text,
      yOffset,
      xOffset
    } = paramas
    ctx.fillText(text, xOffset, yOffset);
  },
  // 绘制多行文字
  handleDrawMultipleText: function(paramas) {
    let {
      ctx,
      text,
      yOffset,
      xOffset
    } = paramas
    const textArray = []
    // 每行限制12字
    for (let i = 0; i < text.length / 12; i++) {
      if (i > 2) {
        break;
      }
      textArray.push(text.substr(i * 12, 12));
    }
    textArray.forEach(val => {
      ctx.fillText(val, xOffset, yOffset)
      yOffset += 25
    })
    return yOffset
  },
  // 绘制图片
  handleDrawImage: function(paramas) {
    const {
      ctx,
      wsize,
      hsize,
      path,
      xOffset,
      yOffset
    } = paramas
    ctx.drawImage(path, xOffset, yOffset, wsize, hsize)
  },
  // 保存并预览
  handlePreviewCard: function(paramas) {
    const {
      cWidth,
      cHeight
    } = paramas
    // 上下文
    const self = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: parseInt(cWidth, 10),
      height: parseInt(cHeight, 10),
      destWidth: parseInt(cWidth, 10),
      destHeight: parseInt(cHeight, 10),
      canvasId: 'shareImg',
      success: function(res) {
        self.setData({
          shareTempImg: res.tempFilePath
        })
        wx.hideLoading() // 生成图片一半需要时间较长 无需做延时关闭处理
        // 预览图片 长按可分享给朋友
        // wx.previewImage({
        //   current: res.tempFilePath, // 当前显示图片的http链接
        //   urls: [res.tempFilePath] // 需要预览的图片http链接列表
        // })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            showMessageToast('图片已成功保存到相册', 'none')
            self.setData({
              doShare: true
            })
          },
          fail: function(res) {
            if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") {
              showMessageToast('已取消保存图片', 'none')
              self.setData({
                doShare: true
              })
            } else {
              showMessageToast('保存失败', 'none')
            }
          }
        })

      },
      fail: function(res) {
        showLoadingToast('图片生成失败！', 'fail')
        wx.hideLoading()
        self.setData({
          doShare: false
        })
      }
    })
  }
})
