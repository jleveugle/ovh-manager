import controller from './telecom-sms-senders-add.controller';
import template from './telecom-sms-senders-add.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.senders.add', {
    url: '/add',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'SmsSendersAddCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
