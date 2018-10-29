import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import resource from 'angular-resource';
import translate from 'angular-translate';

import ovhManagerOptionsManage from './manage/telecom-sms-options-manage';
import ovhManagerOptionsRecredit from './recredit/telecom-sms-options-recredit';
import ovhManagerOptionsResponse from './response/telecom-sms-options-response';

import routes from './telecom-sms-options.routes';

export default angular
  .module('ovhManagerOptions', [
    uiRouter,
    resource,
    translate,
    ovhManagerOptionsManage,
    ovhManagerOptionsRecredit,
    ovhManagerOptionsResponse,
  ])
  .config(routes)
  .name;
