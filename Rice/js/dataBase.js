/**
 * Created by Administrator on 2017/7/27.
 */
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
$(document).ready(function(){
    // 获得数据库备份列表
    GetdataBase();
    // 数据库备份
    $("#dataBaseCopy").click(function(){
        DataBaseCopy();
    })
})
// 获得数据库备份列表
function GetdataBase(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/backupPaging.action",
        // url:"../json/dataBase.json",
        dataType:"json",
        data:{
            page:current_page,
            count:count
        },
        success:function(data){
            total=data.items.Statistics.total_pages;
            DataBaseShow(data);
            adjustTable(data, GetdataBase)
        },
        error:function(data){
            alert("服务器出错了！");
        }
    })
}
// 展示备份列表
function DataBaseShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+data.items.datasets[i].id+"</td><td>"+
            data.items.datasets[i].explains+"</td><td>"+data.items.datasets[i].backuptime+"</td></tr>";
    }
    $("#dataBase").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#dataBase").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
}
// 数据库备份
function DataBaseCopy(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/insertDataBackup.action",
        // url:"../json/allAddress.json",
        dataType:"json",
        success:function(data){
            GetdataBase();
        },
        error:function(data){
            alert("服务器出错");
        }
    })
}
// 选择当前页数目
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetdataBase();
})