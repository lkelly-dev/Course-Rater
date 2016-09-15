app.controller('CoursesCtrl', function($scope, Course, ngProgress, toaster, $http) {

    $scope.course = new Course();
    $scope.results = [];

    var refresh = function() {
        $scope.courses = Course.query();
        $scope.course = "";
    }
    refresh();

    $scope.add = function(course) {
        Course.save(course, function(course) {
            refresh();
        });
    };

    $scope.update = function(course) {
        course.$update(function() {
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

    $scope.deselect = function() {
        $scope.course = "";
    };


    $scope.rating_update = function(new_rating, rating, numberOfRatings) {
        var new_rating = ((new_rating - 0) + (rating - 0) * (numberOfRatings - 0)) / (numberOfRatings + 1);
        return Math.round(new_rating * 100) / 100;
    };

    $scope.fix_array = function(instructors) {
        var partsOfStr = instructors.split(',');
        return partsOfStr;
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

    createCourse = function(name, instructors) {
        $scope.course = new Course();
        $scope.course.name = name;
        $scope.course.instructors = instructors;
        $scope.course.rating = 0;
        $scope.course.numberOfRatings = 0;
        add($scope.course);
    };

    populate_server = function() {
        var urlString = "http://crossorigin.me/https://cobalt.qas.im/api/1.0/courses?limit=50&skip=1220&key=456y8hDcetwgug1EGcDxM9XHcrAx84P8";
        var jsonData = httpGet(urlString);
        var arr_from_json = JSON.parse(jsonData);

        console.log(arr_from_json);
        for (i = 0; i < arr_from_json.length; i++) {
            var courseName = arr_from_json[i].code
                //console.log(courseName);
                //console.log(instructors);
            var instructors = [];
            var classMeetings = arr_from_json[i].meeting_sections;
            for (j = 0; j < classMeetings.length; j++) {
                var meetingTimes = classMeetings[j];
                for (x = 0; x < meetingTimes.instructors.length; x++) {
                    //console.log(meetingTimes.instructors[x]);
                    instructors.push(meetingTimes.instructors[x]);
                    //console.log(instructors + "LOL");
                }
            }
            createCourse(courseName, instructors);
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
                if (data[i].name.includes(val)) {
                    $scope.results.push(data[i]);
                }
            }
        })
    };
})
