import angular from 'angular';
import translate from 'angular-translate';
import 'ng-at-internet';

import translateLoaderPluggable from 'angular-translate-loader-pluggable';
import asyncLoaderFactory from './translate/async-loader.factory';
import translateServiceProvider from './translate/translate.service';

import sessionService from './session/session.service';

import {
  MANAGER_URLS, LANGUAGES, REDIRECT_URLS, URLS,
} from './ovh-manager-core.constants';

export default angular
  .module('ovhManagerCore', [
    translate,
    translateLoaderPluggable.name,
    'ng-at-internet',
  ])
  .constant('constants', {})
  .constant('LANGUAGES', LANGUAGES)
  .constant('MANAGER_URLS', MANAGER_URLS)
  .constant('REDIRECT_URLS', REDIRECT_URLS)
  .constant('TARGET', 'EU')
  .constant('URLS', URLS)
  .factory('asyncLoader', asyncLoaderFactory)
  .provider('TranslateService', translateServiceProvider)
  .config(($translateProvider, translatePluggableLoaderProvider, TranslateServiceProvider) => {
    TranslateServiceProvider.setUserLocale();

    const defaultLanguage = TranslateServiceProvider.getUserLocale();

    $translateProvider.useLoader('translatePluggableLoader');

    translatePluggableLoaderProvider.useLoader('asyncLoader');

    $translateProvider.preferredLanguage(defaultLanguage);
    $translateProvider.use(defaultLanguage);
    $translateProvider.fallbackLanguage(LANGUAGES.fallback);
  })
  .service('SessionService', sessionService)
  .name;
