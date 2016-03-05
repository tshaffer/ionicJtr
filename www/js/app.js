// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('jtr', ['ionic', 'jtr.controllers', 'jtr.services', 'jtr.jtrServerService', 'jtr.jtrStationsService', 'jtr.jtrEpgFactory', 'jtr.jtrCGServices', 'jtr.jtrSettingsService'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.directive('groupedRadio', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=groupedRadio'
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      element.addClass('button');
      element.on('click', function(e) {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function(newVal) {
        element.removeClass('button-positive');
        if (newVal === scope.value) {
          element.addClass('button-positive');
        }
      });
    }
  };
})

.filter('formatDayOfWeek', function() {

    return function(dateTime) {

      var weekday = new Array(7);
      weekday[0] = "Sun";
      weekday[1] = "Mon";
      weekday[2] = "Tue";
      weekday[3] = "Wed";
      weekday[4] = "Thu";
      weekday[5] = "Fri";
      weekday[6] = "Sat";

      var date = new Date(dateTime);

      return weekday[date.getDay()];
    }
  })

.filter('formatScheduledRecordingIcon', function() {

    return function(startDT, endDT) {

      var currentDateTime = new Date();
      var startDateTime = new Date(startDT);
      var endDateTime = new Date(endDT);

      var icon = 'glyphicon-remove';
      if (startDateTime <= currentDateTime && currentDateTime < endDateTime) {
        icon = 'glyphicon-stop';
      }

      return icon;
    }
  })

.filter('formatMonthDay', function() {

    return function(dateTime) {

      var date = new Date(dateTime);
      return (date.getMonth() + 1).toString() + "/" + date.getDate().toString();
    }
  })

.filter('formatChannel', function() {

    return function(channel) {

      var channelParts = channel.split('-');
      if (channelParts.length == 2 && channelParts[1] == "1") {
        channel = channelParts[0];
      }
      return channel;
    }
  })

.filter('formatTimeOfDay', function() {

    return function(dateTime) {

      var date = new Date(dateTime);

      var amPM = "am";

      var numHours = date.getHours();
      if (numHours == 0) {
        numHours = 12;
      }
      else if (numHours > 12) {
        numHours -= 12;
        amPM = "pm";
      }
      else if (numHours == 12) {
        amPM = "pm";
      }
      var hoursLbl = numHours.toString();

      //if (hoursLbl.length == 1) hoursLbl = "&nbsp" + hoursLbl;
      //if (hoursLbl.length == 1) hoursLbl = hoursLbl;

      var minutesLbl = twoDigitFormat(date.getMinutes().toString());

      return hoursLbl + ":" + minutesLbl + amPM;
    }
  })

.filter('formatStartDateTime', function() {
  return function(startDateTime) {

    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    var dt = startDateTime;
    var n = dt.indexOf(".");
    var formattedDayDate;
    if (n >= 0) {
      var dtCompatible = dt.substring(0, n);
      var date = new Date(dtCompatible);
      formattedDayDate = weekday[date.getDay()] + " " + (date.getMonth() + 1).toString() + "/" + date.getDate().toString();
    }
    else {
      formattedDayDate = "poop";
    }
    return formattedDayDate;
  };
})

.filter('formatPosition', function() {
    return function(lastViewedPosition, duration) {

      var lastViewedPositionInMinutes = Math.floor(lastViewedPosition / 60);
      var position = lastViewedPositionInMinutes.toString() + " of " + duration.toString() + " minutes";

      return position;
    };
  })


  .config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.recordings', {
    url: '/recordings',
    views: {
      'tab-recordings': {
        templateUrl: 'recordings/recordings.html',
        controller: 'RecordingsCtrl'
      }
    }
  })

  .state('tab.recording-detail', {
    url: '/recordings/:recordingId',
    views: {
      'tab-recordings': {
        templateUrl: 'recordings/recordingDetails.html',
        controller: 'RecordingDetailCtrl'
      }
    }
  })

  .state('tab.channelguide', {
    url: '/channelguide',
    views: {
      'tab-channelguide': {
        templateUrl: 'channelGuide/channelGuide.html',
        controller: 'ChannelGuideCtrl'
      }
    }
  })

  .state('tab.program-details', {
    url: '/channelguide/:programId',
    views: {
      'tab-channelguide': {
        templateUrl: 'channelGuide/programDetails.html',
        controller: 'ProgramDetailsCtrl'
      }
    }
  })

  .state('tab.scheduledrecordings', {
    url: '/scheduledrecordings',
    views: {
      'tab-scheduledrecordings': {
        templateUrl: 'scheduledRecordings/scheduledRecordings.html',
        controller: 'ScheduledRecordingsCtrl'
      }
    }
  })

  .state('tab.manualrecord', {
    url: '/manualrecord',
    views: {
      'tab-manualrecord': {
        templateUrl: 'manualRecord/manualRecord.html',
        controller: 'ManualRecordCtrl'
      }
    }
  })

  .state('tab.recordnow', {
    url: '/recordnow',
    views: {
      'tab-recordnow': {
        templateUrl: 'templates/tab-recordnow.html',
        controller: 'RecordNowCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })

  .state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ChatsCtrl'
      }
    }
  })

  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/recordings');

});
