'use strict';

/**
 * @ngdoc function
 * @name app.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */

angular.module('graphe')
    .controller('MainCtrl', ['$scope', '$mdSidenav', '$mdToast', '$location', 'fab',
        function ($scope, $mdSidenav, $mdToast, $location, fab) {

            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.toastPosition = {
                bottom: true,
                top: false,
                left: false,
                right: true
            };

            $scope.menuOptions = [
                {label: 'Home', link: '/'},
                {label: 'New Graph', link: '/graph'},
                {label: 'Help', link: '/about'}
            ];

            $scope.isShowContextToolbar = false;
            $scope.fabOptions = fab.fabOptions;

            // Functions
            $scope.showHelp = showHelp;
            $scope.setMessage = setMessage;
            $scope.hasMessages = hasMessages;
            $scope.showContextToolbar = showContextToolbar;
            $scope.hideContextToolbar = hideContextToolbar;
            $scope.setCurrentOption = setCurrentOption;
            $scope.getCurrentOption = getCurrentOption;
            $scope.showSimpleToast = showSimpleToast;
            $scope.getToastPosition = getToastPosition;
            $scope.toggleSidenav = toggleSidenav;
            $scope.go = go;
            $scope.cancel = cancel;

            // Function definitions
            function showHelp (){
                $scope.showSimpleToast($scope.currentOption.message);
            }

            function setMessage(message){
                $scope.message = message;
            }

            function hasMessages(){
                return $scope.message !== null && $scope.message !== undefined && $scope.message !== '';
            }

            function showContextToolbar() {
              $scope.isShowContextToolbar = true;
            }

            function hideContextToolbar (){
                $scope.isShowContextToolbar = false;
                $scope.hideFab = false;
            }

            function setCurrentOption  (option) {
                $scope.currentOption = option;
            }

            function getCurrentOption (){
                return $scope.currentOption;
            }

             function showSimpleToast (message) {

                if ($mdToast !== undefined) {
                    console.log('toast');
                    $mdToast.show(
                        $mdToast.simple()
                            .content(message)
                            .action('Got it.')
                            .highlightAction(false)
                            .position($scope.getToastPosition())
                            .hideDelay(3000))
                                .then(function(){
                                    console.log('got it.');
                                });
                }
            }

            function getToastPosition () {
                return Object.keys($scope.toastPosition)
                    .filter(function (pos) {
                        return $scope.toastPosition[pos];
                    })
                    .join(' ');
            }

            function toggleSidenav (menuId) {
                $mdSidenav(menuId).toggle();
            }

            function go (url, hideNavigationBar) {
                $location.path(url);

                if(hideNavigationBar) {
                    $scope.toggleSidenav('left');
                }
                console.log('going to: ' + url);
            }

            function cancel() {
                $scope.hideContextToolbar();
                $scope.setMessage(null);
                $scope.setCurrentOption({});
            }

        }]);
