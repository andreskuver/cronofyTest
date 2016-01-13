(function() {
  'use strict';
  angular
    .module('core')
    .controller('CalendarController', CalendarController);
    
  CalendarController.$inject = ['$scope', '$stateParams', 'Authentication', '$http', 'moment','alert'];

  /* @ngInject */
  function CalendarController($scope, $stateParams, Authentication, $http, moment,alert) {
    var vm = this;
    vm.user = Authentication.user;
    vm.getEvents = getEvents;
    vm.getCalendars = getCalendars;
    vm.events = [];
    vm.pushCalendar = pushCalendar;
    vm.calendarSelectedIDS = [];
    init();

    function init() {
      var prov = vm.user.calendar_providers[0];
      getCalendars(prov,function(err,res){
        if (!err){
          var calendars = res.data.calendars;
          //getEvents(prov,[]);
          groupCalendars(calendars);
        }
      });
    };

    function pushCalendar(cid) {
      var index = vm.calendarSelectedIDS.indexOf(cid);
      var prov = vm.user.calendar_providers[0];

      if(index < 0){ //If it is checked
        vm.calendarSelectedIDS.push(cid);
      } else {
        vm.calendarSelectedIDS.splice(index,1);
      }

      if (vm.calendarSelectedIDS.length > 0) {
        getEvents(prov,vm.calendarSelectedIDS);
      }
      else {
        vm.events = [];
      }
    };

    function groupCalendars(calendars) {
      vm.userCalendars = _.groupBy(calendars,function(calendar){
        return calendar.provider_name;
      });
    }

    function getEvents (provider,calendarsIDs) {
      
      var params = {
        access_token: provider.access_token,
        refresh_token: provider.refresh_token,
        provider_name: provider.linking_profile.provider_name,
        "calendar_ids[]": calendarsIDs,
        tzid: 'Etc/UTC',
        options: {
          "calendar_ids[]": calendarsIDs
        }
      };

      var req = {
        method:'GET',
        url : 'https://api.cronofy.com/v1/events',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': "*",
          Authorization: 'Bearer' + provider.access_token
        },
        params: params
      };

      $http.get('/api/users/allEvents', { params: params })
        .then(function (ok) {
          vm.events = ok.data.events;
        },
          function(err) {

          }
      );
    }

    function getCalendars (provider,cb) {
      $http.post('/api/users/calendars', { provider: provider })
        .then(function (ok) {
          cb(null,ok);
          console.log(ok.data.calendars);
          //vm.calendars = ok.data.calendars;
        },
        function (err){
          cb(err,null);
        }
        );
    };

    vm.calendarView = 'month';
    vm.viewDate = new Date();
    vm.isCellOpen = true;

    vm.changeViewLevel = function(level) {
      console.log(level);
      vm.calendarView = level;
    };

    vm.eventClicked = function(event) {
      alert.show('Clicked', event);
      console.log("Clicked",event);
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