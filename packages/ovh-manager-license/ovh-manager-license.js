import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import uiBootstrap from 'angular-ui-bootstrap';
import translate from 'angular-translate';

import ovhUtils from '@ovh-ux/ovh-utils-angular';
import ovhHttp from 'ovh-angular-http';

import core from '@ovh-ux/ovh-manager-core';

import { Types } from './ovh-manager-license.constants';
import routing from './ovh-manager-license.routes';
import service from './ovh-manager-license.service';

export default angular
    .module("Module.license", [
        core,
        uiRouter,
        ovhUtils,
        uiBootstrap,
        translate,
        ovhHttp
    ])
    .config(routing)
    .constant("types", Types)
    .service("License", service)
    .name;
