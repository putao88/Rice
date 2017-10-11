/**
 * Created by Administrator on 2017/7/27.
 */
$("document").ready(function(){

})

// 修改密码
function ChangePWD(id,salt,pwd){
    layer.open({
        type:1,
        title:"修改用户密码",
        area:["280px","300px;"],
        shadeClose:false,
        skin:"yourclass",
        content:'<div class="pwdLayer"><div class="full_bg marginT_30"><span class="full_namelay">原密码：</span><input type="text" class="pwd" id="oldPWD"></div>' +
        '<div class="full_bg"><span class="full_namelay">新密码：</span><input type="text" class="pwd" id="newPWD"><span class="promptPwd" id="promptnewPwd">注：请填写6到20位任意字符！</span></div>' +
        '<div class="full_bg"><span class="full_namelay">确认密码：</span><input type="text" class="pwd" id="rePWD"></div></div>' ,
        btn:["确定","取消"],
        btnAlign:"c",
        yes:function(){
            // 判断输入是否为空
            var sign=0;
                if($.trum($("#newPWD").val()).length<6||$.trim($("#newPWD").val()).length>20){
                    var sure1=layer.confirm("新密码必须在6到20位之间！",{
                        icon:0,
                        btn:["确认"]
                    },function(){
                        layer.close(sure1);
                    })
                }else{
                    sign++;
                }
                if($.trim($("#newPWD").val())!=$.trim($("#rePWD").val())){
                    var sure2=layer.confirm("两次输入密码不一致！",{
                        icon:0,
                        btn:["确认"]
                    },function(){
                        layer.close(sure2);
                    })
                }else{
                    sign++;
                }
            if($("#oldPWD").val()!=pwd){
                var sure3=layer.confirm("原密码错误！",{
                    icon:0,
                    btn:["确认"]
                },function(){
                    layer.close(sure3);
                })
            }else{
                sign++;
            }
                if(sign==3){
                $.ajax({
                    type:"get",
                    url:"http://www.guzili.com.cn/Rice_ssm/editAdminPassword",
                    dataType:"json",
                    data:{
                        "userid":id,
                        "password":$.trim($("#oldPWD").val()),
                        "newpassword":$.trim($("#newPWD").val()),
                        "salt":salt
                    },
                    success:function(data){
                        if(data.msg=="false"){
                            alert("请求资源失败，请重试！");
                        }else{
                            layer.confirm(data.items,{
                                icon:0,
                                btn:["确认"]
                            },function(){
                                layer.closeAll();
                            })
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
}