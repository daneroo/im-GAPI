/* this is for the gapi global for jshint */
/* global gapi */

angular.module('imGAPI').factory('youtube', function($q, $http, $sce) {


  // creates an url for an embeded iframe youtube player
  // ids: [] of youtube videoId's
  // autoplay, weather the video should start immediately
  // TODO: could replace autoplay with a options has to allow all other player options
  // For convinience the result is blessed by $sce, as it is typically bound to a template as a resource URL.
  function urlForList(ids, autoplay) {
    autoplay = !!autoplay; // cast to boolean
    if (ids && ids.length > 0) {
      var firstVid = ids[0];
      var src = 'https://www.youtube.com/embed/' + firstVid + '?autoplay=' + autoplay;
      if (ids.length > 1) {
        var playlist = ids.slice(1).join(',');
        src += '&playlist=' + playlist;
      }
      return $sce.trustAsResourceUrl(src);
    } else {
      // throw error?
      return '';
    }
  }

  // Google API
  // v2 API deprecated
  // http://kaspars.net/blog/web-development/embed-youtube-channel-playlist
  var v2User = 'ittfchannel';
  var v3Channel = 'UC9ckyA_A3MfXUa0ttxMoIZw';

  var fetchListV2 = function() {
    var user = v3Channel;
    var url = 'http://gdata.youtube.com/feeds/api/users/' + user + '/uploads?alt=jsonc&v=2&max-results=3';
    return $http.get(url)
      .then(function(result) {
        // console.log('result.data.data.items',result.data.data.items);
        var ids = [];
        result.data.data.items.forEach(function(i) {
          ids.push(i.id);
        });
        console.log('+V2:playlist', ids.join(','));
        return urlForList(ids, false);
      })
      .catch(function(error) {
        console.log('error', error);
        return error;
      });
  };

  // load the google API for youtube
  function googleAPI() {
    // gapi has been mad a legal global in .jshintrc, could put that into a module....
    if (!gapi) {
      return $q.reject(new Error('Gapi not available'));
    }
    return $q.when(gapi.client.load('youtube', 'v3'))
      .then(function() {
        return gapi;
      });
  }

  function getThing() {
    if (0) {
      gapi.client.youtube.channels.list({
        part: 'contentDetails',
        forUsername: 'ittfchannel'
      })
        .then(function(result) {
          console.log('channel', result);
        });
    }
    // channel section uploads: 'UC9ckyA_A3MfXUa0ttxMoIZw.aqsRo9JYx5M'
    // result.items[0].relatedPlaylists.uploads = 'UU9ckyA_A3MfXUa0ttxMoIZw'            
  }

  function fetchListV3() {
    return googleAPI().then(function() {

      var requestOptions = {
        // recent uploads
        playlistId: 'UU9ckyA_A3MfXUa0ttxMoIZw',
        // part: 'id',
        part: 'snippet',
        maxResults: 3
      };
      return $q.when(gapi.client.youtube.playlistItems.list(requestOptions)
        .then(function(result) {
          console.log('-playlist', result);
          var ids = [];
          result.result.items.forEach(function(item) {
            // ids.push(item.id); // this is not the video id
            ids.push(item.snippet.resourceId.videoId);
          });
          console.log('+V3:playlist', ids.join(','));
          return urlForList(ids, false);
        }));
    });
  }

  var svc = {
    urlForList: urlForList,
    fetchListV2: fetchListV2,
    fetchListV3: fetchListV3,
    get: function(params) {
      var url = '';
      return $http.get(url)
        //.then(onMatchLoadSuccess, onMatchLoadError, onMatchLoadProgress);
        .then(function(result) {
          return result.data;
        });
    }
  };
  return svc;
});