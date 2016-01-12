(function() {
  'use strict';
  angular
    .module('core')
    .controller('CalendarController', CalendarController);
    
  CalendarController.$inject = ['$scope', '$stateParams', 'Authentication', '$http', 'moment'];

  /* @ngInject */
  function CalendarController($scope, $stateParams, Authentication, $http, moment) {
    var vm = this;
    vm.user = Authentication.user;
    vm.getEvents = getEvents;
    vm.getCalendars = getCalendars;
    vm.events = [];

    function getEvents (provider) {
      $http.post('/api/users/allEvents', { provider: provider })
        .then(function (ok) {
          for(var i=0; i<ok.data.events.length; i++) {
            var newEvent = {};
            newEvent.title = ok.data.events[i].summary;
            newEvent.startsAt = ok.data.events[i].start;
            newEvent.endsAt = ok.data.events[i].end;
            vm.events[i] = newEvent;
          }
        },
        function (err){
        }
        );
    }

    function getCalendars (provider) {
      $http.post('/api/users/calendars', { provider: provider })
        .then(function (ok) {
          console.log(ok.data.calendars);
          //vm.calendars = ok.data.calendars;
        },
        function (err){
        }
        );
    }

    vm.calendarView = 'month';
    vm.viewDate = new Date();
    vm.isCellOpen = true;

    vm.changeViewLevel = function(level) {
      console.log(level);
      vm.calendarView = level;
    };

    vm.eventClicked = function(event) {
      alert.show('Clicked', event);
    };

    vm.eventEdited = function(event) {
      alert.show('Edited', event);
    };

    vm.eventDeleted = function(event) {
      alert.show('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {
      alert.show('Dropped or resized', event);
    };

    vm.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

  }
})();