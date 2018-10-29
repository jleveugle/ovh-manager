import _ from 'lodash';

import template from './v4-links.html';

export default {
  template,
  bindings: {
    actions: '=telecomV4Links',
  },
  controller: class {
    $onInit() {
      this.actionRows = {
        main: null,
        normal: null,
      };

      const mainActions = _.filter(this.actions, action => action.main && !action.divider);

      this.actionRows.main = _.chunk(mainActions, 2);

      this.actionRows.normal = _.chain(this.actions)
        .difference(mainActions)
        .filter(action => !action.divider)
        .chunk(3)
        .value();
    }
  },
};
