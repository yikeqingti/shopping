import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asnycWx.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({
    // handleChooseAddress() {
    //     wx.getSetting({
    //         success: (result) => {
    //             const scopeAddress = result.authSetting["scope.address"];
    //             if (scopeAddress === true || scopeAddress === undefined) {
    //                 wx.chooseAddress({
    //                     success: (result1) => {
    //                         console.log(result1);

    //                     },
    //                     fail: () => {},
    //                     complete: () => {}
    //                 });
    //             } else {
    //                 wx.openSetting({
    //                     success: (result2) => {
    //                         wx.chooseAddress({
    //                             success: (result3) => {
    //                                 console.log(result3);

    //                             },
    //                             fail: () => {},
    //                             complete: () => {}
    //                         });

    //                     },
    //                     fail: () => {},
    //                     complete: () => {}
    //                 });

    //             }

    //         }
    //     })
    // },
    data: {
        address: {},
        car: [],
        allChecked: false,
        totalPrice: 0,
        totalNum: 0
    },
    onShow() {
        const address = wx.getStorageSync("address");
        const car = wx.getStorageSync("car") || [];
        // const allChecked=car.length?car.every(v=>v.checked):false;
        this.setData({ address });
        this.setCar(car);
    },
    async handleChooseAddress() {
        try {
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting["scope.address"];
            if (scopeAddress === false) {
                await openSetting();
            }
            let address = await chooseAddress();
            address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
            wx.setStorageSync("address", address);
        } catch (error) {
            console.log(error);
        }
    },

    handleItemChange(e) {
        const goods_id = e.currentTarget.dataset.id;
        let { car } = this.data;
        let index = car.findIndex(v => v.goods_id === goods_id);
        car[index].checked = !car[index].checked;
        this.setCar(car);
    },

    setCar(car) {
        let allChecked = true;
        let totalPrice = 0;
        let totalNum = 0;
        car.forEach(v => {
            if (v.checked) {
                totalPrice += v.num * v.goods_price;
                totalNum += v.num;
            } else {
                allChecked = false;
            }
        })
        allChecked = car.length != 0 ? allChecked : false;
        this.setData({
            car,
            totalPrice,
            totalNum,
            allChecked
        });
        wx.setStorageSync("car", car);
    },
    handleItemAllCheck() {
        let { car, allChecked } = this.data;
        allChecked = !allChecked;
        car.forEach(v => v.checked = allChecked);
        this.setCar(car);
    },
    async handleItemNumEdit(e) {
        const { operation, id } = e.currentTarget.dataset;
        let { car } = this.data;
        const index = car.findIndex(v => v.goods_id === id);
        if (car[index].num === 1 && operation === -1) {
            const res = await showModal({ content: "你是否要删除?" })
            if (res.confirm) {
                car.splice(index, 1);
                this.setCar(car);
            }
        } else {
            car[index].num += operation;
            this.setCar(car);
        }
    },
    async handlePay() {
        const { address, totalNum } = this.data;
        if (!address.userName) {
            await showToast({ title: "你还没有选择收获地址" });
            return;
        }
        if (totalNum === 0) {
            await showToast({ title: "你还没有选购商品" });
            return;
        }
        wx.navigateTo({
            url: '/pages/pay/index'
        });

    }
})