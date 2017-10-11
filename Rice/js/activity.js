/**
 * Created by Administrator on 2017/7/27.
 */
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var uname="asmin03";
var obj={
    "chooseFile":"压缩包",
    "title":"标题",
    "starttime":"开始时间",
    "endtime":"结束时间"
}
$("document").ready(function(){
    // 获取活动列表
    GetActivityList();
    $("#addfile").click(function(){
        AddActivity();
    })
})
// 获取活动列表
function GetActivityList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/discoverys/selectActivyPaging.action",
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
                ActivityListShow(data);
                adjustTable(data,GetActivityList)
            }
        },
        error:function(){
            alert("服务器报错！");
        }
    })
}
// 展示活动列表
function ActivityListShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+data.items.datasets[i].title+"</td><td class='ricePic'>"+
            "<img src="+data.items.datasets[i].pictureUrl+"></td><td>"+"<a href="+data.items.datasets[i].detailsUrl+">"+data.items.datasets[i].detailsUrl+
            "</td><td>"+data.items.datasets[i].starttime+ "</td><td>"+data.items.datasets[i].endtime+"</td><td><a class='delete'>删除</td></tr>"
    }
    $("#activity").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#activity").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 删除活动
    $(".delete").click(function(){
        var id=$(this).parent().parent().attr("id");
        DeleteActivityList(id);
    })
}
// 删除活动
function  DeleteActivityList(id){
    layer.confirm('确定要删除吗？', {
        icon:0,
        btn: ['确定','取消'] //按钮
    }, function(){
        $.ajax({
            type:"get",
            dataType:"json",
            url:"http://www.guzili.com.cn/Rice_ssm/discoverys/deletDA.action",
            data:{
                uname:uname,
                id:id
            },
            success:function(data){
                if(data.msg=="false"){
                    alert("请求资源失败，请重试！");
                }else{
                    GetActivityList();
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
// 添加活动
function AddActivity(){
    layer.open({
        type:1,
        title:"添加活动",
        area:["500px","450px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="AppLayer">' +
        '<form  id="avtivityForm" enctype="multipart/form-data"><div class="full_bg2 marginT_30">' +
        '<label class="name_label">文章标题：</label><input type="text" id="title" class="adjust" name="title"></div>' +
        '<div class="full_bg2">' +
        '<label class="name_label">开始时间：</label><input type="text" class="time adjust" id="starttime" name="starttime" readonly></div>' +
        '<div class="full_bg2">' +
        '<label class="name_label">结束时间：</label><input type="text" class="time adjust" id="endtime" name="endtime" readonly></div>' +
        '<div class="full_bg2"><label class="name_label">Zip压缩包：</label><input  name="zipFile" type="file" class="chooseFile" id="chooseFile"></div></form>' +
        '<div class="full_bg2"><strong class="red">说明:</strong>APP阅读模块使用压缩文件包形式实现功能!' +
        '<a class="red" id="download_examp" href="https://www.guzili.com.cn/discovery/activities/DaDemo.zip">点击下载示例压缩包</a></div>' +
        '<div class="full_bg2">1:压缩文件格式必须是zip格式;</div>' +
        '<div class="full_bg2">2:压缩包文件首页文件都以"index.html"命名;</div>' +
        '<div class="full_bg2">3:封面图片以"cover.png"命名;</div>' +
        '</div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            // 判断输入是否为空
           var sign=0;
           $(".AppLayer .adjust").each(function(){
               if($.trim($(this).val())==""){
                   var str=$(this).attr("id");
                   var sure=layer.confirm("活动"+obj[str]+"不能为空！",{
                       icon:0,
                       btn:["确认"]
                   },function(){
                       layer.close(sure);
                   })
               }else{
                   sign++;
               }
           })
            // 判断上传文件
            var filePath=$("#chooseFile").val();
            if(filePath==""){
                var tishi1=layer.confirm("请上传压缩包文件！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.close(tishi1);
                })
            }
            else{
                var fileType=(filePath.substr(filePath.lastIndexOf("."))).toLowerCase();
                if(fileType!=".zip"){
                    var tishi2=layer.confirm("请上传Zip格式的文件！",{
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
            if(sign==4){
                var formData=new FormData($("#avtivityForm")[0]);
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/discoverys/AppAct.action",
                    // url:"../json/sureDistribution.json",
                    dataType:"json",
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    data:formData,
                    // data:{
                    //     title:$.trim($("#readingTitle").val()),
                    //     starttime:$("#starttime").val(),
                    //     endtime:$("#endtime").val(),
                    //     zipFile:$("#chooseFile").val()
                    // },
                    success:function(data){
                        if(data.msg=="false"){
                            alert("请求资源失败，请重试！");
                        }else{
                            GetActivityList();
                            layer.msg("新增活动成功！",{time: 800, icon:1},function(){
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
    // 配置开始时间和结束时间
    var start={
        elem:'#starttime',
        istime:true,
        format:'YYYY-MM-DD hh:mm:ss',
        min: laydate.now(), //设定最小日期为当前日期
        max: '2099-06-16 23:59:59', //最大日期
        istoday: false,
        choose: function(datas){
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas //将结束日的初始值设定为开始日
        }
    }
    var end={
        elem:'#endtime',
        istime:true,
        format:'YYYY-MM-DD hh:mm:ss',
        min: laydate.now(),
        max: '2099-06-16 23:59:59',
        istoday: false,
        choose: function(datas){
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    }
    $("#starttime").click(function(){
        laydate(start);
    });
    $("#endtime").click(function(){
        laydate(end);
    })
}
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetActivityList();
})