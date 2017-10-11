/**
 * Created by Administrator on 2017/7/27.
 */
var color;
var obj={
    "name":"用户名",
    "password":"密码",
    "repassword":"确认密码",
    "telephone":"手机号码"
}
$("document").ready(function(){
    // 添加管理员
    $(".addmanager").click(function(){
        AddManager();
    })
    // 获得管理员列表
    GetmanagerList();
})
// 获得管理员列表
function GetmanagerList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/administratorAll",
        // url:"../json/managerList.json",
        dataType:"json",
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                ManagerListShow(data);
            }
        },
        error:function(){
            alert("服务器出错");
        }
    })
}
// 展示管理员列表
function  ManagerListShow(data){
    var tbody="";
    for(var i in data.items.sysAdminCustoms){
        if(data.items.sysAdminCustoms[i].Roles=="超级管理员"){
            color="orange";
        }else{
            color="grey";
        }
        var number=parseInt(i)+1;
        tbody+="<tr id="+data.items.sysAdminCustoms[i].id+"><td>"+number+"</td><td>"+
            data.items.sysAdminCustoms[i].username+"</td><td>"+data.items.sysAdminCustoms[i].phone+"</td><td class="+color+">"+
            data.items.sysAdminCustoms[i].Roles+"</td><td>"+data.items.sysAdminCustoms[i].registerTime+"</td><td>"+
            "<a class='delete'>删除</a></td></tr>";
    }
    $("#managerList").find("tbody").html(tbody);
    $("#total_data").html(data.items.total);
    if($("#managerList").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 删除管理员
    $(".delete").click(function(){
        var id=$(this).parent().parent().attr("id");
        DeleteManager(id);
    })
}
// 删除管理员
function DeleteManager(id){
    layer.confirm('确定要删除吗？', {
        icon:2,
        btn: ['确定','取消'] //按钮
    }, function(){
        $.ajax({
            type:"get",
            url:"http://www.guzili.com.cn/Rice_ssm/deletAdmin",
            // url:"../json/deleteDistribution.json",
            dataType:"json",
            data:{
                id:id
            },
            success:function(data){
                if(data.msg=="false"){
                    alert("请求资源失败，请重试！");
                }else{
                    GetmanagerList();
                    layer.msg(data.items,{time: 800, icon:1},function(){
                        layer.closeAll();
                    });
                }
            },
            error:function(data){
                alert("服务器出错！");
            }
        })
    }, function(){
        // 取消时调用的函数
    });
}
// 添加管理员
function AddManager(){
    layer.open({
        type:1,
        title:"添加管理员",
        area:["580px","430px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="addMalayer">' +
        '<div class="bg"><label class="addMname"><i class="red">*</i>&nbsp;&nbsp;用户名：</label>' +
        '<input type="text" id="name"><span class="layerprompt"></span></div>' +
        '<div class="bg"><label class="addMname"><i class="red">*</i>&nbsp;&nbsp;初始密码：</label>' +
        '<input type="text" id="password"><span class="layerprompt"></span></div>' +
        '<div class="bg"><label class="addMname"><i class="red">*</i>&nbsp;&nbsp;确认密码：</label>' +
        '<input type="text" id="repassword"><span class="layerprompt"</span></div>' +
        '<div class="bg"><label class="addMname"><i class="red">*</i>&nbsp;&nbsp;手机：</label>' +
        '<input type="text" id="telephone"><span class="layerprompt"></span></div>' +
        '<div class="bg"><label class="addMname"><i class="red">*</i>&nbsp;&nbsp;角色：</label>' +
        '<select id="role"></select></div>' +
        '</div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            //  判断内容是否为空
            var sign=0;
            $(".addMalayer input").each(function(){
                if($(this).val()==""){
                    var str=$(this).attr("id");
                    var sure=layer.confirm("管理员"+obj[str]+"不能为空！",{
                        icon:0,
                        btn:["确认"]
                    },function(){
                        layer.close(sure);
                    })
                }
                else{
                    sign++;
                }
            });
            // 判断2次密码是否一致
            if($("#repassword").val()!=$("#password").val()){
                var confirm=layer.confirm("两次密码不一致！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.close(confirm);
                })
            }else{
                sign++;
            }
            if(sign==5){
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/addAdministrator.action",
                    // url:"../json/sureDistribution.json",
                    dataType:"json",
                    data:{
                        username:$("#name").val(),
                        password:$("#password").val(),
                        phone:$("#telephone").val(),
                        roles:$("#role").val()
                    },
                    success:function(data){
                        if(data.msg=="false"){
                            alert("请求资源失败，请重试！");
                        }else{
                            GetmanagerList();
                            layer.msg("新增管理员成功！",{time: 800, icon:1},function(){
                                layer.closeAll();
                            });
                        }
                    },
                    error:function(){
                        alert("服务器出错！");
                    }
                })
            }
        },
        btn2:function(){
            layer.closeAll();
        }
    })
    // 获得角色
    GetRole();
}
// 获得角色
function GetRole(){
    $.ajax({
        type:"get",
        dataType:"json",
        url:"http://www.guzili.com.cn/Rice_ssm/selectSysRole.action",
        success:function(data){
            if(data.msg=="false"){
                var fail1=layer.confirm(data.items,{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.close(fail1);
                })
            }else{
                var string="";
                for(var i in data.items){
                   string+="<option value="+data.items[i].id+">"+data.items[i].name+"</option>"
                }
                $("#role").append(string);
            }
        },
        error:function(){}
    })
}