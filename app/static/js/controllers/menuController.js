'use strict';

var log = log4javascript.getLogger("menuController-logger");

angular.module('uluwatuControllers').controller('menuController', ['$scope', '$rootScope', '$filter',
    function($scope, $rootScope, $filter) {
        $rootScope.menuPanel = {
            credentialsActive: true,
            templatesActive: false,
            networksActive: false,
            securityGroupsActive: false,
            blueprintsActive: false,
            recipesActive: false,
            stacksActive: false
        }

        $scope.changeActiveMenu = function(menu) {
            for (var key in $rootScope.menuPanel) {
                if (key == menu) {
                    $rootScope.menuPanel[key] = true;
                } else {
                    $rootScope.menuPanel[key] = false;
                }
            }
        }

    }
]);