import controller from './telecom-sms-sms-pending.controller';
import template from './telecom-sms-sms-pending.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.sms.pending', {
    url: '/pending',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'SmsPendingCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
