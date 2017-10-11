/**
 * Created by Administrator on 2017/7/26.
 */
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var ordersCode="";
var productName="";
var productStatus={
    "-1":"",
    "0":""
}
var Orderstatus={
    "-1":"未支付",
    "0":"待取货",
    "1":"已取货",
    "2":"已收货",
    "3":"已取消",
    "4":"已退款"
}
var Roughness={
    "0":'粗米',
    "1":'中度粗米',
    "2":'精白米'
}
var Ordergetway={
    "0":"自取",
    "1":"配送"
}
var payType={
    "1":"微信",
    "2":"支付宝",
    "3":"购物卡"
}
$(document).ready(function(){
    // 从弹出的详情面板跳转到列表
    $("#secondOrder").click(function(){
        if($(this).hasClass("back")){
            $(".ordreList").show();
            $(".orderDetail").hide();
            $(".thirdOrder").hide();
            $("#secondOrder").removeClass("back");
        }
    });
    // 获取交易订单
    GetorderManageList();
})
// 获取交易订单
function GetorderManageList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/order/selectOrderspaging.action",
        // url:"../json/orderManage.json",
        dataType:"json",
        data:{
            ordersCode:ordersCode,
            productName:productName,
            page:current_page,
            count:count
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                total=data.items.Statistics.total_pages;
                OrderManageShow(data);
                adjustTable(data,GetorderManageList)
            }
        },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 展示订单列表
function OrderManageShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].orderCode+"><td>"+number+"</td><td>"+
            data.items.datasets[i].orderCode+"</td><td>"+data.items.datasets[i].equipment.equiNum+"</td><td>"+
            data.items.datasets[i].product.name+"</td><td>"+data.items.datasets[i].totalPrice+"</td><td>"+data.items.datasets[i].createtime+"</td>"+
            "<td>"+data.items.datasets[i].count+"</td><td>"+Orderstatus[data.items.datasets[i].status]+"</td><td>"+
            "<a class='detail'>详情</a></td></tr>"
    }
    $("#orderManage").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#orderManage").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 弹出详情面板
    $(".detail").click(function(){
        $(".ordreList").hide();
        $(".orderDetail").show();
        $(".thirdOrder").show();
        $("#secondOrder").addClass("back");
        var orderCode=$(this).parent().parent().attr("id");
        // 获取订单详情
        GetOrderDetail(orderCode);
    })
    $("#secondOrder").click(function(){
        if($(this).hasClass("back")){
            $(".ordreList").show();
            $(".orderDetail").hide();
            $(".thirdOrder").hide();
            $("#secondOrder").removeClass("back");
        }
    });
}
// 获取订单详情
function  GetOrderDetail(ordersCode){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/order/selectOrderspaging.action",
        // url:"../json/orderManageDetail.json",
        dataType:"json",
        data:{
            ordersCode:ordersCode
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                $("#orderNum").html(data.items.datasets[0].orderCode);
                $("#resPerson").html(data.items.datasets[0].userName);
                $("#resMes").html(data.items.datasets[0].address);
                $("#resMobile").html(data.items.datasets[0].phonenumber);
                $("#riceName").html(data.items.datasets[0].product.name);
                $("#riceDescrip").html(data.items.datasets[0].product.description);
                $("#price").html(data.items.datasets[0].unitPrice);
                $("#sendPerson").html(data.items.datasets[0].couriers.name);
                $("#orderStatus").html(Orderstatus[data.items.datasets[0].status]);
                $("#orderTime").html(data.items.datasets[0].createtime);
                $("#resiveWay").html(Ordergetway[data.items.datasets[0].getway]);
                $("#allreder").html(data.items.datasets[0].count);
                $("#deliveryFee").html(data.items.datasets[0].tip);
                $("#totalPrice").html(data.items.datasets[0].totalPrice);
                $("#riceImg").attr("src",data.items.datasets[0].product.pic);
                $("#payType").html(payType[data.items.datasets[0].payType2]);
                $("#roughness").html(Roughness[data.items.datasets[0].roughness]);
            }
        },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 选择当前显示数目
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetorderManageList();
})
// 搜索获得列表,当搜索框的值改变时，触发函数
$("#searchBtn").click(function(){
    if($("#searchClfic").val()==1){
        productName="";
        ordersCode=$.trim($("#search").val());
    }else if($("#searchClfic").val()==2){
        ordersCode="";
        productName=$.trim($("#search").val());
    }
    current_page=1;
    GetorderManageList();
})