import controller from './ovh-manager-sms-phonebooks.controller';
import template from './ovh-manager-sms-phonebooks.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.phonebooks', {
    url: '/phonebooks',
    views: {
      smsInnerView: {
        template,
        controller,
        controllerAs: 'PhonebooksCtrl',
      },
    },
    params: {
      bookKey: null,
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
