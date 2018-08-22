import angular from 'angular';
import translate from 'angular-translate';
import 'ng-at-internet';

import translateLoaderPluggable from 'angular-translate-loader-pluggable';
import asyncLoaderFactory from './translate/async-loader.factory';

export default angular
  .module('ovhManagerCore', [
    translate,
    translateLoaderPluggable.name,
    'ng-at-internet',
  ])
  .constant('constants', {})
  .factory('asyncLoader', asyncLoaderFactory)
  .config(($translateProvider, translatePluggableLoaderProvider) => {
    const defaultLanguage = 'fr_FR';

    // if (localStorage["univers-selected-language"]) {
    //     defaultLanguage = localStorage["univers-selected-language"];
    // } else {
    //     localStorage["univers-selected-language"] = defaultLanguage;
    // }

    $translateProvider.useLoader('translatePluggableLoader');

    translatePluggableLoaderProvider.useLoader('asyncLoader');

    $translateProvider.preferredLanguage(defaultLanguage);
    $translateProvider.use(defaultLanguage);
    $translateProvider.fallbackLanguage('fr_FR');
  })
  .name;
