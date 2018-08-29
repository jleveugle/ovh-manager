import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import resource from 'angular-resource';
import translate from 'angular-translate';

import ovhManagerToolboxTelecom from '@ovh-ux/ovh-manager-toolbox-telecom'; // eslint-disable-line import/no-extraneous-dependencies

import 'ovh-api-services';
import 'ovh-angular-contracts';
import 'ovh-angular-responsive-tabs';
import 'ovh-angular-swimming-poll';

import smsSidebarModule from './components/sidebar/ovh-manager-sms-sidebar';
import smsDashboardModule from './dashboard/telecom-sms-dashboard';
import smsGuidesModule from './guides/telecom-sms-guides';
import smsUsersModule from './users/telecom-sms-users';
import smsOptionsModule from './options/telecom-sms-options';
import smsOrderModule from './order/ovh-manager-sms-order';
import smsPhonebooksModule from './phonebooks/ovh-manager-sms-phonebooks';
import smsSendersModule from './senders/telecom-sms-senders';

import {
  SMS_ALERTS, SMS_GUIDES, SMS_PHONEBOOKS, SMS_REGEX, SMS_STOP_CLAUSE, SMS_URL,
} from './ovh-manager-sms.constants';

import SmsFactory from './ovh-manager-sms.factory';
import SmsMediator from './ovh-manager-sms.mediator';
import routes from './ovh-manager-sms.routes';

export default angular
  .module('ovhManagerSms', [
    'ovh-api-services',
    'ovh-angular-contracts',
    'ovh-angular-responsive-tabs',
    'ovh-angular-swimming-poll',
    ovhManagerToolboxTelecom,
    resource,
    smsDashboardModule,
    smsGuidesModule,
    smsUsersModule,
    smsOptionsModule,
    smsOrderModule,
    smsPhonebooksModule,
    smsSendersModule,
    smsSidebarModule,
    uiRouter,
    translate,
  ])
  .config(routes)
  .constant('SMS_ALERTS', SMS_ALERTS)
  .constant('SMS_GUIDES', SMS_GUIDES)
  .constant('SMS_PHONEBOOKS', SMS_PHONEBOOKS)
  .constant('SMS_REGEX', SMS_REGEX)
  .constant('SMS_STOP_CLAUSE', SMS_STOP_CLAUSE)
  .constant('SMS_URL', SMS_URL)
  .service('SmsMediator', SmsMediator)
  .factory('SmsService', SmsFactory)
  .name;
