import ctrl from './license-detail.controller';

export default ($stateProvider) => {
  'ngInject';

  $stateProvider.state('license.detail', {
    url: '/:licenceId/detail',
    template: import('./license-detail.html'),
    controller: ctrl,
    translations: ['license'],
  });
};
