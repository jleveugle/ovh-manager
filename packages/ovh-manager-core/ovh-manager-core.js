import angular from 'angular';
import translate from 'angular-translate';

import asyncLoaderFactory from './translate/async-loader.factory';

export default angular
    .module("ovhManagerCore", [
        translate
    ])
    .constant("constants", {})
    .factory('asyncLoader', asyncLoaderFactory)
    .config(($translateProvider) => {
        const lang = "fr_FR";

        $translateProvider
            .useLoader('asyncLoader')
            .preferredLanguage(lang);
    })
    .name;
