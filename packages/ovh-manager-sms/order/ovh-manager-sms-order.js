import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import translate from 'angular-translate';

import { SMS_ORDER_PREFIELDS_VALUES } from './ovh-manager-sms-order.constants';
import routes from './ovh-manager-sms-order.routes';

export default angular
  .module('ovhManagerSmsOrder', [uiRouter, translate])
  .constant('SMS_ORDER_PREFIELDS_VALUES', SMS_ORDER_PREFIELDS_VALUES)
  .config(routes)
  .name;
