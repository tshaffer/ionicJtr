/**
 * Created by tedshaffer on 2/15/16.
 */
//angular.module('jtr.jtrServerService', ['$http', function($http) {
angular.module('jtr.jtrServerService', [])

  .service ('jtrServerService', ['$http', function($http){

    var self = this;

    var baseURL = document.baseURI.replace("?", "");
    if (baseURL.indexOf("localhost") >= 0) {
      this.baseUrl = "http://192.168.0.105:8080/";
    }
    else {
      this.baseUrl = document.baseURI.substr(0, document.baseURI.lastIndexOf(":")) + ":8080/";
    }

    this.getRecordings = function () {

      console.log("jtrServerService::getRecordings");
      var promise = $http.get('http://192.168.0.105:8080/getRecordings');
      return promise;

      //  $http.get('http://192.168.0.105:8080/getRecordings').success(function(data) {
      //  console.log("getRecordings success");
      //  return data.recordings;
      //});

      //var url = self.baseUrl + "getRecordings";
      //
      //var promise = $http.get(url, {});
      //return promise;
    };

  }])
