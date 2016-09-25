app.controller('DistancesCtrl', function($scope, Course, ngProgress, Rating, Building, toaster, $http, $filter) {

    $scope.course = new Course();
    $scope.results = [];
    $scope.user = window.user;
    $scope.picked_courses = [];
    $scope.building = new Building();
    $scope.allBuildings = Building.query();




    var refresh = function() {
        $scope.courses = Course.query();
        $scope.course = "";
    }
    refresh();



    $scope.addCourse = function(picked){
      if($scope.picked_courses.indexOf(picked) == -1){
        $scope.picked_courses.push(picked);
      }
    };

    $scope.search = function(val) {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/api/courses'
        }).
        success(function(data, status, headers, config) {
            $scope.results = [];
            for (i = 0; i < data.length; i++) {
                if (data[i].name && data[i].name.includes(val)) {
                    $scope.results.push(data[i]);
                }
            }
        })
    };

    httpGet = function(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.send(null);
        return xmlHttp.responseText;
    };

    $scope.populate_buildings = function(){

      var jsonData = httpGet("https://raw.githubusercontent.com/cobalt-uoft/datasets/master/buildings.json");
      var lines = jsonData.split('\n');
      for(i = 0; i < lines.length - 1; i++){
        var building = JSON.parse(lines[i]);
        var name = building.name;
        var code = building.code;
        var lat = building.lat;
        var long = building.lng;
        createBuilding(name, code, lat, long);
      }


    };

    createBuilding = function(name, code, lat, long) {
        $scope.building = new Building();
        $scope.building.name = name;
        $scope.building.code = code;
        $scope.building.lat = lat;
        $scope.building.long = long;
        $scope.add($scope.building);
    };


    $scope.add = function(building) {
        Building.save(building, function(building) {
            refresh();
        });
    };


    $scope.update = function(building) {
        building.$update(function() {
            refresh();
        });
    };

    $scope.remove = function(building) {
        building.$delete(function() {
            refresh();
        });
    };

    $scope.edit = function(id) {
        $scope.building = building.get({
            id: id
        });
    };










})
