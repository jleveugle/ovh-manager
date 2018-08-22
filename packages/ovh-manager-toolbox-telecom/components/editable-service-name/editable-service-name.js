import angular from 'angular';

import directive from './editable-service-name.directive';

export default angular
  .module('ovhManagerToolboxEditableServiceName', [])
  .directive('editableServiceName', directive)
  .name;
