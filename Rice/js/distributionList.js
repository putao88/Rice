/**
 * Created by Administrator on 2017/7/25.
 */
var obj={
    "useraccount":"帐号",
    "name":"姓名",
    "phone":"电话",
    "address":"地址",
    "card":"身份证号"
}
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var telephone="";
var name="";
var accountBind=0;
$("document").ready(function(){
    // 获取配送员列表
    GetDistributionList();
})
// 获取配送员列表
function GetDistributionList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/user/allCourier.action",
        // url:"../json/distributionList.json",
        dataType:"json",
        data:{
            page:current_page,
            count:count,
            telephone:telephone,
            name:name
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                total=data.items.Statistics.total_pages;
                DistributionListShow(data);
                adjustTable(data,GetDistributionList)
            }
        }
    })
}
// 配送员列表展现
function  DistributionListShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+
            "</td><td>"+
            data.items.datasets[i].name+"</td><td>"+data.items.datasets[i].phone+"</td><td>"+
            data.items.datasets[i].card+"</td><td>" +
            data.items.datasets[i].address+"</td><td><a class='relation'>关联设备</a></td>"+
            "<td><a class='editor'>编辑</a>" + "<a class='delete'>删除</a></td></tr>";
        }
    $("#distributionList").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#distributionList").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 编辑配送员信息
    $(".editor").click(function(){
        id=$(this).parent().parent().attr("id");
        EditorDistribution(id);
    })
    // 删除配送员
    $(".delete").click(function(){
        id=$(this).parent().parent().attr("id");
        DeleteDistribution(id);
    })
    // 关联配送员设备
    $(".relation").click(function(){
        var id=$(this).parent().parent().attr("id");
        Grant(id);
    })
}
// 编辑配送员信息
function EditorDistribution(id){
    layer.open({
        type:1,
        title:"修改用户信息",
        area:["450px","350px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="modifylayer">' +
        '<div><label>用户帐号：</label><input type="text" value="" disabled="disabled" id="useraccount"></div>' +
        '<div><label>真实姓名：</label><input type="text" value="" id="name"></div>' +
        '<div><label>移动电话：</label><input type="text" value="" id="phone"></div>' +
        '<div><label>身份证号：</label><input type="text" value="" disabled="disabled" id="card"></div>' +
        '<div><label>家庭住址：</label><input type="text" value="" class="bigger" id="address"></div>' +
        '</div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
           // 确认修改配送员信息
           //  判断内容是否为空
            var sign=0;
            $(".modifylayer div input").each(function(){
                if($.trim($(this).val())==""){
                    var str=$(this).attr("id");
                    var sure=layer.confirm("配送员"+obj[str]+"不能为空！",{
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
            // 当所有内容都不为空时
            if(sign==5){
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/user/AddCourier.action",
                    // url:"../json/sureDistribution.json",
                    dataType:"json",
                    data:{
                        id:id,
                        useraccount:$("#useraccount").val(),
                        name:$.trim($("#name").val()),
                        phone:$("#phone").val(),
                        address:$.trim($("#address").val()),
                        card:$("#card").val()
                    },
                    success:function(data){
                        if(data.msg=="false"){
                            alert("请求资源失败，请重试！");
                        }else{
                            GetDistributionList();
                            layer.msg("配送员信息修改成功！",{time: 800, icon:1},function(){
                                layer.closeAll();
                            });
                        }
                    }
                })
            }
        },
        btn2:function(){
            layer.closeAll();
        }
    })
    GetdistMes(id);
}
// 获取配送员信息
function GetdistMes(id){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/user/selectCourierById.action",
        // url:"../json/distribution.json",
        dataType:"json",
        data:{
            id:id
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                $("#useraccount").val(data.items.useraccount);
                $("#name").val(data.items.name);
                $("#phone").val(data.items.phone);
                $("#card").val(data.items.card);
                $("#address").val(data.items.address);
            }
        },
        error:function(){
            alert("error");
        }
    })
}
// 删除配送员信息
function DeleteDistribution(id){
    layer.confirm('确定要删除吗？', {
        icon:0,
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax({
            type:"get",
            url:"http://www.guzili.com.cn/Rice_ssm/user/deleteCourier.action",
            // url:"../json/deleteDistribution.json",
            dataType:"json",
            data:{
                id:id
            },
            success:function(data){
                if(data.msg=="false"){
                    alert("请求资源失败，请重试！");
                }else{
                    GetDistributionList();
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
// 添加配送员
$(".addperson").click(function(){
    AddPerson();
})
function AddPerson(){
    layer.open({
        type:1,
        title:"新增配送员",
        area:["450px","350px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="modifylayer">' +
        '<div><label>用户帐号：</label><input type="text" value="" id="useraccount"></div>' +
        '<div><label>真实姓名：</label><input type="text" value="" id="name"></div>' +
        '<div><label>移动电话：</label><input type="text" value="" id="phone"></div>' +
        '<div><label>身份证号：</label><input type="text" value="" id="card"></div>' +
        '<div><label>家庭住址：</label><input type="text" value="" class="bigger" id="address"></div>' +
        '</div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            // 确认修改配送员信息
            //  判断内容是否为空
            var sign=0;
            $(".modifylayer div input").each(function(){
                if($.trim($(this).val())==""){
                    var str=$(this).attr("id");
                    var sure=layer.confirm("配送员"+obj[str]+"不能为空！",{
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
            // 当所有内容都不为空时，并且帐号已存在时
            if(sign==5&&accountBind==1){
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/user/AddCourier.action",
                    // url:"../json/addPerson.json",
                    dataType:"json",
                    data:{
                        useraccount:$.trim($("#useraccount").val()),
                        name:$.trim($("#name").val()),
                        phone:$.trim($("#phone").val()),
                        address:$.trim($("#address").val()),
                        card:$.trim($("#card").val())
                    },
                    success:function(data){
                        if(data.msg=="false"){
                            alert("请求资源失败，请重试！");
                        }else{
                            GetDistributionList();
                            layer.msg(data.items,{time: 800, icon:1},function(){
                                layer.closeAll();
                            });
                        }
                    },
                    error:function(){
                        alert("服务器出错了")
                    }
                })
            }
            else{
                var warning=layer.confirm("用户帐号不存在！",{
                    icon:0,
                    btn:["确定"]
                },function(){
                    layer.close(warning);
                });
            }
        },
        btn2:function(){
            layer.closeAll();
        }
    })
    // 判断帐号是否存在
    addgustAcount();
}
// 判断帐号是否存在
function addgustAcount(){
    $("#useraccount").change(function(){
        var account=$.trim($(this).val());
        $.ajax({
            type:"get",
            url:"http://www.guzili.com.cn/Rice_ssm/user/CourierBinding.action",
            dataType:"json",
            data:{
                account:account
            },
            success:function(data){
                if(data.msg=="false"){
                    accountBind=0;
                    var warning=layer.confirm(data.items,{
                        icon:0,
                        btn:["确定"]
                    },function(){
                        layer.close(warning);
                    });
                }else{
                    accountBind=1;
                }
            },
            error:function(){
                alert("服务器出错！");
            }
        })
    })
}
// 授权处理
function Grant(id){
    layer.open({
        type:1,
        title:"销售记录授权",
        area:["760px","380px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="grantbg">' +
        '<div class="grantleft">' +
        '<select multiple="multiple" id="selectleft"></select></div>' +
        '<div class="grantbtn">' +
        '<div class="rightbtn"><span></span></div>' +
        '<div class="leftbtn"><span></span></div>' +
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
// 配送员设备授权获取
function uesrGrant(id){
    var array= new Array();
    var selRightCont="";
    var selLeftCont="";
    /*****************已授权获取************************/
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/equipment/selectEqFromCourier.action",
        dataType:"json",
        data:{
            cId:id
        },
        success:function(data){
            if(data.msg=="false"){
               layer.confirm("配送员设备授权信息请求失败，请重试！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.closeAll();
                })
            }else{
                for(var i in data.items){
                    selRightCont="<option value="+data.items[i].id+">"+
                        data.items[i].city+data.items[i].district+data.items[i].street+
                        data.items[i].address+"</option>";
                    $("#selectright").append(selRightCont);
                    array.push(data.items[i].id);
                }
                // if(data.items.id){
                //     selRightCont="<option value="+data.items.id+">"+
                //         data.items.city+data.items.district+data.items.street+
                //         data.items.address+"</option>";
                //     $("#selectright").append(selRightCont);
                //     array.push(data.items.id);
                // }
            }
        },
        error:function(){
            alert("服务器出错！");
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
                layer.confirm("设备地址信息请求失败，请重试！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.closeAll();
                })
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
        },
        error:function(){
            alert("服务器出错！");
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
        url:"http://www.guzili.com.cn/Rice_ssm/equipment/courierCorrelation.action",
        // url:"../json/sureGrant.json",
        dataType:"json",
        traditional:true,
        data:{
            cId:id,
            eqId:eqIds
        },
        success:function(data){
            if(data.msg=="false"){
                var fail=layer.confirm("更新失败，请重试！",{
                    icon:2,
                    btn:["确认"]
                },function(){
                    layer.close(fail);
                })
            }else{
                layer.msg("授权成功！",{time: 800, icon:1},function(){
                    layer.closeAll();
                });
            }
        },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 选择当前页数目
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetDistributionList();
})
// 搜索获得列表,
$("#searchBtn").click(function(){
    if($("#searchClfic").val()==1){
        name="";
        telephone=$.trim($("#search").val());
    }else if($("#searchClfic").val()==2){
        telephone="";
        name=$.trim($("#search").val());
    }
    current_page=1;
    GetDistributionList();
})