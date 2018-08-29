import template from './telecom-sms-senders-blacklisted.html';
import controller from './telecom-sms-senders-blacklisted.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.senders.blacklisted', {
    url: '/blacklisted',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'SmsSendersBlacklistedCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
