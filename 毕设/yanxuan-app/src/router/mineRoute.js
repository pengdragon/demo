export default {
    path: '/mine',
    component: () => import('@pages/mine/index'),
    children: [
        {
            path: 'noFind',
            component: () => import('@pages/mine/404'),
        }
    ]
}