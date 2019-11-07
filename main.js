var viewer;
var entities;
var s2layer;
function initialize() {
    Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZTViOWUyYy1iZjZkLTQ5NTktOTk3My0yZGM4ZTE0ZGZlYWUiLCJpZCI6MTc1NDQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzIzNjQyMzF9.fkI-5SQ2LERgGpjNVEG3XZ_2yFOhewjbqzm-E6V4Z_M';
    viewer = new Cesium.Viewer('cesiumContainer',
    {animation:false,
    timeline:false
    });

    //loadGeoJSON([0,1,2,3],'h3')
    //loadGeoJSON([0,1,2,3,4,5],'s2')
    //loadGeoJSON([0],'eaggrT')
}

function loadGeoJSON(levels,type){
    levels.forEach(function(e){
        var promise = Cesium.GeoJsonDataSource.load(type + '_level' + e.toString() + '.geojson',{
            fill: Cesium.Color.fromRandom({
                alpha: 0.02
            }),
            stroke: Cesium.Color.fromRandom({
                minimumRed : 0.75,
                minimumGreen : 0.75,
                minimumBlue : 0.75,
                alpha : 1.0
            }),
            strokeWidth: 6
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


function onClick(type,num) {

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

