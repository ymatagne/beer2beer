'use strict';


var services = angular.module('b2b.services', []);

var controllers = angular.module('b2b.controllers', []);


var app = angular.module('b2b', ['b2b.services','b2b.controllers','ngDialog','duScroll','ui.bootstrap'])
      .run(function ($rootScope, Auth) {
        $rootScope.$watch('currentUser', function(currentUser) {
          // if no currentUser and on a page that requires authorization then try to update it
          // will trigger 401s if user does not have a valid session
          if (!currentUser) {
            Auth.currentUser();
          }
        })
       });