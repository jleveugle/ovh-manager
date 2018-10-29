import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import translate from 'angular-translate';

import ovhManagerSmsPhonebooksCreate from './create/telecom-sms-phonebooks-create';

import routes from './ovh-manager-sms-phonebooks.routes';

export default angular
  .module('ovhManagerSmsPhonebooks', [uiRouter, translate, ovhManagerSmsPhonebooksCreate])
  .config(routes)
  .name;
