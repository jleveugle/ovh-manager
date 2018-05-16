import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import routing from './ovh-manager-welcome.routes';

const moduleName = angular.module("ovhManagerWelcome", [ uiRouter ])
    .config(routing)
    .name;

export default moduleName;