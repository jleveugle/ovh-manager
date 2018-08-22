import angular from 'angular';
import sidebarMenu from 'ovh-angular-sidebar-menu';

import ovhManagerSms from '@ovh-ux/ovh-manager-sms'; // eslint-disable-line import/no-extraneous-dependencies

export default angular
  .module('ovh-manager-sidebar', [sidebarMenu, ovhManagerSms])
  .run((SidebarMenu, SmsSidebar) => {
    SidebarMenu.setInitializationPromise(
      new Promise((resolve) => {
        SidebarMenu.addMenuItem({
          title: 'Licences',
          state: 'license.dashboard',
        });

        SmsSidebar.init();

        resolve();
      }),
    );
  })
  .name;
