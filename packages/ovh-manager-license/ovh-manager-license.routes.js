import LicenseCtrl from './ovh-manager-license.controller';
import template from './ovh-manager-license.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('license', {
    abstract: true,
    url: '/configuration/license',
    template: '<ui-view/>',
    resolve: {
      translations: /* @ngInject */ ($translate, asyncLoader) => import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)),
    },
  });
  $stateProvider.state('license.dashboard', {
    url: '',
    template,
    controller: LicenseCtrl,
  });
};
