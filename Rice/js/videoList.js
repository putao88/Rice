/**
 * Created by Administrator on 2017/7/27.
 */
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var obj={
    "videoTitle":"标题",
    "videoDescript":"描述"
}
$("document").ready(function(){
    // 获取视频列表
    GetVideoList();
    // 添加视频
    $("#addvideo").click(function(){
        AddVideo();
    })
})
// 获取视频列表
function GetVideoList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/equipment/ selectVideoPaging.action",
        // url:"../json/deciceList.json",
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
                VideoListShow(data);
                adjustTable(data,GetVideoList)
            }
        },
        error:function(){
            alert("服务器报错！");
        }
    })
}
// 展示视频列表
function VideoListShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+
            data.items.datasets[i].title+"</td><td>"+
            data.items.datasets[i].descript+"</td><td>"+
            data.items.datasets[i].uptime+"</td><td>"+
            "<a class='play' id="+data.items.datasets[i].url+">播放</a><a class='delete'>删除</a>"
    }
    $("#videoList").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#videoList").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 删除视频
    $(".delete").click(function(){
        var id=$(this).parent().parent().attr("id");
        DeleteVideoList(id);
    })
    // 视频播放
    $(".play").click(function(){
        var id=$(this).parent().parent().attr("id");
        var titleStr=$(this).parent().parent().children().eq(1).html();
        var url="https://www.guzili.com.cn/"+$(this).attr("id");
        VideoPlay(id,titleStr,url);
    })
}
// 添加视频
function AddVideo(){
    layer.open({
        type:1,
        title:"添加",
        area:["450px","400px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="videoLayer1"><form  id="videoForm" enctype="multipart/form-data">' +
        '<div class="video_full"><span class="videoLspan">视频名称</span><input type="text" id="videoTitle" class="contStr" name="title"></div>' +
        '<div class="video_full"><span class="videoLspan">视频描述：</span><textarea class="contStr" id="videoDescript" name="descript"></textarea></div>'+
        '<div class="video_full"><span class="videoLspan">文件：</span><input  name="file" type="file" class="chooseFile" id="chooseFile"></div>'+
        '<div class="full_bg2 marT_10"><strong class="red" style="display:inline-block;margin-left:70px;">说明:</strong class="fleft">只接受.mp4格式的视频文件</div>' +
        '</form></div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            // 判断输入是否为空
            var sign=0;
            $(".videoLayer1 .contStr").each(function(){
                if($.trim($(this).val())==""){
                    var str=$(this).attr("id");
                    var sure=layer.confirm("视频"+obj[str]+"不能为空！",{
                        icon:0,
                        btn:["确认"]
                    },function(){
                        layer.close(sure);
                    })
                }else{
                    sign++;
                }
            })
            // 判断上传视频文件
            var filePath=$("#chooseFile").val();
            if(filePath==""){
                var tishi1=layer.confirm("请上传mp4格式视频文件！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.close(tishi1);
                })
            }
            else{
                var fileType=(filePath.substr(filePath.lastIndexOf("."))).toLowerCase();
                if(fileType!=".mp4"){
                    var tishi2=layer.confirm("请上传mp4格式的文件！",{
                        icon:0,
                        btn:["确认"]
                    },function(){
                        layer.close(tishi2);
                    })
                }else{
                    sign++;
                }
            }
            // 当输入的内容不为空且上传文件格式正确后
            if(sign==3){
                var formdata=new FormData($("#videoForm")[0]);
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/equipment/insertVideo.action",
                    dataType:"json",
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    data:formdata,
                    // data:{
                    //     title:$.trim($("#videoTitle").val()),
                    //     descript:$.trim($("#videoDescript").val()),
                    //     file:$("#chooseFile").val()
                    // },
                    success:function(data){
                        if(data.msg=="false"){
                            alert("请求资源失败，请重试！");
                        }else{
                            GetVideoList();
                            layer.msg("添加视频成功！",{time: 800, icon:1},function(){
                                layer.closeAll();
                            });
                        }
                    },
                    error:function(){
                        alert("服务器报错！");
                    }
                })
            }
        },
        btn2:function(){
            layer.closeAll();
        }
    })
}
// 视频播放
function  VideoPlay(id,titleStr,url){
    layer.open({
        type:1,
        title:titleStr,
        area:["600px","560px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="videoLayer">' +
        '<video id="my-video" class="video-js" controls="controls" preload="none" poster="">'+
        '<source src='+url+' type="video/mp4">'+
        '</video>' +
        '</div>',
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            layer.closeAll();
        },
        btn2:function(){
            layer.closeAll();
        },
        success: function(layero){
            //处理layer层中video播放器全屏样式问题
            setTimeout(function() {
                $(layero).removeClass('layer-anim');
            }, 0);
        }
    })
}
// 删除视频
function  DeleteVideoList(id){
    layer.confirm('确定要删除吗？', {
        icon:0,
        btn: ['确定','取消'] //按钮
    }, function(){
        $.ajax({
            type:"get",
            dataType:"json",
            url:"http://www.guzili.com.cn/Rice_ssm/equipment/deletVideo.action",
            data:{
                id:id
            },
            success:function(data){
                if(data.msg=="false"){
                    alert("请求资源失败，请重试！");
                }else{
                    GetVideoList();
                    layer.msg(data.items,{time: 800, icon:1},function(){
                        layer.closeAll();
                    });
                }
            },
            error:function(){
                alert("服务报错！");
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
    GetReadingList();
})