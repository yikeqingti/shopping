import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
    data: {
        goodsObj: {},
        isCollect: false
    },
    GoodsInfo: {},
    onShow: function() {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        let options = currentPage.options;
        const { goods_id } = options;
        this.getGoodsDetail(goods_id);

    },
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
        this.GoodsInfo = goodsObj;
        let collect = wx.getStorageSync("collect") || [];
        let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
        this.setData({
            goodsObj: {
                goods_name: goodsObj.goods_name,
                goods_price: goodsObj.goods_price,
                //  iphone部分手机不识别webp图片格式
                // 临时修改 webp=>jpg
                goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: goodsObj.pics
            },
            isCollect
        })
    },
    handlePrevewImage(e) {
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
        const current = e.currentTarget.dataset.url;
        wx: wx.previewImage({
            current,
            urls
        })
    },
    handleCatAdd() {
        let car = wx.getStorageSync("car") || [];
        let index = car.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        if (index === -1) {
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            car.push(this.GoodsInfo);
        } else {
            car[index].num++;
        }
        wx.setStorageSync("car", car);
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            mask: true
        })

    },
    handleCollect() {
        let isCollect = false;
        let collect = wx.getStorageSync("collect") || [];
        let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        if (index !== -1) {
            collect.splice(index, 1);
            isCollect = false;
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true,
            });
        } else {
            collect.push(this.GoodsInfo);
            isCollect = true;
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true,
            });
        }
        wx.setStorageSync("collect", collect);
        this.setData({
            isCollect
        })


    }

})