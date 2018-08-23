import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import resource from 'angular-resource';
import translate from 'angular-translate';

import routes from './telecom-sms-users.routes';

export default angular
  .module('ovhManagerSmsUsers', [
    uiRouter,
    resource,
    translate,
  ])
  .config(routes)
  .name;
