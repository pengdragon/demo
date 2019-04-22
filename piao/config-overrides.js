const path = require('path');

const rewireLess = require('react-app-rewire-less');

/**
 * config 是当前的webpack 配置，我们只需要对其修改之后，return 出去，就能实现重写的功能
 * env 是当前的环境， 开发环境or生产环境
 * npm start => env development
 * npm build => env 颇大哥特
 */
module.exports = function (config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, './src'),
    'components': path.resolve(__dirname, './src/components')
  }

  // 处理 less
  config = rewireLess(config, env);

  console.log(config);

  // 记住要将 config 给 return 出去
  return config;
}
