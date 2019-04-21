export default {
    path: '/cart',
    component: () => import('@pages/cart/index'),

    children: [
        {
            path: 'addresseidt',
            component: () => import('@pages/common/address-edit.vue'),
            beforeEnter: (to, from, next) => {
                console.log('独享守卫执行了')
                next()
            },

        },
        {
            path: 'order',
            component: () => import('@pages/common/order.vue'),
        }
    ]

}