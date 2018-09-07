import angular from 'angular';
import ngAria from 'angular-aria';
import ngSanitize from 'angular-sanitize';
import translate from 'angular-translate';
import _ from 'lodash';

import ssoAuth from 'ovh-angular-sso-auth';
import OvhHttp from 'ovh-angular-http';

import core from '@ovh-ux/ovh-manager-core'; // eslint-disable-line import/no-extraneous-dependencies
import license from '@ovh-ux/ovh-manager-license'; // eslint-disable-line import/no-extraneous-dependencies
import sms from '@ovh-ux/ovh-manager-sms'; // eslint-disable-line import/no-extraneous-dependencies
import welcome from '@ovh-ux/ovh-manager-welcome'; // eslint-disable-line import/no-extraneous-dependencies

import routing from './ovh-manager.routes';
import sidebarConfig from './ovh-manager-sidebar';

import navbarService from './navbar/navbar.service';
import notificationService from './navbar/navbar-notification.service';

import 'ovh-ui-angular';
import 'bootstrap';

import './ovh-manager.less';
import './ovh-manager.scss';

angular
  .module('ovhManager', [
    core,
    license,
    sms,
    welcome,
    ngAria,
    ngSanitize,
    'oui',
    sidebarConfig,
    ssoAuth,
    OvhHttp,
    translate,
  ])
  .run((ssoAuthentication/* , User */) => {
    ssoAuthentication.login(); // .then(() => User.getUser());
  })
  .constant('OVH_SSO_AUTH_LOGIN_URL', '/auth')
  .factory('serviceTypeInterceptor', () => ({
    request(config) {
      const localConfig = config;
      if (/^(\/?engine\/)?2api(-m)?\//.test(localConfig.url)) {
        localConfig.url = localConfig.url.replace(/^(\/?engine\/)?2api(-m)?/, '');
        localConfig.serviceType = 'aapi';
      }

      if (/^apiv6\//.test(localConfig.url)) {
        localConfig.url = localConfig.url.replace(/^apiv6/, '');
        localConfig.serviceType = 'apiv6';
      }

      if (/^apiv7\//.test(localConfig.url)) {
        localConfig.url = localConfig.url.replace(/^apiv7/, '');
        localConfig.serviceType = 'apiv7';
      }

      return localConfig;
    },
  }))
  .config((ssoAuthenticationProvider, $httpProvider, OVH_SSO_AUTH_LOGIN_URL) => {
    ssoAuthenticationProvider.setLoginUrl(OVH_SSO_AUTH_LOGIN_URL);
    ssoAuthenticationProvider.setLogoutUrl(`${OVH_SSO_AUTH_LOGIN_URL}?action=disconnect`);

    // if (!constants.prodMode) {
    ssoAuthenticationProvider.setUserUrl('/engine/apiv6/me');
    // }

    ssoAuthenticationProvider.setConfig([
      {
        serviceType: 'apiv6',
        urlPrefix: '/engine/apiv6',
      },
      {
        serviceType: 'aapi',
        urlPrefix: '/engine/2api',
      },
      {
        serviceType: 'apiv7',
        urlPrefix: '/engine/apiv7',
      },
    ]);

    $httpProvider.interceptors.push('serviceTypeInterceptor');
    $httpProvider.interceptors.push('ssoAuthInterceptor');
  })
  .config((OvhHttpProvider) => {
    // OvhHttpProvider.rootPath = constants.swsProxyPath;
    _.set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
    _.set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
    _.set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
  })
  .config(routing)
  .service('ManagerNavbarService', navbarService)
  .service('NavbarNotificationService', notificationService)
  .run(($transitions,
    $translate,
    asyncLoader,
    ouiNavbarConfiguration) => {
    // $translatePartialLoader.addPart('components');

    const removeOnSuccessHook = $transitions.onSuccess({}, () => {
      _.set(ouiNavbarConfiguration, 'translations', {
        notification: {
          errorInNotification: $translate.instant('common_navbar_notification_error_in_notification'),
          errorInNotificationDescription: $translate.instant('common_navbar_notification_error_in_notification_description'),
          markRead: $translate.instant('common_navbar_notification_mark_as_read'),
          markUnread: $translate.instant('common_navbar_notification_mark_as_unread'),
          noNotification: $translate.instant('common_navbar_notification_none'),
          noNotificationDescription: $translate.instant('common_navbar_notification_none_description'),
        },
      });
    });

    // removeOnSuccessHook();
    import(`./translations/Messages_${$translate.use()}.xml`)
      .then((module) => {
        asyncLoader.addTranslations(module.default)
          .then(() => $translate.refresh())
          .then(() => removeOnSuccessHook());
      });
  })
  .run(($rootScope, ManagerNavbarService) => {
    // Get first base structure of the navbar, to avoid heavy loading
    ManagerNavbarService.getNavbar().then((navbar) => {
      _.set($rootScope, 'navbar', navbar);
      _.set($rootScope.navbar, 'responsiveLinks', []);

      // Then get the products links, to build the reponsive menu
      // ManagerNavbarService.getResponsiveLinks()
      //   .then((responsiveLinks) => {
      //     _.set($rootScope.navbar, 'responsiveLinks', responsiveLinks);
      //   });
    });
  });
