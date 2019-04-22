// 初始化状态
const initState = {
  homeInfo: {},
  dataList: []
};

export function home(state = initState, action) {
  switch (action.type) {
    case 'RECEIVE_HOME':
      return {
        ...state,
        homeInfo: action.homeInfo
      };
    case 'RECEIVE_FETCHDEMO':
      return {
        ...state,
        dataList: action.dataList
      };
    default:
      return { ...state };
  }
};
