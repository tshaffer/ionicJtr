/**
 * Created by tedshaffer on 2/26/16.
 */
angular.module('jtr.controllers')

.controller('ChannelGuideCtrl', function($scope, $ionicGesture, jtrServerService, jtrStationsService, jtrEpgFactory, jtrCGServices, jtrSettingsService) {

  $scope.navigateBackward = function (numPixels) {

    var numMinutes = (numPixels / 120) * 30;
    //cumulativeMinutesScrolled += numMinutes;
    //console.log("navigate backward by " + numPixels + " pixels, " + numMinutes + " minutes");
    //console.log("cumulativeMinutesScrolled=" + cumulativeMinutesScrolled);

    newScrollToTime = new Date($scope.channelGuideDisplayCurrentDateTime).addMinutes(-numMinutes);
    if (newScrollToTime < $scope.channelGuideDisplayStartDateTime) {
      newScrollToTime = new Date($scope.channelGuideDisplayStartDateTime);
    }
    $scope.scrollToTime(newScrollToTime)
    $scope.updateTextAlignment();

    $scope.selectProgramAtTimeOnStation(newScrollToTime, $scope._currentStationIndex, $scope._currentSelectedProgramButton);
  }


  $scope.navigateForward = function (numPixels) {

    var numMinutes = (numPixels / 120) * 30;
    //cumulativeMinutesScrolled += numMinutes;
    //console.log("navigate forward by " + numPixels + " pixels, " + numMinutes + " minutes");
    //console.log("cumulativeMinutesScrolled=" + cumulativeMinutesScrolled);

    newScrollToTime = new Date($scope.channelGuideDisplayCurrentDateTime).addMinutes(numMinutes);
    var proposedEndTime = new Date(newScrollToTime).addMinutes($scope.channelGuideHoursDisplayed);
    if (proposedEndTime > $scope.channelGuideDisplayEndDateTime) {
      newScrollToTime = new Date($scope.channelGuideDisplayEndDateTime).addMinutes(-numMinutes);
    }
    $scope.scrollToTime(newScrollToTime)
    $scope.updateTextAlignment();

    $scope.selectProgramAtTimeOnStation(newScrollToTime, $scope._currentStationIndex, $scope._currentSelectedProgramButton);
  }

  $scope.scrollToTime = function (newScrollToTime) {

    console.log("scrollToTime: " + newScrollToTime);

    var startMinute = (parseInt(newScrollToTime.getMinutes() / 30) * 30) % 60;
    var startHour = newScrollToTime.getHours();

    var roundedDownScrollToTime = new Date(newScrollToTime.getFullYear(), newScrollToTime.getMonth(), newScrollToTime.getDate(), startHour, startMinute, 0, 0);

    var timeDiffInMinutes = msecToMinutes(newScrollToTime.getTime() - roundedDownScrollToTime.getTime());

    var slotsToScroll = $scope.getSlotIndex(roundedDownScrollToTime);
    var scrollLeftValue = (slotsToScroll * $scope.widthOfThirtyMinutes) + (timeDiffInMinutes / 30 * $scope.widthOfThirtyMinutes);

    //$("#cgData").scrollLeft(slotsToScroll * $scope.widthOfThirtyMinutes)
    $("#cgData").scrollLeft(scrollLeftValue);

    $scope.channelGuideDisplayCurrentDateTime = newScrollToTime;
    $scope.channelGuideDisplayCurrentEndDateTime = new Date($scope.channelGuideDisplayCurrentDateTime).addHours($scope.channelGuideHoursDisplayed);
  }


  //$scope.navigateBackward = function (numHours) {
  //
  //  newScrollToTime = new Date($scope.channelGuideDisplayCurrentDateTime).addHours(-numHours);
  //  if (newScrollToTime < $scope.channelGuideDisplayStartDateTime) {
  //    newScrollToTime = new Date($scope.channelGuideDisplayStartDateTime);
  //  }
  //  $scope.scrollToTime(newScrollToTime)
  //  $scope.updateTextAlignment();
  //
  //  $scope.selectProgramAtTimeOnStation(newScrollToTime, $scope._currentStationIndex, $scope._currentSelectedProgramButton);
  //}
  //
  //
  //$scope.navigateForward = function (numHours) {
  //
  //  newScrollToTime = new Date($scope.channelGuideDisplayCurrentDateTime).addHours(numHours);
  //  var proposedEndTime = new Date(newScrollToTime).addHours($scope.channelGuideHoursDisplayed);
  //  if (proposedEndTime > $scope.channelGuideDisplayEndDateTime) {
  //    newScrollToTime = new Date($scope.channelGuideDisplayEndDateTime).addHours(-numHours);
  //  }
  //  $scope.scrollToTime(newScrollToTime)
  //  $scope.updateTextAlignment();
  //
  //  $scope.selectProgramAtTimeOnStation(newScrollToTime, $scope._currentStationIndex, $scope._currentSelectedProgramButton);
  //}

  $scope.getSlotIndex = function (dateTime) {

    // compute the time difference between the new time and where the channel guide data begins (and could be displayed)
    var timeDiffInMinutes = msecToMinutes(dateTime.getTime() - $scope.channelGuideDisplayStartDateTime.getTime());

    // compute number of 30 minute slots to scroll
    var slotIndex = parseInt(timeDiffInMinutes / 30);
    if (slotIndex < 0) {
      slotIndex = 0;
    }
    return slotIndex;
  }


    //$scope.scrollToTime = function (newScrollToTime) {
  //
  //  var slotsToScroll = $scope.getSlotIndex(newScrollToTime);
  //
  //  $("#cgData").scrollLeft(slotsToScroll * $scope.widthOfThirtyMinutes)
  //
  //  $scope.channelGuideDisplayCurrentDateTime = newScrollToTime;
  //  $scope.channelGuideDisplayCurrentEndDateTime = new Date($scope.channelGuideDisplayCurrentDateTime).addHours($scope.channelGuideHoursDisplayed);
  //},


    // TODO - is this still necessary?
  $scope.selectProgramAtTimeOnStation = function (selectProgramTime, stationIndex, currentUIElement) {

    $scope._currentStationIndex = stationIndex;

    var slotIndex = $scope.getSlotIndex(selectProgramTime);

    var station = $scope.stations[stationIndex];
    var stationId = station.StationId;

    var programStationData = $scope.getProgramStationData(stationId);
    var buttonIndex = programStationData.programUIElementIndices[slotIndex];

    // get the array of program buttons for this station
    var cgProgramsInStationRowElement = "#cgStation" + stationIndex.toString() + "Data";
    var programUIElementsInStation = $(cgProgramsInStationRowElement).children();       // programs in that row

    var nextActiveUIElement = programUIElementsInStation[buttonIndex];

    $scope.selectProgram(currentUIElement, nextActiveUIElement);
  }

  $scope.onSwipeLeft = function() {
    console.log("onSwipeLeft invoked");
    $scope.navigateForward(1);
  };

  $scope.onSwipeRight = function() {
    console.log("onSwipeRight invoked");
    $scope.navigateBackward(1);
  };

  $scope.onDragLeft = function() {
    console.log("onDragLeft invoked");
    $scope.navigateForward(1);
  };

  $scope.onDragRight = function() {
    console.log("onDragRight invoked");
    $scope.navigateBackward(1);
  };

  $scope.parseProgramId = function (programUIElement) {

    var programId = programUIElement.id;
    var programInfo = jtrCGServices.parseProgramId(programId);

    return programInfo;
  };

  $scope.getProgramFromUIElement = function (element) {

    var programInfo = $scope.parseProgramId($(element)[0]);

    var programList = $scope.getProgramList(programInfo.stationId);
    var selectedProgram = programList[programInfo.programIndex];
    return selectedProgram;
  };

  $scope.isProgramStartVisible = function (element) {

    var program = $scope.getProgramFromUIElement(element);
    var programDate = program.date;

    if (($scope.channelGuideDisplayCurrentDateTime <= programDate) && (programDate < $scope.channelGuideDisplayCurrentEndDateTime)) return true;

    return false;
  };

  $scope.isProgramEndVisible = function (element) {

    var program = $scope.getProgramFromUIElement(element);
    var programStartDateTime = program.date;
    var programEndDateTime = new Date(programStartDateTime.getTime() + program.duration * 60000);

    if (programEndDateTime > $scope.channelGuideDisplayCurrentEndDateTime) return false;
    if (programEndDateTime <= $scope.channelGuideDisplayCurrentDateTime) return false;

    return true;
  };

  $scope.selectProgram = function (activeProgramUIElement, newActiveProgramUIElement) {

    $scope.updateActiveProgramUIElement(activeProgramUIElement, newActiveProgramUIElement);

    $scope.updateProgramInfo(newActiveProgramUIElement)
  };


  $scope.updateActiveProgramUIElement = function (activeProgramUIElement, newActiveProgramUIElement) {
    $scope._currentSelectedProgramButton = newActiveProgramUIElement;
  }


  $scope.getProgramScheduleStartDateTime = function() {
    return $scope.epgProgramScheduleStartDateTime;
  };

  $scope.getProgramSlotIndices = function(stationId) {
    var programStationData = $scope.epgProgramSchedule[stationId];
    var programSlotIndices = programStationData.initialShowsByTimeSlot;
    return programSlotIndices;
  };

  $scope.getProgramList = function(stationId) {
    var programStationData = $scope.epgProgramSchedule[stationId];
    return programStationData.programList;
  }

  $scope.getProgramStationData = function(stationId) {
    return $scope.epgProgramSchedule[stationId];
  };

  $scope.updateTextAlignment = function () {

    angular.forEach($scope.stations, function(station, stationIndex) {
      var cgProgramLineName = "#cgStation" + stationIndex.toString() + "Data";
      var cgProgramsOnStation = $(cgProgramLineName).children();
      angular.forEach(cgProgramsOnStation, function(cgProgramButton, buttonIndex) {
        var programStartIsVisible = $scope.isProgramStartVisible(cgProgramButton);
        var programEndIsVisible = $scope.isProgramEndVisible(cgProgramButton);
        if (programStartIsVisible && programEndIsVisible) {
          $(cgProgramButton).css('text-align', 'center');
        }
        else if (programStartIsVisible) {
          $(cgProgramButton).css('text-align', 'left');
        }
        else if (programEndIsVisible) {
          $(cgProgramButton).css('text-align', 'right');
        }
        else {
          $(cgProgramButton).css('text-align', 'center');
        }
      });
    });
  };

  $scope.updateProgramInfo = function (programUIElement) {

    var programInfo = $scope.parseProgramId($(programUIElement)[0]);
    var programList = $scope.getProgramList(programInfo.stationId);
    var selectedProgram = programList[programInfo.programIndex];

    // display day/date of selected program in upper left of channel guide
    var programDayDate = dayDate(selectedProgram.date);
    $("#cgDayDate").text(programDayDate);
  }

  $scope.show = function() {

    console.log("channelGuide::show()");
    var currentDate = new Date();
    var startMinute = (parseInt(currentDate.getMinutes() / 30) * 30) % 60;
    var startHour = currentDate.getHours();

    $scope.channelGuideDisplayStartDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), startHour, startMinute, 0, 0);
    $scope.channelGuideDisplayCurrentDateTime = new Date($scope.channelGuideDisplayStartDateTime);
    //$scope.channelGuideDisplayCurrentEndDateTime = new Date($scope.channelGuideDisplayCurrentDateTime).addHours(3);
    $scope.channelGuideDisplayCurrentEndDateTime = new Date($scope.channelGuideDisplayCurrentDateTime).addHours(1);

    // start date/time of data structure containing channel guide data
    var channelGuideDataStructureStartDateTime = $scope.getProgramScheduleStartDateTime();

    // time difference between start of channel guide display and start of channel guide data
    var timeDiffInMinutes = msecToMinutes($scope.channelGuideDisplayStartDateTime - channelGuideDataStructureStartDateTime);

    // index into the data structure (time slots) that contains the first show to display in the channel guide based on the time offset into channel guide data
    var currentChannelGuideOffsetIndex = parseInt(timeDiffInMinutes / 30);

    var maxMinutesToDisplay = 0;
    var minutesToDisplay;

    angular.forEach($scope.stations, function(station, stationIndex) {

      var cgProgramsOnStation = {};
      cgProgramsOnStation.stationData = station;
      $scope.cgData.push(cgProgramsOnStation);

      // iterate through initialShowsByTimeSlot to get programs to display
      var programSlotIndices = $scope.getProgramSlotIndices(station.StationId);

      var programList = $scope.getProgramList(station.StationId);

      var indexIntoProgramList = programSlotIndices[currentChannelGuideOffsetIndex];

      var minutesAlreadyDisplayed = 0;

      // build id of div containing the UI elements of the programs for the current station
      var cgProgramLineName = "#cgProgramsOnStation" + stationIndex.toString() + "Data";
      $(cgProgramLineName).empty();

      // first show to display for this station
      showToDisplay = programList[indexIntoProgramList];

      // calculate the time delta between the time of the channel guide display start and the start of the first show to display
      // reduce the duration of the first show by this amount (time the show would have already been airing as of this time)
      timeDiffInMinutes = msecToMinutes($scope.channelGuideDisplayStartDateTime - new Date(showToDisplay.date));

      var programStationData = $scope.getProgramStationData(station.StationId);
      programStationData.programUIElementIndices = [];

      var slotIndex = 0;
      var uiElementCount = 0;

      //var toAppend = "";
      var firstShowOnStation = true;
      minutesToDisplay = 0;

      cgProgramsOnStation.programs = [];

      while (indexIntoProgramList < programList.length) {

        showToDisplay.indexIntoProgramList = indexIntoProgramList;
        cgProgramsOnStation.programs.push(showToDisplay);

        var durationInMinutes = Number(showToDisplay.duration);

        // perform reduction for only the first show in case it's already in progress at the beginning of this station's display
        if (firstShowOnStation) {
          durationInMinutes -= timeDiffInMinutes;
          firstShowOnStation = false;
        }
        showToDisplay.durationInMinutes = durationInMinutes;

        minutesToDisplay += durationInMinutes;

        var programStartTime = minutesAlreadyDisplayed;                     // offset in minutes
        var programEndTime = minutesAlreadyDisplayed + durationInMinutes;   // offset in minutes
        var slotTime = slotIndex * 30;
        while (programStartTime <= slotTime && slotTime < programEndTime) {
          programStationData.programUIElementIndices[slotIndex] = uiElementCount;
          slotIndex++;
          slotTime = slotIndex * 30;
        }

        minutesAlreadyDisplayed += durationInMinutes;
        indexIntoProgramList++;
        showToDisplay = programList[indexIntoProgramList];

        uiElementCount++;
      }

      if (minutesToDisplay > maxMinutesToDisplay) {
        maxMinutesToDisplay = minutesToDisplay;
      }
    });

    $scope.updateTextAlignment();

    // build and display timeline
    var toAppend = "";
    $("#cgTimeLine").empty();
    var timeLineCurrentValue = $scope.channelGuideDisplayStartDateTime;
    var minutesDisplayed = 0;
    while (minutesDisplayed < maxMinutesToDisplay) {

      var timeLineTime = timeOfDay(timeLineCurrentValue);

      toAppend += "<button class='thirtyMinuteTime'>" + timeLineTime + "</button>";
      timeLineCurrentValue = new Date(timeLineCurrentValue.getTime() + minutesToMsec(30));
      minutesDisplayed += 30;
    }
    $scope.channelGuideDisplayEndDateTime = timeLineCurrentValue;

    $("#cgTimeLine").append(toAppend);

    var promise = jtrServerService.retrieveLastTunedChannel();
    promise.then(function(result) {
      console.log("lastTunedChannel successfully retrieved");
      var stationNumber = result.data;
      var stationIndex = jtrStationsService.getStationIndexFromName(stationNumber)
      var stationRow = $("#cgData").children()[stationIndex + 1];
      $scope._currentSelectedProgramButton = $(stationRow).children()[0];
      $scope.selectProgram(null, $scope._currentSelectedProgramButton);
      $scope._currentStationIndex = stationIndex;


      var dragStart = $ionicGesture.on("dragstart", $scope.dragStart, $("#cgData"));
      var drag = $ionicGesture.on("drag", $scope.drag, $("#cgData"));
      //var dragLeft = $ionicGesture.on("dragleft", $scope.dragLeft, $("#cgData"))
      //var dragRight = $ionicGesture.on("dragright", $scope.dragRight, $("#cgData"))
      var dragEnd = $ionicGesture.on("dragend", $scope.dragEnd, $("#cgData"));

      var hold = $ionicGesture.on("hold", $scope.hold, $("#cgData"));
      var tap = $ionicGesture.on("tap", $scope.tap, $("#cgData"));
      var touch = $ionicGesture.on("touch", $scope.touch, $("#cgData"));
    });

  }

  $scope.hold = function(event) {
    console.log("hold");
    $scope.displayDragData(event);
    cumulativeDeltaX = 0;
  };

  $scope.tap = function(event) {
    console.log("tap");
    $scope.displayDragData(event);
  };

  // touch event signals potential start of drag as does dragStart
  $scope.touch = function(event) {
    console.log("touch");
    //$scope.displayDragData(event);

    $scope.lastDeltaX = event.gesture.deltaX;
    cumulativeDeltaX = 0;
    cumulativeMinutesScrolled = 0;
  };

  // start of drag
  $scope.dragStart = function(event) {
    console.log("dragStart invoked");
    //$scope.displayDragData(event);

    $scope.lastDeltaX = event.gesture.deltaX;
    cumulativeDeltaX = 0;
    cumulativeMinutesScrolled = 0;
  }

  //var cumulativeDeltaX = 0;
  //var cumulativeMinutesScrolled = 0;

  $scope.scrollChannelGuide = function(deltaX) {
    if (deltaX < 0) {
      $scope.navigateForward(-deltaX);
    }
    else if (deltaX > 0) {
      $scope.navigateBackward(deltaX);
    }
    //cumulativeDeltaX += deltaX;
    //console.log("scrollChannelGuide by " + deltaX + " pixels");
    //console.log("cumulative navigation = " + cumulativeDeltaX);
  };

  $scope.drag = function(event) {
    console.log("drag invoked");
    //$scope.displayDragData(event);

    var deltaX = event.gesture.deltaX - $scope.lastDeltaX;
    $scope.lastDeltaX = event.gesture.deltaX;
    console.log("deltaX=" + deltaX);
    $scope.scrollChannelGuide(deltaX);
  }

  $scope.dragLeft = function(event) {
    console.log("dragleft invoked");
    $scope.displayDragData(event);
  }

  $scope.dragRight = function(event) {
    console.log("dragRight invoked");
    $scope.displayDragData(event);
  }

  $scope.dragEnd = function(event) {
    console.log("dragEnd invoked");
    $scope.displayDragData(event);
  }

  $scope.displayDragData = function(event) {
    //console.log("direction=" + event.gesture.direction);
    //console.log("deltaX="+ event.gesture.deltaX);
    //console.log("distance=" + event.gesture.distance);
    //console.log("timestamp=" + event.gesture.timeStamp);
    //console.log("deltaTime=" + event.gesture.deltaTime);
  }

  $scope.cgData = [];

  $scope.getEpgDataPromise = null;

  $scope.stations = jtrStationsService.getStationsResult();

  // initialize epg data
  $scope.numDaysEpgData = 3;
  //$scope.retrieveEpgData();

  var promise = jtrEpgFactory.retrieveEpgData();
  promise.then(function() {
    console.log("jtrEpgFactory returned success");

    $scope.epgProgramSchedule = jtrEpgFactory.getEpgProgramSchedule();
    $scope.epgProgramScheduleStartDateTime = jtrEpgFactory.getEpgProgramScheduleStartDateTime();

    // from view
    $scope.channelGuideDisplayStartDateTime = null;
    $scope.channelGuideDisplayEndDateTime = null;
    $scope.channelGuideDisplayCurrentDateTime = null;
    $scope.channelGuideDisplayCurrentEndDateTime = null;

    $scope._currentSelectedProgramButton = null;
    $scope._currentStationIndex = null;

    $scope.widthOfThirtyMinutes = 120;    // pixels
    $scope.channelGuideHoursDisplayed = 1;

    $scope.show();
  });

})

