$(function() {
    getUserInfo();
    //退出功能
    $("#btnlogout").on('click', function() {
        layer.confirm('是否确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function(index) {
            //do something
            //1.删除本地存储token
            localStorage.removeItem('token');
            //2.跳转至登录页面
            location.href = '/login.html';
            //3.layui自己提供的关闭弹出层的功能
            layer.close(index);
        });
    })
});

function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            };
            renderAvatar(res.data) //调用头像函数
        },
        //无论成功或失败，都要调用这个回调函数
        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
        //         localStorage.removeItem('token');
        //         location.href = '/login.html'
        //     }
        // }
    })
};

//封装头像函数
function renderAvatar(user) {
    //1.获取用户名
    var name = user.nickname || user.username;
    //2.渲染文字
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name);
    //3.渲染头像
    var first = name[0].toUpperCase()
    if (user.user_pic !== null) {
        //3.1渲染图片头像
        $(".layui-nav-img").show().prop('src', user.user_pic);
        $(".user-avatar").hide()
    } else {
        //3.2渲染文字头像
        $(".layui-nav-img").hide();
        $(".user-avatar").show().html(first)
    }
}