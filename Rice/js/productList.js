/**
 * Created by Administrator on 2017/7/26.
 */
var obj={
    "name":"名称",
    "price":"价格",
    "description":"描述",
    "genre":"类型",
    "origin":"产地",
    "chooseFile":"详情压缩包"
}
var color=["green","grey"]
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
var name="";
$("document").ready(function() {
     GetProductList();
})


// 得到产品列表
function GetProductList(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/product/selectProductPaging.action",
        // url:"../json/productList.json",
        dataType:"json",
        data:{
            name:name,
            page:current_page,
            count:count
        },
        success:function(data){
            if(data.msg=="false"){
                alert("请求资源失败，请重试！");
            }else{
                total=data.items.Statistics.total_pages;
                ProductListShow(data);
                adjustTable(data, GetProductList)
            }
        },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 展示产品列表
function  ProductListShow(data){
    var tbody="";
    var str;
    for(var i in data.items.datasets){
        if(data.items.datasets[i].status==0){
            str="正常销售"
        }else if(data.items.datasets[i].status==1){
            str="已下架"}
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
        tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+
            data.items.datasets[i].name+"</td><td class='ricePic'><img src="+data.items.datasets[i].pic+"></td><td>"+
            data.items.datasets[i].origin+"</td><td>"+data.items.datasets[i].price+"</td><td>"+
            data.items.datasets[i].salesVolume+"</td><td class="+color[data.items.datasets[i].status]+">"+str+"</td><td>"+
            data.items.datasets[i].description+"</td><td>"+
                "<a class='editor'>编辑</a><a class='delete'>删除</a></td></tr>"
    }
    $("#productList").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#productList").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
    // 编辑产品信息
    $(".editor").click(function () {
        var id=$(this).parent().parent().attr("id");
        EditorProductList(id);
    })
    // 删除产品
    $(".delete").click(function () {
        var id=$(this).parent().parent().attr("id");
        DeleteProductList(id);
    })

}
// 编辑产品信息
function EditorProductList(id){
    layer.open({
        type: 1,
        title: "编辑",
        area: ["600px", "650px;"],
        shadeClose: false,
        skin: "yourclass",
        content: '<div class="modifyProduct"><form id="productForm" enctype="multipart/form-data">' +
        '<div class="marLR"><label>产品名：</label><input type="text" value="" id="name" class="contentStr" name="name">' +
        '<label>产地：</label><input type="text" value="" id="origin" class="contentStr" name="origin"></div>' +
        '<div class="marLR"><label>类型：</label><input type="text" value="" id="genre" class="contentStr" name="genre">' +
        '<label>销售状态：</label><select id="status" name="status"><option value="0">正常销售</option>' +
        '<option value="1">已下架</option></select></div>' +
        '<div class="marLR">' +
        '<label>销售量：</label><input type="text" value="" id="salesVolume" style="background-color:rgba(234,234,227,0.9);border:none;" name="salesVolume" readonly="readonly">' +
        '<label>市场价格：</label><input type="text" value="" style="margin-right:5px;" id="price" class="contentStr" name="price">元/斤</div>' +
        '<label class="marT_30">商品描述：</label><textarea  id="description" class="contentStr" name="description"></textarea>' +
        '<div class="marLR"><label style="width:120px">商品详情介绍压缩包：</label><input  name="zipFile" type="file" class="chooseFile" id="chooseFile"></div>' +
        '<div class="full_bg2 marT_10"><strong class="red">说明:</strong>使用压缩文件包形式实现功能!' +
        '<a class="red" id="download_examp" href="https://www.guzili.com.cn/discovery/details/productDemo.zip">点击下载示例压缩包</a></div>' +
        '<div class="full_bg2">1:压缩文件格式必须是zip格式;</div>' +
        '<div class="full_bg2">2:压缩包文件首页文件都以"index.html"命名;</div>' +
        '<div class="full_bg2">3:封面图片以"cover.png"命名;</div>' +
        '</form></div>',
        btn: ["确定", "取消"],
        btnAlign: "c",
        yes: function () {
            // 确认修改产品信息
            //  判断内容是否为空
            var sign=0;
            $(".modifyProduct .contentStr").each(function(){
                if($.trim($(this).val())==""){
                    var str=$(this).attr("id");
                    var sure=layer.confirm("产品"+obj[str]+"不能为空！",{
                        icon:0,
                        btn:["确认"]
                    },function(){
                        layer.close(sure);
                    })
                }
                else{
                    sign++;
                }
            })
            var priVal=$.trim($("#price").val());
            if(!isNaN(priVal)&&priVal>=0){
                sign++;
            }else{
                var sure1=layer.confirm("请输入正确的市场价格式！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.close(sure1);
                })
            }
            // 判断上传文件格式
            var filePath=$("#chooseFile").val();
            if(filePath!=""){
                var fileType=(filePath.substr(filePath.lastIndexOf("."))).toLowerCase();
                if(fileType!=".zip"){
                    var tishi2=layer.confirm("请上传Zip格式的文件！",{
                        icon:1,
                        btn:["确认"]
                    },function(){
                        layer.close(tishi2);
                    })
                }else{
                    if(sign==6){
                        var formData1=new FormData($("#productForm")[0]);
                        formData1.append("id",id);
                        alert($("#salesVolume").val());
                        $.ajax({
                            type:"post",
                            url:"http://www.guzili.com.cn/Rice_ssm/product/addProduct.action",
                            // url:"../json/sureDistribution.json",
                            dataType:"json",
                            async: true,
                            cache: false,
                            contentType: false,
                            processData: false,
                            data:formData1,
                            success:function(data){
                                if(data.msg=="false"){
                                    alert("请求资源失败，请重试！");
                                }else{
                                    GetProductList();
                                    layer.confirm("产品信息修改成功！",{
                                        icon:1,
                                        btn:["确认"]
                                    },function(){
                                        layer.closeAll();
                                    })
                                }
                            },
                            error:function(){
                                alert("服务器出错了！");
                            }
                        })
                    }
                }
            }
            else{
                if(sign==6){
                    var formData2=new FormData($("#productForm")[0]);
                    formData2.append("id",id);
                    $.ajax({
                        type:"post",
                        // url:"http://192.168.2.227:8080/Rice_ssm/product/addProduct.action",
                        url:"http://www.guzili.com.cn/Rice_ssm/product/addProduct.action",
                        // url:"../json/sureDistribution.json",
                        dataType:"json",
                        async: true,
                        cache: false,
                        contentType: false,
                        processData: false,
                        data:formData2,
                        // data:{
                        //     id:id,
                        //     name:$.trim($("#name").val()),
                        //     price:$.trim($("#price").val()),
                        //     description:$.trim($("#description").val()),
                        //     origin:$.trim($("#origin").val()),
                        //     status:$("#status").val(),
                        //     genre:$.trim($("#genre").val()),
                        //     zipFile:$("#chooseFile").val()
                        // },
                        success:function(data){
                            if(data.msg=="false"){
                                alert("请求资源失败，请重试！");
                            }else{
                                GetProductList();
                                layer.msg("产品信息修改成功！",{time: 800, icon:1},function(){
                                    layer.closeAll();
                                });
                            }
                        },
                        error:function(){
                            alert("服务器出错！");
                        }
                    })
                }
            }
        },
        btn2: function () {
            layer.closeAll();
        }
    })
    GetProduct(id);
}
// 获取产品信息
function GetProduct(id){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/product/porductSelectById.action",
        // url:"../json/product.json",
        dataType:"json",
        data:{
            id:id
        },
        success:function(data){
            $("#name").val(data.items.name);
            $("#origin").val(data.items.origin);
            $("#genre").val(data.items.genre);
            $("#price").val(data.items.price);
            $("#salesVolume").val(data.items.salesVolume);
            $("#description").val(data.items.description);
            $("#status option").each(function(){
                if($(this).val()==data.items.status){
                    $(this).attr("selected","selected");
                }
            })
    },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 新增产品列表
$(".addproduct").click(function(){
    layer.open({
        type: 1,
        title: "新增产品",
        area: ["600px", "650px;"],
        shadeClose: false,
        skin: "yourclass",
        content: '<div class="modifyProduct"><form id="productForm" enctype="multipart/form-data">' +
        '<div class="marLR"><label>产品名：</label><input type="text" value="" id="name" class="contentStr" name="name">' +
        '<label>产地：</label><input type="text" value="" id="origin" class="contentStr" name="origin"></div>' +
        '<div class="marLR"><label>类型：</label><input type="text" value="" id="genre" class="contentStr" name="genre">' +
        '<label>销售状态：</label><select id="status" name="status"><option value="0">正常销售</option>' +
        '<option value="1">已下架</option></select></div>' +
        '<div class="marLR">' +
        '<label>市场价格：</label><input type="text" value="" style="margin-right:5px;" id="price" class="contentStr" name="price">元/斤</div>' +
        '<label class="marT_30">商品描述：</label><textarea  id="description" class="contentStr" name="description"></textarea>' +
        '<div class="marLR"><label style="width:120px">商品详情介绍压缩包：</label><input  name="zipFile" type="file" class="chooseFile" id="chooseFile"></div>' +
        '<div class="full_bg2 marT_10"><strong class="red">说明:</strong>使用压缩文件包形式实现功能!' +
        '<a class="red" id="download_examp" href="https://www.guzili.com.cn/discovery/details/productDemo.zip">点击下载示例压缩包</a></div>' +
        '<div class="full_bg2">1:压缩文件格式必须是zip格式;</div>' +
        '<div class="full_bg2">2:压缩包文件首页文件都以"index.html"命名;</div>' +
        '<div class="full_bg2">3:封面图片以"cover.png"命名;</div>' +
        '</form></div>',
        btn: ["确定", "取消"],
        btnAlign: "c",
        yes: function () {
            // 确认修改产品信息
            //  判断内容是否为空
            var sign=0;
            $(".modifyProduct .contentStr").each(function(){
                if($.trim($(this).val())==""){
                    var str=$(this).attr("id");
                    var sure=layer.confirm("产品"+obj[str]+"不能为空！",{
                        icon:0,
                        btn:["确认"]
                    },function(){
                        layer.close(sure);
                    })
                }
                else{
                    sign++;
                }
            })
            var filePath=$("#chooseFile").val();
            if(filePath==""){
                var tishi1=layer.confirm("请上传压缩包文件！",{
                    icon:1,
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
            var priVal=$.trim($("#price").val());
            if(!isNaN(priVal)&&priVal>=0){
                sign++;
            }else{
                var sure1=layer.confirm("请输入正确的市场价格式！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.close(sure1);
                })
            }
            if(sign==7){
                // FormData对象的使用，用于文件上传
                var formData=new FormData($("#productForm")[0]);
                $.ajax({
                    type:"post",
                    url:"http://www.guzili.com.cn/Rice_ssm/product/addProduct.action",
                    // url:"../json/sureDistribution.json",
                    dataType:"json",
                    async: true,
                    cache: false,
                    contentType: false,
                    processData: false,
                    data:formData,
                    success:function(data){
                        if(data.msg=="false"){
                            alert("请求资源失败，请重试！");
                        }else{
                            GetProductList();
                            layer.msg("新增产品成功！",{time: 800, icon:1},function(){
                                layer.closeAll();
                            });
                        }
                    },
                    error:function(){
                        alert("服务器出错！");
                    }
                })
            }
        },
        btn2: function () {
            layer.closeAll();
        }
    })
})
// 删除产品
function  DeleteProductList(id){
    layer.confirm('确定要删除吗？', {
        icon:0,
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax({
            type:"get",
            url:"http://www.guzili.com.cn/Rice_ssm/product/delProduct.action",
            // url:"../json/deleteDistribution.json",
            dataType:"json",
            data:{
                uname:"uname",
                id:id
            },
            success:function(data){
                if(data.msg=="false"){
                    alert("请求资源失败，请重试！");
                }else{
                    GetProductList();
                    layer.msg(data.items,{time: 800, icon:1},function(){
                        layer.closeAll();
                    });
                }
            },
            error:function(data){
                alert("服务器出错！");
            }
        })
    }, function () {
        // 取消时调用的函数
    });
}
// 选择当前显示数目
$("#perpagenum").change(function(){
    count=$.trim($("#perpagenum").val());
    current_page=1;
    GetProductList();
})
// 搜索获得列表,
$("#searchBtn").click(function(){
   name=$.trim($("#search").val());
    current_page=1;
    GetProductList();
})