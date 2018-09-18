import {
  chain, find, get, isString, map, zipObject,
} from 'lodash';

export default class ManagerNavbarService {
  constructor(
    $q,
    $translate,
    asyncLoader,
    // FeatureAvailabilityService,
    LANGUAGES,
    MANAGER_URLS,
    NavbarNotificationService,
    // OtrsPopupService,
    // ProductsService,
    REDIRECT_URLS,
    SessionService,
    ssoAuthentication,
    TARGET,
    TranslateService,
    URLS,
  ) {
    'ngInject';

    this.$q = $q;
    this.$translate = $translate;
    // this.featureAvailabilityService = FeatureAvailabilityService;
    this.asyncLoader = asyncLoader;
    this.LANGUAGES = LANGUAGES;
    this.MANAGER_URLS = MANAGER_URLS;
    this.navbarNotificationService = NavbarNotificationService;
    // this.otrsPopupService = OtrsPopupService;
    // this.productsService = ProductsService;
    this.REDIRECT_URLS = REDIRECT_URLS;
    this.sections = {
      iaas: ['PROJECT', 'VPS', 'SERVER', 'DEDICATED_CLOUD', 'HOUSING'],
      paas: ['CEPH', 'NAS', 'NASHA', 'CDN', 'VEEAM'],
      metrics: 'METRICS',
      vracks: 'VRACK',
      loadBalancer: 'LOAD_BALANCER',
      cloudDesktop: 'CLOUD_DESKTOP',
    };
    this.sessionService = SessionService;
    this.ssoAuthentication = ssoAuthentication;
    this.TARGET = TARGET;
    this.translateService = TranslateService;
    this.URLS = URLS;
  }

  getProducts(products) {
    const getServices = (section, productsList) => {
      // If only one section (string), return a simple array
      if (isString(section)) {
        return map(get(find(productsList, { name: section }), 'services'));
      }

      // Return object of all sections
      const services = map(section, serviceType => map(get(find(productsList, { name: serviceType }), 'services')));
      return zipObject(section, services);
    };

    return {
      iaas: getServices(this.sections.iaas, products),
      paas: getServices(this.sections.paas, products),
      metrics: getServices(this.sections.metrics, products),
      vracks: getServices(this.sections.vracks, products),
      loadBalancer: getServices(this.sections.loadBalancer, products),
      cloudDesktop: getServices(this.sections.cloudDesktop, products),
    };
  }

  static getProductsMenu(categoryName, products) {
    return map(products, product => ({
      title: product.displayName,
      state: categoryName,
      stateParams: {
        serviceName: product.serviceName,
      },
    }));
  }

  getSectionTitle(section) {
    switch (section) {
      case 'PROJECT':
        return this.$translate.instant('cloud_sidebar_section_cloud_project');
      case 'VPS':
        return this.$translate.instant('cloud_sidebar_section_vps');
      case 'SERVER':
        return this.$translate.instant('cloud_sidebar_section_dedicated_server');
      case 'DEDICATED_CLOUD':
        return this.$translate.instant('cloud_sidebar_section_dedicated_cloud');
      case 'HOUSING':
        return this.$translate.instant('cloud_sidebar_section_housing');
      case 'CEPH':
        return this.$translate.instant('cloud_sidebar_section_paas_cda');
      case 'NAS':
        return this.$translate.instant('cloud_sidebar_section_nas');
      case 'NASHA':
        return this.$translate.instant('cloud_sidebar_section_nasha');
      case 'CDN':
        return this.$translate.instant('cloud_sidebar_section_cdn');
      case 'VEEAM':
      default:
        return this.$translate.instant('cloud_sidebar_section_paas_veeam');
    }
  }

  getIaasMenu(products) {
    return map(this.sections.iaas, section => ({
      name: `iaas.${section}`,
      title: this.getSectionTitle(section),
      subLinks: !products[section].length ? null : map(products[section], (service) => {
        switch (section) {
          case 'PROJECT':
            return {
              name: service.serviceName,
              title: service.displayName,
              subLinks: [{
                title: this.$translate.instant('cloud_sidebar_pci_infrastructure'),
                state: 'iaas.pci-project.compute',
                stateParams: {
                  projectId: service.serviceName,
                },
              }, {
                title: this.$translate.instant('cloud_sidebar_pci_object_storage'),
                state: 'iaas.pci-project.compute.storage',
                stateParams: {
                  projectId: service.serviceName,
                },
              }, {
                title: this.$translate.instant('cloud_sidebar_pci_manage'),
                state: 'iaas.pci-project.billing',
                stateParams: {
                  projectId: service.serviceName,
                },
              }, {
                title: this.$translate.instant('cloud_sidebar_pci_openstack'),
                state: 'iaas.pci-project.compute.openstack',
                stateParams: {
                  projectId: service.serviceName,
                },
              }],
            };
          case 'VPS':
            return {
              title: service.displayName,
              state: 'iaas.vps.detail.dashboard',
              stateParams: {
                serviceName: service.serviceName,
              },
            };
          case 'SERVER':
            return {
              title: service.displayName,
              url: this.REDIRECT_URLS.dedicatedServersPage.replace('{server}', service.serviceName),
            };
          case 'DEDICATED_CLOUD':
            return {
              title: service.displayName,
              url: this.REDIRECT_URLS.dedicatedCloudPage.replace('{pcc}', service.serviceName),
            };
          case 'HOUSING':
          default:
            return {
              title: service.displayName,
              url: this.REDIRECT_URLS.housing.replace('{housing}', service.serviceName),
            };
        }
      }),
    }));
  }

  getPaasMenu(products) {
    return map(this.sections.paas, section => ({
      name: `paas.${section}`,
      title: this.getSectionTitle(section),
      subLinks: !products[section].length ? null : map(products[section], (service) => {
        switch (section) {
          case 'CEPH':
            return {
              title: service.displayName,
              state: 'paas.cda.cda-details.cda-details-home',
              stateParams: {
                serviceName: service.serviceName,
              },
            };
          case 'NAS':
            return {
              title: service.displayName,
              url: this.REDIRECT_URLS.nasPage.replace('{nas}', service.serviceName),
            };
          case 'NASHA':
            return {
              title: service.displayName,
              state: 'paas.nasha.nasha-partitions',
              stateParams: {
                nashaId: service.serviceName,
              },
            };
          case 'CDN':
            return {
              title: service.displayName,
              url: this.REDIRECT_URLS.cdnPage.replace('{cdn}', service.serviceName),
            };
          case 'VEEAM':
          default:
            return {
              title: service.displayName,
              state: 'paas.veeam.detail.dashboard',
              stateParams: {
                serviceName: service.serviceName,
              },
            };
        }
      }),
    }));
  }

  static getCloudDesktopMenu(categoryName, products) {
    return map(products, product => ({
      title: (product.displayName === 'noAlias') ? product.serviceName : product.displayName,
      state: categoryName,
      stateParams: {
        serviceName: product.serviceName,
      },
    }));
  }

  getUniverseMenu(products) {
    const universeProducts = this.getProducts(products);
    const universeMenu = [{
      // Iaas
      name: 'iaas',
      title: this.$translate.instant('cloud_sidebar_section_iaas'),
      subLinks: this.getIaasMenu(universeProducts.iaas),
    }, {
      // Paas
      name: 'paas',
      title: this.$translate.instant('cloud_sidebar_section_paas'),
      subLinks: this.getPaasMenu(universeProducts.paas),
    }, {
      // Metrics
      name: 'dbaas.metrics',
      title: this.$translate.instant('cloud_sidebar_section_metrics'),
      subLinks: this.constructor.getProductsMenu('dbaas.metrics.detail.dashboard', universeProducts.metrics),
    }, {
      // Licences (Link)
      title: this.$translate.instant('cloud_sidebar_section_license'),
      url: this.REDIRECT_URLS.license,
    }, {
      // IP (Link)
      title: this.$translate.instant('cloud_sidebar_section_ip'),
      url: this.REDIRECT_URLS.ip,
    }, {
      // Load Balancer
      name: 'network.iplb',
      title: this.$translate.instant('cloud_sidebar_section_load_balancer'),
      subLinks: this.constructor.getProductsMenu('network.iplb.detail.home', universeProducts.loadBalancer),
    }, {
      // vRack
      name: 'vrack',
      title: this.$translate.instant('cloud_sidebar_section_vrack'),
      subLinks: map(universeProducts.vracks, product => ({
        title: product.displayName,
        state: 'vrack',
        stateParams: {
          vrackId: product.serviceName,
        },
      })),
    }];

    // Cloud Desktop
    // if (this.featureAvailabilityService.hasFeature(
    //   'CLOUD_DESKTOP',
    //   'sidebarMenu',
    //   this.locale)
    // ) {
    //   universeMenu.push({
    //     name: 'deskaas',
    //     title: this.$translate.instant('cloud_sidebar_section_cloud_desktop'),
    //     subLinks: this.constructor.getCloudDesktopMenu(
    //   'deskaas.details',
    //   universeProducts.cloudDesktop
    // ),
    //   });
    // }

    return universeMenu;
  }

  getAssistanceMenu(locale) {
    const assistanceMenu = [];

    // Guides (External)
    const cloudGuide = get(this.URLS.guides, `cloud.${locale}`);
    const homeGuide = get(this.URLS.guides, `home.${locale}`);
    const frenchHomeGuide = get(this.URLS.guides, 'home.FR');
    if (cloudGuide) {
      assistanceMenu.push({
        title: this.$translate.instant('navbar_support_guide'),
        url: cloudGuide,
        isExternal: true,
      });
    } else if (homeGuide) {
      assistanceMenu.push({
        title: this.$translate.instant('navbar_support_all_guides'),
        url: homeGuide,
        isExternal: true,
      });
    } else if (frenchHomeGuide) {
      assistanceMenu.push({
        title: this.$translate.instant('navbar_support_all_guides'),
        url: frenchHomeGuide,
        isExternal: true,
      });
    }

    // New ticket
    assistanceMenu.push({
      title: this.$translate.instant('navbar_support_new_ticket'),
      click: (callback) => {
        // if (!this.otrsPopupService.isLoaded()) {
        //   this.otrsPopupService.init();
        // } else {
        //   this.otrsPopupService.toggle();
        // }

        if (typeof callback === 'function') {
          callback();
        }
      },
    });

    // Tickets list
    assistanceMenu.push({
      title: this.$translate.instant('navbar_support_list_ticket'),
      url: get(this.REDIRECT_URLS, 'support', ''),
    });

    // Telephony (External)
    if (this.TARGET !== 'US') {
      assistanceMenu.push({
        title: this.$translate.instant('navbar_support_telephony_contact'),
        url: this.URLS.support_contact[locale] || this.URLS.support_contact.FR,
        isExternal: true,
      });
    }

    return {
      name: 'assistance',
      title: this.$translate.instant('navbar_support_assistance'),
      iconClass: 'icon-assistance',
      subLinks: assistanceMenu,
    };
  }

  getLanguageMenu() {
    const currentLanguage = find(this.LANGUAGES.available, {
      key: this.translateService.getUserLocale(),
    });

    return {
      name: 'languages',
      label: get(currentLanguage, 'name'),
      class: 'oui-navbar-menu_language',
      title: get(currentLanguage, 'key').split('_')[0].toUpperCase(),
      headerTitle: this.$translate.instant('navbar_language'),
      subLinks: map(this.LANGUAGES.available, lang => ({
        title: lang.name,
        isActive: lang.key === currentLanguage.key,
        click: () => {
          this.translateService.setUserLocale(lang.key);
          window.location.reload();
        },
        lang: chain(lang.key).words().head().value(),
      })),
    };
  }

  getUserMenu(currentUser) {
    return {
      name: 'user',
      title: currentUser.firstname,
      iconClass: 'icon-user',
      nichandle: currentUser.nichandle,
      fullName: `${currentUser.firstname} ${currentUser.name}`,
      subLinks: [
        // My Account
        {
          name: 'user.account',
          title: this.$translate.instant('navbar_account'),
          url: this.REDIRECT_URLS.userInfos,
          subLinks: [{
            title: this.$translate.instant('navbar_account_infos'),
            url: this.REDIRECT_URLS.userInfos,
          }, {
            title: this.$translate.instant('navbar_account_security'),
            url: this.REDIRECT_URLS.userSecurity,
          },
          (this.TARGET === 'EU' || this.TARGET === 'CA') && {
            title: this.$translate.instant('navbar_account_emails'),
            url: this.REDIRECT_URLS.userEmails,
          },
          (this.TARGET === 'EU') && {
            title: this.$translate.instant('navbar_account_subscriptions'),
            url: this.REDIRECT_URLS.userSubscriptions,
          }, {
            title: this.$translate.instant('navbar_account_ssh'),
            url: this.REDIRECT_URLS.userSSH,
          }, {
            title: this.$translate.instant('navbar_account_advanced'),
            url: this.REDIRECT_URLS.userAdvanced,
          }],
        },

        // Billing
        !currentUser.isEnterprise && {
          name: 'user.billing',
          title: this.$translate.instant('navbar_billing'),
          url: this.REDIRECT_URLS.billing,
          subLinks: [{
            title: this.$translate.instant('navbar_billing_history'),
            url: this.REDIRECT_URLS.billing,
          }, {
            title: this.$translate.instant('navbar_billing_payments'),
            url: this.REDIRECT_URLS.billingPayments,
          }],
        },

        // Services
        (this.TARGET === 'EU' || this.TARGET === 'CA') && (!currentUser.isEnterprise ? {
          name: 'user.services',
          title: this.$translate.instant('navbar_renew'),
          url: this.REDIRECT_URLS.services,
          subLinks: [{
            title: this.$translate.instant('navbar_renew_management'),
            url: this.REDIRECT_URLS.services,
          }, {
            title: this.$translate.instant('navbar_renew_agreements'),
            url: this.REDIRECT_URLS.servicesAgreements,
          }],
        } : {
          title: this.$translate.instant('navbar_renew_agreements'),
          url: this.REDIRECT_URLS.servicesAgreements,
        }),

        // Payment
        !currentUser.isEnterprise && {
          name: 'user.payment',
          title: this.$translate.instant('navbar_means'),
          url: this.REDIRECT_URLS.paymentMeans,
          subLinks: [{
            title: this.$translate.instant('navbar_means_mean'),
            url: this.REDIRECT_URLS.paymentMeans,
          },
          (this.TARGET === 'EU' || this.TARGET === 'CA') && {
            title: this.$translate.instant('navbar_means_ovhaccount'),
            url: this.REDIRECT_URLS.ovhAccount,
          },
          (this.TARGET === 'EU' || this.TARGET === 'CA') && {
            title: this.$translate.instant('navbar_means_vouchers'),
            url: this.REDIRECT_URLS.billingVouchers,
          }, {
            title: this.$translate.instant('navbar_means_refunds'),
            url: this.REDIRECT_URLS.billingRefunds,
          },
          (this.TARGET === 'EU') && {
            title: this.$translate.instant('navbar_means_fidelity'),
            url: this.REDIRECT_URLS.billingFidelity,
          }, {
            title: this.$translate.instant('navbar_means_credits'),
            url: this.REDIRECT_URLS.billingCredits,
          }],
        },

        // Orders
        (!currentUser.isEnterprise && this.TARGET === 'EU' && currentUser.ovhSubsidiary === 'FR') && {
          title: this.$translate.instant('navbar_orders'),
          url: this.REDIRECT_URLS.orders,
        },

        // Contacts
        (this.TARGET === 'EU') && {
          title: this.$translate.instant('navbar_contacts'),
          url: this.REDIRECT_URLS.contacts,
        },

        // Tickets
        {
          title: this.$translate.instant('navbar_list_ticket'),
          url: this.REDIRECT_URLS.support,
        },

        // Logout
        {
          title: this.$translate.instant('global_logout'),
          class: 'logout',
          click: (callback) => {
            this.ssoAuthentication.logout();

            if (typeof callback === 'function') {
              callback();
            }
          },
        },
      ],
    };
  }

  getInternalLinks(currentUser, notificationsMenu) {
    // Return login link if user not logged
    if (!currentUser) {
      return [{
        title: this.$translate.instant('common_login'),
        click: () => this.ssoAuthentication.logout(),
      }];
    }

    const menu = [
      this.getLanguageMenu(), // Language
      this.getAssistanceMenu(currentUser.ovhSubsidiary), // Assistance
      this.getUserMenu(currentUser), // User
    ];

    if (notificationsMenu.show) {
      menu.splice(1, 0, notificationsMenu);
    }
    return menu;
  }

  getManagersNames() {
    switch (this.TARGET) {
      case 'EU': {
        if (this.locale === 'FR') {
          return ['portal', 'gamma', 'partners'];
        }
        return ['portal', 'gamma'];
      }
      case 'CA': {
        return ['gamma'];
      }
      case 'US':
      default: {
        return [];
      }
    }
  }

  loadTranslations() {
    return import(`./translations/Messages_${this.$translate.use()}.xml`)
      .then((module) => {
        this.asyncLoader.addTranslations(module.default)
          .then(() => this.$translate.refresh());
      });
  }

  // Get managers links for main-links attribute
  getManagerLinks(products) {
    const currentUniverse = 'cloud';
    const managerUrls = this.MANAGER_URLS;
    const managerNames = this.getManagersNames();

    return map(managerNames, (managerName) => {
      const managerLink = {
        name: managerName,
        class: managerName,
        title: this.$translate.instant(`navbar_${managerName}`),
        url: managerUrls[managerName],
        isPrimary: ['partners', 'labs'].indexOf(managerName) === -1,
      };

      if (products && managerName === currentUniverse) {
        managerLink.subLinks = this.getUniverseMenu(products);
      }

      return managerLink;
    });
  }

  // Get products and build responsive menu
  getResponsiveLinks() {
    return this.productsService.getProducts()
      .then(({ results }) => this.getManagerLinks(results))
      .catch(() => this.getManagerLinks());
  }

  // Get navbar navigation and user infos
  getNavbar() {
    const managerUrls = this.MANAGER_URLS;

    // Get base structure for the navbar
    const getBaseNavbar = (user, notifications) => {
      this.locale = user.ovhSubsidiary;

      return {
        // Set OVH Logo
        brand: {
          label: this.$translate.instant('navbar_cloud'),
          url: managerUrls.cloud,
          iconAlt: 'OVH',
          iconClass: 'oui-icon oui-icon-ovh',
        },

        // Set Internal Links
        internalLinks: this.getInternalLinks(user, notifications),

        // Set Manager Links
        managerLinks: this.getManagerLinks(),
      };
    };
    return this.$q.all({
      translate: this.loadTranslations(),
      user: this.sessionService.getUser(),
      notifications: this.navbarNotificationService.getNavbarContent(),
    })
      .then(({ user, notifications }) => getBaseNavbar(user, notifications))
      .catch(() => getBaseNavbar());
  }
}
