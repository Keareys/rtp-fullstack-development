'use strict';

angular.module('testApp')
    .directive('csSelect', function() {
        return {
            require: '^stTable',
            template: '<input type="checkbox"/>',
            scope: {
                row: '=csSelect'
            },
            link: function(scope, element, attr, ctrl) {

                element.bind('change', function(evt) {
                    scope.$apply(function() {
                        ctrl.select(scope.row, 'multiple');
                    });
                });

                scope.$watch('row.isSelected', function(newValue, oldValue) {
                	if (newValue === true) {
                		element.parent().addClass('rowSelection');
                    } else {
                        element.parent().removeClass('rowSelection');
                    }
                });
            }
        };
    });
