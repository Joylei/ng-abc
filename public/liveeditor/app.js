angular.module('app',['app.editor'])
.controller('EditorCtrl', ['$scope','$log',function($scope, $log){
  $log.log('ctrl init');
  var url = decodeURIComponent(location.search.substring(1));
  $scope.src = url;
}]);
