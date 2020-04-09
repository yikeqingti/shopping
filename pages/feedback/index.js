// pages/feedback/index.js
Page({
    data: {
        tabs: [{
                id: 0,
                value: "体验问题",
                isActive: true
            },
            {
                id: 1,
                value: "商品、商家投诉",
                isActive: false
            }
        ],
        chooseImages: [],
        textVal: ''
    },
    UpLoadImgs: [],
    handleTabsItemChange(e) {
        const { index } = e.detail;
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })
    },
    handleChooseImg() {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (result) => {
                this.setData({
                    chooseImages: [...this.data.chooseImages, ...result.tempFilePaths]
                })
            }
        });
    },
    handleRemoveImg(e) {
        const { index } = e.currentTarget.dataset;
        // console.log(index);
        let { chooseImages } = this.data;
        chooseImages.splice(index, 1);
        this.setData({
            chooseImages
        })
    },
    handleTextInput(e) {
        this.setData({
            textVal: e.detail.value
        })
    },
    handleFormSubmit() {
        const { textVal, chooseImages } = this.data;
        if (!textVal.trim()) {
            wx.showToast({
                title: '输入不合法',
                icon: 'none',
                mask: true
            });
            return;
        }
        wx.showLoading({
            title: '正在上传中',
            mask: true
        });
        if (chooseImages.length != 0) {
            chooseImages.forEach((v, i) => {
                wx.uploadFile({
                    url: 'http://images.ac.cn/api/upload',
                    filePath: v,
                    name: 'file',
                    formData: {},
                    success: (result) => {
                        let url = JSON.parse(result.data).url;
                        this.UpLoadImgs.push(url);
                        wx.hideLoading();
                        if (i === chooseImages.length - 1) {
                            console.log("把文本的内容和外网的图片数组提交到后台");
                            this.setData({
                                textVal: '',
                                chooseImages: []
                            })
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    }
                });
            })
        } else {
            wx.hideLoading();
            wx.showLoading({
                title: '提交成功',
                mask: true,
                success: (result) => {
                    wx.navigateBack({
                        delta: 1
                    });
                },
                fail: () => {},
                complete: () => {}
            });
        }
    }
})