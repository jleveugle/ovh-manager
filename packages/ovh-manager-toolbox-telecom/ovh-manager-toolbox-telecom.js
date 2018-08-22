import angular from 'angular';

import ovhManagerToolboxDebounce from './components/debounce/debounce';
import ovhManagerToolboxEditableServiceName from './components/editable-service-name/editable-service-name';
import ovhManagerToolboxTelecomToaster from './components/toaster/toaster';
import ovhManagerToolboxTelecomToastError from './components/toast-error/toast-error';
import ovhManagerToolboxTelecomV4Links from './components/v4-links/v4-links';

import './ovh-manager-toolbox-telecom.less';

export default angular
  .module('ovhManagerToolboxTelecom', [
    ovhManagerToolboxDebounce,
    ovhManagerToolboxEditableServiceName,
    ovhManagerToolboxTelecomToaster,
    ovhManagerToolboxTelecomToastError,
    ovhManagerToolboxTelecomV4Links,
  ])
  .name;
