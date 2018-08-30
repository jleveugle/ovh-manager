import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';
import uiRouter from '@uirouter/angularjs';
import translate from 'angular-translate';

import routes from './telecom-sms-sms-pending.routes';

export default angular
  .module('ovhManagerSmsSmsPending', [
    uiBootstrap,
    uiRouter,
    translate,
  ])
  .config(routes)
  .name;
