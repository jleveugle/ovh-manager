import controller from './telecom-sms-options.controller';
import template from './telecom-sms-options.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.options', {
    url: '/options',
    views: {
      smsInnerView: {
        template,
        controller,
        controllerAs: 'TelecomSmsOptionsCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
