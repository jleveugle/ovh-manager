import template from './telecom-sms-dashboard.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.dashboard', {
    url: '',
    views: {
      smsInnerView: {
        template,
        controller: 'TelecomSmsDashboardCtrl',
        controllerAs: 'SmsDashboardCtrl',
      },
    },
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
};
