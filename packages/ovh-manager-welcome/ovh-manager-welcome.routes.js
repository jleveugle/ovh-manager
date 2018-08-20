import template from './ovh-manager-welcome.html';

export default function ($stateProvider) {
  'ngInject';

  $stateProvider.state('welcome', {
    url: '/welcome',
    template,
  });
}
