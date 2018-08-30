import controller from './telecom-sms-sms-outgoing.controller';
import template from './telecom-sms-sms-outgoing.html';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('sms.sms.outgoing', {
    url: '/outgoing',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'SmsOutgoingCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
