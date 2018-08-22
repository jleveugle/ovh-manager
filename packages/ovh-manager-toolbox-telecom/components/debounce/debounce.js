import angular from 'angular';

import factory from './debounce.factory';

export default angular
  .module('ovhManagerToolboxDebounce', [])
  .factory('debounce', factory)
  .name;
