(function () {
    'use strict';
    /**
     * gpAlgorithmPlayer
     *
     * Directive to control the algorithm execution, gives a interface to communication
     * through the gpAlgorithmPlayerCtrl
     */

    angular.module('graphe.directives')
        .directive('gpAlgorithmPlayer', ['dfs','bfs','coloracaoSequencial', 'coloracaoClasse',gpAlgorithmPlayer])
        .controller('gpAlgorithmPlayerCtrl', gpAlgorithmPlayerCtrl);

    function gpAlgorithmPlayer() {
        return {
            restrict: 'E',
            require: ['^gpContainer', '^?gpStage'],
            controller: 'gpAlgorithmPlayerCtrl'
        };
    }

    function gpAlgorithmPlayerCtrl($scope, $interval, dfs,bfs, coloracaoSequencial, coloracaoClasse, broadcastService) {

        $scope.steps = [];
        $scope.selectedStep = -1;

        $scope.algorithms = [
            dfs,
            bfs,
            coloracaoSequencial,
            coloracaoClasse
        ];

        $scope.pilha = [];
        $scope.fila = [];
        $scope.passoAtual = -1;
        $scope.resultado = [];

        $scope.emExecucao = false;

        $scope.algoritmoSelecionado = $scope.algorithms[0];
        var operacaoAtual = 0;
        var resultado = [];

        $scope.runAlg = run;


        var graphCopy = undefined;


        function proximoPasso(){

            if(operacaoAtual < resultado.length){
                var operacao = resultado[operacaoAtual];
                if(operacao.operacao !== ''){
                    broadcastService.broadcast(operacao.operacao, operacao.item);
                }

                if(operacao.pilha !== undefined){

                $scope.pilha = operacao.pilha.map(function(element){
                    return element.label;
                });
                }

                if(operacao.fila !== undefined) {
                    $scope.fila = operacao.fila.map(function (element) {
                        return element.label;
                    });
                }

                $scope.passoAtual = operacao.passo;

                if(operacao.resultado !== undefined) {
                    $scope.resultado = operacao.resultado.map(function (element) {
                        return element.label;
                    });
                }


                operacaoAtual++;
            }
            else{
                $scope.emExecucao = false;

                console.log('revertendo');
                console.log($scope.graph);
                console.log(graphCopy);

                $scope.graph = graphCopy;
            }

        }

        function run() {


            graphCopy = angular.copy($scope.graph);


            if($scope.emExecucao){
                $scope.emExecucao = false;
            }

            else {
            $scope.showDialog(function (startNode) {
                $scope.emExecucao = true;

                resultado = $scope.algoritmoSelecionado.run($scope.graph, startNode);
                $scope.timerAlgoritmo = $interval(proximoPasso, 1000, resultado.length + 1);
                console.log(resultado);
            });
            }
        }
    }
})();