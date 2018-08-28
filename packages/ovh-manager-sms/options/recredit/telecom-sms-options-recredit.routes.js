import controller from './telecom-sms-options-recredit.controller';
import template from './telecom-sms-options-recredit.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.options.recredit', {
    url: '/recredit',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'TelecomSmsOptionsRecreditCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
