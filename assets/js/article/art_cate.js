$(function () {
  let layer = layui.layer
  initArtCateList()

  // 获取文章类别管理数据
  function initArtCateList() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res)
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  let indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      title: '添加分类'
      , type: 1
      , area: ['500px', '250px']
      , content: $('#dialog-add').html()
    });
  })


  // 为添加按钮添加监听事件  请求添加分类接口  重新渲染数据
  $('body').on('submit', '#form_add', function (e) {
    e.preventDefault()
    // 新增分类接口
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败')
        }
        initArtCateList()
        return layer.msg('新增分类成功')
      }
    })
    layui.layer.close(indexAdd)
  })
  // 编辑按钮绑定事件 代理的形式
  let indexEdit = null
  $('tbody').on('click', '#btn-edit', function (e) {
    // 弹出一个修改层
    indexEdit = layer.open({
      title: '修改分类'
      , type: 1
      , area: ['500px', '250px']
      , content: $('#dialog-edit').html()
    });


    // 将已有的分类信息添加到表格里面
    let id = $(this).attr('data-id')

    console.log(id)
    let form = layui.form
    $.ajax({
      method:'GET',
      url:'/my/article/cates/' + id,
      success:function(res){
        // console.log(res);
        //修改获取之前的值
        form.val('form-edit',res.data)
      }
    })

  })

  // 通过代理方式 ，为确认添加按钮添加事件监听
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
      // console.log(res)
      $.ajax({
      method:'POST',
       url:'/my/article/updatecate',
       data:$(this).serialize(),
       success:function(res){
        console.log(res)
        if(res.status !== 0){
          return layer.msg('修改分类数据失败')
        }
        layer.msg('修改分类数据成功')
        initArtCateList()
        
       }
      })
      layui.layer.close(indexEdit) 
  })
  

  // 删除按钮绑定事件

  $('tbody').on('click', '#btn-delete', function (e) {
     e.preventDefault()
    let id = $(this).attr('data-id')
    console.log(id)
    layer.confirm('是否删除分类?', {icon: 3, title:'删除'}, function(index){
      $.ajax({
        type:'GET',
        url:'/my/article/deletecate/' + id,
        success:function(res){
          if(res.status !== 0){
            return layui.layer.msg('删除失败')
          }
          layui.layer.msg('删除成功')
          initArtCateList()
        }
      })
      layer.close(index);
    });
  })

})