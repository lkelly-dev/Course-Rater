app.controller('DistancesCtrl', function($scope, Course, ngProgress, Rating, Building, toaster, $http, $filter, NgMap) {

    $scope.course = new Course();
    $scope.building = new Building();
    $scope.allBuildings = Building.query();
    $scope.allCourses = Course.query();
    $scope.allRatings = Rating.query();
    $scope.user = window.user;
    $scope.results = [];
    $scope.picked_courses = [];
    $scope.distances = [];
    $scope.isCollapsed = false;


    var refresh = function() {
        $scope.courses = Course.query();
        $scope.course = "";
    }
    refresh();


    $scope.addCourse = function(course, section){
      if($scope.picked_courses.indexOf(section) == -1){
        section.name = course.name;
        var temp_loc = $scope.Buildingfilter(section.times[0].location.substring(0, 2));
        var blatlng = temp_loc.lat + ", " + temp_loc.long;
        section.location = blatlng;

        $scope.picked_courses.push(section);
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
                if (data[i].name && data[i].name.includes(val.toUpperCase())) {
                    $scope.results.push(data[i]);
                }
                if($scope.results.length == 15){
                  break;
                }
            }
        })
    };

    // $scope.search = function(val) {
    //         $scope.results = [];
    //         //console.log($scope.allCourses);
    //         for (i = 0; i < $scope.allCourses.length; i++) {
    //             if ($scope.allCourses[i].name && $scope.allCourses[i].name.includes(val)) {
    //                 $scope.results.push($scope.allCourses[i]);
    //               }
    //     }
    // };

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

    $scope.Ratingfilter = function(Course_id, User_id) {
        if (User_id) {
            return $filter('filter')($scope.allRatings, {
                courseID: Course_id,
                userID: User_id
            });
        }
        return $filter('filter')($scope.allRatings, {
            courseID: Course_id
        });
    };

    $scope.AverageRating = function(result) {
        var fuck = $scope.Ratingfilter(result._id);
        var total = 0;
        if (fuck.length > 0) {
            for (var i = 0; i < fuck.length; i++) {
                total += fuck[i].rating_value;
            }
            var avg = total / fuck.length;
            return avg;
        } else {
            return 0;
        }
    };

    NgMap.getMap().then(function(map) {
    // console.log(map.getCenter());
    // console.log('markers', map.markers);
    // console.log('shapes', map.shapes);
  });

  $scope.Buildingfilter = function(Building_code){
    return $filter('filter')($scope.allBuildings, {code: Building_code})[0];
  };


  $scope.courseGrabber = function(num) {
      if(num >= 0){
        //var course = $scope.picked_courses[num - 1].building.substring(0, 2);
        try {
          var course = $scope.picked_courses[num ].times[0].location.substring(0, 2);
          var building1 = $scope.Buildingfilter(course);
          var blatlng = building1.lat + ", " + building1.long
          return blatlng;
            }
            catch(err) {
              //console.log("OOPS");
              return undefined;
            }
      }
      else{

      }
  };

  $scope.isLocationValid = function(section){
    if(!section.times[0]){
      return false;
    }else if (section.times[0].location.substring(0, 2) == "ZZ") {
      return false;
    }
    return true;
  };

  $scope.removeCourse = function(pick){
    var index = $scope.picked_courses.indexOf(pick);
    $scope.picked_courses.splice(index, 1);
    //console.log("hello");
  };

  $scope.populateDistances = function(){
    $scope.distances.length = 0;
    if($scope.picked_courses.length > 1){
    for(i=1; i<$scope.picked_courses.length; i++){
      var first = $scope.picked_courses[i-1].location;
      var second = $scope.picked_courses[i].location;
      $scope.distanceBetweenTwoPoints(first, second, i-1);
    }
  }
};

  $scope.distanceBetweenTwoPoints = function(pOne, pTwo, num){

    if(pOne && pTwo){
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [pOne],
      destinations: [pTwo],
      travelMode: google.maps.TravelMode.WALKING
    }, function (response, status) {

      if (status == google.maps.DistanceMatrixStatus.OK) {
        console.log(response.rows[0].elements[0].duration.text);
        $scope.distances[num] = response.rows[0].elements[0].duration.text;
      }

    });
    }
  };

})
