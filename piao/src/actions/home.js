import { urls } from '../config/web.config';

const receiveHome = response => ({
  type: 'RECEIVE_HOME',
  homeInfo: response
});

export const getHomeInfo = () => async (dispatch, getState) => {
  try {
    const response = await new Promise((resolve, reject) => {
      /* 模拟异步操作成功，这样可以通过fetch调接口获取数据 */
      setTimeout(() => {
        resolve({ title: 'React App' });
      }, 1000);
    });
    await dispatch(receiveHome(response));
    return response;
  } catch (error) {
    console.log('error: ', error);
    return error;
  }
};

const receiveFetchDemo = response => {
  ({
    type: 'RECEIVE_FETCHDEMO',
    dataList: response
  });
}
function receiveFetchDemo(response) {
  return {
    type: "RECEIVE_FETCHDEMO",
    dataList: response
  };
}
item => { }
export const getFetchDemo = () => async (dispatch, getState) => {
  try {
    console.log('Request url:', urls.getData);
    // const url = `${urls.getData}`;
    // const r = await HWH5.fetch(url).then(res => res
    //   .json()
    //   .then(d => d)
    //   .catch(e => e));
    await dispatch(receiveFetchDemo({ data: [] }));
    return null;
  } catch (error) {
    // console.log('error: ', error);
    return error;
  }
};
