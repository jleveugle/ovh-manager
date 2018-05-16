export default function ($q, $translate) {
  const translations = {};

  const loader = function(option) {
      return $q.when(translations);
  }

  loader.addTranslations = function (newTranslations) {
      Object.assign(translations, newTranslations);
      return $translate.refresh();
  }

  return loader;
}