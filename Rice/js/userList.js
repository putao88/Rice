/**
 * Created by Administrator on 2017/7/25.
 */
var current_page=1;
var count=$("#perpagenum").val();
var account="";
var nickname="";
var total=0;
$("document").ready(function(){
    // 页面初始获取用户列表
    GetUserList();
})

// 获取用户列表
function GetUserList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/user/userAll.action",
        // url:"../json/userList.json",
        dataType:"json",
        data:{
            page:current_page,
            count:count,
            account:account,
            nickname:nickname
        },
        success:function(data){
           if(data.msg=="false"){
               layer.confirm("请求资源失败，请重试！",{
                   icon:0,
                   btn:["确认"]
               },function(){
                   layer.closeAll();
               });
           }else{
               total=data.items.Statistics.total_pages;
               userListShow(data);
               adjustTable(data,GetUserList)
           }
        },
        error:function(){
            alert("抱歉，请求资源失败！");
        }
    })
}
// 用户列表展现
function userListShow(data){
    var tbody="";
        for(var i in data.items.datasets){
            var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
            tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+
                data.items.datasets[i].nickname+
                "</td><td>"+data.items.datasets[i].account+"</td><td>" +
                data.items.datasets[i].phone+"</td><td>"+
                data.items.datasets[i].memberPoints+"</td><td>"+data.items.datasets[i].registertime+"</td>" +
                "<td><a class='watch'>查看</a></td>"+"<td><a class='grant'>授权</a></td></tr>"
        }
    $("#userList").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#userList").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 授权函数
    $(".grant").click(function(){
        var id=$(this).parent().parent().attr("id");
        Grant(id);
    })
    // 查看收货地址
    $(".watch").click(function(){
        var id=$(this).parent().parent().attr("id");
       WatchAddress(id);
    })
}
// 搜索获得列表,
$("#searchBtn").click(function(){
    if($("#searchClfic").val()==1){
        account="";
        nickname=$.trim($("#search").val());
    }else if($("#searchClfic").val()==2){
        nickname="";
        account=$.trim($("#search").val());
    }
    current_page=1;
    GetUserList();
})
// 选择每页的条目
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetUserList();
})
// 授权处理
function Grant(id){
    layer.open({
        type:1,
        title:"销售记录授权",
        area:["760px","380px"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="grantbg">' +
        '<div class="grantleft">' +
        '<select multiple="multiple" id="selectleft"></select></div>' +
        '<div class="grantbtn">' +
        '<div class="allrightbtn"><span></span></div>' +
        '<div class="rightbtn"><span></span></div>' +
        '<div class="leftbtn"><span></span></div>' +
        '<div class="allleftbtn"><span></span></div>' +
        '</div>' +
        '<div class="grantright">' +
        '<select multiple="multiple" id="selectright"></select></div>' +
        '</div>' ,
        btn:["提交","取消"],
        btnAlign:"c",
        yes:function(){
            var eqIds=new Array();
            $("#selectright option").each(function(){
                eqIds.push($(this).val());
            })
            sureGrant(id,eqIds);
        },
        btn2:function(){
            layer.closeAll();
        }
    })
    uesrGrant(id);
// 全部选中移至右边
    $(".allrightbtn").click(function(){
        $("#selectleft option").appendTo("#selectright");
    })
// 全部选中移至左边
    $(".allleftbtn").click(function(){
        $("#selectright option").appendTo("#selectleft");
    })
// 单个选中移至右边
    $(".rightbtn").click(function(){
        $("#selectleft option:selected").appendTo("#selectright");
    })
// 单个选中移至左边
    $(".leftbtn").click(function(){
        $("#selectright option:selected").appendTo("#selectleft");
    })
// 双击选中移动
    $("#selectright").dblclick(function(){
        $("option:selected",this).appendTo("#selectleft");
    })
    $("#selectleft").dblclick(function(){
        $("option:selected",this).appendTo("#selectright");
    })
}
// 用户授权获取
function uesrGrant(id){
    var array= new Array();
    var selRightCont="";
    var selLeftCont="";
    /*****************已授权获取************************/
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/user/selsectAthorityByUserId.action",
        // url:"../json/userGrant.json",
        dataType:"json",
        data:{
            userId:id
        },
        success:function(data){
            if(data.msg=="false"){
                layer.confirm(data.items,{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.closeAll();
                })
            }else{
                for(var i in data.items){
                    selRightCont="<option value="+data.items[i].eqId+">"+data.items[i].districts+"</option>";
                    $("#selectright").append(selRightCont);
                    array.push(data.items[i].eqId);
                }
            }
        }
    })
    /*****************所有设备************************/
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/equipment/EquipmentAll.action",
        // url:"../json/allGrant.json",
        dataType:"json",
        success:function(data){
            if(data.msg=="false"){
                layer.confirm("请求资源失败，请重试！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.closeAll();
                });
            }else{
                for(var i in data.items){
                    selLeftCont="<option value="+data.items[i].id+">"+
                        data.items[i].city+data.items[i].district+data.items[i].street+
                        data.items[i].address+"</option>";
                    $("#selectleft").append(selLeftCont)
                }
                for (var j = 0; j < array.length; j++) {
                    $("#selectleft option[value="+array[j]+"]").remove();
                }
            }
        }
    })
}
// 确认授权函数
function sureGrant(id,eqIds){
    if(eqIds==""){
        eqIds=[""];
    }
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/user/athorityFromUser.action",
        // url:"../json/sureGrant.json",
        dataType:"json",
        traditional:true,
        data:{
            userId:id,
            eqIds:eqIds
        },
        success:function(data){
            if(data.msg=="false"){
                layer.confirm("授权失败！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.closeAll();
                })
            }else{
                layer.msg('授权成功！',{time: 800, icon:1},function(){
                    layer.closeAll();
                });
            }
        },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 查看用户地址
function WatchAddress(id){
    layer.open({
        type:1,
        title:"收货信息",
        area:["500px","450px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="addressLayer"></div>',
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            layer.closeAll();
        },
        btn2:function(){
            layer.closeAll();
        }
    })
    // 获取地址信息
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/address/userAddress.action",
        dataType:"json",
        data:{
            userId:id
        },
        success:function(data){
            var content="";
            for(var i in data.items){
                content+="<div class='bg'><div class='title'>收货信息：</div>"+
                    "<div><span>收货人：</span><span>"+data.items[i].name+"</span></div>" +
                    "<div><span>电话：</span><span>" + data.items[i].phonenumber+"</span></div>"+
                    "<div><span>地址：</span><span>"+data.items[i].area+data.items[i].street+data.items[i].address+"</span></div></div>"
            }
            if(data.items==""){
                content="<div class='layerNoData'>暂无收货信息！</div>"
            }
            $(".addressLayer").html(content);
        }
    })
}