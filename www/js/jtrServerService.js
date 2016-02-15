/**
 * Created by tedshaffer on 2/15/16.
 */
//angular.module('jtr.jtrServerService', ['$http', function($http) {
angular.module('jtr.jtrServerService', [])

  .service ('jtrServerService', ['$http', function($http){

    var self = this;

    var baseURL = document.baseURI.replace("?", "");
    if (baseURL.indexOf("localhost") >= 0) {
      this.baseUrl = "http://192.168.0.113:8080/";
    }
    else {
      this.baseUrl = document.baseURI.substr(0, document.baseURI.lastIndexOf(":")) + ":8080/";
    }

    this.getRecordings = function () {

      var url = self.baseUrl + "getRecordings";

      var promise = $http.get(url, {});
      return promise;
    };

  }])

  .factory ('Pizza', function() {

    // Some fake testing data
    var recordings =[{
      title: 'Seinfeld'
    }, {
      title: 'Best Pizza Ever'
    }, {
      title: 'Get Smart'
    }];

    return {
      all: function() {
        return recordings;
      },
      remove: function(recording) {
        recordings.splice(recordings.indexOf(recording), 1);
      },
      get: function(recordingId) {
        for (var i = 0; i < recordings.length; i++) {
          if (recordings[i].id === parseInt(recordingId)) {
            return recordings[i];
          }
        }
        return null;
      }
    };

  })


  //var self = this;
  //
  //var baseURL = document.baseURI.replace("?", "");
  //if (baseURL.indexOf("localhost") >= 0) {
  //  this.baseUrl = "http://192.168.0.113:8080/";
  //}
  //else {
  //  this.baseUrl = document.baseURI.substr(0, document.baseURI.lastIndexOf(":")) + ":8080/";
  //}
  //
  //this.getRecordings = function () {
  //
  //  var url = self.baseUrl + "getRecordings";
  //
  //  var promise = $http.get(url, {});
  //  return promise;
  //};

