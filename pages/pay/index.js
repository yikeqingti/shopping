import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asnycWx.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({

    data: {
        address: {},
        car: [],
        totalPrice: 0,
        totalNum: 0
    },
    onShow() {
        const address = wx.getStorageSync("address");
        let car = wx.getStorageSync("car") || [];
        // 过滤后的购物车数组
        car = car.filter(v => v.checked);
        this.setData({ address });
        let totalPrice = 0;
        let totalNum = 0;
        car.forEach(v => {
            totalPrice += v.num * v.goods_price;
            totalNum += v.num;
        })
        this.setData({
            car,
            totalPrice,
            totalNum,
            address
        });
    },
    async handleOrderPay() {
        try {
            const token = wx.getStorageSync("token");
            if (!token) {
                wx.navigateTo({
                    url: '/pages/auth/index',
                });
                return;
            }
            // const header = { Authorization: token };
            const order_price = this.data.totalPrice;
            const consignee_addr = this.data.address.all;
            const car = this.data.car;
            let goods = [];
            car.forEach(v => goods_push({
                goods_id: v.goods_id,
                goods_number: v.num,
                goods_price: v.goods_price
            }))
            const orderParams = { order_price, consignee_addr, goods };
            // 准备发送请求 创建订单 获取订单编号
            const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams })
                // 发起 预支付接口
            const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
            // 发起微信支付
            await requestPayment(pay);
            // 查询后台订单状态
            const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } })
            await showToast({ title: "支付成功" })
                // 删除已支付的商品
            let newCar = wx.getAccountInfoSync("car");
            newCar = newCar.filter(v => !v.checked);
            wx.setStorageSync("car", newCar);
            // 支付成功跳转订单页面
            wx.navigateTo({
                url: '/pages/order/index'
            });

        } catch (error) {
            await showToast({ title: "支付失败" })
        }
    }
})