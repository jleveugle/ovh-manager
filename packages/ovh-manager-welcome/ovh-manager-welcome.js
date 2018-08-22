import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ocLazyLoad from 'oclazyload';
import routing from './ovh-manager-welcome.routes';

const moduleName = angular.module('ovhManagerWelcome', [ocLazyLoad, uiRouter])
  .config(routing)
  .name;

export default moduleName;
