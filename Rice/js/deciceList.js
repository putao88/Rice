/**
 * Created by Administrator on 2017/7/26.
 */
var obj={
    "equiNum":"编号",
    "longitude":"经度",
    "latitude":"纬度",
    "street":"街道",
    "address":"详细地址"
}
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var eqNum="";
var province="";
var city="";
var district="";
var riceType="";
var clerker="";
var uname="";
$("document").ready(function(){
    // 获取设备列表
    GetdeciceList();
    // 获取大米类型
    GetRiceType();
    // 获取所有联系人
    GetClerker();
    // 添加设备
    $(".addequipment").click(function () {
        AddDeciceList();
    })
})
// 获取设备列表
function GetdeciceList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/equipment/EquipmentPaging.action",
        // url:"../json/deciceList.json",
        dataType:"json",
        data:{
            eqNum:eqNum,
            page:current_page,
            count:count
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                total=data.items.Statistics.total_pages;
                DeciceListShow(data);
                adjustTable(data,GetdeciceList)
            }
        },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 展现设备列表
function  DeciceListShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+
            data.items.datasets[i].equiNum+"</td><td>"+
            data.items.datasets[i].province+"-"+data.items.datasets[i].city+"-"+data.items.datasets[i].district+"-"+data.items.datasets[i].street+"-"+data.items.datasets[i].address+
                "</td><td>"+data.items.datasets[i].longitude+","+data.items.datasets[i].latitude+"</td><td>"+data.items.datasets[i].eqProduct[0].name+
                "</td><td><a class='editor'>编辑</a><a class='delete'>删除</td></tr>"
    }
    $("#deciceList").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#deciceList").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 编辑设备信息
    $(".editor").click(function () {
        var id=$(this).parent().parent().attr("id");
        EditorDeciceList(id);
    })
    // 删除设备
    $(".delete").click(function () {
        var id=$(this).parent().parent().attr("id");
        DeleteProductList(id);
    })
}
// 编辑设备信息
function  EditorDeciceList(id){
    layer.open({
        type:1,
        title:"修改设备信息",
        area:["700px","460px"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="deviceLayer"><form id="deciceForm" enctype="multipart/form-data">' +
        '<div class="full_bg marginT_30"><label class="marginL_20">设备编号&nbsp;:</label><input type="text"  value="" class="marginR_100" id="equiNum" name="equiNum">' +
        '<label>米型&nbsp;:</label><select id="riceType" name="product1Id"></select></div>' +
        '<div class="full_bg"><label class="marginL_20">经度&nbsp;:</label><input type="text"  value="" class="marginR_100" id="longitude" name="longitude">' +
        '<label>纬度&nbsp;:</label><input type="text"  value="" id="latitude" name="latitude"></div>' +
        '<div class="full_bg marginT_30"><label class="marginL_20">设备区域&nbsp;:</label>' +
        '<div class="distpickerbg" data-toggle="distpicker" id="distpicker">' +
        '<select id="province" name="province"></select><select id="city" name="city"></select><select id="district" name="district"></select></div></div>' +
        '<div class="full_bg"><label class="marginL_20">街道&nbsp;:</label><input type="text"  value="" class="marginR_100" id="street" name="street">' +
        '<label>详细地址&nbsp;:</label><input type="text"  value="" id="address" name="address"></div>' +
        '<div  class="full_bg"><label class="marginL_20">联系人&nbsp;:</label><select id="clerker" name="servicemanName"></select></div>' +
        '</form></div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            var sign=0;
            $(".deviceLayer input").each(function(){
                if($.trim($(this).val())==""){
                    var str=$(this).attr("id");
                    var sure=layer.confirm("设备"+obj[str]+"不能为空！",{
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
            if(sign==5){
                // 绑定成功，发送其他数据
                var formData=new FormData($("#deciceForm")[0]);
                formData.append("id",id);
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/equipment/insertEq.action",
                    // url:"../json/sureDistribution.json",
                    dataType:"json",
                    async: true,
                    cache: false,
                    contentType: false,
                    processData: false,
                    data:formData,
                    success:function(data){
                        if(data.msg=="false"){
                            var fail2=layer.confirm(data.items,{
                                icon:0,
                                btn:["确认"]
                            },function(){
                                layer.close(fail2);
                            })
                        }else{
                            // 关联设备联系人和设备
                            $.ajax({
                                type:"get",
                                url:"http://www.guzili.com.cn/Rice_ssm/equipment/upEqServiceman.action",
                                // url:"../json/sureDistribution.json",
                                dataType:"json",
                                data:{
                                    Equinum:$.trim($("#equiNum").val()),
                                    servicemanId:$("#clerker").val()
                                },
                                success:function(data){
                                    if(data.msg=="false"){
                                        var fail1=layer.confirm(data.items,{
                                            icon:0,
                                            btn:["确认"]
                                        },function(){
                                            layer.close(fail1);
                                        })
                                    }else{
                                        GetdeciceList();
                                        layer.msg("设备信息修改成功！",{time: 800, icon:1},function(){
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
                    error:function(data){
                        alert("服务器出错！");
                    }
                })
            }
        },
        btn2:function(){
            layer.closeAll();
        }
    })
    $("#riceType").html(riceType);
    $("#clerker").html(clerker);
    // 获取设备默认信息
    Getdecice(id);
}
// 添加设备
function AddDeciceList(){
    layer.open({
        type:1,
        title:"添加设备",
        area:["700px","460px"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="deviceLayer"><form id="deciceForm" enctype="multipart/form-data">' +
        '<div class="full_bg marginT_30"><label class="marginL_20">设备编号&nbsp;:</label><input type="text"  value="" class="marginR_100" id="equiNum" name="equiNum">' +
        '<label>米型&nbsp;:</label><select id="riceType" name="product1Id"></select></div>' +
        '<div class="full_bg"><label class="marginL_20">经度&nbsp;:</label><input type="text"  value="" class="marginR_100" id="longitude" name="longitude">' +
        '<label>纬度&nbsp;:</label><input type="text"  value="" id="latitude" name="latitude"></div>' +
        '<div class="full_bg marginT_30"><label class="marginL_20">设备区域&nbsp;:</label>' +
        '<div class="distpickerbg" data-toggle="distpicker" id="distpicker">' +
        '<select id="province" name="province"></select><select id="city" name="city"></select><select id="district" name="district"></select></div></div>' +
        '<div class="full_bg"><label class="marginL_20">街道&nbsp;:</label><input type="text"  value="" class="marginR_100" id="street" name="street" >' +
        '<label>详细地址&nbsp;:</label><input type="text"  value="" id="address" name="address"></div>' +
        '<div  class="full_bg"><label class="marginL_20">联系人&nbsp;:</label><select id="clerker" name="servicemanName"></select></div>' +
        '</form></div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            var sign=0;
            $(".deviceLayer input").each(function(){
                if($.trim($(this).val())==""){
                    var str=$(this).attr("id");
                    var sure=layer.confirm("设备"+obj[str]+"不能为空！",{
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
            if(sign==5){
                // 先新增设备
                var formData=new FormData($("#deciceForm")[0]);
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/equipment/insertEq.action",
                    // url:"../json/sureDistribution.json",
                    dataType:"json",
                    async: true,
                    cache: false,
                    contentType: false,
                    processData: false,
                    data:formData,
                    // data:{
                    //     equiNum:$.trim($("#equiNum").val()),
                    //     address:$.trim($("#address").val()),
                    //     latitude:$.trim($("#latitude").val()),
                    //     longitude:$.trim($("#longitude").val()),
                    //     product1Id:$("#riceType").val(),
                    //     street:$.trim($("#street").val()),
                    //     province:$("#distpicker select").eq(0).val(),
                    //     city:$("#distpicker select").eq(1).val(),
                    //     district:$("#distpicker select").eq(2).val()
                    // },
                    success:function(data){
                        if(data.msg=="false"){
                            var fail2=layer.confirm(data.items,{
                                icon:0,
                                btn:["确认"]
                            },function(){
                                layer.close(fail2);
                            })
                        }else{
                            // 关联设备联系人和设备
                            $.ajax({
                                type:"get",
                                url:"http://www.guzili.com.cn/Rice_ssm/equipment/insertServiceman.action",
                                // url:"../json/sureDistribution.json",
                                dataType:"json",
                                data:{
                                    Equinum:$.trim($("#equiNum").val()),
                                    servicemanId:$("#clerker").val()
                                },
                                success:function(data){
                                    if(data.msg=="false"){
                                        var fail1=layer.confirm(data.items,{
                                            icon:0,
                                            btn:["确认"]
                                        },function(){
                                            layer.close(fail1);
                                        })
                                    }else{
                                        GetdeciceList();
                                        layer.msg("添加设备成功！",{time: 800, icon:1},function(){
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
    $("#distpicker").distpicker();
    $("#riceType").html(riceType);
    $("#clerker").html(clerker);
}
// 获取大米类型
function GetRiceType(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/product/selectAllProducts.action",
        // url:"../json/allRiceType.json",
        dataType:"json",
        success:function(data){
            for(var i in data.items){
                riceType+="<option value="+data.items[i].id+">"+data.items[i].name+"</option>"
            }
        },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 获取所有联系人
function GetClerker(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/equipment/selectAllServiceman.action",
        // url:"../json/allDeviceManager.json",
        dataType:"json",
        success:function(data){
            for(var i in data.items){
                clerker+="<option value="+data.items[i].id+">"+data.items[i].name+"</option>"
            }
        },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 获取设备详细信息
function Getdecice(id){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/equipment/selectById.action",
        // url:"../json/device.json",
        dataType:"json",
        data:{
            id:id
        },
        success:function(data){
            $("#equiNum").val(data.items.equipment.equiNum);
            $("#latitude").val(data.items.equipment.latitude);
            $("#longitude").val(data.items.equipment.longitude);
            $("#street").val(data.items.equipment.street);
            $("#address").val(data.items.equipment.address);
            $("#distpicker").distpicker({
                province:data.items.equipment.province,
                city:data.items.equipment.city,
                district:data.items.equipment.district
            });
           $("#riceType option").each(function(){
               if($(this).val()==data.items.equipment.product1Id){
                   $(this).attr("selected","selected");
               }
           })
            $("#clerker option").each(function(){
                if($(this).val()==data.items.Serviceman.id){
                    $(this).attr("selected","selected");
                }
            })
        },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 删除设备
function DeleteProductList(id){
    layer.confirm('确定要删除吗？', {
        icon:0,
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax({
            type:"get",
            url:"http://www.guzili.com.cn/Rice_ssm/equipment/deletByIdEq.action",
            // url:"../json/deleteDistribution.json",
            dataType:"json",
            data:{
                uname:uname,
                id:id
            },
            success:function(data){
                if(data.msg=="false"){
                    alert("请求资源失败，请重试！");
                }else{
                    GetdeciceList();
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
    GetdeciceList();
})
// 搜索获得列表,
$("#searchBtn").click(function(){
    eqNum=$.trim($("#search").val());
    current_page=1;
    GetdeciceList();
})