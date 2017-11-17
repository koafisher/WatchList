angular.module('playlist',['ui.router'])

.factory('playlistFactory', [function(){
                             var o = {
                             playlists: []
                             };
                             return o;
                             }])
.config([
         '$stateProvider',
         '$urlRouterProvider',
         function($stateProvider, $urlRouterProvider) {
         $stateProvider
         .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl'
                })
         .state('play', {
                url: '/play/{id}',
                templateUrl: '/play.html',
                controller: 'playlistCtrl'
                });
         $urlRouterProvider.otherwise('home');
         }])
.controller('MainCtrl', [
  '$scope','$http','$window','playlistFactory',
  function($scope, $http, $window, playlistFactory) {
    $scope.playlists = playlistFactory.playlists;
    $scope.create = function(playlist) {
      return $http.post('/playlists', playlist).success(function(data){
        $scope.playlists.push(data);
      });
    };
    $scope.addPlaylist = function() {
      if($scope.formContent == null) {
                         $window.alert("Must give list a name");
                         return;
                         }
      $scope.create({title:$scope.formContent, upvotes:0, movies:[]});
      $scope.formContent = '';
    };
    $scope.upvote = function(playlist) {
      return $http.put('/playlists/' + playlist._id + '/upvote')
        .success(function(data){
          console.log("upvote worked");
          playlist.upvotes += 1;
        });
    };
    $scope.incrementUpvotes = function(playlist) {
      $scope.upvote(playlist);
    };
    $scope.delete = function(playlist) {
      $http.delete('/playlists/' + playlist._id )
        .success(function(data){
          console.log("delete worked");
        });
      $scope.getAll();
    };
    $scope.getAll = function() {
      return $http.get('/playlists').success(function(data){
        angular.copy(data, $scope.playlists);
      });
    };
    $scope.getAll();
  }
])
.controller('playlistCtrl', [
                             '$scope',
                             '$window',
                             '$stateParams',
                             'playlistFactory',
                             'MainCtrl',
                             function($scope, $window, $stateParams, playlistFactory,MainCtrl){
                             $scope.playlist = playlistFactory.playlists[$stateParams.id];
                             $scope.delete = MainCtrl.delete;
                             $scope.create = MainCtrl.create;
                             $scope.addMovie = function(){
                                if($scope.bodyMovie == null) {
                                    $window.alert("Invalid Movie to add");
                                    return;
                                }
                             var temp = $scope.playlist;
                             $scope.delete($scope.playlist);
                             temp.movies.push({
                                                          movietitle: $scope.bodyMovie
                                                          });
                             $scope.create(temp);
                             $scope.bodyMovie = '';
                             };
                             $scope.remove = function(item) {
                                var temp = $scope.playlist;
                                var index = temp.movies.indexOf(item);
                                temp.movies.splice(index, 1);
                                $scope.delete($scope.playlist);
                                $scope.create(temp);
                             };
                             }]);
