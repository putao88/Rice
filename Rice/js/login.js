/**
 * Created by Administrator on 2017/8/2.
 */
$(document).ready(function(){
    // 登录选中框加样式
    $("#username,#password").focus(function(){
        $(this).parent().addClass("seltbg");
    })
    $("#username,#password").blur(function(){
        $(this).parent().removeClass("seltbg");
    })
})
