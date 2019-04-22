const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const requireJSON = function (filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};
const babelrc = requireJSON('./.babelrc');

const babelOptions = Object.assign({}, babelrc, { cacheDirectory: true });

// 判断当前wepback运行环境是否为Debug模式
const DEBUG = process.argv.includes('start')
  || (!process.argv.includes('prod') && !process.argv.includes('uat'));

// 判断当前运行环境是UAT模式还是生产模式
const { appName, versionCode } = require('@wecode/wlk-cli/lib/tools/lib/plugin');

const VERBOSE = process.argv.includes('verbose');
/*
Node环境变量,只有开发环境和生产环境，涉及react、react-hot-loader等模块的打包
如果在package.json中启动指定环境，则优先使用该环境，win和mac设置node环境变量语法不同，比如开发环境指定生产环境：
mac "start": "export NODE_ENV=production&&babel-node tools/run start"
win "start": "set NODE_ENV=production&&babel-node tools/run start",
*/
let { NODE_ENV } = process.env;
if (NODE_ENV === undefined) {
  NODE_ENV = DEBUG ? 'development' : 'production';
}

// 应用环境变量，包含开发环境，测试环境和生产环境。
const APP_ENV = DEBUG ? 'development' : process.argv.includes('uat') ? 'uat' : 'production';

// public文件夹目录路径，文件将统一复制至项目根目录，`..` 代表往 `html/index.html` 上级目录，即根目录
const publicUrl = '..';

const plugins = [
  // Makes some environment variables available in index.html.
  // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
  // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
  new HtmlWebpackPlugin({
    filename: 'html/index.html',
    title: appName,
    version: Date.now(),
    vconsole: APP_ENV !== 'production',
    inject: true,
    template: '../src/index.html'
  }),
  new InterpolateHtmlPlugin({ NODE_ENV, PUBLIC_URL: publicUrl, APP_ENV }),
  new webpack.DefinePlugin({
    'process.env.APP_ENV': JSON.stringify(
      DEBUG ? 'development' : process.argv.includes('uat') ? 'uat' : 'production'
    )
  })
];

/*
  need to review, HardSourceWebpackPlugin has bugs in build uat/prod
  use it in devServer currently
*/
if (!DEBUG) {
  plugins.push(
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[hash].css'
    })
  );
} else {
  plugins.push(new HardSourceWebpackPlugin());
}

module.exports = {
  mode: DEBUG ? 'development' : process.argv.includes('uat') ? 'none' : 'production',
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: ['./entry']
  },
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },
  output: {
    filename: 'js/[name]-[hash].js',
    path: path.join(__dirname, `build/apps/${appName}/${versionCode}/`),
    publicPath: !DEBUG ? '../' : `/apps/${appName}/${versionCode}/`,
    chunkFilename: 'js/[name]-[hash].js'
  },
  // BASE_URL是全局的api接口访问地址
  plugins,
  // alias是配置全局的路径入口名称，只要涉及到下面配置的文件路径，可以直接用定义的单个字母表示整个路径
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.scss', '.css'],
    modules: [path.resolve(__dirname, 'node_modules'), path.join(__dirname, './src')],
    alias: {
      actions: path.resolve(__dirname, 'src/actions'),
      components: path.resolve(__dirname, 'src/components'),
      routes: path.resolve(__dirname, 'routes'),
      reducers: path.resolve(__dirname, 'src/reducers'),
      utils: path.resolve(__dirname, 'src/utils'),
      i18n: path.resolve(__dirname, 'src/i18n')
    }
  },
  externals: {},
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: babelOptions
        }
      },
      {
        test: /\.(less|css)$/,
        use: [
          !DEBUG ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: ['file-loader?limit=1000&name=assets/images/[md5:hash:base64:10].[ext]']
      }
      // {
      //   test: /(\.jsx|\.js)$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/
      // }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 5,
      automaticNameDelimiter: '~',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(less|css)$/,
          chunks: 'all',
          enforce: true
        },
        vendor: {
          // 基础类库
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    },
    minimize: APP_ENV === 'production',
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      })
    ]
  }
};
