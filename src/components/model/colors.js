(function () {
    'use strict';

    angular.module('graphe.model')
        .service('colors', color);

    function color() {


        var materialColors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F', '#03A9F4', '#00BCD4',
        '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548',
        '#9E9E9E', '#607D8B'];

        var materialColor = d3.scale.ordinal().range(materialColors);

        function getColor(i) {
            var index = i || Math.floor(Math.random() * materialColors.length);

            console.log(index);

            return materialColor(index);

        }

        //noinspection UnnecessaryLocalVariableJS
        var service = {
            materialColors: materialColors,
            materialColor: materialColor,
            getColor: getColor
        };

        return service;

    }
})();