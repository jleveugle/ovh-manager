export default function ($q) {
    "ngInject";

    const translations = {};

    const loader = function(option) {
        return $q.when(translations);
    }

    loader.addTranslations = function (newTranslations) {
        return $q.when(Object.assign(translations, newTranslations));
    }

    return loader;
}