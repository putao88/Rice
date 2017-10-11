/**
 * Created by Administrator on 2017/7/24.
 */
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var account="";
var cardNum="";
$("documnet").ready(function(){
    GetShoppingRecord();
})
// 得到购物卡充值列表
function GetShoppingRecord(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/scc/selectRechargeRecord.action",
        // url:"../json/shoppingRecord.json",
        dataType:"json",
        data:{
            page:current_page,
            count:count,
            cardNum:cardNum,
            account:account
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                total=data.items.Statistics.total_pages;
                ShoppingRecordShow(data);
                adjustTable(data, GetShoppingRecord)
            }
        }
    })
}
function  ShoppingRecordShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+
            data.items.datasets[i].card.cardNum+"</td><td>"+
            data.items.datasets[i].card.telephone+"</td><td>"+
            data.items.datasets[i].account+"</td><td>"+
            data.items.datasets[i].money+"</td><td>"+data.items.datasets[i].createtime+"</td></tr>"
    }
    $("#shoppingRecord").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#shoppingRecord").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
}
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetShoppingRecord();
})
// 搜索获得列表
$("#searchBtn").click(function(){
    if($("#searchClfic").val()==1){
        cardNum="";
        account=$.trim($("#search").val());
    }else if($("#searchClfic").val()==2){
        account="";
        cardNum=$.trim($("#search").val());
    }
    current_page=1;
    GetShoppingRecord();
})