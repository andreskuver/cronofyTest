angular
 .module('core')
 .factory('alert', function($uibModal) {

   function show(action, event) {
     return $uibModal.open({
       templateUrl: '/modules/core/client/views/modal-template.html',
       controller: function() {
         var alertVM = this;
         alertVM.action = action;
         alertVM.event = event;
       },
       controllerAs: 'alertVM'
     });
   }

   return {
     show: show
   };

 });