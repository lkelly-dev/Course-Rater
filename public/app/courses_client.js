app.controller('CoursesCtrl', function($scope, Course, Rating, ngProgress, toaster, $http, $filter) {

    $scope.course = new Course();
    $scope.rating = new Rating();
    $scope.results = [];
    $scope.isCollapsed = false;
    $scope.user = window.user;
    $scope.allRatings = Rating.query();



    var refresh = function() {
        $scope.courses = Course.query();
        $scope.ratings = Rating.query();
        $scope.course = "";
    }
    refresh();

    $scope.add = function(course) {
        Course.save(course, function(course) {
            refresh();
        });
    };


    $scope.update = function(course, search_param) {
        course.$update(function() {
          $scope.search(search_param);
            refresh();
        });
    };

    $scope.remove = function(course) {
        course.$delete(function() {
            refresh();
        });
    };

    $scope.edit = function(id) {
        $scope.course = Course.get({
            id: id
        });
    };

    $scope.rate = function(id) {
      if($scope.course._id == id){
      }
      else{
        $scope.course = Course.get({
            id: id
        });
      }
    };

    $scope.deselect = function() {
        $scope.course = "";
    };

    $scope.rating_update = function(new_rating, rating, numberOfRatings) {
        var new_rating = ((new_rating - 0) + (rating - 0) * (numberOfRatings - 0)) / (numberOfRatings + 1);
        return Math.round(new_rating * 100) / 100;
    };

    // $scope.fix_array = function(instructors) {
    //     var partsOfStr = instructors.split(',');
    //     return partsOfStr;
    // };


    add = function(course) {
        Course.save(course, function(course) {
            refresh();
        });
    };

    httpGet = function(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.send(null);
        return xmlHttp.responseText;
    };

    createCourse = function(name, instructors, location) {
        $scope.course = new Course();
        $scope.course.name = name;
        $scope.course.instructors = instructors;
        $scope.course.rating = 0;
        $scope.course.numberOfRatings = 0;
        $scope.course.building = location;
        console.log(location);
        add($scope.course);
    };

    readJson = function(file) {
    var request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);
    if (request.status == 200)
        return request.responseText;
};

    populate_server = function() {
        //var urlString = "http://crossorigin.me/https://cobalt.qas.im/api/1.0/courses?limit=50&skip=450&key=456y8hDcetwgug1EGcDxM9XHcrAx84P8";

        //var jsonData = httpGet(urlString);
        //var arr_from_json = JSON.parse(jsonData);
        var jsonData = httpGet("https://api.myjson.com/bins/2p48o");
        var arr_from_json = JSON.parse(jsonData);

        console.log(arr_from_json);
        for (i = 0; i < arr_from_json.length; i++) {
            var courseName = arr_from_json[i].code
                //console.log(courseName);
                //console.log(instructors);
            var instructors = [];
            var location = "";
            var classMeetings = arr_from_json[i].meeting_sections;

            if(classMeetings[0] && classMeetings[0].times[0]){
              location = classMeetings[0].times[0].location;
            }

            for (j = 0; j < classMeetings.length; j++) {
                var meetingTimes = classMeetings[j];
                for (x = 0; x < meetingTimes.instructors.length; x++) {
                    //console.log(meetingTimes.instructors[x]);
                    if (instructors.indexOf(meetingTimes.instructors[x]) > -1) {
                          //In the array!
                      } else {
                          instructors.push(meetingTimes.instructors[x]);
                    }
                    //console.log(instructors + "LOL");
                }

            }
            //console.log(location);
            createCourse(courseName, instructors, location);
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













    $scope.add_rating = function(rating) {
        Rating.save(rating, function(rating) {
            refresh();
        });
    };
    add_rating = function(rating) {
        Rating.save(rating, function(rating) {
            refresh();
        });
    };


    $scope.update_rating = function(rating) {
        rating.$update(function() {
            refresh();
        });
    };

    $scope.remove_rating = function(rating) {
        rating.$delete(function() {
            refresh();
        });
    };

    $scope.edit_rating = function(id) {
        $scope.rating = Course.get({
            id: id
        });
    };

    $scope.createRating = function(rating_value, userID, courseID) {

        $scope.rating = new Rating();
        $scope.rating.rating_value = rating_value;
        $scope.rating.userID = userID;
        $scope.rating.courseID = courseID;
        add_rating($scope.rating);
    };

    $scope.getRating = function(){
      $http({
          method: 'GET',
          url: 'http://localhost:8080/api/ratings'
      }).
      success(function(data, status, headers, config) {
        console.log(data);
          $scope.allRatings = data;
          refresh();
      })
    };

    $scope.Ratingfilter = function(Course_id, User_id){
      return $filter('filter')($scope.allRatings, {courseID: Course_id, userID: User_id})[0];
    };

    $scope.Submit = function(search_param, userID, result){
        if (isValidRating(result.new_rating) ){
        $scope.update($scope.course, search_param)
        $scope.createRating(result.new_rating, userID, result._id);
        $scope.course.rating = $scope.rating_update(result.new_rating, result.rating, result.numberOfRatings);
        $scope.course.numberOfRatings += 1;
        $scope.getRating();
        refresh();
      }else{
        console.log("YOU FUCKED UP");
      }


    };

    function isValidRating(str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0 && n <= 5;
}





})
