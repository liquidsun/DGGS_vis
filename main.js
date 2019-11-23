var viewer;
var entities;
var s2layer;
var handler;
function initialize() {
    Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZTViOWUyYy1iZjZkLTQ5NTktOTk3My0yZGM4ZTE0ZGZlYWUiLCJpZCI6MTc1NDQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzIzNjQyMzF9.fkI-5SQ2LERgGpjNVEG3XZ_2yFOhewjbqzm-E6V4Z_M';
    viewer = new Cesium.Viewer('cesiumContainer',
    {   animation:false,
        timeline:false,
        geocoder:false,
        homeButton:false,
        navigationHelpButton:false,
        baseLayerPicker:false
    });

    
    
    //loadGeoJSON([0,1,2,3],'h3')
    //loadGeoJSON([0,1,2,3,4,5],'s2')
    //loadGeoJSON([0],'eaggrT')
    highlightEntityOnClick()
}

function createButtons() {
    
}

function loadGeoJSON(levels,type){
    levels.forEach(function(e){
        var promise = Cesium.GeoJsonDataSource.load('data/' + type + '_level' + e.toString() + '.geojson',{
            fill: Cesium.Color.fromRandom({
                alpha: 0.02
            }),
            stroke: Cesium.Color.fromRandom({
                minimumRed : 0.5,
                minimumGreen : 0.5,
                minimumBlue : 0.5,
                alpha : 1.0
            }),
            strokeWidth: 20
        });

        promise.then(function (datasource) {
            datasource.name = type + '_' + e.toString()
            datasource.show = true
        for (var i = 0; i < datasource.entities.values.length; i++) {
            var entity = datasource.entities.values[i];
            if (Cesium.defined(entity.polygon)) {
                entity.polygon.arcType = Cesium.ArcType.GEODESIC;
            }
        }
        viewer.dataSources.add(datasource)
        })

    })
}

function show_layers(names){

}

function highlightEntityOnClick(){

    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(function(movement) {
        //console.log(movement);
        var pickedObject = viewer.scene.pick(movement.position);
        if (Cesium.defined(pickedObject)) {
            var highlightObject = new Cesium.Entity({
                name:"highlited feature",
                polygon: {
                    hierarchy: pickedObject.id.polygon.hierarchy,
                    material: Cesium.Color.YELLOW.withAlpha(0.5)
                }
            });
            //console.log(highlightObject);
            viewer.entities.removeAll();
            //console.log(pickedObject);
            //console.log(pickedObject.id.polygon.material);
            //console.log(viewer.dataSources);
            viewer.entities.add(highlightObject)
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}


function onLayerButtonClick(type,num) {
    layer = viewer.dataSources.getByName(type + '_' + num)[0];
    Cesium.when(layer).then(function(it){
        if (it){
            it.show = !it.show;
        }
        else{
            loadGeoJSON([num],type)
        }
    })
}

