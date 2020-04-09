// promise 形式 getSetting
export const getSetting = () => {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: (result) => {
                    resolve(result);
                },
                fail: (err) => {
                    reject(err);
                },
                complete: () => {}
            });

        })
    }
    // promise 形式 chooseAddress
export const chooseAddress = () => {
        return new Promise((resolve, reject) => {
            wx.chooseAddress({
                success: (result) => {
                    resolve(result);
                },
                fail: (err) => {
                    reject(err);
                },
                complete: () => {}
            });

        })
    }
    // promise 形式 openSetting
export const openSetting = () => {
        return new Promise((resolve, reject) => {
            wx.openSetting({
                success: (result) => {
                    resolve(result);
                },
                fail: (err) => {
                    reject(err);
                },
                complete: () => {}
            });

        })
    }
    // promise 形式 showModal

export const showModal = ({ content }) => {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: '提示',
                content: content,
                success: (res) => {
                    resolve(res);
                },
                fail: (err) => {
                    reject(err);
                }
            })

        })
    }
    // promise 形式 showToast

export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })

    })
}

export const login = () => {
        return new Promise((resolve, reject) => {
            wx.login({
                timeout: 10000,
                success: (result) => {
                    resolve(result);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        })
    }
    // Promise形式的小程序微信支付
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}