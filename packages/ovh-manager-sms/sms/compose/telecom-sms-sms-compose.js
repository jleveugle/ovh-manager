import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import uiBootstrap from 'angular-ui-bootstrap';
import translate from 'angular-translate';

import routes from './telecom-sms-sms-compose.routes';

export default angular
  .module('ovhManagerSmsSmsCompose', [
    uiRouter,
    uiBootstrap,
    translate,
  ])
  .config(routes)
  .name;
