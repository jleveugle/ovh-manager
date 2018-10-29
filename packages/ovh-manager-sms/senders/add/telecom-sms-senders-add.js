import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import translate from 'angular-translate';

import routes from './telecom-sms-senders-add.routes';

export default angular
  .module('ovhManagerSmsSendersAdd', [
    uiRouter,
    translate,
  ])
  .config(routes)
  .name;
