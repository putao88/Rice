var current_page=1;
var count=$("#perpagenum").val();
$(document).ready(function(){
    // 获得订单反馈列表
    GetorderSuggestList();
})
// 获得订单反馈列表
function GetorderSuggestList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/order/OrderFeedbackPaging",
        dataType:"json",
        data:{
            page:current_page,
            count:count
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                total=data.items.Statistics.total_pages;
                OrderSuggestShow(data);
                adjustTable(data,GetorderSuggestList)
            }
        },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 展示订单反馈列表
function OrderSuggestShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var status="";
        if(data.items.datasets[i].reply){
            status="<td class='grey'>已回复</td>"
        }else{
            status="<td class='red'>未回复</td>"
        }
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].orderId+"><td>"+number+"</td><td>" +
            data.items.datasets[i].orderId+"</td><td>"+data.items.datasets[i].userAccount+"</td>" +
                status+"<td><a class='reply'>回复</a></td></tr>"
    }
    $("#orderSuggest").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#orderSuggest").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 查看回复列表
    $(".reply").click(function(){
        var orderId=$(this).parent().parent().attr("id");
        account=$(this).parent().parent().children().eq(2).html();
        ReplyList(orderId,account);
    })
}
// 回复弹出层
function ReplyList(orderId,account){
    layer.open({
        type:1,
        title:account+"的评论",
        area:["400px","430px"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="replyLayer" id="replyLayer"></div>',
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            layer.closeAll();
        },
        btn2:function(){
            layer.closeAll();
        }
    })
    // 获得评论列表
    GetReplyList(orderId);
}
// 获得评论列表
function GetReplyList(orderId){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/order/feedbackByOrderId",
        dataType:"json",
        data:{
            orderId:orderId
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                var layerCont="";
                for(var i in data.items){
                    var replyCont="";
                    if(!data.items[i].reply){
                        replyCont=""
                    }else{
                        replyCont="<div class='div1 orange'>客服回复:（<span>"+data.items[i].backTime+"</span>)</div>"+
                            "<div class='div3'>"+data.items[i].reply+"</div>"
                    }
                    layerCont+="<div class='div1'>意见反馈:（<span>"+data.items[i].createtime+"</span>)<a class='litReply' id="+data.items[i].id+">回复</a></div>"+
                            "<div class='div2'>"+data.items[i].feedbackContent+"</div>"+replyCont+"<hr>";
                }
                $("#replyLayer").html(layerCont);
                // 点击回复
                $(".litReply").click(function(){
                    var id=$(this).attr("id");
                    var index=layer.open({
                        title:"回复",
                        type:1,
                        area:["400px","430px"],
                        shadeClose:false,
                        skin:"yourclass",
                        content:'<textarea type="text" placeholder="请输入回复内容" class="replyText" id="replyText"></textarea>',
                        btn:["确定","取消"],
                        btnAlign:"c",
                        yes:function(){
                            if($.trim($("#replyText").val())=="") {
                                var warning2 = layer.confirm("回复内容不能为空！", {
                                    icon: 0,
                                    btn: ["确定"]
                                }, function () {
                                    layer.close(warning2);
                                })
                            }else{
                                $.ajax({
                                    type:"get",
                                    url:"http://www.guzili.com.cn/Rice_ssm/order/replymessage.action",
                                    dataType:"json",
                                    data:{
                                        id:id,
                                        reply:$.trim($("#replyText").val())
                                    },
                                    success:function(data){
                                        if(data.msg=="false"){
                                            alert("请求资源失败，请重试！");
                                        }else{
                                            GetReplyList(orderId);
                                            GetorderSuggestList();
                                            layer.msg('回复成功！',{time: 800, icon:1},function(){
                                                layer.close(index);
                                            });
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

                })
            }
        },
        error:function(data){
            alert("服务器出错了！");
        }
    })
}