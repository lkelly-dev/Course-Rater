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
        if ($scope.course._id == id) {} else {
            $scope.course = Course.get({
                id: id
            });
        }
    };

    $scope.deselect = function() {
        $scope.course = "";
    };



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

    createCourse = function(name, instructors, short_description, long_description, sections) {
        $scope.course = new Course();
        $scope.course.name = name;
        $scope.course.instructors = instructors;
        $scope.course.short_description = short_description;
        $scope.course.long_description = long_description;
        $scope.course.sections = sections;
        add($scope.course);
    };


    populate_server = function() {
        var jsonData = httpGet("https://raw.githubusercontent.com/cobalt-uoft/datasets/master/courses.json");
        var lines = jsonData.split('\n');
        for (x = 3709; x < 3770; x++) {
            //console.log("WTF");
            var course = JSON.parse(lines[x]);
            //console.log(course);
            var courseName = course.code;
            var courseShortDescription = course.name;
            var courseLongDescription = course.description;
            var courseSections = course.meeting_sections;
            var instructors = [];

            for (i = 0; i < courseSections.length; i++) {
                //console.log(courseSections[i]);
                for (j = 0; j < courseSections[i].instructors.length; j++) {
                    if (instructors.indexOf(courseSections[i].instructors[j]) > -1) {
                        //In the array!
                    } else {
                        instructors.push(courseSections[i].instructors[j]);
                    }
                }
            }
            //console.log(courseName);
            createCourse(courseName, instructors, courseShortDescription, courseLongDescription, courseSections);
        }
    };



    $scope.search = function(val) {
        $http({
            method: 'GET',
            url: 'https://courserater.herokuapp.com/api/courses'
        }).
        success(function(data, status, headers, config) {
            $scope.results = [];
            for (i = 0; i < data.length; i++) {
                if (data[i].name && data[i].name.includes(val.toUpperCase())) {
                    $scope.results.push(data[i]);
                }
                if ($scope.results.length == 15) {
                    break;
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
        $scope.rating = Rating.get({
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

    $scope.getRating = function() {
        $http({
            method: 'GET',
            url: 'https://courserater.herokuapp.com/api/ratings'
        }).
        success(function(data, status, headers, config) {
            //console.log(data);
            $scope.allRatings = data;
            refresh();
        })
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

    $scope.Submit = function(search_param, userID, result) {
        if (isValidRating(result.new_rating) && $scope.Ratingfilter(result._id).length == 0) {
            $scope.update($scope.course, search_param)
            $scope.createRating(result.new_rating, userID, result._id);
            //$scope.course.rating = $scope.rating_update(result.new_rating, result.rating, result.numberOfRatings);
            //$scope.course.numberOfRatings += 1;
            $scope.getRating();
            refresh();
        } else {
            alert("ERROR: Invalid rating. Please try again.");
        }
    };

    function isValidRating(str) {
        var n = ~~Number(str);
        return String(n) === str && n >= 0 && n <= 5;
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

    $scope.timeCalc = function(courseTime){
      if(courseTime[0]){
      var start = courseTime[0].start / 3600;
      var end =  courseTime[0].end / 3600;
      if(start > 12){
        start = (start - 12) + "pm";
      }
      else{
        start = start + "am";
      }
      if(end > 12){
        end = (end - 12) + "pm";
      }
      else{
        end = end + "am";
      }
      var time =  start + " - " + end;
      var days = "";
      for(i = 0; i < courseTime.length; i++){
        days = days + " " + courseTime[i].day.substring(0, 3).toLowerCase();
      }
      return time + " -- " + days;
    }
    };


})
