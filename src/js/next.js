import '../css/public.css'
import '../css/next.css'

//开发模式需要引入webpack-dev-server.js来实现实时更新，其他模式无需加载
if(webpackScene=='dev'){
    var webpackDevServerJs=document.createElement('script');
    webpackDevServerJs.src="/webpack-dev-server.js";
    document.head.appendChild(webpackDevServerJs);
}



let console=require('./modules/next')
