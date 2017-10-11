/**
 * Created by Administrator on 2017/7/31.
 */
$("document").ready(function(){
   // 配置地图
    Map();
})
function Map(){
    var map;
    createMap();//创建地图
    setMapEvent();//设置地图事件
    addMapControl();//向地图添加控件
    addMapOverlay();//向地图添加覆盖物
}
//创建地图
function createMap(){
    map=new BMap.Map("mapContainer");
    map.centerAndZoom(new BMap.Point(112.85607,30.882112),5);/*设置地图中心*/
}
//设置地图事件
function setMapEvent(){
    map.enableScrollWheelZoom();/*启用滚轮放大缩小，默认禁用。*/
    map.enableKeyboard();/*启用键盘*/
    map.enableDragging();/*启用地图拖拽*/
    map.enableDoubleClickZoom();/*双击放大地图*/
}
//向地图添加控件
function addMapControl(){
    var scaleControl = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
    scaleControl.setUnit(BMAP_UNIT_IMPERIAL);
    map.addControl(scaleControl);
    var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
    map.addControl(navControl);
    var overviewControl = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:true});
    map.addControl(overviewControl);
}
// //向地图添加覆盖物
function addMapOverlay(){
    $.ajax({
        dataType:"json",
        type: "get",
        url:"http://www.guzili.com.cn/Rice_ssm/reports/bdmap.action",
        error: function(request) {
            alert("服务器报错！");
        },
        success: function(data) {
            var markers = data;
            for(var index = 0; index < markers.length; index++ ){
                var point = new BMap.Point(markers[index].position.lng,markers[index].position.lat);
                var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png",new BMap.Size(20,25),{
                    imageOffset: new BMap.Size(markers[index].image.width,markers[index].image.height)
                })});
                var label = new BMap.Label(markers[index].title,{offset: new BMap.Size(25,5)});
                // 设置label的样式
                label.setStyle({
                    "height":"20px",
                    "width":"100px",
                    "textAlign":"center",
                    "lineHeight":"20px"
                })
                var opts = {
                    width: 200,
                    title: markers[index].title,
                    enableMessage: false
                };
                var infoWindow = new BMap.InfoWindow(markers[index].content,opts);
                marker.setLabel(label);
                addClickHandler(marker,infoWindow);
                map.addOverlay(marker);
            };
        }
    });
    // var infoWindow = new BMap.InfoWindow("深圳市福田区莲花街道五洲星苑");
    // addClickHandler(marker,infoWindow);
    // var label=new BMap.Label("DB0001",{offset: new BMap.Size(20,-5)});
    // marker.setLabel(label);
    // map.addOverlay(marker);

}
function addClickHandler(target,window){
    target.addEventListener("click",function(){
        target.openInfoWindow(window);
    });
}