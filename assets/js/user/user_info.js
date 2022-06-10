$(function(){
  let form = layui.form
  form.verify({
    nickname:function(value){
      if(value.length > 6){
        return '昵称长度必须在1-6个字符之间'
      }
    }
  })
  initUserInfo()
  //初始化用户的基本信息
  function initUserInfo(){
    $.ajax({
      type:'GET',
      url:'/my/userinfo',
      success:function(res){
        if(res.status !== 0){
          return layui.layer.msg('获取用户信息失败')
        }
        // console.log('okok')
        //调用form.val('filter', object) 方法、
        console.log(form.val('formUserInfo'))
        console.log(res.data)
        layui.form.val('formUserInfo',res.data)
      
      }
    })
  }

  //重置功能
  $('#btnReset').on('click',function(e){
    // 阻止重置行为
     e.preventDefault()
     initUserInfo()
  })
  
  // 监听表单的提交事件，提交修改功能
  $('.layui-form').on('submit',function(e){
     e.preventDefault()
     // 发起ajax请求
     $.ajax({
       type:'POST',
       url:'/my/userinfo',
       data:$(this).serialize(),
       success:function(res){
         if(res.status !== 0){
           return layer.msg('更新用户信息失败')
         }
         layer.msg('更新用户信息成功')
         // 在子页面里面调用父页面的方法渲染用户信息
         window.parent.getUserInfo()
       }
     })
  })

})