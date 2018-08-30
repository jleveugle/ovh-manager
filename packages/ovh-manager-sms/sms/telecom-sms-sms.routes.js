import controller from './telecom-sms-sms.controller';
import template from './telecom-sms-sms.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.sms', {
    url: '/sms',
    views: {
      smsInnerView: {
        template,
        controller,
        controllerAs: 'TelecomSmsSmsCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
