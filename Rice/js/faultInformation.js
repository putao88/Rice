/**
 * Created by Administrator on 2017/7/26.
 */
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var eqNum="";
$(document).ready(function(){
    // 获取设备状态列表
    GetfaultInformation();
})
// 获取故障信息列表
function GetfaultInformation(){
    $.ajax({
            type:"get",
            url:"http://www.guzili.com.cn/Rice_ssm/equipment/eqErrorPaging.action",
            // url:"../json/faultInformation.json",
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
                    faultInformationShow(data);
                    adjustTable(data,GetfaultInformation)
                }
            },
            error:function(data){
                alert("服务器出错！");
            }
        }
    )
}
//故障信息展示
function  faultInformationShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>" +
            data.items.datasets[i].eqid+"</td><td>"+data.items.datasets[i].error_id+"</td><td>" +
            data.items.datasets[i].error_time +"</td><td>"+data.items.datasets[i].description+"</td><tr>";
    }
    $("#faultInformation").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#faultInformation").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
}
// 选择当前显示数目
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetfaultInformation();
})
// 搜索获得列表,
$("#searchBtn").click(function(){
    eqNum=$.trim($("#search").val());
    current_page=1;
    GetfaultInformation();
})