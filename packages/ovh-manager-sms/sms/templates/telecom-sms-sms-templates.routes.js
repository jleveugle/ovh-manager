import controller from './telecom-sms-sms-templates.controller';
import template from './telecom-sms-sms-templates.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.sms.templates', {
    url: '/templates',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
