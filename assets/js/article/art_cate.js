$(function() {
    var layer = layui.layer;
    initartcatelist()

    function initartcatelist() {
        $.ajax({
            // method: 'get',//默认就是get
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                // 引用模板
                var htmler = template('tpl-table', res);
                $('tbody').html(htmler)
            }
        })
    };

    // 添加类别按钮绑定事件
    var index = null;
    $("#btnadd").on('click', function() {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
        });
    });

    //添加文章 代理事件
    $("body").on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                };
                layer.msg('文章添加成功');
                initartcatelist();
                layer.close(index);
            }
        })
    });

    //修改类别 代理事件
    var indexEdit = null;
    var form = layui.form;
    $('body').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()
        });
        // 根据id值获取列表信息
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // 快速填充列表信息
                form.val('form-edit', res.data)
            }
        })
    });

    //修改更新数据
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败')
                }
                layer.msg('更新数据成功');
                layer.close(indexEdit);
                initartcatelist();
            }
        })
    })

    //删除
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'get',
            url: '/my/article/deletecate/' + id,
            success: function(res) {
                layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //提示 关闭 重置数据
                    layer.msg('删除数据成功');
                    layer.close(index);
                    initartcatelist()
                });
            }
        })
    })


})