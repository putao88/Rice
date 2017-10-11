/**
 * Created by Administrator on 2017/7/27.
 */
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var obj={
    "version":"版本号",
    "remarks":"版本说明"
}
$("document").ready(function(){
    // 获取活动列表
    GetUpdateList();
    $("#update").click(function(){
        AddActivity();
    })
})
// 获取活动列表
function GetUpdateList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/appVersionSelectPaging.action",
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
                UpdateListShow(data);
                adjustTable(data,GetUpdateList)
            }
        },
        error:function(){
            alert("服务器报错！");
        }
    })
}
// 展示活动列表
function UpdateListShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+
            data.items.datasets[i].version +"</td><td>"+
            data.items.datasets[i].download +"</td><td>"+
            data.items.datasets[i].datetime +"</td><td>"+
            data.items.datasets[i].remarks+ "</td></tr>"
    }
    $("#appUpdate").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#appUpdate").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
}
// 版本更新上传
function AddActivity(){
    layer.open({
        type:1,
        title:"版本上传",
        area:["500px","400px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="AppLayer">' +
        '<form  id="updateForm" enctype="multipart/form-data">' +
        '<div class="full_bg2  marginT_30">' +
        '<label class="name_label">版本号：</label><input type="text" name="version" id="version" class="adjust"></div>' +
        '<div class="marginT_30">' +
        '<label class="name_label fleft">版本说明：</label>' +
        '<textarea type="text" id="remarks" class="adjust" name="remarks"></textarea></div>' +
        '<div class="full_bg2 marginT_30"><label class="name_label">Zip压缩包：</label><input  name="File" type="file" class="chooseFile" id="File"></div></form>' +
        '<div class="full_bg2 marT_10"><strong class="red" style="margin-left:61px;">说明：</strong>上传app版本更新文件</div>'+
        '</div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            // 判断输入是否为空
            var sign=0;
            $(".AppLayer .adjust").each(function(){
                if($.trim($(this).val())==""){
                    var str=$(this).attr("id");
                    var sure=layer.confirm(obj[str]+"不能为空！",{
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
            var filePath=$("#File").val();
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
            if(sign==3){
                var formData=new FormData($("#updateForm")[0]);
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/uploadingVersion.action",
                    dataType:"json",
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    data:formData,
                    success:function(data){
                        if(data.msg=="false"){
                            var updateFail=layer.confirm(data.items,{
                                icon:0,
                                btn:["确认"]
                            },function(){
                                layer.close(updateFail);
                            })
                        }else{
                            GetUpdateList();
                            layer.msg("版本上传成功！",{time: 800, icon:1},function(){
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
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetUpdateList();
})