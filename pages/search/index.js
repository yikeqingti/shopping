import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
    data: {
        goods: [],
        isFocus: false,
        inputValue: ''
    },
    TimeId: -1,
    handleInput(e) {
        const { value } = e.detail;
        // 检验合法性
        if (!value.trim()) {
            this.setData({
                goods: [],
                isFocus: false
            })
            return;
        }
        this.setData({
            isFocus: true
        })
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.qsearch(value);
        }, 1000)
    },
    async qsearch(query) {
        const res = await request({ url: "/goods/qsearch", data: { query } });
        // console.log(res);
        this.setData({
            goods: res
        })
    },
    handleCancel() {
        this.setData({
            inputValue: "",
            isFocus: false,
            goods: []
        })
    }
})