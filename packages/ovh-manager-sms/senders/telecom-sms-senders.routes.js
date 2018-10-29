import controller from './telecom-sms-senders.controller';
import template from './telecom-sms-senders.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.senders', {
    url: '/senders',
    views: {
      smsInnerView: {
        template,
        controller,
        controllerAs: 'SmsSendersCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
