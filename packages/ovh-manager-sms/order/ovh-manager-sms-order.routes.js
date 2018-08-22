import controller from './ovh-manager-sms-order.controller';
import template from './ovh-manager-sms-order.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.order', {
    url: '/order',
    views: {
      smsInnerView: {
        template,
        controller,
        controllerAs: 'SmsOrder',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
