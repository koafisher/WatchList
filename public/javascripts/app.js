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
      if($scope.formContent === '') {return;}
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
                             function($scope, $window, $stateParams, playlistFactory){
                             $scope.playlist = playlistFactory.playlists[$stateParams.id];
                             
                             $scope.addMovie = function(){
                                if($scope.bodyMovie == null) {
                                    $window.alert("Invalid Movie to add");
                                    return;
                                }
                             $scope.playlist.movies.push({
                                                          movietitle: $scope.bodyMovie
                                                          });
                             $scope.body = '';
                             };
                             $scope.remove = function(item) {
                                var index = $scope.playlist.movies.indexOf(item);
                                $scope.playlist.movies.splice(index, 1);
                             };
                             }]);
