import { fetchGet, fetchPost } from 'fetch'
import API from 'API'

const state = {

    orderList: JSON.parse(localStorage.getItem('order')) || []
};


const mutations = {
    // 添加商品
    addGoods(state, params) {
        localStorage.setItem('order', JSON.stringify(params))
        state.orderList = JSON.parse(localStorage.getItem('order'));

    }
}
const actions = {


}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}