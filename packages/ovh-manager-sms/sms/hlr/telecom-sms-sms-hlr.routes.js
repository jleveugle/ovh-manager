import controller from './telecom-sms-sms-hlr.controller';
import template from './telecom-sms-sms-hlr.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.sms.hlr', {
    url: '/hlr',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'SmsHlrCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
