import controller from './telecom-sms-sms-incoming.controller';
import template from './telecom-sms-sms-incoming.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.sms.incoming', {
    url: '/incoming',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'SmsIncomingCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
