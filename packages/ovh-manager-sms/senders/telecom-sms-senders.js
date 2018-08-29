import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import uiBootstrap from 'angular-ui-bootstrap';
import translate from 'angular-translate';

import routes from './telecom-sms-senders.routes';

import smsSendersAddModule from './add/telecom-sms-senders-add';
import smsSendersBlacklistedModule from './blacklisted/telecom-sms-senders-blacklisted';

export default angular
  .module('ovhManagerSmsSenders', [
    uiRouter,
    uiBootstrap,
    translate,
    smsSendersAddModule,
    smsSendersBlacklistedModule,
  ])
  .config(routes)
  .name;
