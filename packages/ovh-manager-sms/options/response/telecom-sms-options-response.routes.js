import controller from './telecom-sms-options-response.controller';
import template from './telecom-sms-options-response.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.options.response', {
    url: '/response',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'TelecomSmsOptionsResponseCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
