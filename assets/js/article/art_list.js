$(function(){
  // 定义一个查询的参数对象，将来请求数据的时候需要将请求参数对象提交到服务器
let layer = layui.layer
let form = layui.form
let laypage = layui.laypage;

// 美化时间过滤器

template.defaults.imports.dataFormat = function(date){
  let dt = new Date(date)

  let y = dt.getFullYear()
  let m = padZero(dt.getMonth() + 1)
  let d = padZero(dt.getDate())

  let hh = padZero(dt.getHours())
  let mm = padZero(dt.getMinutes())
  let ss = padZero(dt.getSeconds())

  return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss
}

// 补零
function padZero(n){
  return n > 9 ? n : '0' + n
}


  let q = {
    pagenum:1, //页码值，默认第一页
    pagesize:10,// 每页显示多少条数据
    cate_id:'',//文章分类的id
    state:'',//文章的发布动态
  }

  initTable()
  initCate()
    // 获取文章列表数据的方法
    function initTable() {
      $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function(res) {
          console.log(res)
          if (res.status !== 0) {
            return layer.msg('获取文章列表失败！')
          }
          // 使用模板引擎渲染页面的数据
          var htmlStr = template('tpl-table', res)
          $('tbody').html(htmlStr)
          // // 调用渲染分页的方法
          renderPage(res.total)
        }
      })
    }

 
  // 初始化文章分类的方法
  function initCate(){
    $.ajax({
      type:'GET',
      url:'/my/article/cates',
      success:function(res){
        if(res.status !== 0){
          return layer.msg('获取分类数据失败')
        }
       
        console.log(res)
       let htmlStr = template('tpl-cate',res)
       $('[name=cate_id]').html(htmlStr)
       // 通过 layui 重新渲染表单区域的UI结构
       form.render()
      }
    })
  }

// 为筛选表单绑定submit事件
$('#form-search').on('submit',function(e){
  e.preventDefault()
  let cate_id = $('[name=cate_id]').val()
  let state = $('[name=state]').val()
  // 为q里面数据赋值
  q.cate_id = cate_id
  q.state = state

  //根据最新的筛选条件重新渲染数据
  initTable()
})

// 定义渲染分页的方法
function renderPage(total){
  console.log(total)  
    //执行一个laypage实例
    laypage.render({
      elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
      ,count: total //数据总数，从服务端得到
      ,limit: q.pagesize
      ,curr:q.pagenum
      ,layout:[
        'count',
        'limit',
        'prev',
        'page',
        'next',   
        'skip',
      ]
      ,limits:[2,3,5,10]
      ,jump: function(obj,first){
        //obj包含了当前分页的所有参数，分页发生切换
        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        // console.log(obj.limit); //得到每页显示的条数
        // 根据最新的q渲染列表
    
        if(!first){
          initTable()
        }
        // 因为initTable()函数里面调用了renderPage(total)函数，因此只要进入页面就会发生
        //死循环，因此需要判断 是进入页面就触发函数，还是点击分页触发函数
        //所以需要在first===false的时候   才说明是点击分页器了  才需要调取函
      }
      
    });
  
}

// 删除文章列表
$('tbody').on('click','.btn-delete',function(){
  // 获取删除按钮的个数
  let len = $('.btn-delete').length
  // 获取当前id值 删除对应的文章
  let id = $(this).attr('data-id')
// 询问框
  layer.confirm('是否删除文章?', {icon: 3, title:'提示'}, function(index){
    $.ajax({
      method:'GET',
      url:'/my/article/delete/' + id,
      success:function(res){
        if(res.status !== 0){
          return layer.msg('删除文章失败')
        }
        layer.msg('删除文章成功')
        // 需要判断当前页面是否有剩余数据，没有的话则需要 页码值-1 重新渲染数据
        if(len === 1){ //等于一 说明删除完后页面上就没有数据了
          q.pagenum = q.pagenum === 1 ? 1 :q.pagenum - 1
         
        }
        initTable()
      }
    })
    
    layer.close(index);
  });
})

})