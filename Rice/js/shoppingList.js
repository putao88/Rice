/**
 * Created by Administrator on 2017/7/23.
 */
var Status={
    "0":"正常",
    "1":"挂失",
    "2":"冻结",
    "3":"失效"
}
var color=["green","red","orange","grey"];
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var name="";
var telephone="";
$("document").ready(function(){
    GetShoppingList();
})
function GetShoppingList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/scc/selectCardPaging.action",
        // url:"../json/shoppingList.json",
        dataType:"json",
        data:{
            name:name,
            telephone:telephone,
            page:current_page,
            count:count
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                total=data.items.Statistics.total_pages;
                ShoppingListShow(data);
                adjustTable(data,GetShoppingList)
            }
        }
    })
}
// 展示购物卡列表
function ShoppingListShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+
            data.items.datasets[i].cardNum+"</td><td>"+
            data.items.datasets[i].telephone+"</td><td>"+data.items.datasets[i].initialBalance+"</td><td>"+
            data.items.datasets[i].balance+"</td><td class="+color[data.items.datasets[i].status]+">"+
            Status[data.items.datasets[i].status]+"</td><td>"+data.items.datasets[i].createtime+"</td><td>" +
            "<a class='editor'>编辑</a></td></tr>"
    }
    $("#shoppingList").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#shoppingList").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 编辑购物卡信息
    $(".editor").click(function(){
        var id=$(this).parent().parent().attr("id");
        EditorProduct(id);
    })
}
// 编辑购物卡信息
function EditorProduct(id){
    layer.open({
        type:1,
        title:"修改用户信息",
        area:["500px","400px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="modifylayer">' +
        '<div><label>编号：</label><input type="text" value="" disabled="disabled" id="number"></div>' +
        '<div><label>卡号：</label><input type="text" value="" disabled="disabled" id="cardNum"></div>' +
        '<div><label>手机号码：</label><input type="text" value="" disabled="disabled" id="telephone"></div>' +
        '<div><label>购卡金额：</label><input type="text" value="" disabled="disabled" id="initialBalance"></div>' +
        '<div><label>余额：</label><input type="text" value="" disabled="disabled" id="balance"></div>' +
        '<div><label>状态：</label>' +
        '<select id="status"><option value="0">正常</option><option value="1">挂失</option><option value="2">冻结</option><option value="3">失效</option></select></div>'+
        '</div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            $.ajax({
                type:"post",
                url:"http://www.guzili.com.cn/Rice_ssm/scc/updateinfo.action",
                // url:"../json/sureDistribution.json",
                dataType:"json",
                data:{
                    uname:"uname",
                    id:$("#number").val(),
                    cardNum:$("#cardNum").val(),
                    telephone:$("#telephone").val(),
                    initialBalance:$("#initialBalance").val(),
                    balance:$("#balance").val(),
                    status:$("#status").val()
                },
                success:function(data){
                    if(data.msg=="false"){
                        alert("请求资源失败，请重试！");
                    }else{
                        GetShoppingList();
                        layer.msg('购物卡信息修改成功！',{time: 800, icon:1},function(){
                            layer.closeAll();
                        });
                    }
                }
            })
        },
        btn2:function(){
            layer.closeAll();
        }
    })
    // 获得购物卡信息
    GetShopping(id);
}
// 获得购物卡信息
function GetShopping(id){
    $.ajax({
        type:"get",
        dataType:"json",
        // url:"../json/shopping.json",
        url:"http://www.guzili.com.cn/Rice_ssm/scc/selectCardById.action",
        data:{
            id:id
        },
        success:function(data){
            console.log(data);
            $("#number").val(data.items.id);
            $("#cardNum").val(data.items.cardNum);
            $("#telephone").val(data.items.telephone);
            $("#initialBalance").val(data.items.initialBalance);
            $("#balance").val(data.items.balance);
            $("#status option").each(function(){
                if($(this).val()==data.items.status){
                    $(this).attr("selected","selected");
                }
            })
        }
    })
}
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetShoppingList();
})
// 搜索框通过手机号搜索
$("#searchBtn").click(function(){
    telephone=$.trim($("#search").val());
    current_page=1;
    GetShoppingList();
})