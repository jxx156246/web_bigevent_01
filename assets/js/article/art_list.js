$(function() {
    // 时间过滤器
    template.defaults.imports.dateFormat = function(dtStr) {
        var dt = new Date(dtStr);
        var y = dt.getFullYear();
        var m = zero(dt.getMonth() + 1);
        var d = zero(dt.getDate());

        var hh = zero(dt.getHours());
        var mm = zero(dt.getMinutes());
        var ss = zero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    };
    // 补零
    function zero(n) {
        return n < 9 ? '0' + n : n;
    }
    var layer = layui.layer;
    var form = layui.form
    var q = {
        pagenum: 1, //页码值,第一页
        pagesize: 2, //每页显示多少条数据，每页2条数据
        cate_id: '', //文章分类的 Id
        state: '', //文章的状态，可选值有：已发布、草稿
    };

    // 渲染数据
    inittable()

    function inittable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlstr = template('tpl-list', res);
                $('tbody').html(htmlstr);
                renderpage(res.total)
            }
        })
    }

    // 渲染类别数据
    initcate()

    function initcate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var str = template('tpl-cate', res);
                $('[name=cate_id]').html(str);
                form.render() //重新渲染layui
            }

        })
    }

    // 筛选表单
    $('#form-select').on('submit', function(e) {
        e.preventDefault();
        // 获取
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 重新渲染
        inittable()
    })

    //分页函数
    var laypage = layui.laypage;

    function renderpage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的是ID,不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义排版
            limits: [2, 5, 8, 10], //每页条数的选择项
            //当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
            jump: function(obj, first) {
                console.log(obj);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //判断如果不是初始加载，就调用
                if (!first) {
                    inittable()
                }
            }
        });
    }

    // 删除，代理函数
    $('tbody').on('click', '.btn-delete', function() {
        //获取id
        var id = $(this).attr('data-id');
        //询问框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功');
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    inittable();
                    layer.close(index);
                }
            })
        });
    })


})