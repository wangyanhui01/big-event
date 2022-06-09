$(function(){
  // 点击去注册账号的连接
  $('#link-reg').on('click',function(){
     $('.login-box').hide()
     $('.reg-box').show()
  })
  // 点击去登录链接
  $('#link-login').on('click',function(){
    $('.reg-box').hide()
    $('.login-box').show()
 })


 let form = layui.form
 let layer = layui.layer
 form.verify({
  //我们既支持上述函数式的方式，也支持下述数组的形式
  //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
  pass: [
    /^[\S]{6,12}$/
    ,'密码必须6到12位，且不能出现空格'
  ],
  repass:function(value){
     // t通过形参拿到确认密码框的数值和密码框的值进行对比，判断
     let pass =  $('.reg-box [name=password]').val()
     if(pass !== value){
       return "两次密码不一致"
     }
  }
});     

//监听注册表单的提交事件
$('#form_reg').on('submit',function(e){
   e.preventDefault()
  //  console.log('111')
  let data = {username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()}
   $.post('/api/reguser',data,function(res){
      if(res.status !== 0){
        return layer.msg(res.message);
      }
      layer.msg('注册成功，请登录')
      //模拟点击事件
      $('#link-login').click()
   })
})

$('#form_login').on('submit',function(e){
  e.preventDefault()
  $.ajax({
    type:'POST',
    url:'/api/login',
    data:$(this).serialize(),
    success:function(res){
      if(res.status !== 0){
        return layer.msg(res.message);
      }
      layer.msg('登陆成功')
      //将登陆成功的token字符串存起来
      localStorage.setItem('token',res.token)
      // console.log(res.token)
      location.href = '/index.html'
    }
  })
})


})
