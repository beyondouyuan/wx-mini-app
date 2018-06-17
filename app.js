//app.js
import {
    requestOpenidGid,
    requestSession,
    requestUpdateuserInfo
} from '/api/index'
import {
    isToday
} from '/utils/util'
App({
    globalData: {
        userInfo: null,
        code: null,
        sessionId: null,
        opengid: null,
        punchTotal: 0,
        stepTotal: 0,
        hasPunch: false
    },
    onLaunch: function(option) {
        const self = this
        if (this.PunchReadyCallback) {
            this.PunchReadyCallback(this.globalData.hasPunch)
        }
        if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(this.globalData.userInfo)
        }
        wx.checkSession({
            success: function(res) {
                console.log(res)
                if (!wx.getStorageSync('sessionId')) {
                    self.wxLogin()
                }
            },
            fail: function(res) {
                self.wxLogin(self)
            }
        })
    },
    wxLogin: function(self) {
        wx.login({
            success: res => {
                console.log(res.code)
                const {
                    code
                } = res
                self.globalData.code = code
                wx.setStorageSync('code', code)
                if (res.code) {
                    requestSession(code).then(res => {
                        const {
                            session_id
                        } = res
                        self.globalData.sessionId = session_id
                        wx.setStorageSync('sessionId', session_id)
                        if (self.sessionIdReadyCallback) {
                            self.sessionIdReadyCallback(res)
                        }
                    })
                }
            },
            fail: res => {
                console.log(res)
            }
        })
    },
    onShow: function(option) {
        const self = this
        const punchTime = wx.getStorageSync('punchTime')
        console.log(punchTime)
        if (punchTime && isToday(punchTime)) {
            self.globalData.hasPunch = true
        } else {
            self.globalData.hasPunch = false
        }
        if (option.scene == 1044) {
            wx.getShareInfo({
                shareTicket: option.shareTicket,
                success: function(res) {
                    const {
                        encryptedData,
                        iv
                    } = res
                    const params = {
                        encryptedData,
                        iv,
                        sessionId: wx.getStorageSync('sessionId')
                    }
                    requestOpenidGid(params).then(res => {
                        const {
                            opengid
                        } = res
                        self.globalData.opengid = opengid
                        if (self.opengIdReadyCallback) {
                            self.opengIdReadyCallback(res)
                        }
                        wx.setStorageSync('opengid', opengid)
                    })
                },
                fail: function(res) {
                    console.log(res)
                }
            })
        }

    }

})
