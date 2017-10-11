/**
 * Created by Administrator on 2017/7/27.
 */
var color={
    "0":"red",
    "1":"grey"
}
var current_page=1;
var count=$("#perpagenum").val();
var account="";
var total=0;
var messStatus={
    "0":"未回复",
    "1":"已回复"
}
$("document").ready(function(){
    // 获得系统消息列表
    GetSuggestion();
})
// 获得系统消息列表
function GetSuggestion(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/user/FeedbackPaging.action",
        dataType:"json",
        data:{
            page:current_page,
            count:count,
            account:account
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                total=data.items.Statistics.total_pages;
                SuggestionShow(data);
                adjustTable(data,GetSuggestion)
            }
        },
        error:function(){
            alert("服务器报错！");
        }
    })
}
// 消息列表展示
function SuggestionShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>" +
            data.items.datasets[i].account+"</td><td>"+data.items.datasets[i].createtime+"</td><td>" +
            data.items.datasets[i].feedbackType+"</td><td>"+data.items.datasets[i].feedbackContent+"</td><td class="+color[data.items.datasets[i].status]+">"+
            messStatus[data.items.datasets[i].status]+"</td><td>"+"<a class='reply'>回复</a><a class='delete'>删除</a></td></tr>"
    }
    $("#suggestion").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#suggestion").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 删除消息
    $(".delete").click(function(){
        var id=$(this).parent().parent().attr("id");
        DeleteSuggestion(id);
    })
    // 回复弹出框
    $(".reply").click(function(){
        var id=$(this).parent().parent().attr("id");
        var str=$(this).parent().parent().children().eq(1).html()+"的反馈信息";
        var eedbackContent=$(this).parent().parent().children().eq(4).html()
        layer.open({
            type:1,
            title:str,
            area:["600px","500px;"],
            shadeClose:false,
            skin:"yourclass",
            content:'<div class="centerbg">' +
            '<div class="lab">留言内容</div>' +
            '<textarea id="message" disabled="disabled">'+eedbackContent+'</textarea>' +
            '<div class="lab">回复信息</div>' +
            '<textarea id="reply"></textarea>' +
            '</div>' ,
            btn:["确定","取消"],
            btnAlign:"c",
            yes:function(){
                if($.trim($("#reply").val())!=""){
                    $.ajax({
                        type:"get",
                        url:"http://www.guzili.com.cn/Rice_ssm/user/repllySysfeedback.action",
                        dataType:"json",
                        data:{
                            id:id,
                            reply:$("#reply").val()
                        },
                        success:function(data){
                            if(data.msg=="false"){
                                alert("请求资源失败，请重试！");
                            }else{
                                GetSuggestion();
                                layer.msg("回复信息成功！",{time: 800, icon:1},function(){
                                    layer.closeAll();
                                });
                            }
                        },
                        error:function(data){
                            alert("服务器出错！");
                        }
                    })
                }
                else{
                    var sure= layer.confirm("回复内容不能为空！",{
                        icon:0,
                        btn:["确认"]
                    },function(){
                        layer.close(sure);
                    })
                }
            },
            btn2:function(){
                layer.closeAll();
            }
        })
    })
}
// 删除消息
function DeleteSuggestion(id){
    layer.confirm('确定要删除吗？', {
        icon:2,
        btn: ['确定','取消'] //按钮
    }, function(){
        $.ajax({
            type:"get",
            url:"http://www.guzili.com.cn/Rice_ssm/user/deleFeedback.action",
            dataType:"json",
            data:{
                id:id
            },
            success:function(data){
                if(data.msg=="false"){
                    alert("请求资源失败，请重试！");
                }else{
                    GetSuggestion();
                    layer.msg(data.items,{time: 800, icon:1},function(){
                        layer.closeAll();
                    });
                }
            },
            error:function(data){
                alert("服务器报错！");
            }
        })
    }, function(){
        // 取消时调用的函数
    });
}
// 选择当前显示数目
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetSuggestion();
})
// 搜索获得列表,当搜索框的值改变时，触发函数
$("#searchBtn").click(function(){
    account=$.trim($("#search").val());
    current_page=1;
    GetSuggestion();
})