import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import SmsSidebarService from './ovh-manager-sms-sidebar.service';

export default angular
  .module('ovhManagerSmsSidebar', [uiRouter])
  .service('SmsSidebar', SmsSidebarService)
  .name;
