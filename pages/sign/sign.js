const app = getApp()

import { requestSign } from '../../api/index'
import { showSuccessToast, showGroupShareAppMessage, showLoadingToast } from '../../utils/util'
import promise from '../../utils/promise'
Page({
  data: {
    signData: {},
    joinTxt: '已加入小程序',
    runTxt: '累计步数',
    shareTempImg: '',
    cWidth: '0', // canvas初始值必须设计 否则安卓具有兼容问题 发生变形
    cHeight: '0',
    doShare: false,
    avatarUrl: '',
    qrcode : 'http://alicliimg.clewm.net/weapp/2018/06/11/50dda0d9d76556cca646dfb1eb0537ac1528656525.png'
  },
  onLoad: function() {
    this.fetchSignImg()
    const {avatarUrl} = app.globalData.userInfo
    this.setData({
      avatarUrl: avatarUrl
    })
  },
  onShareAppMessage: function(option) {
    if (this.data.doShare) {
      if (option.from == 'button') {
        return showGroupShareAppMessage(this.data.shareTempImg)
      }
    } else {

    }

  },
  fetchSignImg: function() {
    requestSign().then(res => {
      if (res.code == '200') {
        this.setData({
          signData: res.data
        })
      }
    })
  },

  handleShare: function(e) {
      this.setData({
        draw: true
      })
      const self = this
      showLoadingToast('正在生成图片...', 'none')
      const promisefyImageInfo = promise(wx.getImageInfo)
      // 设备信息
      const promisefySystemInfo = promise(wx.getSystemInfo)
      const promisefyDownload = promise(wx.downloadFile)
      const qrcode = `http://alicliimg.clewm.net/weapp/2018/06/11/50dda0d9d76556cca646dfb1eb0537ac1528656525.png`
      const {avatarUrl} = app.globalData.userInfo
      const promisefyImageInfoData = promisefyImageInfo({
        src: self.data.signData.bg
      })
      const qrcodeData = promisefyImageInfo({
        src: qrcode
      })
      const avatarUrlData = promisefyImageInfo({
        src: avatarUrl
      })
      const promisefySystemInfoData = promisefySystemInfo()

      Promise.all([promisefyImageInfoData, promisefySystemInfoData, qrcodeData, avatarUrlData])
      .then(res => {
        const { windowHeight, windowWidth} = res[1]
        // 宽高所占比例
        const percentage = 0.8
        // canvas样式
        this.setData({
          cWidth: `${windowWidth * 2 * percentage}rpx`,
          cHeight: `${windowHeight * 2 * percentage}rpx`
        })
        // 绘制背景图片
        const ctx = wx.createCanvasContext('shareImg')
        // 绘制底图
        ctx.drawImage(res[0].path, 0, 0, windowWidth * percentage, windowHeight * percentage)
        ctx.setTextAlign('center')                        //  位置
        ctx.setFillStyle('#ffffff')                       //  颜色
        ctx.setFontSize(12)                               //  字号
        let jionTxtAllArray = [];
        let runTxtAllArray = [];
        const jionTxtAll = `${this.data.joinTxt}${this.data.signData.joinTotal} 天`
        const runTxtAll = `${this.data.runTxt}${this.data.signData.runTotal} 步`
        // 为了防止标题过长，分割字符串,每行18个
        for (let i = 0; i < jionTxtAll.length / 18; i++) {
            if (i > 2) {
                break;
            }
            jionTxtAllArray.push(jionTxtAll.substr(i * 18, 18));
        }
        for (let i = 0; i < runTxtAll.length / 18; i++) {
            if (i > 2) {
                break;
            }
            runTxtAllArray.push(runTxtAll.substr(i * 18, 18));
        }
        // 画笔纵向偏移
        let yOffset = 70
        // 分别绘制标题描述文字
        jionTxtAllArray.forEach(function (value) {
          // ctx.setFontSize(12);
          ctx.fillText(value, (windowWidth / 2) * percentage, yOffset);
          yOffset += 25;
        });
        yOffset += 15;
        runTxtAllArray.forEach(function (value) {
          ctx.fillText(value, (windowWidth / 2) * percentage, yOffset);
          yOffset += 25;
        });
        yOffset += 30
        // 小程序码尺寸
        const qrImgSize = 180
        // 头像尺寸
        const avatarSize = 64
        // 绘制小程序吗
        ctx.drawImage(res[2].path, ((windowWidth / 2) * percentage - qrImgSize / 2), yOffset, qrImgSize, qrImgSize)
        yOffset += 90
        ctx.save()
        ctx.beginPath()
        ctx.arc((windowWidth / 2) * percentage, yOffset, avatarSize / 2, 0, 2 * Math.PI)

        ctx.clip()

        ctx.drawImage(res[3].path, (windowWidth / 2) * percentage - avatarSize / 2, yOffset - avatarSize / 2, avatarSize, avatarSize)
        ctx.restore()

        ctx.stroke()
        ctx.draw(false, function() {
          // 保存临时图片
          // 此操作需要异步延时。否则安卓上第一次调用时可能无法保存成功
          setTimeout(function() {
            wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: parseInt(self.data.cWidth, 10),
            height: parseInt(self.data.cHeight, 10),
            destWidth: parseInt(self.data.cWidth, 10),
            destHeight: parseInt(self.data.cHeight, 10),
            canvasId: 'shareImg',
            success: function(res) {
              self.setData({
                shareTempImg: res.tempFilePath
              })
              wx.hideLoading()
              // 预览图片 长按可分享给朋友
              wx.previewImage({
                current: res.tempFilePath, // 当前显示图片的http链接
                urls: [res.tempFilePath] // 需要预览的图片http链接列表
              })

              self.setData({
                doShare: true
              })
              console.log("get tempfilepath(success) is:",res.tempFilePath)
              // 将图片保存在系统相册中(应先获取权限，) 以便用于分享到朋友圈 也可不调用此方法，直接使用预览图片长按来实现操作
              // wx.saveImageToPhotosAlbum({
              //   filePath: res.tempFilePath,
              //   success: function(res) {
              //     console.log("save photo is success")
              //     self.setData({
              //       doShare: true
              //     })
              //   },

              //   fail: function(err) {
              //     console.log("save photo is fail")
              //   }
              // })
            },
            fail: function(res) {
              console.log(res)
              showLoadingToast('图片生成失败！', 'fail')
              self.setData({
                doShare: false
              })
            }
          })
          }, 300)

        })
      })
  }
})
