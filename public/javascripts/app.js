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
                             '$http',
                             '$window',
                             '$stateParams',
                             'playlistFactory',
                             function($scope, $http, $window, $stateParams, playlistFactory){
                             $scope.playlist = playlistFactory.playlists[$stateParams.id];
                             $scope.playlists = playlistFactory.playlists;
                             $scope.addMovie = function(){
                                if($scope.movie == null) {
                                    $window.alert("Invalid Movie to add");
                                    return;
                                }
                             $http.delete('/playlists/' + $scope.playlist._id )
                             .success(function(data){
                                      $scope.playlist.movies.push({
                                                                  movietitle: $scope.movie
                                                                  });
                                      return $http.post('/playlists', $scope.playlist).success(function(data){
                                                                                        $scope.playlists.push(data);
                                                                                        });
                                      });
                             
                             console.log($scope.playlist);
                             $scope.bodyMovie = '';
                             };
                             $scope.remove = function(item) {
                             $http.delete('/playlists/' + $scope.playlist._id )
                             .success(function(data){
                                var index = $scope.playlist.movies.indexOf(item);
                                $scope.playlist.movies.splice(index, 1);
                                      return $http.post('/playlists', $scope.playlist).success(function(data){
                                                                                               $scope.playlists.push(data);
                                                                                               });
                                      });
                             
                             };
                             
                             }]);
