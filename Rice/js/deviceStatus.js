/**
 * Created by Administrator on 2017/7/26.
 */
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var eqNum="";
$(document).ready(function(){
    // 获取设备状态列表
    GetdeviceStatusList();
})
// 获取设备状态列表
function GetdeviceStatusList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/equipment/EquipmentStatusPaging.action",
        // url:"../json/deviceStatus.json",
        dataType:"json",
        data:{
            page:current_page,
            count:count,
            eqNum:eqNum
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                total=data.items.Statistics.total_pages;
                DeviceStatusShow(data);
                adjustTable(data,GetdeviceStatusList)
            }
        },
        error:function(data){
            alert("服务器出错！");
        }
    }
    )
}
// 设备状态展示
function  DeviceStatusShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>" +
            data.items.datasets[i].eqNum+"</td><td>"+data.items.datasets[i].temperature+"</td><td>" +
            data.items.datasets[i].humidity+"</td><td>"+data.items.datasets[i].cerealReserves+"</td><td>" +
            data.items.datasets[i].cerealTotal+"</td><td>"+data.items.datasets[i].uptime+"</td></tr>"
    }
    $("#deviceStatus").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#deviceStatus").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
}
// 选择当前显示数目
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetdeviceStatusList();
})
// 搜索获得列表,
$("#searchBtn").click(function(){
    eqNum=$.trim($("#search").val());
    current_page=1;
    GetdeviceStatusList();
})