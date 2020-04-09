import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
    data: {
        tabs: [{
                id: 0,
                value: "综合",
                isActive: true
            },
            {
                id: 1,
                value: "销量",
                isActive: false
            },
            {
                id: 2,
                value: "价格",
                isActive: false
            }
        ],
        goodsList: []
    },
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },
    totalPages: 1,

    onLoad: function(options) {
        this.QueryParams.cid = options.cid || "";
        this.QueryParams.query = options.query || "";
        this.getGoodsList();
    },
    async getGoodsList() {
        const res = await request({ url: "/goods/search", data: this.QueryParams });
        // 计算总页数
        const total = res.total;
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
        // console.log(this.totalPages)
        this.setData({
            goodsList: [...this.data.goodsList, ...res.goods]
        })

        // 关闭下拉刷新窗口
        wx.stopPullDownRefresh();
    },

    handleTabsItemChange(e) {
        const { index } = e.detail;
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })
    },
    // 页面上滑 滚动条触底事件
    onReachBottom() {
        if (this.QueryParams.pagenum > this.totalPages) {
            wx: wx.showToast({
                title: '已经到底啦'
            })
        }
        else {
            this.QueryParams.pagenum++;
            this.getGoodsList();
        }
    },
    onPullDownRefresh() {
        this.setData({
            goodsList: []
        })
        this.QueryParams.pagenum = 1;
        this.getGoodsList();
    }
})