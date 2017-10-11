/**
 * Created by Administrator on 2017/7/26.
 */
var years=$("#years").val();
var ordersAllArray=new Array();
var ordersFinishArray=new Array();
var ordersRefundArray=new Array();
var ordersDefeatedArray=new Array();
var ordersAmountArray=new Array();
$("document").ready(function(){
    // 获取订单信息
    GetDransaction();
})
// 选择年份
$("#years").change(function(){
    years=$("#years").val();
    current_page=1;
    GetDransaction();
})
// 获取订单年信息
function GetDransaction(){
    $.ajax({
        type:"get",
        dataType:"json",
        url:"http://www.guzili.com.cn/Rice_ssm/order/selsetOrdersChart.action",
        // url:"../json/dransaction.json",
        data:{
            years:years
        },
        success:function(data){
            $("#transactMoney").html(data.items.orderCustom.odersTotal);
            $("#transactOrder").html(data.items.orderCustom.odersCount);
            $("#transactSuc").html(data.items.orderCustom.odersFinishCount);
            $("#transactFail").html(data.items.orderCustom.odersDefeatCount);
            $("#transacRefund").html(data.items.orderCustom.ordersRefundCount);
            for(var i in data.items.listReport){
                ordersAllArray[i]=data.items.listReport[i].ordersAll;
                ordersFinishArray[i]=data.items.listReport[i].ordersFinish;
                ordersRefundArray[i]=data.items.listReport[i].ordersRefund;
                ordersDefeatedArray[i]=data.items.listReport[i].ordersDefeated;
                ordersAmountArray[i]=(data.items.listReport[i].ordersAmount/10000).toFixed(6);
            }
            // 图表配置
            ECharts();
        }
    })
}
// 年图表配置
function ECharts(){
    var myChart = echarts.init(document.getElementById('chart'));

    // 指定图表的配置项和数据
    option = {
        title : {
            text: '月订单购买交易记录',
            subtext: '实时获取用户订单购买记录',
            textStyle:{
                fontSize:16
            }
        },
        grid:{
            x: 40,
            y: 80,
            x2:20,
            y2:25
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['所有订单','已取消','已付款','付款金额<万元>','已退款']
        },
        toolbox: {
            show : true,
            // orient: 'vertical',
            feature : {
                dataView : {
                    show: true,
                    readOnly: false,
                    textareaBorderColor:'#e1e1e1',
                    textColor:'#646464',
                    buttonColor:'#68bb14',
                    optionToContent: function(opt) {
                        var axisData = opt.xAxis[0].data;
                        var series = opt.series;
                        var table = '<table>' +
                            '<tbody><tr>'
                            + '<td>时间</td>'
                            + '<td>' + series[0].name + '</td>'
                            + '<td>' + series[1].name + '</td>'
                            + '<td>' + series[2].name + '</td>'
                            + '<td>' + series[3].name + '</td>'
                            + '<td>' + series[4].name + '</td>'
                            + '</tr>';
                        for (var i = 0, l = axisData.length; i < l; i++) {
                            table += '<tr>'
                                + '<td>' + axisData[i] + '</td>'
                                + '<td>' + series[0].data[i] + '</td>'
                                + '<td>' + series[1].data[i] + '</td>'
                                + '<td>' + series[2].data[i] + '</td>'
                                + '<td>' + series[3].data[i]+ '</td>'
                                + '<td>' + series[4].data[i] + '</td>'
                                + '</tr>';
                        }
                        table += '</tbody></table>';
                        return table;
                    }
                },
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            },

        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                triggerEvent:{
                    name:true
                },
                axisLabel:{
                    clickable:true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'所有订单',
                type:'bar',
                // data:[ordersAllArray[0],ordersAllArray[1],ordersAllArray[2],ordersAllArray[3],ordersAllArray[4],ordersAllArray[5],ordersAllArray[6],ordersAllArray[7],ordersAllArray[8],ordersAllArray[9],ordersAllArray[10],ordersAllArray[11]],
                data:ordersAllArray,
                itemStyle: {
                    normal: {color:'#68bb14'}
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'}
                        // {type : 'min', name: '最小值'}
                    ]
                }
            },
            {
                name:'已取消',
                type:'bar',
                // data:[ordersDefeatedArray[0],ordersDefeatedArray[1],ordersDefeatedArray[2],ordersDefeatedArray[3],ordersDefeatedArray[4],ordersDefeatedArray[5],ordersDefeatedArray[6],ordersDefeatedArray[7],ordersDefeatedArray[8],ordersDefeatedArray[9],ordersDefeatedArray[10],ordersDefeatedArray[11]],
                data:ordersDefeatedArray,
                itemStyle: {
                    normal: {color:'#b4b4b4'}
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'}
                        // {type : 'min', name: '最小值'}
                    ]
                }
            },
            {
                name:'已付款',
                type:'bar',
                data:[ordersFinishArray[0],ordersFinishArray[1],ordersFinishArray[2],ordersFinishArray[3],ordersFinishArray[4],ordersFinishArray[5],ordersFinishArray[6],ordersFinishArray[7],ordersFinishArray[8],ordersFinishArray[9],ordersFinishArray[10],ordersFinishArray[11]],
                itemStyle: {
                    normal: {color:'#ffa800' }
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'}
                        // {type : 'min', name: '最小值'}
                    ]
                }
            },
            {
                name:'付款金额<万元>',
                type:'bar',
                // data:[ordersAmountArray[0]/10000,ordersAmountArray[1]/10000,ordersAmountArray[2]/10000,ordersAmountArray[3]/10000,ordersAmountArray[4]/10000,ordersAmountArray[5]/10000,ordersAmountArray[6]/10000,ordersAmountArray[7]/10000,ordersAmountArray[8]/10000,ordersAmountArray[9]/10000,ordersAmountArray[10]/10000,ordersAmountArray[11]/10000],
                data:ordersAmountArray,
                itemStyle: {
                    normal: {
                        color:'#a499bb'
                    }
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'}
                        // {type : 'min', name: '最小值'}
                    ]
                }
            },
            {
                name:'已退款',
                type:'bar',
                // data:[ordersRefundArray[0],ordersRefundArray[1],ordersRefundArray[2],ordersRefundArray[3],ordersRefundArray[4],ordersRefundArray[5],ordersRefundArray[6],ordersRefundArray[7],ordersRefundArray[8],ordersRefundArray[9],ordersRefundArray[10],ordersRefundArray[11]],
                data:ordersRefundArray,
                itemStyle: {
                    normal: {color:'#ff5757'}
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'}
                        // {type : 'min', name: '最小值'}
                    ]
                }
            }

        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    myChart.on('click', function (params) {
        var monthArray=["0","1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
      for(var i=1;i<=12;i++){
          if(params.value==monthArray[i]){
              $("#chartMonth").parent().show();
             var months=i;
              GetDransactionMonth(months);
          }
      }
    })
}
// 获取订单月详细信息
function GetDransactionMonth(months){
    $.ajax({
        type:"get",
        dataType:"json",
        url:"http://www.guzili.com.cn/Rice_ssm/order/monthlySales.action",
        // url:"../json/dransactionMonth.json",
        data:{
            years:years,
            months:months
        },
        success:function(data){
            console.log(data);
            for(var i in data.items){
                ordersAllArray[i]=data.items[i].ordersAll;
                ordersFinishArray[i]=data.items[i].ordersFinish;
                ordersRefundArray[i]=data.items[i].ordersRefund;
                ordersDefeatedArray[i]=data.items[i].ordersDefeated;
                ordersAmountArray[i]=data.items[i].ordersAmount;
            }
            // 图表配置
            EChartsMonth(months);
        }
    })
}
// 月图表配置
function EChartsMonth(months){
    var myChartMonth= echarts.init(document.getElementById('chartMonth'));

    // 指定图表的配置项和数据
    optionMonth= {
        title : {
            text: months+'月订单购买交易记录',
            subtext: '实时获取用户订单购买记录',
            textStyle:{
                fontSize:16
            }
        },
        grid:{
            x: 40,
            y: 80,
            x2:20,
            y2:25
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['所有订单','已取消','已付款','付款金额<元>','已退款']
        },
        toolbox: {
            show : true,
            // orient: 'vertical',
            feature : {
                dataView : {
                    show: true,
                    readOnly: false,
                    textareaBorderColor:'#e1e1e1',
                    textColor:'#646464',
                    buttonColor:'#68bb14',
                    optionToContent: function(opt) {
                        var axisData = opt.xAxis[0].data;
                        var series = opt.series;
                        var table = '<table>' +
                            '<tbody><tr>'
                            + '<td>时间</td>'
                            + '<td>' + series[0].name + '</td>'
                            + '<td>' + series[1].name + '</td>'
                            + '<td>' + series[2].name + '</td>'
                            + '<td>' + series[3].name + '</td>'
                            + '<td>' + series[4].name + '</td>'
                            + '</tr>';
                        for (var i = 0, l = axisData.length; i < l; i++) {
                            table += '<tr>'
                                + '<td>' + axisData[i] + '</td>'
                                + '<td>' + series[0].data[i] + '</td>'
                                + '<td>' + series[1].data[i] + '</td>'
                                + '<td>' + series[2].data[i] + '</td>'
                                + '<td>' + series[3].data[i]+ '</td>'
                                + '<td>' + series[4].data[i] + '</td>'
                                + '</tr>';
                        }
                        table += '</tbody></table>';
                        return table;
                    }
                },
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            },

        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
                triggerEvent:{
                    name:true
                },
                axisLabel:{
                    clickable:true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'所有订单',
                type:'bar',
                data:[ordersAllArray[0],ordersAllArray[1],ordersAllArray[2],ordersAllArray[3],ordersAllArray[4],ordersAllArray[5],
                    ordersAllArray[6],ordersAllArray[7],ordersAllArray[8],ordersAllArray[9],ordersAllArray[10],ordersAllArray[11],
                    ordersAllArray[12],ordersAllArray[13],ordersAllArray[14],ordersAllArray[15],ordersAllArray[16],ordersAllArray[17],
                    ordersAllArray[18],ordersAllArray[19],ordersAllArray[20],ordersAllArray[21],ordersAllArray[22],ordersAllArray[23],
                    ordersAllArray[24],ordersAllArray[25],ordersAllArray[26],ordersAllArray[27],ordersAllArray[28],ordersAllArray[29],
                    ordersAllArray[30]],
                itemStyle: {
                    normal: {color:'#68bb14'}
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'}
                        // {type : 'min', name: '最小值'}
                    ]
                }
            },
            {
                name:'已取消',
                type:'bar',
                data:[ordersDefeatedArray[0],ordersDefeatedArray[1],ordersDefeatedArray[2],ordersDefeatedArray[3],ordersDefeatedArray[4],
                    ordersDefeatedArray[5],ordersDefeatedArray[6],ordersDefeatedArray[7],ordersDefeatedArray[8],ordersDefeatedArray[9],
                    ordersDefeatedArray[10],ordersDefeatedArray[11],ordersDefeatedArray[12],ordersDefeatedArray[13],ordersDefeatedArray[14],
                    ordersDefeatedArray[15],ordersDefeatedArray[16],ordersDefeatedArray[17],ordersDefeatedArray[18],ordersDefeatedArray[19],
                    ordersDefeatedArray[20],ordersDefeatedArray[21],ordersDefeatedArray[22],ordersDefeatedArray[23],ordersDefeatedArray[24],
                    ordersDefeatedArray[25],ordersDefeatedArray[26],ordersDefeatedArray[27],ordersDefeatedArray[28],ordersDefeatedArray[29],
                    ordersDefeatedArray[30]],
                itemStyle: {
                    normal: {color:'#b4b4b4'}
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'}
                        // {type : 'min', name: '最小值'}
                    ]
                }
            },
            {
                name:'已付款',
                type:'bar',
                data:[ordersFinishArray[0],ordersFinishArray[1],ordersFinishArray[2],ordersFinishArray[3],ordersFinishArray[4],ordersFinishArray[5],
                    ordersFinishArray[6],ordersFinishArray[7],ordersFinishArray[8],ordersFinishArray[9],ordersFinishArray[10],ordersFinishArray[11],
                    ordersFinishArray[12],ordersFinishArray[13],ordersFinishArray[14],ordersFinishArray[15],ordersFinishArray[16],ordersFinishArray[17],
                    ordersFinishArray[18],ordersFinishArray[19],ordersFinishArray[20],ordersFinishArray[21],ordersFinishArray[22],ordersFinishArray[23],
                    ordersFinishArray[24],ordersFinishArray[25],ordersFinishArray[26],ordersFinishArray[27],ordersFinishArray[28],ordersFinishArray[29],
                    ordersFinishArray[30]],
                itemStyle: {
                    normal: {color:'#ffa800' }
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'}
                        // {type : 'min', name: '最小值'}
                    ]
                }
            },
            {
                name:'付款金额<元>',
                type:'bar',
                data:[ordersAmountArray[0],ordersAmountArray[1],ordersAmountArray[2],ordersAmountArray[3],ordersAmountArray[4],ordersAmountArray[5],
                    ordersAmountArray[6],ordersAmountArray[7],ordersAmountArray[8],ordersAmountArray[9],ordersAmountArray[10],ordersAmountArray[11],
                    ordersAmountArray[12],ordersAmountArray[13],ordersAmountArray[14],ordersAmountArray[15],ordersAmountArray[16],ordersAmountArray[17],
                    ordersAmountArray[18],ordersAmountArray[19],ordersAmountArray[20],ordersAmountArray[21],ordersAmountArray[22],ordersAmountArray[23],
                    ordersAmountArray[24],ordersAmountArray[25],ordersAmountArray[26],ordersAmountArray[27],ordersAmountArray[28],ordersAmountArray[29],
                    ordersAmountArray[30]],
                itemStyle: {
                    normal: { color:'#a499bb'}
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'}
                        // {type : 'min', name: '最小值'}
                    ]
                }
            },
            {
                name:'已退款',
                type:'bar',
                data:[ordersRefundArray[0],ordersRefundArray[1],ordersRefundArray[2],ordersRefundArray[3],ordersRefundArray[4],ordersRefundArray[5],
                    ordersRefundArray[6],ordersRefundArray[7],ordersRefundArray[8],ordersRefundArray[9],ordersRefundArray[10],ordersRefundArray[11],
                    ordersRefundArray[12],ordersRefundArray[13],ordersRefundArray[14],ordersRefundArray[15],ordersRefundArray[16],ordersRefundArray[17],
                    ordersRefundArray[18],ordersRefundArray[19],ordersRefundArray[20],ordersRefundArray[21],ordersRefundArray[22],ordersRefundArray[23],
                    ordersRefundArray[24],ordersRefundArray[25],ordersRefundArray[26],ordersRefundArray[27],ordersRefundArray[28],ordersRefundArray[29],
                    ordersRefundArray[30]],
                itemStyle: {
                    normal: {color:'#ff5757'}
                },
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'}
                        // {type : 'min', name: '最小值'}
                    ]
                }
            }

        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChartMonth.setOption(optionMonth);
}