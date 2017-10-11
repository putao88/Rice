/**
 * Created by Administrator on 2017/7/21.
 */
$(document).ready(function(){
    // 获取管理员自己的信息
     GetPersonMes();
})
    // 点击侧边导航栏的效果
    $(".fguidebg").click(function(){
        $(this).siblings(".guide_child").toggle(200);
        $(this).parent().siblings().children(".guide_child").slideUp(200);
        $(this).parent().siblings().children(".fguidebg").children("div:last-child").removeClass("darrow").addClass("rarrow");
        if($(this).children("div:last-child").hasClass("rarrow")){
            $(this).children("div:last-child").removeClass("rarrow").addClass("darrow");
        }
        else{
            $(this).children("div:last-child").removeClass("darrow").addClass("rarrow");
        }
    })
// 点击退出，弹出确认框
$("#loginout").click(function(){
    layer.confirm('是否要退出系统？', {
        icon:2,
        btn: ['是','否'] //按钮
    }, function(){
        // layer.closeAll();
        // window.location.href="../html/login.html";
    }, function(){
        // 取消时调用的函数
    });
})

// 获取分页
function adjustTable(data,show){
    // var page_number=Math.ceil(data.total/data.per_page);
    var cpag_num='<li class="left_button">上一页</li>';
    var page_number=data.items.Statistics.total_pages;
    var k=parseInt(current_page)-4>page_number-9?page_number-9:parseInt(current_page)-4;
    for(var j=0;j<=9;k++){
        if(k>0&&k<=page_number){
            if(k==current_page) {
                cpag_num += "<li class='num' style='color:#fff;background-color:#68BB14'>" + k + "</li>";
            }else{
                cpag_num += "<li class='num'>" + k + "</li>";
            }
            j++;
        }else if(k>page_number) j++;
    }
    cpag_num+='<li class="right_button">下一页</li>';
    $("div.parger_num ul").html(cpag_num);
    tableEvent(show);
};
// 点击分页
function tableEvent(show) {
    $(".left_button").click(function () {
        if(current_page>1){
            current_page=current_page-1;
            show();
        }
    });
    $(".right_button").click(function () {
        if(current_page<total){
            current_page=parseInt(current_page)+1;
            show();
        }
    })
    $(".num").click(function () {
        current_page=$(this).text();
        show();
    })
};
// 获取管理员自己的信息
function GetPersonMes(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/admin_Info",
        // url:"../json/personMes.json",
        dataType:"json",
        success:function(data){
            $("#user").html(data.items.admin.username);
            $("#username").val(data.items.admin.username);
            $("#telepho").val(data.items.admin.phone);
            var id=data.items.admin.id;
            var pwd=data.items.admin.password;
            var salt=data.items.admin.salt;
            // 修改密码弹出框
            $("#changePwd").click(function(){
                ChangePWD(id,salt,pwd);
            })
        }
    })
}