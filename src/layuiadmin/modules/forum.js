/**

 @Name：layuiAdmin 社区系统
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form;

  //帖子管理
  table.render({
    elem: '#LAY-app-forum-list'
    ,method:'POST'
    ,url: 'https://www.hattonstar.com/shoppingGet?shop_id=2' //模拟接口
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'id', width: 80, title: 'ID', sort: true}
      ,{field: 'name', title: '商品名称'}
      ,{field: 'type', title: '类型'}
      ,{field: 'price', width: 80,title: '价格'}
      ,{field: 'royalty', width: 80,title: '提成'}
      ,{field: 'integral', width: 80,title: '积分'}
      ,{field: 'stock', width: 80,title: '库存'}
      ,{field: 'avatar', title: '标题图片', width: 100, templet: '#imgTpl'}
      ,{field: 'time', title: '更新时间', width: 180, sort: true}
      ,{field: 'flag', title: '标签', templet: '#buttonTpl', minWidth: 80, align: 'center'}
      // ,{field: 'flag1', title: '分享购', templet: '#buttonTpl1', minWidth: 50, align: 'center'}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-forum-list'}
    ]]
    // ,page: true
    // ,limit: 3
    // ,limits: [3, 6, 9, 12, 15]
    ,text: '对不起，加载出现异常！'
  });

  //下架商品管理
    table.render({
    elem: '#LAY-app-forum-delllist'
    ,method:'POST'
    ,url: 'https://www.hattonstar.com/downGet?shop_id=2' //模拟接口
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'id', width: 80, title: 'ID', sort: true}
      ,{field: 'name', title: '商品名称'}
      ,{field: 'type', title: '类型'}
      ,{field: 'price', width: 80,title: '价格'}
      ,{field: 'royalty', width: 80,title: '提成'}
      ,{field: 'integral', width: 80,title: '积分'}
      ,{field: 'stock', width: 80,title: '库存'}
      ,{field: 'avatar', title: '标题图片', width: 100, templet: '#imgTpl'}
      ,{field: 'time', title: '更新时间', width: 180, sort: true}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-forum-list'}
    ]]
    ,text: '对不起，加载出现异常！'
  });
  
    table.on('tool(LAY-app-forum-delllist)', function(obj){
    var data = obj.data;
    if(obj.event === 'shopingup'){
      layer.confirm('确定重新上架该商品？', function(index){
        $.ajax({
          type:'POST',
          url:'https://www.hattonstar.com/shoppingUp',
          dataType:'json',
          data:{
            id : data.id
          },
          success:function(data){
            console.log("success");
            obj.del();
            layer.close(index);
          },
          error:function(hex){
            console.log("错误返回");
          }
        }) 
      });
    }
  });


  //监听工具条
  table.on('tool(LAY-app-forum-list)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定下架此商品？', function(index){
        $.ajax({
          type:'POST',
          url:'https://www.hattonstar.com/shoppingOff',
          dataType:'json',
          data:{
            id : data.id
          },
          success:function(data){
            console.log("success");
            obj.del();
            layer.close(index);
          },
          error:function(hex){
            console.log("错误返回");
          }
        }) 
      });
    } else if(obj.event === 'edit'){
      var tr = $(obj.tr);

      layer.open({
        type: 2
        ,title: '编辑商品信息'
        ,content: './listform.html'
        ,area: ['550px', '600px']
        ,btn: ['确定', '取消']
        ,resize: false
        ,yes: function(index, layero){
          var iframeWindow = window['layui-layer-iframe'+ index]
          ,submitID = 'LAY-app-forum-submit'
          ,submit = layero.find('iframe').contents().find('#'+ submitID);

          //监听提交
          iframeWindow.layui.form.on('submit('+ submitID +')', function(data){
            var field = data.field; //获取提交的字段
            var one_switch = 'OFF'
            var good_switch = 'OFF'
            var post_switch = 'OFF'
            var share_switch = 'OFF'
            if (field.one_switch == 'on') {
              one_switch = 'on'
            }
          if (field.good_switch == 'on') {
              good_switch = 'on'
            }
          if (field.post_switch == 'on') {
              post_switch = 'on'
            }
          if (field.share_switch == 'on') {
              share_switch = 'on'
            }
            //提交 Ajax 成功后，静态更新表格中的数据
            $.ajax({
              type:'POST',
              url:'https://www.hattonstar.com/shoppingUpdatePart',
              dataType:'json',
              data:{
                id : obj.data.id,
                name : field.name,
                price : field.price,
                royalty : field.royalty,
                integral : field.integral,
                one_switch : one_switch,
                good_switch : good_switch,
                post_switch : post_switch,
                share_switch: share_switch,
                type : field.shopping_type,
                stock : field.stock
              },
              success:function(data){
                console.log("success");
                table.reload('LAY-app-forum-list'); //数据刷新
                layer.close(index); //关闭弹层
              },
              error:function(hex){
                console.log("错误返回");
              }
            }) 


          });  
          
          submit.trigger('click');
        }
        ,success: function(layero, index){
          var mapType = new Map([['限时抢', 7], ['1元购', 8], ['新品特价', 9], ['教育教学',10], ['教育周边', 11], ['绿色农场', 12], ['健康养生', 13], ['公告中心', 14]]);
          var body = layer.getChildFrame('body', index);
          body.find("#shoping_name").val(obj.data.name);
          body.find("#shoping_price").val(obj.data.price);
          body.find("#shoping_royalty").val(obj.data.royalty);
          body.find("#shoping_integral").val(obj.data.integral);
          body.find("#shoping_stock").val(obj.data.stock);
          body.find("#shopping_type").val(mapType.get(obj.data.type));
          body.find("#shoping_id").val(obj.data.id);
          body.find("#shoping_item_id").hide();
          var flag = obj.data.flag;
          switch(flag) {
               case 0:
                  body.find("#one_switch").removeAttr('checked');
                  body.find("#good_switch").removeAttr('checked');
                  body.find("#post_switch").removeAttr('checked');
                  break;
               case 1:
                  body.find("#one_switch").removeAttr('checked');
                  body.find("#good_switch").removeAttr('checked');
                  body.find("#post_switch").attr('checked','true');
                  break;
               case 2:
                  body.find("#one_switch").removeAttr('checked');
                  body.find("#good_switch").attr('checked','true');
                  body.find("#post_switch").removeAttr('checked');
                  break;
               case 3:
                  body.find("#one_switch").attr('checked','true');
                  body.find("#good_switch").removeAttr('checked');
                  body.find("#post_switch").removeAttr('checked');
                  break;
               case 4:
                  body.find("#one_switch").removeAttr('checked');
                  body.find("#good_switch").attr('checked','true');
                  body.find("#post_switch").attr('checked','true');
                  break;
               case 5:
                  body.find("#one_switch").attr('checked','true');
                  body.find("#good_switch").removeAttr('checked');
                  body.find("#post_switch").attr('checked','true');
                  break;
               case 6:
                  body.find("#one_switch").attr('checked','true');
                  body.find("#good_switch").attr('checked','true');
                  body.find("#post_switch").removeAttr('checked');
                  break;
               default:
                  body.find("#one_switch").attr('checked','true');
                  body.find("#good_switch").attr('checked','true');
                  body.find("#post_switch").attr('checked','true');
                  break;
          }
          var flag1 = obj.data.flag1;
          if (flag1 == 1){
            body.find("#share_switch").attr('checked','true');
          }else{
            body.find("#share_switch").removeAttr('checked');
          }

        }
      });
    }
  });

  //回帖管理
  table.render({
    elem: '#LAY-app-forumreply-list'
    ,url: layui.setter.base + 'json/forum/replys.js' //模拟接口
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'id', width: 100, title: 'ID', sort: true}
      ,{field: 'replyer', title: '回帖人'}
      ,{field: 'cardid', title: '回帖ID', sort: true}
      ,{field: 'avatar', title: '头像', width: 100, templet: '#imgTpl'}
      ,{field: 'content', title: '回帖内容', width: 200}
      ,{field: 'replytime', title: '回帖时间', sort: true}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-forum-replys'}
    ]]
    ,page: true
    ,limit: 10
    ,limits: [10, 15, 20, 25, 30]
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(LAY-app-forumreply-list)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除此条评论？', function(index){
        obj.del();
        layer.close(index);
      });
    } else if(obj.event === 'edit'){
      var tr = $(obj.tr);

      layer.open({
        type: 2
        ,title: '编辑评论'
        ,content: '../../../views/app/forum/replysform.html'
        ,area: ['550px', '350px']
        ,btn: ['确定', '取消']
        ,resize: false
        ,yes: function(index, layero){
          //获取iframe元素的值
          var othis = layero.find('iframe').contents().find("#layuiadmin-form-replys");
          var content = othis.find('textarea[name="content"]').val();
          
          //数据更新
          obj.update({
            content: content
          });
          layer.close(index);
        }
        ,success: function(layero, index){
            
        }

      });
    }
  });
  
  exports('forum', {})
});