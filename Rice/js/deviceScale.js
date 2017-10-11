/**
 * Created by Administrator on 2017/7/31.
 */
var current_page=1;
var count=$("#perpagenum").val();
var total=0;
$("document").ready(function(){
    // 获取销售设备情况列表
    GetdeviceScale();
})
// 获取销售设备情况列表
function GetdeviceScale(){
    $.ajax({
        type:"get",
        url:"http://www.guzili.com.cn/Rice_ssm/reports/selectEqSalesRecordPaging",
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
                DeviceScaleShow(data);
                adjustTable(data,GetdeviceScale);
            }
        },
        error:function(){
            alert("服务器出错！");
        }
    })
}
// 展示设备销售情况
function DeviceScaleShow(data){
    var tbody="";
    for(var i in data.items.datasets){
        var number=(parseInt(current_page)-1)*count+parseInt(i)+1;
       tbody+="<tr id="+data.items.datasets[i].id+"><td>"+number+"</td><td>"+data.items.datasets[i].equipmentNum+
               "</td><td>"+data.items.datasets[i].weight+"</td><td>"+data.items.datasets[i].unitPrice+"</td><td>"+
           data.items.datasets[i].total+"</td><td>"+data.items.datasets[i].discount+"</td><td>"+data.items.datasets[i].createTime+"</td></tr>"
    }
    $("#deviceScale").find("tbody").html(tbody);
    $("#total_data").html(data.items.Statistics.total_data);
    if($("#deviceScale").find("tbody").html()==""){
        $(".nodata").show();
    }else{
        $(".nodata").hide();
    }
}
// 选择当前页数目
$("#perpagenum").change(function(){
    count=$("#perpagenum").val();
    current_page=1;
    GetdeviceScale();
})
// Excel导出函数
$("#export").click(function(){
    Export();
})
// Excel导出数据
function Export(){
    var idTmr;
    function  getExplorer() {
        var explorer = window.navigator.userAgent ;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
            return 'ie';
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
            return 'Firefox';
        }
        //Chrome
        else if(explorer.indexOf("Chrome") >= 0){
            return 'Chrome';
        }
        //Opera
        else if(explorer.indexOf("Opera") >= 0){
            return 'Opera';
        }
        //Safari
        else if(explorer.indexOf("Safari") >= 0){
            return 'Safari';
        }
    }
    function method1(tableid) {//整个表格拷贝到EXCEL中
        if(getExplorer()=='ie')
        {
            var curTbl = document.getElementById(tableid);
            var oXL = new ActiveXObject("Excel.Application");

            //创建AX对象excel
            var oWB = oXL.Workbooks.Add();
            //获取workbook对象
            var xlsheet = oWB.Worksheets(1);
            //激活当前sheet
            var sel = document.body.createTextRange();
            sel.moveToElementText(curTbl);
            //把表格中的内容移到TextRange中
            sel.select;
            //全选TextRange中内容
            sel.execCommand("Copy");
            //复制TextRange中内容
            xlsheet.Paste();
            //粘贴到活动的EXCEL中
            oXL.Visible = true;
            //设置excel可见属性

            try {
                var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
            } catch (e) {
                print("Nested catch caught " + e);
            } finally {
                oWB.SaveAs(fname);

                oWB.Close(savechanges = false);
                //xls.visible = false;
                oXL.Quit();
                oXL = null;
                //结束excel进程，退出完成
                //window.setInterval("Cleanup();",1);
                idTmr = window.setInterval("Cleanup();", 1);

            }

        }
        else
        {
            tableToExcel('deviceScale')
        }
    }
    function Cleanup() {
        window.clearInterval(idTmr);
        CollectGarbage();
    }
    var tableToExcel = (function() {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
            format = function(s, c) {
                return s.replace(/{(\w+)}/g,
                    function(m, p) { return c[p]; }) }
        return function(table, name) {
            if (!table.nodeType) table = document.getElementById(table)
            var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
            window.location.href = uri + base64(format(template, ctx))
        }
    })()
    method1('deviceScale');
}
