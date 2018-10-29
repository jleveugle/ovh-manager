import controller from './telecom-sms-phonebooks-create.controller';
import template from './telecom-sms-phonebooks-create.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.phonebooks.create', {
    url: '/create',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'PhonebooksCreateCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
