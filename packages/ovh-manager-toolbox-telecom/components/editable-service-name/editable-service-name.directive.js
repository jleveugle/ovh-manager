import controller from './editable-service-name.controller';
import template from './editable-service-name.html';

export default /* @ngInject */ $timeout => ({
  restrict: 'E',
  template,
  scope: {
    title: '=editableServiceNameTitle',
    serviceName: '=editableServiceNameServiceName',
    onEditStart: '&?editableServiceNameTitleOnEditStart',
    onEditCancel: '&?editableServiceNameTitleOnEditCancel',
    onSave: '&editableServiceNameTitleOnSave', // MUST BE a promise
    maxlength: '@',
    disabled: '=',
  },
  bindToController: true,
  controllerAs: '$ctrl',
  controller,
  link($scope, $element, attributes, editableServiceNameCtrl) {
    $scope.$watch('$ctrl.inEdition', (isInEdition) => {
      if (isInEdition) {
        $timeout(() => {
          $element.find('input.service-name-edit-input').select();
        });
      }
    });

    $element.on('keydown blur', 'input.service-name-edit-input', (event) => {
      if (event.type === 'keydown') {
        if (event.keyCode === 27) { // if ESC is pressed
          editableServiceNameCtrl.cancelEdition();
          $scope.$apply();
        }
      }
    });

    $scope.$on('$destroy', () => {
      $element.off('keydown');
    });
  },
});
