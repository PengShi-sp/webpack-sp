"use strict";

const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
// const webpackConfig = require("./webpack-dev-server-master/examples/bonjour/webpack.config.js");
const webpackConfig = require("./webpack-dev.config.js");
const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
    inline: true,
    // hot: true,
    stats: {
        colors: true
    },
    disableHostCheck: true,
    proxy: {
        //代理部分，方便开发环境跨域请求接口
        '/api/*': {
            target:'https://www.baidu.com',
            secure: false,// 接受 运行在 https 上的服务
            changeOrigin: true//允许跨域，必不可少
        }
    }
});

server.listen(8080 , function() {
    console.log("启动中，这玩意初次启动贼慢多等会，好了根据自己的页面访问 http://localhost:8080");
});