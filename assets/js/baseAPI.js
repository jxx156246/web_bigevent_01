//登录
var baseurl = 'http://ajax.frontend.itheima.net';
//生产
// var baseurl = 'http://ajax.frontend.itheima.net';
//测试
// var baseurl = 'http://ajax.frontend.itheima.net';

//拦截所有ajax\post\get请求
//配置参数
$.ajaxPrefilter(function(options) {
    alert(options.url)
    options.url = baseurl + options.url;
    alert(options.url)
})