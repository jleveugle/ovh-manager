import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';
import uiRouter from '@uirouter/angularjs';
import translate from 'angular-translate';

import routes from './telecom-sms-sms-templates.routes';

export default angular
  .module('ovhManagerSmsSmsTemplates', [
    uiBootstrap,
    uiRouter,
    translate,
  ])
  .config(routes)
  .name;
