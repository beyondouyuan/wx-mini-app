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
        todayStep: 0,
        hasPunch: false
    },
    onLaunch: function(option) {
        const self = this
        if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(this.globalData.userInfo)
        }
        wx.checkSession({
            success: function(res) {
                const sessionId = wx.getStorageSync('sessionId')
                const userInfo = wx.getStorageSync('userInfo')
                if (sessionId && userInfo) {
                    const params = {
                        userInfo,
                        sessionId
                    }
                    requestUpdateuserInfo(params).then(res => {
                        // console.log(res)
                    })
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
                const {
                    code
                } = res
                self.globalData.code = code
                wx.setStorageSync('code', code)
                if (code) {
                    requestSession(code).then(res => {
                        if (res.errcode != '40163') {
                            const {
                                session_id
                            } = res
                            self.globalData.sessionId = session_id
                            wx.setStorageSync('sessionId', session_id)
                            if (self.sessionIdReadyCallback) {
                                self.sessionIdReadyCallback(res)
                            }
                        }

                    })
                }
            },
            fail: res => {
                console.log('login fail' + res)
            }
        })
    },
    onShow: function(option) {
        const self = this
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
