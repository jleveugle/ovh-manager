export default /* @ngInject */ function ($q) {
  const translations = {};

  const loader = function () {
    return $q.when(translations);
  };

  loader.addTranslations = function (newTranslations) {
    return $q.when(Object.assign(translations, newTranslations));
  };

  return loader;
}
