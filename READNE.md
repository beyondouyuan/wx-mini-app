### 获取微信运动数据 encryptedData包括敏感数据在内的完整用户信息的加密数据以及iv数据需经后台解析

参考文档：

- [前端调用接口wx.getWeRunData(OBJECT)](https://developers.weixin.qq.com/miniprogram/dev/api/we-run.html#wxgetwerundataobject)

- [解密算法](https://developers.weixin.qq.com/miniprogram/dev/api/signature.html#wxchecksessionobject)


### 获取小程序码

- [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/qrcode.html)

- [前端调用-小程序码A](https://api.weixin.qq.com/wxa/getwxacode?access_token=ACCESS_TOKEN)
- [前端调用-小程序码B](https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=ACCESS_TOKEN)
- [前端调用-小程序码C](https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=ACCESS_TOKEN)

- 1.[access_token](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183)应由前端提供code零时登陆凭证都后台去获取相关铭感信息
- 2.[会话凭证](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183)
- 3.小程序码或者二维码前端直接调用的接口返回流数据，需后台解析


### 涉及敏感信息 appId openId secret等信息均由前端向后台发送临时code换取
