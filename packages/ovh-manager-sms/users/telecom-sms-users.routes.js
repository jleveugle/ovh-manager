import controller from './telecom-sms-users.controller';
import template from './telecom-sms-users.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.users', {
    url: '/users',
    views: {
      smsInnerView: {
        template,
        controller,
        controllerAs: 'SmsUsersCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
