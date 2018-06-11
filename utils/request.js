const request = (url, config) => {
    const { data, method } = config
    const promise = new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
            method: method || 'GET',
            header: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            responseType: config.responseType,
            success: res => {
                resolve(res)
            },
            fail: (res) => {
                reject(res)
            }
        })
    })

    return promise
}


export default request
