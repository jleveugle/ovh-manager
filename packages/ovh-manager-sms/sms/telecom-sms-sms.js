import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import translate from 'angular-translate';

import ovhManagerSmsSmsCompose from './compose/telecom-sms-sms-compose';
import ovhManagerSmsSmsHlr from './hlr/telecom-sms-sms-hlr';
import ovhManagerSmsSmsIncoming from './incoming/telecom-sms-sms-incoming';
import ovhManagerSmsSmsOutgoing from './outgoing/telecom-sms-sms-outgoing';
import ovhManagerSmsSmsPending from './pending/telecom-sms-sms-pending';
import ovhManagerSmsSmsTemplates from './templates/telecom-sms-sms-templates';

import routes from './telecom-sms-sms.routes';

export default angular
  .module('ovhManagerSmsSms', [
    uiRouter,
    translate,
    ovhManagerSmsSmsCompose,
    ovhManagerSmsSmsHlr,
    ovhManagerSmsSmsIncoming,
    ovhManagerSmsSmsOutgoing,
    ovhManagerSmsSmsPending,
    ovhManagerSmsSmsTemplates,
  ])
  .config(routes)
  .name;
