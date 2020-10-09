//登录
var baseurl = 'http://ajax.frontend.itheima.net';
//生产
// var baseurl = 'http://ajax.frontend.itheima.net';
//测试
// var baseurl = 'http://ajax.frontend.itheima.net';

//拦截所有ajax\post\get请求
//配置参数
$.ajaxPrefilter(function(options) {
    //2.为以/my/开头的Ajax请求设置头信息
    options.headers = {
        Authorization: localStorage.getItem('token') || '',
    }

    //1.拼接url地址
    // alert(options.url)
    options.url = baseurl + options.url;
    // alert(options.url)

    //3.拦截所有响应，判断身份认证信息
    //无论成功或失败，都要调用这个回调函数
    options.complete = function(res) {
        // console.log(res);
        if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
            localStorage.removeItem('token');
            location.href = '/login.html'
        }
    }
})