var app = angular.module('CourseRater', ['ngResource', 'ngProgress', 'ngAnimate', 'toaster']);
app.config(function($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
});

// Handle http server errors
app.factory('myHttpInterceptor', function($q, toaster) {
    return {
        responseError: function(response) {
            console.log(response);
            if (response.data) {
                if (response.data.message)
                    toaster.error("Error: ", response.data.message);
                else
                    toaster.error("Error: ", response.data);
            }
            return $q.reject(response);
        }
    };
});

// Showing loading indicator on top while data is requested from database
app.directive('loading', ['$http', 'ngProgress', function($http, ngProgress) {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            scope.isLoading = function() {
                return $http.pendingRequests.length !== 0;
            };

            scope.$watch(scope.isLoading, function(v) {
                if (v) {
                    ngProgress.start();
                } else {
                    ngProgress.complete();
                }
            });
        }
    };
}]);

// Create a resource factory to access products table from database
app.factory('Course', function($resource) {
    return $resource('http://localhost:8080/api/courses/:id', {
        id: '@_id'
    }, {
        update: { // Defined manually as it is not provided with ng-resource
            method: 'PUT'
        }
    });
});


app.factory('Rating', function($resource) {
    return $resource('http://localhost:8080/api/ratings/:id', {
        id: '@_id'
    }, {
        update: { // Defined manually as it is not provided with ng-resource
            method: 'PUT'
        }
    });
});

app.factory('Building', function($resource) {
    return $resource('http://localhost:8080/api/buildings/:id', {
        id: '@_id'
    }, {
        update: { // Defined manually as it is not provided with ng-resource
            method: 'PUT'
        }
    });
});




app.directive('search', function() {
    return function($scope, element) {
        element.bind("keyup", function(event) {
            var val = element.val();
            if (val.length > 2) {
                $scope.search(val);
            }
        });
    };
});

app.filter('unique', function() {
   return function(collection, keyname) {
      var output = [],
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});
