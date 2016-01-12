(function() {
  'use strict';
  angular
    .module('core')
    .controller('CalendarController', CalendarController);
    
  CalendarController.$inject = ['$scope', '$stateParams', 'Authentication', '$http'];

  /* @ngInject */
  function CalendarController($scope, $stateParams, Authentication, $http) {
    var vm = this;
    vm.user = Authentication.user;
    vm.getEvents = getEvents;
    vm.getCalendars = getCalendars;


    function getEvents (provider) {
      $http.post('/api/users/allEvents', { provider: provider })
        .then(function (ok) {
          vm.events = ok.data.events;
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

  }
})();