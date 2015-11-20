(function() {
    'use strict';
    angular
        .module('graphe.directives')
        .directive('gpContainer', gpContainer)
        .controller('gpContainerCtrl', gpContainerCtrl);


    function gpContainer() {
        return {
            controller: 'gpContainerCtrl',
            restrict: 'A'
        };
    }

    function gpContainerCtrl($rootScope, $scope, $window, $mdDialog, dfs, $interval, model, colors, labels) {
        var vm = this;

        // Sets the default menu option
        $scope.currentOption = $scope.fab.fabOptions.add;
        $scope.isFabOpen = false;
        $scope.showDialog = showDialog;
        $scope.showNodeEditDialog = showNodeEditDialog;
        $scope.showLinkEditDialog = showLinkEditDialog;

        //unused
        //$scope.graphideFab = false;
        //$scope.selectedRow = null;

        $scope.selectedColumn = null;
        // The stage dimensions
        $scope.width = 0;
        $scope.height = 0;
        $scope.selectedNode = null;

        vm.getCurrentOption = function(){
            return $scope.currentOption;
        };

        rescalePanels();

        // instantiate the graph
        init();

        // functions
        vm.updateNodeCount = updateNodeCount;
        vm.setSelectedOption = setSelectedOption;
        vm.showNodeEditDialog = $scope.showNodeEditDialog;
        vm.showLinkEditDialog = $scope.showLinkEditDialog;

        //unused
        //$scope.selectCell = selectCell;
        //$scope.deselectCell = deselectCell;

        //$scope.toggleFab = toggleFab;
        $scope.setSelectedNode = setSelectedNode;

        vm.setSelectedNode = setSelectedNode;
        // end functions

        $scope.matrix = $scope.graph.getAdjacencyMatrix();

        $scope.adjacencyList = $scope.graph.getAdjacencyMatrix();

        $scope.$watch('scope.graph.getAdjacentMatrix()', function(){
            $scope.matrix = $scope.graph.getAdjacencyMatrix();
            console.log('matrix changed');
            console.log($scope.matrix);
        });

        /*$scope.$watch('scope.graph.getAdjacentList()', function(){
            $scope.adjacencyList = $scope.graph.getAdjacencyList();
            console.log('list changed');
            console.log($scope.adjacencyList);
        });*/



        rescalePanels();

        // on window resize, resize the graph
        angular.element($window).on('resize', function () {

            $scope.$apply(function () {
                rescalePanels();
            });

            var dimensions = {
                width: $scope.width,
                height: $scope.height
            };

            $rootScope.$broadcast('window.resized' , dimensions);
        });

        function setSelectedNode(node){
            console.log(node);

            $scope.selectedNode = node;
        }

        function setSelectedOption(currentAction) {

            console.log('selected option');
            console.log(currentAction);
            $scope.fab.currentOption = currentAction;
            //$scope.toggleFab();
            $scope.showContextToolbar();
        }

        //unused
        //function selectCell(row, column){
        //    $scope.selectedRow = row;
        //    $scope.selectedColumn = column;
        //}
        //
        //function deselectCell() {
        //    $scope.selectedRow = null;
        //    $scope.selectedColumn = null;
        //}

        //function toggleFab () {
        //    $scope.isFabOpen = !$scope.isFabOpen;
        //}

        function rescalePanels() {
            // get the width of graph-stage element and set to the graph element itself
            var graphStageDiv = $('#gp-stage-container');
            $scope.width = graphStageDiv.width();
            $scope.height= graphStageDiv.height();

            var mdcontent = $('#mdcontent');

            $scope.mdcontent = mdcontent.width() + ',' + mdcontent.height();
        }

        function updateNodeCount (){
            console.log('updating node count');
            $scope.graph.nodes = $scope.graph.getNodes();
            $scope.graph.links = $scope.graph.getEdges();
        }

        function init(){

            // Creates a simple graph
            $scope.graph = model.getGraph();

            var numberOfNodes = 5;

            for(var i = 0; i < numberOfNodes; i++) {
                $scope.graph.addNode({
                    index: i,
                    x: Math.random() * 500,
                    y: Math.random() * 500,
                    fixed: true,
                    label: labels.getLetter(),
                    color: d3.rgb(255,255,255),
                    radius: 15
                });
            }

            // Connect the nodes with each other
            for(i = 0; i < numberOfNodes; i++){
                for( var j = 0; j < numberOfNodes; j++){
                    if(i !== j) {
                        $scope.graph.addEdge(i,j);
                    }
                }
            }
        }

        function showNodeEditDialog(node, action) {

            console.log('editing');
            console.log(node);

            $scope.selectedNode = node;

            $mdDialog.show({
                controller: NodeEditDialogController,
                // use parent scope
                scope: $scope,
                preserveScope: true,
                templateUrl: '../../components/directives/container/nodeEditDialog.tpl.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true
            }).then(
                // on sucess
                function () { action(); },
                // on error
                function () {}
            );
        }

        //TODO: atualizar apenas quando der ok?
        function NodeEditDialogController($scope, $mdDialog) {

            $scope.color = $scope.selectedNode.color || d3.rgb(255,255,255);

            $scope.label = $scope.selectedNode.label || 'Node Label';

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                console.log('node edit complete');
                $mdDialog.hide(answer);
            };
        }


        /**
         * Dialogo de selecao de n� para execucao de algoritmo
         * @param action
         */
        function showDialog(action) {

            $mdDialog.show({
                controller: DialogController,
                // use parent scope
                scope: $scope,
                preserveScope: true,
                templateUrl: '../../components/directives/container/selectNodeDialog.tpl.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true
            })
                .then(
                // on sucess
                function () {
                    action($scope.selectedNode);
                },
                // on error
                function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        }

        function DialogController($scope, $mdDialog) {

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                //$scope.$apply();
                $mdDialog.hide(answer);
            };
        }


        /**
         *  Di�logo de edi��o de arestas
         */
        function showLinkEditDialog(link, action) {

            $scope.selectedLink = link;

            $mdDialog.show({
                controller: LinkEditDialogController,
                // use parent scope
                scope: $scope,
                preserveScope: true,
                templateUrl: '../../components/directives/container/linkEditDialog.tpl.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true
            }).then(
                // on sucess
                function () { action(); },
                // on error
                function () {}
            );
        }

        function LinkEditDialogController($scope, $mdDialog) {

            $scope.selectedLink.weight = $scope.selectedLink.weight || 1;

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }
    }

})();