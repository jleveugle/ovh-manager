import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import translate from 'angular-translate';

import routes from './telecom-sms-sms-hlr.routes';

export default angular
  .module('ovhManagerSmsSmsHlr', [
    uiRouter,
    translate,
  ])
  .config(routes)
  .name;
