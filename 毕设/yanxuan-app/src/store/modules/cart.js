import { fetchGet, fetchPost } from 'fetch'
import API from 'API'

const state = {
    // 项目调用购物车数据之前，需要对cartList进行初始化
    // 登录了：从后台购物车的初始数据
    // 没有登录：从本地取得购物车的初始数据
    //cartList: JSON.parse(localStorage.getItem('cartData') || '[]')
    cartList: []
};

// 判断用户是否登录
// 没有登录，之后每一次的购物车数据操作完，都要将购物车数据进行本地持久化
// 登录了，之后每一次的购物车数据操作完，都要将购物车数据提交给后台
const mutations = {
    setGetGoods(state, params) {
        console.log(66666)
        state.cartList = params;
        localStorage.setItem('cartData', JSON.stringify(params));

    },
    // 添加商品
    addGoods(state, params) {
        //判断该商品是否存在
        let index = state.cartList.findIndex(item => {
            return item.id == params.id
        });
        if (index >= 0) {
            //存在
            state.cartList[index].count += 1;
        } else {
            //不存在
            params.count = 1;
            params.selected = true;
            state.cartList.push(params);
            let data = {
                title: params.name,
                price: params.price,
                count: 1
            }
            ///////////
            fetchPost('/api/send/databases', data).then(res => {
                console.log('成功')
            }).catch(err => {
                console.log('失败')
            })
        }

        // localStorage.setItem('cartData', JSON.stringify(state.cartList));
    },
    // 移除商品
    removeGoods(state, params) {
        state.cartList = state.cartList.filter(item => {
            // 过滤如果return true 就讲其过滤掉
            return item.id != params.id;
        })
        // 移除之后在本地进行更新
        localStorage.setItem('cartData', JSON.stringify(state.cartList));
    },
    // 选中或取消选中商品
    selectGoods(state, params) {
        let index = state.cartList.findIndex(item => {
            return item.id == params.id;
        })
        if (index >= 0) {
            // 选中商品时，全局中就得设置selected为反
            state.cartList[index].selected = !params.selected;
        }

        localStorage.setItem('cartData', JSON.stringify(state.cartList));

    },
    // 设置商品数据
    setCount(state, params) {
        let index = state.cartList.findIndex(item => {
            return item.id == params.item.id
        });
        if (index >= 0) {
            state.cartList[index].count = params.count;
        }

        localStorage.setItem('cartData', JSON.stringify(state.cartList));
    }
}
const actions = {
    //向阿帕奇数据库注册数据
    async setGoods(store, params) {
        let data = await fetchPost('/api/send/databases', params);
    },
    //从阿帕奇数据库获取商品数据
    async getGoods(store, params) {
        console.log('我日你妈逼')
        let data = await fetchGet('/api/get/databases');
        data = data.data.map(item => {
            return {
                name: item[1],
                price: item[2],
                count: item[3],
                img: item[4],
                selected: false
            }
        })
        store.commit("setGetGoods", data)
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}