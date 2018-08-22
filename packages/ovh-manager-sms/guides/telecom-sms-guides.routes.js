import controller from './telecom-sms-guides.controller';
import template from './telecom-sms-guides.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.guides', {
    url: '/guides',
    views: {
      smsInnerView: {
        template,
        controller,
        controllerAs: 'SmsGuidesCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
