import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import translate from 'angular-translate';
import resource from 'angular-resource';

import TelecomSmsDashboardCtrl from './telecom-sms-dashboard.controller';
import routes from './telecom-sms-dashboard.routes';

export default angular
  .module('ovhManagerSmsDashboard', [resource, translate, uiRouter])
  .config(routes)
  .controller('TelecomSmsDashboardCtrl', TelecomSmsDashboardCtrl)
  .name;
