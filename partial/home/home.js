angular.module('imGAPI').controller('HomeCtrl', function($scope, youtube, $sce) {

  // video
  $scope.fetchListV2 = function() {
    youtube.fetchListV2()
      .then(function(url) {
        console.log('++V2:playlist', $sce.getTrustedResourceUrl(url));
        $scope.videoSrc = url;
      })
      .catch(function(error) {
        console.log('error', error);
      });
  };

  $scope.fetchListV3 = function() {
    youtube.fetchListV3()
      .then(function(url) {
        console.log('++V3:playlist', $sce.getTrustedResourceUrl(url));
        $scope.videoSrc = url;
      })
      .catch(function(error) {
        console.log('error', error);
      });
  };

  $scope.videoSrc = youtube.urlForList(['RNAO-pvtvmI']);
  // $scope.videoSrc=youtube.urlForList(['ySeDKWudHqI','IAXMCVYAp_8','gm3HW2By52g'],true);
  $scope.fetchListV2();
  // $scope.fetchListV3();


});