import angular from 'angular';

import component from './toast-message.component';
import directive from './toast-message-scroller.directive';
import service from './toast.service';

export default angular
  .module('ovhManagerToolboxTelecomToaster', [])
  .component('toastMessage', component)
  .directive('toastMessageScroller', directive)
  .service('Toast', service)
  .name;
