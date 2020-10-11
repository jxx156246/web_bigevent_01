$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initcate();
    // 初始化富文本编辑器
    initEditor()

    function initcate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                };
                var htmlstr = template('tpl-pub', res);
                $('[name=cate_id]').html(htmlstr);
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);


    // 上传图片
    $('.btnchooseimg').on('click', function() {
        $('#coverfile').click();
    })
    $('#coverfile').on('change', function(e) {
        //1.拿到用户选择的文件
        var file = e.target.files[0];
        //2.判断
        if (file == undefined) {
            return layer.msg('请选择文件后再上传')
        };
        //3.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        //4.先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });


    //定义新增文章状态
    var art_state = '已发布';

    //点击存为草稿按钮时改变状态
    $("#btnsave2").on('click', function() {
        art_state = '草稿';
    });

    // 发布新文章
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // console.log(...fd);
                publisharticle(fd)
            })
    })

    // 
    function publisharticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                };
                layer.msg('文章发布成功，跳转页面中···');
                window.parent.document.querySelector('#art_list').click();
            }
        })
    }

})