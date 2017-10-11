/**
 * Created by Administrator on 2017/7/27.
 */
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
$("document").ready(function(){
    // 获得配送费列表
    GetDeliveryFeeList();
    $("#sendFee").click(function(){
        SendFee();
    })
})
// 获得配送费列表
function GetDeliveryFeeList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/order/selectExpressFeePaging.action",
        dataType:"json",
        data:{
            page:current_page,
            count:count
        },
        success:function(data){
            total=data.items.Statistics.total_pages;
            DeliveryFeeShow(data);
            adjustTable(data,GetDeliveryFeeList)
        },
        error:function(){
            alert("服务器报错！");
        }
    })
}
// 配送费展示
function  DeliveryFeeShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>" +
            data.items.datasets[i].account+"</td><td>"+
            data.items.datasets[i].name+"</td><td>"+data.items.datasets[i].phone+"</td><td>" +
            data.items.datasets[i].card+"</td><td>"+data.items.datasets[i].total+"</td><td>" +
            data.items.datasets[i].address+"</td></tr>";
    }
    $("#deliveryFee").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#deliveryFee").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
}
// 选择当前显示数目
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetDeliveryFeeList();
})
// 配送费配置
function SendFee(){
    layer.open({
        type:1,
        title:"设置配送费",
        area:["300px","150px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="sendFeeLayer"><span>配送费:</span>' +
        '<input type="text" id="Fee">' +
        '<span>元/件</span></div>',
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            var Fee=$.trim($("#Fee").val());
            if(Fee==""){
                var kong=layer.confirm("配送费不能为空！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.close(kong);
                })
            }
            else if(isNaN(Fee)){
                var str=layer.confirm("配送费格式错误！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.close(str);
                })
            }
            else{
                // 修改配送费
                $.ajax({
                    type:"post",
                    dataType:"json",
                    url:"../json/fee.json",
                    data:{
                      fee:Fee
                    },
                    success:function(data){
                        if(data.msg=="false"){
                            var false1=layer.confirm("获取配送费失败！",{
                                icon:0,
                                btn:["确认"]
                            },function(){
                                layer.close(false1);
                            })
                        }
                        else{
                            layer.closeAll();
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
    // 获取配送费
    $.ajax({
        type:"get",
        dataType:"json",
        url:"../json/fee.json",
        success:function(data){
            if(data.msg=="false"){
                var false1=layer.confirm("获取配送费失败！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.close(false1);
                })
            }
            else{
                $("#Fee").val(data.items);
            }
        },
        error:function(data){
            alert("服务器出错！");
        }
    })
}