var webpack=require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
//定义文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src/js');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    // 配置生成Source Maps，选择合适的选项
    // 开发环境建议使用：cheap-module-eval-source-map；
    // 生产环境建议使用：cheap-module-source-map
    // cheap-module-eval-source-map方法构建速度更快，但是不利于调试，推荐在大型项目考虑da时间成本时使用。
    devtool: 'cheap-module-source-map',
    //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
    entry: {
        index:'./src/js/index.js',
        next:'./src/js/next.js'
    },
    output:{
        //path参数表示生成文件的根目录
        path:BUILD_PATH,
        filename:'js/[name].js?[chunkhash:5]',
        publicPath: "./"
    },
    plugins:[
        new ExtractTextPlugin({
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
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false//压缩JS
            }
        }),
        new webpack.DefinePlugin({
            webpackScene:JSON.stringify('pro'),
            API_url: JSON.stringify("http://localhost:8080/")//JS内的后台接口域名
        }),
        new webpack.ProvidePlugin({
            $: 'zepto-webpack'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: "js/commons.js?[chunkhash:5]"
        }),
        new CleanWebpackPlugin('dist')
        /*new webpack.ProvidePlugin({
            $: 'jquery'
        }),//这个可以使jquery变成全局变量，不用在自己文件require('jquery')了
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')//这是第三方库打包生成的文件*/
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules'),
                use: {
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
                                sourceMap:false,
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
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:1,
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