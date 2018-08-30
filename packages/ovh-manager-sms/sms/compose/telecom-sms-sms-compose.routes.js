import controller from './telecom-sms-sms-compose.controller';
import template from './telecom-sms-sms-compose.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.sms.compose', {
    url: '/compose',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'SmsComposeCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
