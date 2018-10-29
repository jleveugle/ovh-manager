import angular from 'angular';

import telecomV4Links from './v4-links.component';
import telecomV4Link from './v4-link/v4-link.component';

export default angular
  .module('ovhManagerToolboxTelecomV4Links', [])
  .component('telecomV4Links', telecomV4Links)
  .component('telecomV4Link', telecomV4Link)
  .name;
