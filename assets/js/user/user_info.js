$(function() {
    //1.校验昵称
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度在1~6个字符之间'
            }
        }
    })

    //2.获取用户信息
    inituserinfo();
    var layer = layui.layer;

    function inituserinfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                };
                // 成功后，渲染
                //快速表单赋值
                form.val('formuserinfo', res.data)
            }
        })
    }

    // 重置按钮绑定事件
    //为什么阻止重置按钮的重置行为：会将页面重置到HTML默认value值
    $('#resetbtn').on('click', function(e) {
        e.preventDefault(); //阻止重置
        inituserinfo();
    })


    //
    $(".layui-form").on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功');
                // 调用父框架的获取信息和头像的方法
                window.parent.getUserInfo();
            }
        })
    })
})