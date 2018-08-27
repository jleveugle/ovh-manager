import controller from './telecom-sms-options-manage.controller';
import template from './telecom-sms-options-manage.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.options.manage', {
    url: '/manage',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'TelecomSmsOptionsManageCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
