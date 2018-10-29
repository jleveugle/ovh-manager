import angular from 'angular';

import service from './toast-error.service';

export default angular
  .module('ovhManagerToolboxTelecomToastError', [])
  .service('ToastError', service)
  .name;
