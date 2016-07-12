app.controller('CoursesCtrl', function($scope, Course, ngProgress, toaster) {

$scope.course = new Course();

var refresh = function() {
  $scope.courses = Course.query();
  $scope.course ="";
}
refresh();

$scope.add = function(course) {
  Course.save(course,function(course){
    refresh();
  });
};

$scope.update = function(course) {
  course.$update(function(){
    refresh();
  });
};

$scope.remove = function(course) {
  course.$delete(function(){
    refresh();
  });
};

$scope.edit = function(id) {
  $scope.course = Course.get({ id: id });
};

$scope.deselect = function() {
  $scope.course = "";
}

})
