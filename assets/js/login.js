$(function() {
    //1.点击事件
    $("#link_reg").on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $("#link_login").on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //2.登录表单验证
    var form = layui.form;
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //确认密码验证
        repwd: function(value) {
            var pwd = $('.reg-box input[name=password]').val();
            if (pwd !== value) {
                return "两次输入密码不一致"
            }
        }

    })

    //3.注册功能
    var layer = layui.layer;
    $('#form_reg').on('submit', function(e) {
        //阻止默认提交行为
        e.preventDefault();
        //post
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                };

                layer.msg('注册成功，请登录');
                $("#link_login").click();
            }
        })
    });

    //4.
    $("#form_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                };
                layer.msg('登录成功');
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})