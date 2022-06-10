$(function(){
    // 调用获取用户信息函数
    getUserInfo()

    // 点击按钮 实现退出功能
$('#btnLogout').on('click',function(){
    //询问用户是否退出
    layui.layer.confirm('是否确定退出登陆?', {icon: 3, title:'提示'}, function(index){
        //清空本地存的token
        localStorage.removeItem('token')
        //重新回到登录页面
        location.href = '/login.html'
        layer.close(index);
      });
})

})
//获取用户信息函数
function getUserInfo(){
  $.ajax({
      type:'GET',
      url:'/my/userinfo',
     
      data:{
        
      },
      success:function(res){
          if(res.status !== 0){
              return layui.layer.msg('获取用户信息失败')
          }
          renderAvatar(res.data)
      },
    //   无论成功还是失败都会调用这个函数
    //   complete:function(res){
    //     console.log(res);
    //     //在conplete 函数中 可以使用 res.responseJSON拿到服务器响应回来的数据
    //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
    //        //强制清空token
    //        localStorage.removeItem('token')
    //        //强制跳转登录页
    //        location.href = '/login.html'
    //     }
    //   }
  })   
}

function renderAvatar(user){
   let name = user.nickname || user.username
//    设置欢迎文本
   $('#welcome').html('欢迎&nbsp;&nbsp'+ name + '!')
   // 按需渲染用户头像
   if(user.user_pic !== null){
      $('.layui-nav-img').attr('str',user.user_pic).show()
      $('.text-avatar').hide()
   }else{
    $('.layui-nav-img').hide()
    $('.text-avatar').html(name[0].toUpperCase()).show()
   }
}