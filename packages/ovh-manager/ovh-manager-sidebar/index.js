import angular from 'angular';
import sidebarMenu from 'ovh-angular-sidebar-menu';

import ovhManagerSms from '@ovh-ux/ovh-manager-sms'; // eslint-disable-line import/no-extraneous-dependencies

import { SIDEBAR_CONFIG } from './ovh-manager-sidebar.constants';

import template from './sidebar.html';
import controller from './sidebar.controller';


export default angular
  .module('ovh-manager-sidebar', [sidebarMenu, ovhManagerSms])
  .component('ovhManagerSidebar', {
    template,
    controller,
  })
  .constant('SIDEBAR_CONFIG', SIDEBAR_CONFIG)
  .run(($translate, asyncLoader) => {
    asyncLoader.addTranslations(
      import(`./translations/Messages_${$translate.use()}.xml`)
        .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.xml`))
        .then(x => x.default),
    );
    $translate.refresh();
  })
  .name;
