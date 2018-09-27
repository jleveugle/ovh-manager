import clone from 'lodash/clone';
import each from 'lodash/each';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

export default class SidebarController {
  constructor($translate, $rootScope, OvhApiServices, SIDEBAR_CONFIG, SidebarMenu, SmsSidebar) {
    'ngInject';

    this.$translate = $translate;
    this.$rootScope = $rootScope;
    this.OvhApiServices = OvhApiServices;
    this.SIDEBAR_CONFIG = SIDEBAR_CONFIG;
    this.SidebarMenu = SidebarMenu;
    this.SmsSidebar = SmsSidebar;

    this.isOpen = false;
  }

  $onInit() {
    this.SidebarMenu.setInitializationPromise(
      this.OvhApiServices.Aapi().get().$promise
        .then((services) => { this.buildMenu(services); }),
    );

    this.$rootScope.$on('navbar:toggle', () => {
      this.toggle();
    });
  }

  buildMenu(services) {
    const menuItems = this.buildMenuTreeConfig(services);
    this.buildMenuItems(menuItems);
    this.$rootScope.$broadcast('sidebar:loaded');
  }

  getMenuItemConfig(serviceName) {
    const config = clone(get(this.SIDEBAR_CONFIG, serviceName, this.SIDEBAR_CONFIG.default));

    config.id = serviceName;
    if (!has(config, 'title')) {
      config.title = serviceName;
    }
    config.title = this.$translate.instant(config.title);

    if (has(config, 'error')) {
      config.error = this.$translate.instant(config.error);
    }

    config.allowSubItems = true;
    return config;
  }

  buildMenuTreeConfig(services) {
    return sortBy(
      map(services, (service) => {
        const menuItem = this.getMenuItemConfig(service.name);
        if (has(service, 'subServices') && !isEmpty(service.subServices)) {
          menuItem.subServices = this.buildMenuTreeConfig(service.subServices);
        }
        return menuItem;
      }),
      'title',
    );
  }

  buildMenuItems(menuTree, parent) {
    each(menuTree, (menuItemConfig) => {
      let children = [];
      if (has(menuItemConfig, 'subServices')) {
        children = menuItemConfig.subServices;
      }
      let menuItem;

      if (parent) {
        menuItem = this.SidebarMenu.addMenuItem(menuItemConfig, parent);
      } else {
        menuItem = this.SidebarMenu.addMenuItem(menuItemConfig);
      }

      // TEMP for SMS section, we should add lazy loading of services
      if (menuItemConfig.id === 'SMS') {
        menuItem.onLoad = () => this.SmsSidebar.loadSmsMainSection(menuItem);
      }

      if (!isEmpty(children)) {
        this.buildMenuItems(children, menuItem);
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
