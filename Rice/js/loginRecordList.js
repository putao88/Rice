/**
 * Created by Administrator on 2017/7/28.
 */
var current_page=1;
var count=$("#perpagenum").val();
var adminName="";
var total=0;
$(document).ready(function(){
    // 获得登录记录列表
    GetloginRecordList();
})
// 获得登录记录列表
function GetloginRecordList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/adminAccessInfo.action",
        // url:"../json/loginRecord.json",
        dataType:"json",
        data:{
            page:current_page,
            count:count,
            adminName:adminName
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                total=data.items.Statistics.total_pages;
                LoginRecordShow(data);
                adjustTable(data,GetloginRecordList)
            }
        },
        error:function(){
            alert("抱歉，请求资源失败！");
        }
    })
}
// 登陆列表展示
function LoginRecordShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+
            data.items.datasets[i].account+"</td><td>"+data.items.datasets[i].ip+"</td><td>"+
            data.items.datasets[i].address+"</td><td>"+data.items.datasets[i].loginTime+"</td></tr>";
    }
    $("#loginRecordList").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#loginRecordList").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
}
// 搜索获得列表
$("#searchBtn").click(function(){
    adminName=$("#search").val();
    current_page=1;
    GetloginRecordList();
})
// 选择每页的条目
$("#perpagenum").change(function(){
    count=$.trim($("#perpagenum").val());
    current_page=1;
    GetloginRecordList();
})