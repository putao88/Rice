/**
 * Created by Administrator on 2017/7/27.
 */
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var uname="";
$("document").ready(function(){
    // 添加广告
    $("#advertisement").click(function(){
        AddReading();
    })
    // 获得文章列表
    GetReadingList();
})
// 获得文章列表
function GetReadingList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/discoverys/ selectReadingPaging.action",
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
                ReadingListShow(data);
                adjustTable(data,GetReadingList)
            }
        },
        error:function(){
            alert("服务器报错！");
        }
    })
}
// 展现文章列表
function ReadingListShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+data.items.datasets[i].title+"</td><td class='ricePic'>"+
            "<img src="+data.items.datasets[i].pictureUrl+"></td><td>"+"<a href="+data.items.datasets[i].detailsUrl+" target='view_window'>"+data.items.datasets[i].detailsUrl+
            "</td><td>"+data.items.datasets[i].createTime+"</td><td><a class='delete'>删除</td></tr>"
    }
    $("#reading").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#reading").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 删除文章
    $(".delete").click(function(){
        var id=$(this).parent().parent().attr("id");
        DeleteReadingList(id);
    })
}
// 删除文章
function DeleteReadingList(id){
    layer.confirm('确定要删除吗？', {
        icon:0,
        btn: ['确定','取消'] //按钮
    }, function(){
        $.ajax({
            type:"get",
            dataType:"json",
            url:"http://www.guzili.com.cn/Rice_ssm/discoverys/deletDE.action",
            data:{
                uname:uname,
                id:id
            },
            success:function(data){
                if(data.msg=="false"){
                    alert("请求资源失败，请重试！");
                }else{
                    GetReadingList();
                    layer.msg(data.items,{time: 800, icon:1},function(){
                        layer.closeAll();
                    });
                }
            },
            error:function(){
                alert("服务器报错！");
            }
        })
    }, function(){
        // 取消时调用的函数
    });
}
// 添加文章
function AddReading(){
    layer.open({
        type:1,
        title:"添加文章",
        area:["500px","400px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="AppLayer">' +
        '<form  id="readingForm" enctype="multipart/form-data"><div class="full_bg2 marginT_30">' +
        '<label class="name_label">文章标题：</label><input type="text" id="readingTitle" name="title"></div>' +
        '<div class="full_bg2"><label class="name_label">Zip压缩包：</label><input  name="zipFile" type="file" class="chooseFile" id="chooseFile"></div></form>' +
        '<div class="full_bg2"><strong class="red">说明:</strong>APP阅读模块使用压缩文件包形式实现功能!' +
        '<a class="red" id="download_examp" href="https://www.guzili.com.cn/discovery/reading/DcDemo.zip">点击下载示例压缩包</a></div>' +
        '<div class="full_bg2">1:压缩文件格式必须是zip格式;</div>' +
        '<div class="full_bg2">2:压缩包文件首页文件都以"index.html"命名;</div>' +
        '<div class="full_bg2">3:封面图片以"cover.png"命名;</div>' +
        '</div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
           var sign=0;
            if($.trim($("#readingTitle").val())==""){
                var sure=layer.confirm("文章标题不能为空！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.close(sure);
                })
            }
            else{
                sign++;
            }
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
            if(sign==2){
                var formData=new FormData($("#readingForm")[0]);
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/discoverys/AppReading.action",
                    // url:"../json/sureDistribution.json",
                    dataType:"json",
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    data:formData,
                    success:function(data){
                        if(data.msg=="false"){
                            alert("请求资源失败，请重试！");
                        }else{
                            GetReadingList();
                            layer.msg("新增文章成功！",{time: 800, icon:1},function(){
                                layer.closeAll();
                            });
                        }
                    },
                    error:function () {
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
// 选择当前显示数目
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetReadingList();
})