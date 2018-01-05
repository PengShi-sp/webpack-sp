var webpack=require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//定义文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src/js');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var CleanWebpackPlugin = require('clean-webpack-plugin');

//官方插件 webpack.IgnorePlugin 把不想 bundle 的文件排除掉
// var ignoreFiles = new webpack.IgnorePlugin(/\.\/jquery-last.js$/);
module.exports = {
    // 配置生成Source Maps，选择合适的选项
    // 开发环境建议使用：cheap-module-eval-source-map；
    // 生产环境建议使用：cheap-module-source-map
    // cheap-module-eval-source-map方法构建速度更快，但是不利于调试，推荐在大型项目考虑da时间成本时使用。
    devtool: 'cheap-module-eval-source-map',
    //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
    entry: {
        //'webpack-dev-server/client?http://0.0.0.0:8080',//资源服务器地址
        index:'./src/js/index.js',
        next:'./src/js/next.js'
    },
    output:{
        //path参数表示生成文件的根目录
        path:BUILD_PATH,
        filename:'js/[name].js?[chunkhash:5]',
        publicPath: "./"
    },
    devServer:{
        historyApiFallback:true,
        inline:true
    },
    plugins:[
        new ExtractTextPlugin({
            //指定css文件打包目录和文件命名规范
            filename: 'css/[name].css?[contenthash:5]',
            allChunks: true,
        }),
        new HtmlwebpackPlugin({
            filename:'index.html',
            template:path.resolve(SRC_PATH, 'index.html'),
            inject:false,
            minify:{
                minifyCSS: false,
                minifyJS: false,
                //删除模板内注释
                removeComments:true
            }
        }),
        new HtmlwebpackPlugin({
            filename:'next.html',
            template:path.resolve(SRC_PATH, 'next.html'),
            inject:false,
            minify:{
                minifyCSS: false,
                minifyJS: false,
                //删除模板内注释
                removeComments:true
            }
        }),
        new webpack.DefinePlugin({
            //公共变量，提供模块文件和模板文件判断当前打包环境来引用不同文件和变量
            webpackScene:JSON.stringify('dev'),
            API_url: JSON.stringify("http://localhost:8080/")
        }),
        new webpack.ProvidePlugin({
            //使zepto变成全局变量，不用再自己require('zepto')了
            $: 'zepto-webpack'
        }),
        //把所有入口文件的公共代码统一打包成common.js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: "js/commons.js?[chunkhash:5]"
        }),
        //开发模式使用，打包完成自动打开页面
        new OpenBrowserPlugin({ url: 'http://localhost:8080/index.html' })
        /*new webpack.ProvidePlugin({
            $: 'jquery'
        }),//使jquery变成全局变量，不用再自己require('jquery')了
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')//这是第三方库打包生成的文件*/
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                //处理.js文件只包含src目录内的，提高打包速度
                include: path.resolve(__dirname, 'src'),
                //处理.js文件不包含node_modules目录内的，提高打包速度
                exclude: /(node_modules|bower_components)/,
                use: {
                    //使用babel-loader把ES6转码es2015
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.css$/,
                //使用ExtractTextPlugin来处理，postcss-loader进行需要添加浏览器前缀处理
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                minimize: true //css压缩
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer')({broswers:'last 5 versions'})
                                ]
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                //使用url-loader来处理图片小于1k的进行base64转码处理，文件处理到img文件夹内，文件夹+hash前5位.后缀名
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:1024,
                            name:'img/[name].[ext]?[hash:5]'
                        }
                    }
                ]
            }
        ]
    }
}
// module.exports=module.exports;
// export default config;