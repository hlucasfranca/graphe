(function () {
    'use strict';

    angular.module('graphe')
        .directive('gpStepList', function () {

            return {
                templateUrl: 'scripts/directives/gpStepList.html',
                restrict: 'E',
                require: '^gpAlgorithmPlayer',
                link: function postLink(scope, element, attrs, gpStageCtrl) {

                    scope.hideSteps = false;
                }
            };
        });
})();