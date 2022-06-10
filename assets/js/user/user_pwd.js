$(function(){
let form = layui.form
// 表单验证
form.verify({
  pass: [
    /^[\S]{6,12}$/
    ,'密码必须6到12位，且不能出现空格'
  ],
  samePwd:function(value){
     if(value === $('[name=oldPwd]').val()){
       return '新旧密码不能相同'
     }
  },
  rePwd:function(value){
    if(value !== $('[name=newPwd]').val()){
      return '两次输入的新密码必须相同'
    }
 },
})

// 修改密码  监听表单提交事件  获取数据
$('.layui-form').on('submit',function(e){
  e.preventDefault()
   $.ajax({
      type:'POST',
      url:'/my/updatepwd',
      data:$(this).serialize(),
      success:function(res){
        if(res.status !== 0){
          return layui.layer.msg('更新密码失败')
        }
        return layui.layer.msg('更新密码成功')
        $('.layui-form')[0].reset()
      }
   })
})



})