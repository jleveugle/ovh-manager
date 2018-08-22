import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import translate from 'angular-translate';

import routes from './ovh-manager-sms-phonebooks.routes';

export default angular
  .module('ovhManagerSmsPhonebooks', [uiRouter, translate])
  .config(routes)
  .name;
