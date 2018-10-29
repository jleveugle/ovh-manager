import LicenseCtrl from './ovh-manager-license.controller';
import template from './ovh-manager-license.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('license', {
    abstract: true,
    url: '/configuration/license',
    template: '<ui-view/>',
    translations: ['.'],
  });
  $stateProvider.state('license.dashboard', {
    url: '',
    template,
    controller: LicenseCtrl,
  });
};
