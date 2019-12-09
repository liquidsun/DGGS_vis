var viewer;
var entities;
var handler;

// On document load
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

    //Upload config file
    let config = getConfig('data/app_config.json');
    config.then(d=>{
        //console.log(d);
        //Populate menu element
        createButtons(d)
    })
    //add highlighting functionality
    highlightEntityOnClick()
}


//gets config.json from accepted string path
async function getConfig(path){
        let promise = await fetch(path);
        //console.log(promise)
        let json_result = await promise.json();
        return json_result
}

//Creates button groups to control layers in menu based on accepted config.json
function createButtons(json) {
    //iterate through each root element
    json.buttonGroups.forEach(e=>{
        //add button group name
        $('<span><strong>' + e.fullname + '</strong></span><span/><strong/><br><br>').appendTo('.backdrop');
        //add container
        $('<div></div>',{
            "class": e.name
        }).appendTo('.backdrop');

        //add button group element
        let currentBGroup = $('<div></div>',{
            "class":"btn-group",
            "role":"group"
        }).appendTo('.'+ e.name);
        $('<br>').appendTo('.'+ e.name)
        //iterate through levels array, create button for each
        //and assign click event listener
        e.levels.forEach(l=>{
          var curButton =  $('<button></button>', {
                "type":"button",
                "class":"btn btn-secondary",
                "text":l
            })
            curButton.on('click',function (){
                if (curButton.attr('class') == "btn btn-secondary"){
                    curButton.removeClass("btn btn-secondary").addClass("btn btn-secondary active");
                }else
                {
                    curButton.removeClass("btn btn-secondary active").addClass("btn btn-secondary");
                }
                onLayerButtonClick(e.name,l)}).appendTo(currentBGroup);
        })
    })
}

//Loads geojson file to Cesium datasources using levels array and type string
//to concatenate proper file name
function loadGeoJSON(levels,type){
    levels.forEach(e=>{
        var promise = Cesium.GeoJsonDataSource.load('data/' + type + '_level' + e.toString() + '.geojson',{

        //create random colors for interiors and borders
            fill: Cesium.Color.fromRandom({
                alpha: 0.05
            }),
            stroke: Cesium.Color.fromRandom({
                minimumRed : 0.6,
                minimumGreen : 0.6,
                minimumBlue : 0.6,
                alpha : 1.0
            }),
            strokeWidth: 20
        });

        promise.then(datasource=>{
        //assign name to new datasource to be able to get it
            datasource.name = type + '_' + e.toString()
            datasource.show = true;
        //transform geometry type from planar to geodesic to avoid errors on the globe's poles
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


//highlight feature on click
function highlightEntityOnClick(){

    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    //click event handler
    handler.setInputAction(movement=>{
        //console.log(movement);

        //get clicked feature
        var pickedObject = viewer.scene.pick(movement.position);
        if (Cesium.defined(pickedObject)) {
           //create new feature with same geometry
            var highlightObject = new Cesium.Entity({
                name:"highlited feature",
                polygon: {
                    hierarchy: pickedObject.id.polygon.hierarchy,
                    material: Cesium.Color.YELLOW.withAlpha(0.5)
                }
            });
            //console.log(highlightObject);
            //remove all previous highlight features
            viewer.entities.removeAll();
            //add new one
            viewer.entities.add(highlightObject)
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

//Layers control button click event handler. Accepts type string
//and num level as array, shows correspond layer or loads it
function onLayerButtonClick(type,num) {
    let layer = viewer.dataSources.getByName(type + '_' + num)[0];
    Cesium.when(layer).then(it=>{
        if (it){
            it.show = !it.show;
        }
        else{
            loadGeoJSON([num],type)
        }
    })
}
document.addEventListener("DOMContentLoaded", initialize);
