import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
    data: {
        leftMenuList: [],
        rightContent: [],
        currentIndex: 0,
        // 右侧内容滚动条距离顶部的距离
        scrollTop: 0
    },
    // 接口返回的函数
    Cates: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 本地存储技术
        const Cates = wx.getStorageSync("cates");
        if (!Cates) {
            this.getCates();
        } else {
            if (Date.now() - Cates.time > 1000 * 10) {
                this.getCates();
            } else {
                this.Cates = Cates.data;
                let leftMenuList = this.Cates.map(v => v.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }
    },
    async getCates() {
        // request({
        //         url: "/categories"
        //     })
        //     .then(res => {
        //         this.Cates = res.data.message;

        //         // 把接口数据存入到本地数据
        //         wx.setStorageSync("cates", {time:Date.now(), data:this.Cates});

        //         let leftMenuList = this.Cates.map(v => v.cat_name);
        //         let rightContent = this.Cates[0].children;
        //         this.setData({
        //             leftMenuList,
        //             rightContent
        //         })
        //     })

        // 使用es7的async await来发送请求     
        const res = await request({ url: "/categories" })
            // this.Cates = res.data.message;
        this.Cates = res;
        // 把接口数据存入到本地数据
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
    },
    handleItemTop(e) {
        const { index } = e.currentTarget.dataset;
        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightContent,
            scrollTop: 0
        })
    }
})