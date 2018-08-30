import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';
import uiRouter from '@uirouter/angularjs';
import translate from 'angular-translate';

import routes from './telecom-sms-sms-incoming.routes';

export default angular
  .module('ovhManagerSmsSmsIncoming', [
    uiBootstrap,
    uiRouter,
    translate,
  ])
  .config(routes)
  .name;
