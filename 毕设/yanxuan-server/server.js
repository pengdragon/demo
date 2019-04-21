const express = require('express');
const api = require('./api');
const fetchp = require('axios')
const url = require('url');
const { JSDOM } = require("jsdom");
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const Mock = require('mockjs');
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})


app.use(bodyParser());
//将数据送往数据库
app.post('/api/send/databases', (req, res) => {
    console.log(666)
    let data = req.body;
    console.log(data)
    fetchp
        .post(
            "http://localhost:8888/back-stage-management/server/php/register.php",
            data
        )
    res.json({
        message: 'ok',
        status: 200,
        data: null
    })
})
//获取商品数据库
app.get('/api/get/databases', (req, response) => {
    console.log('获取数据库')
    fetchp
        .get("http://localhost:8888/back-stage-management/server/php/selecte_show.php")
        .then(res => {
            console.log('成功获取数据库')
            console.log(res.data)
            response.json({
                message: 'ok',
                status: 0,
                data: {

                    data: res.data
                }
            })

        })



})
app.post(api.REGIESTER_URL, (req, res) => {
    console.log('得到注册请求')
    let { username, password } = req.body;
    if (username && password) {
        //注册
        let userData = require('./data/user.json');

        let index = userData.findIndex(item => {
            return item.username === username
        })
        if (index >= 0) {
            res.json({
                message: '该用户已存在',
                status: 2,
                data: null
            })
        } else {
            userInfo = Mock.mock({
                username,
                password,
                'headerImg|1': require('./data/imgs.json').headerImgs
            })
            userData.push(userInfo);
            fs.writeFileSync('./data/user.json', JSON.stringify(userData), () => { });
            //注册数据库
            let data = { user: username, password: password }
            console.log('开始注册数据库')

            fetchp.post('http://localhost:8888/server/php/register.php', data).then(res => {
                console.log('数据库注册结束')
            })
            res.json({
                message: '注册成功',
                status: 0,
                data: null
            })
        }
    }
    else {
        res.json({
            message: '参数不能为空',
            status: 1,
            data: null
        })
    }
})

app.post(api.LOGIN_URL, (req, res) => {
    let { username, password } = req.body;
    if (username && password) {
        let userData = require('./data/user.json');
        let user = userData.find(item => {
            return item.username == username && item.password == password;
        })
        if (user) {
            user.token = 'fajldkfjouy312uhayf787fasfgbh';
            res.json({
                status: 0,
                message: 'ok',
                data: user
            });
        } else {
            res.json({
                status: 2,
                message: '用户名或密码错误',
                data: null
            });
        }
    } else {
        res.json({
            message: '参数不能为空',
            status: 1,
            data: null
        })
    }
})

/*
商品总数
*/
app.get(api.GOODS_TOTAL_URL, (req, res) => {
    console.log('pl')
    // axios.get('http://m.you.163.com/xhr/search/getTotalNumbersOfProducts.json')
    //     .then(response => {


    //         let cateList = JSON.stringify({
    //             status: 0,
    //             message: 'ok',
    //             data: {
    //                 total: response.data.data
    //             }
    //         })

    //         // 将获取的数据存储下来
    //         fs.writeFile('data/ total.json', cateList, err => {
    //         })
    //         res.json({
    //             message: 'ok',
    //             status: 0,
    //             data: {
    //                 total: response.data.data
    //             }
    //         })
    //     })
    fs.readFile('data/total.json', 'utf-8', (err, data) => {
        console.log('test')
        res.json(data)
        // if (err) { throw err }
        // else {
        //     console.log('读取成功');
        //     console.log(data);
        //     res.json(JSON.parse(data))
        // }
    })
})

//分类列表
app.get(api.CATE_LIST_URL, (req, res) => {
    // JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
    // let cateList = JSON.stringify({
    //     status: 0,
    //     message: 'ok',
    //     data: dom.window.cateList
    // })

    // 将获取的数据存储下来
    // fs.writeFile('data/cateList.json', cateList, err => {
    // })
    // 读取文件
    console.log('得到请求')
    fs.readFile('data/cateList.json', 'utf-8', (err, data) => {
        if (err) throw err;
        else {
            console.log('读取成功');
            //console.log(data);
            res.json(JSON.parse(data))
        }
    })
    // res.json({
    //     status: 0,
    //     message: 'ok',
    //     data: dom.window.cateList
    // });

});

// 首页轮播图数据
app.get(api.HOME_BANNER_LIST_URL, (req, res) => {
    console.log('得到请求')
    // JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
    //     let cateList = JSON.stringify({
    //         status: 0,
    //         message: 'ok',
    //         data: dom.window.jsonData.focusList
    //     })

    //     // 将获取的数据存储下来
    //     fs.writeFile('data/focusList.json', cateList, err => {
    //     })


    //     res.json({
    //         status: 0,
    //         message: 'ok',
    //         data: dom.window.jsonData.focusList
    //     });
    // });
    //读取文件
    fs.readFile('data/focusList.json', 'utf-8', (err, data) => {
        if (err) { throw err }
        else {
            console.log('读取成功');
            console.log(data);
            res.json(JSON.parse(data))
        }
    })
})

// 网易严选协议
app.get(api.POLICY_LIST_URL, (req, res) => {
    // JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
    //     let cateList = JSON.stringify({
    //         status: 0,
    //         message: 'ok',
    //         data: dom.window.jsonData.policyDescList
    //     })

    //     // 将获取的数据存储下来
    //     fs.writeFile('data/policyDescList.json', cateList, err => {
    //     })
    //     res.json({
    //         status: 0,
    //         message: 'ok',
    //         data: dom.window.jsonData.policyDescList
    //     });
    // });
    fs.readFile('data/policyDescList.json', 'utf-8', (err, data) => {
        if (err) { throw err }
        else {
            console.log('读取成功');
            console.log(data);
            res.json(JSON.parse(data))
        }
    })
})

// 首页分类列表
app.get(api.HOME_CATE_LIST_URL, (req, res) => {
    // JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
    //     let cateList = JSON.stringify({
    //         status: 0,
    //         message: 'ok',
    //         data: dom.window.jsonData.kingKongModule
    //     })
    //     // 将获取的数据存储下来
    //     fs.writeFile('data/kingKongModule.json', cateList, err => {
    //     })
    //     res.json({
    //         status: 0,
    //         message: 'ok',
    //         data: dom.window.jsonData.kingKongModule
    //     });
    // });
    fs.readFile('data/kingKongModule.json', 'utf-8', (err, data) => {
        if (err) { throw err }
        else {
            console.log('读取成功');
            console.log(data);
            res.json(JSON.parse(data))
        }
    })
})

// 首页活动
// app.get(api.HOME_ACTIVITY_URL, (req, res) => {
//     JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
//         let cateList = JSON.stringify({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.bigPromotionModule
//         })
//         // 将获取的数据存储下来
//         fs.writeFile('data/bigPromotionModule.json', cateList, err => {
//         })
//         res.json({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.bigPromotionModule
//         });
//     });
// })

//品牌制造商直供
// app.get(api.HOME_TAG_LIST_URL, (req, res) => {
//     console.log(8)
//     JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
//         let cateList = JSON.stringify({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.tagList
//         })
//         // 将获取的数据存储下来
//         fs.writeFile('data/tagList.json', cateList, err => {
//         })
//         res.json({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.tagList
//         });
//     });
// })

//类目热销榜
app.get(api.HOME_CATE_HOT_SELL_URL, (req, res) => {
    JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
        res.json({
            status: 0,
            message: 'ok',
            data: dom.window.jsonData.categoryHotSellModule
        });
    });
})

// 人气推荐
// app.get(api.HOME_POPULAR_LIST_URL, (req, res) => {
//     JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
//         let cateList = JSON.stringify({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.popularItemList
//         })
//         // 将获取的数据存储下来
//         fs.writeFile('data/popularItemList.json', cateList, err => {
//         })
//         res.json({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.popularItemList
//         });
//     });
// })

// 限时购
// app.get(api.HOME_FLASH_SALE_URL, (req, res) => {
//     JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
//         let cateList = JSON.stringify({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.flashSaleModule
//         })
//         // 将获取的数据存储下来
//         fs.writeFile('data/flashSaleModule.json', cateList, err => {
//         })
//         res.json({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.flashSaleModule
//         });
//     });
// })

// 新品首发
// app.get(api.HOME_NEW_ITEM_URL, (req, res) => {
//     JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
//         let cateList = JSON.stringify({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.newItemList
//         })
//         // 将获取的数据存储下来
//         fs.writeFile('data/newItemList.json', cateList, err => {
//         })
//         res.json({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.newItemList
//         });
//     });
// })

// 购物指南
// app.get(api.HOME_SHOPPING_GUIDE_URL, (req, res) => {
//     JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
//         let cateList = JSON.stringify({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.sceneLightShoppingGuideModule
//         })
//         // 将获取的数据存储下来
//         fs.writeFile('data/sceneLightShoppingGuideModule.json', cateList, err => {
//         })
//         res.json({
//             status: 0,
//             message: 'ok',
//             data: dom.window.jsonData.sceneLightShoppingGuideModule
//         });
//     });
// })

// 推荐列表
app.get(api.HOME_TOP_CATELIST_URL, (req, res) => {
    // JSDOM.fromURL("http://m.you.163.com/", { runScripts: 'dangerously' }).then(dom => {
    //     let cateList = JSON.stringify({
    //         status: 0,
    //         message: 'ok',
    //         data: dom.window.jsonData.categoryModule
    //     })
    //     // 将获取的数据存储下来
    //     fs.writeFile('data/categoryModule.json', cateList, err => {
    //     })
    //     res.json({
    //         status: 0,
    //         message: 'ok',
    //         data: dom.window.jsonData.categoryModule
    //     });
    // });
    fs.readFile('data/categoryModule.json', 'utf-8', (err, data) => {
        if (err) { throw err }
        else {
            console.log('读取成功');
            console.log(data);
            res.json(JSON.parse(data))
        }
    })
})

// 分类列表数
app.get(api.HOME_CATE_ITEM_LIST_URL, (req, res) => {
    let { id } = url.parse(req.url, true).query;
    if (!id) {
        res.json({
            status: 1,
            message: '缺少参数',
            data: null
        });
        return;
    }

    JSDOM.fromURL("http://m.you.163.com/item/list?categoryId=" + id, { runScripts: 'dangerously' }).then(dom => {
        let cateList = JSON.stringify({
            status: 0,
            message: 'ok',
            data: {
                categoryItemList: dom.window.jsonData.categoryItemList,
                currentCategory: dom.window.jsonData.currentCategory
            }
        })
        // 将获取的数据存储下来
        fs.writeFile('data/categoryItemList.json', cateList, err => {
        })
        res.json({
            status: 0,
            message: 'ok',
            data: {
                categoryItemList: dom.window.jsonData.categoryItemList,
                currentCategory: dom.window.jsonData.currentCategory
            }
        });
    });
    // fs.readFile('data/categoryItemList.json', 'utf-8', (err, data) => {
    //     if (err) { throw err }
    //     else {
    //         console.log('读取成功');
    //         console.log(data);
    //         res.json(JSON.parse(data))
    //     }
    // })
})

// 商品详情 
app.get(api.ITEM_DETAIL_URL, (req, res) => {
    let { id } = url.parse(req.url, true).query;
    if (!id) {
        res.json({
            status: 1,
            message: '缺少参数',
            data: null
        });
        return;
    }

    JSDOM.fromURL("http://m.you.163.com/item/detail?id=" + id, { runScripts: 'dangerously' }).then(dom => {
        let cateList = JSON.stringify({
            status: 0,
            message: 'ok',
            data: dom.window.jsonData
        })
        // 将获取的数据存储下来
        fs.writeFile('data/jsonData.json', cateList, err => {
        })
        res.json({
            status: 0,
            message: 'ok',
            data: dom.window.jsonData
        });
    });
    // fs.readFile('data/jsonData.json', 'utf-8', (err, data) => {
    //     if (err) { throw err }
    //     else {
    //         console.log('读取成功');
    //         console.log(data);
    //         res.json(JSON.parse(data))
    //     }
    // })
})

//分类
app.get(api.CATEGOEY_LIST_URL, (req, res) => {
    // JSDOM.fromURL('http://m.you.163.com/item/cateList', { runScripts: 'dangerously' }).then(dom => {
    //     let cateList = JSON.stringify({
    //         status: 0,
    //         message: 'ok',
    //         data: dom.window.ftlData.categoryL1List
    //     })
    //     // 将获取的数据存储下来
    //     fs.writeFile('data/categoryL1List.json', cateList, err => {
    //     })
    //     res.json({
    //         status: 0,
    //         message: 'ok',
    //         data: dom.window.ftlData.categoryL1List
    //     })
    // })
    fs.readFile('data/categoryL1List.json', 'utf-8', (err, data) => {
        if (err) { throw err }
        else {
            console.log('读取成功');
            console.log(data);
            res.json(JSON.parse(data))
        }
    })
})

//分类页面分类列表
app.get(api.CATEGOEY_LIST_GROUP_URL, (req, res) => {
    let categoryId = url.parse(req.url, true).query.categoryId || '1022001';

    JSDOM.fromURL('http://m.you.163.com/item/cateList?categoryId=' + categoryId, { runScripts: 'dangerously' }).then(dom => {
        let cateList = JSON.stringify({
            status: 0,
            message: 'ok',
            data: {
                categoryGroupList: dom.window.ftlData.categoryGroupList,
                currentCategory: dom.window.ftlData.currentCategory
            }
        })
        // 将获取的数据存储下来
        fs.writeFile('data/categoryGroupList.json', cateList, err => {
        })
        res.json({
            status: 0,
            message: 'ok',
            data: {
                categoryGroupList: dom.window.ftlData.categoryGroupList,
                currentCategory: dom.window.ftlData.currentCategory
            }
        })
    })
})

// 分类商品列表
app.get(api.CATEGOEY_LIST_GROUP_ITEM_URL, (req, res) => {
    let { categoryId, subCategoryId } = url.parse(req.url, true).query;
    if (!categoryId || !subCategoryId) {
        res.json({
            status: 1,
            message: '缺少参数',
            data: null
        });
        return;
    }

    JSDOM.fromURL('http://m.you.163.com/item/list?categoryId=' + categoryId + '&subCategoryId=' + subCategoryId, { runScripts: 'dangerously' }).then(dom => {
        let cateList = JSON.stringify({
            status: 0,
            message: 'ok',
            data: dom.window.ftlData.categoryItems
        })
        // 将获取的数据存储下来
        fs.writeFile('data/categoryItems.json', cateList, err => {
        })
        res.json({
            status: 0,
            message: 'ok',
            data: dom.window.ftlData.categoryItems
        })
    })
})

// 识物tab数据
app.get(api.TOPIC_FIND_TABS_URL, (req, res) => {
    axios.get('http://m.you.163.com/topic/v1/find/getTabs.json')
        .then(response => {
            res.json({
                status: 0,
                message: 'ok',
                data: response.data.data
            })
        })
})

// 识物tab列表数据
// 参数：tabId 默认值为9
app.get(api.TOPIC_FIND_TAB_DATA_URL, (req, res) => {
    let tabId = url.parse(req.url, true).query.tabId || 9;
    //推荐
    if (tabId == 9) {
        axios.get('http://m.you.163.com/topic/v1/find/recManual.json')
            .then(response => {
                let arr = response.data.data;
                let newData = [];
                arr.map(({ topics }) => {
                    newData = [...newData, ...topics];
                })
                res.json({
                    status: 0,
                    message: 'ok',
                    data: {
                        hasMore: false,
                        result: newData
                    }
                })
            })
    }
    //达人   上新   home
    else if (tabId == 4 || tabId == 5 || tabId == 6) {
        let { page, size } = url.parse(req.url, true).query;
        axios.get('http://m.you.163.com/topic/v1/find/getTabData.json', {
            params: {
                page,
                size,
                tabId
            }
        }).then(response => {
            res.json({
                status: 0,
                message: 'ok',
                data: response.data.data
            })
        })
    }
    else {
        res.json({
            message: 'id错误',
            status: 1,
            data: null
        })
    }
})

// 识物tab晒单banner数据
app.get(api.TOPIC_FIND_SHOW_BANNER_URL, (req, res) => {
    axios.get('https://m.you.163.com/topic/v1/look/getCollection.json?id=39')
        .then(response => {
            res.json({
                message: 'ok',
                status: 0,
                data: response.data.data
            })
        })
})

// 识物tab晒单列表数据
app.get(api.TOPIC_FIND_SHOW_DATA_URL, (req, res) => {
    let { page, size, type } = url.parse(req.url, true).query;
    if (!page || !size || !type) {
        res.json({
            message: '缺少参数',
            status: 1,
            data: null
        })
        return;
    }
    if (type != 1 && type != 2 && type != 3) {
        res.json({
            message: 'type参数不正确',
            status: 2,
            data: null
        })
        return;
    }

    axios.get('https://m.you.163.com/topic/v1/look/getList.json', {
        params: {
            page,
            size,
            type
        }
    })
        .then(response => {
            res.json({
                message: 'ok',
                status: 0,
                data: response.data.data
            })
        })
})


// 部署前端页面到服务器上

//设置静态资源
app.use('/css', express.static('./www/css'));
app.use('/js', express.static('./www/js'));
app.use('/images', express.static('./www/images'));

// 请求服务器‘/’,显示首页
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/www/index.html');
});

// 其他路径请求，还是响应index页面
app.use('/', (req, res) => {
    res.sendFile(__dirname + '/www/index.html');
})



app.listen('9099', 'localhost', (error) => {
    if (error) {
        console.log('启动失败');
        console.log(error);
    } else {
        console.log('启动成功');
    }
});