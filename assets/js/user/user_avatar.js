$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);
    // 2.修改图片
    //2.1点击事件
    $('#btnChooseImage').on('click', function() {
        $("#file").click()
    });
    // 2.2图片上传

    $('#file').on('change', function(e) {
        var files = e.target.files;
        if (files.length === 0) {
            return layui.layer.msg('请选择图片上传')
        };
        // 1. 拿到用户选择的文件
        var file = e.target.files[0];
        // 2. 根据选择的文件， 创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 3. 先销毁旧的裁剪区域， 再重新设置图片路径， 之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    //3.上传头像
    $("#btnUpload").on('click', function() {
        //3.1获取头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //3.2上传
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('头像更新失败')
                };
                layui.layer.msg('头像更新成功');
                window.parent.getuserinfo();
            }
        })
    });
    //4.更换图片
    getUserInfo()

    function getUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                };
                //  先销毁旧的裁剪区域， 再重新设置图片路径， 之后再创建新的裁剪区域：
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', res.data.user_pic) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域 
            }
        })
    };

})