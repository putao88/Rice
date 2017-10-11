var obj={
    "name":"姓名",
    "telephone":"电话",
    "remarks":"备注"
}
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var account="";
var name="";
// 获取设备管理员列表
$("document").ready(function(){
    deviceMangerList();
})
function deviceMangerList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/equipment/allEqmanager.action",
        // url:"../json/deviceMangerList.json",
        dataType:"json",
        data:{
            page:current_page,
            count:count,
            telephone:account,
            name:name
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                total=data.items.Statistics.total_pages;
                deviceMangerListShow(data);
                adjustTable(data,deviceMangerList)
            }
        }
    })
}
// 展现设备管理员列表信息
function deviceMangerListShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+data.items.datasets[i].name+
                "</td><td>"+data.items.datasets[i].telephone+"</td><td>"+data.items.datasets[i].remarks+"</td>" +
            "<td><a class='editor'>编辑</a><a class='delete'>删除</a></td></tr>"
    }
    $("#deviceMangerList").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#deviceMangerList").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 编辑管理员信息
    $(".editor").click(function(){
        var id=$(this).parent().parent().attr("id");
        var name=$(this).parent().parent().children().eq(2).html();
        var telephone=$(this).parent().parent().children().eq(1).html();
        var remarks=$(this).parent().parent().children().eq(3).html();
        EditorDeviceManger(id,name,telephone,remarks);
    })
    // 删除管理员
    $(".delete").click(function(){
        var id=$(this).parent().parent().attr("id");
        DeleteDeviceManger(id);
    })
}
// 编辑管理员信息
function  EditorDeviceManger(id,name,telephone,remarks){
    layer.open({
        type:1,
        title:"修改设备管理员信息",
        area:["450px","360px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="modifylayer">' +
        '<div><label>姓名：</label><input type="text" value='+name+' id="name"></div>' +
        '<div><label>电话：</label><input type="text" value='+telephone+' id="telephone"></div>' +
        '<div class="largdiv"><label class="fleft">备注：</label><textarea type="text" id="remarks">'+remarks+'</textarea></div>' +
        '</div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            //确认修改管理员信息
            //  判断内容是否为空
            var sign=0;
            $(".modifylayer div label").siblings().each(function(){
                if($.trim($(this).val())==""){
                    var str=$(this).attr("id");
                    var sure=layer.confirm("设备管理员"+obj[str]+"不能为空！",{
                        icon:0,
                        btn:["确认"]
                    },function(){
                        layer.close(sure);
                    })
                }
                else{
                    sign++;
                }
            })
            // 当管理员所有内容都不为空时
            if(sign==3){
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/user/updateeqManager.action",
                    // url:"../json/sureDistribution.json",
                    dataType:"json",
                    data:{
                        id:id,
                        name:$.trim($("#name").val()),
                        telephone:$.trim($("#telephone").val()),
                        remarks:$.trim($("#remarks").val())
                    },
                    success:function(data){
                        if(data.msg=="false"){
                            alert("请求资源失败，请重试！");
                        }else{
                            deviceMangerList();
                            layer.msg("设备管理员信息修改成功！",{time: 800, icon:1},function(){
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
}
// 新增设备管理员信息
$(".addperson").click(function(){
    AddPerson();
})
function AddPerson(){
    layer.open({
        type:1,
        title:"修改设备管理员信息",
        area:["450px","360px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="modifylayer">' +
        '<div><label>姓名：</label><input type="text" value="" id="name"></div>' +
        '<div><label>电话：</label><input type="text" value="" id="telephone"></div>' +
        '<div class="largdiv"><label class="fleft">备注：</label><textarea type="text" id="remarks" placeholder="请添加备注"></textarea></div>' +
        '</div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            //确认修改管理员信息
            //  判断内容是否为空
            var sign=0;
            $(".modifylayer div label").siblings().each(function(){
                if($.trim($(this).val())==""){
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
            })
            // 当管理员所有内容都不为空时
            if(sign==3){
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/user/addeqManager.action",
                    // url:"../json/sureDistribution.json",
                    dataType:"json",
                    data:{
                        name:$.trim($("#name").val()),
                        telephone:$.trim($("#telephone").val()),
                        remarks:$.trim($("#remarks").val())
                    },
                    success:function(data){
                        if(data.msg=="false"){
                            alert("添加不成功，请重试！");
                        }else{
                            deviceMangerList();
                            layer.msg("设备管理员添加成功！",{time: 800, icon:1},function(){
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
}
// 删除管理员
function DeleteDeviceManger(id){
    layer.confirm('确定要删除吗？', {
        icon:0,
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax({
            type:"get",
            url:"http://www.guzili.com.cn/Rice_ssm/user/deleteqManager.action",
            // url:"../json/deleteDistribution.json",
            dataType:"json",
            data:{
                id:id
            },
            success:function(data){
                deviceMangerList();
                if(data.msg=="false"){
                    alert("请求资源失败，请重试！");
                }else{
                    deviceMangerList();
                    layer.msg(data.items,{time: 800, icon:1},function(){
                        layer.closeAll();
                    });
                }
            },
            error:function(data){
                alert("error");
            }
        })
    }, function () {
        // 取消时调用的函数
    });

}
// 选择当前显示数目
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    deviceMangerList();
})
// 搜索获得列表,
$("#searchBtn").click(function(){
    if($("#searchClfic").val()==1){
        name="";
        account=$.trim($("#search").val());
    }else if($("#searchClfic").val()==2){
        account="";
        name=$.trim($("#search").val());
    }
    current_page=1;
    deviceMangerList();
})