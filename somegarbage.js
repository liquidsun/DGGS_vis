function adds2layer(){
    var polygonList = createPolygonListFromBounds({
        bounds: [[-180.0, -90], [180.0, 90]],
        level: 7
    });

    polygonList.forEach(function(e) {
        console.log(e)
        var arr1d = [].concat(...e.path);
        console.log(arr1d)
        entities.add({
            parent: s2layer,
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(arr1d),
                material: Cesium.Color.BLUE.withAlpha(0.2),
                height: 0,
                outline: true,
                outlineColor: Cesium.Color.BLUE
            }
        })
    })
}

function add0H3Hexes(){
    h3_1 = entities.add(new Cesium.Entity());
    var hex0 = [];
    h3.getRes0Indexes().forEach(function (e) {
        hex0.push(h3.h3ToGeoBoundary(e,true))
    })
    hex0.forEach(function(e){
        var arr1d = [].concat(...e);
        entities.add({
            parent : h3_1,
            polygon : {
                hierarchy : Cesium.Cartesian3.fromDegreesArray(arr1d),
                material : Cesium.Color.RED.withAlpha(0.2),
                height : 0,
                outline : true,
                outlineColor : Cesium.Color.RED
            }
        })
    });
}