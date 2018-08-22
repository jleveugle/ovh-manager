angular.module('managerApp').controller('TelecomSmsSmsTemplateAddCtrl', class TelecomSmsSmsTemplateAddCtrl {
  constructor($q, $stateParams, $timeout, $translate, $uibModalInstance, OvhApiSms, SmsMediator) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        templates: OvhApiSms.Templates().v6(),
      },
    };
    this.SmsMediator = SmsMediator;
  }

  $onInit() {
    this.loading = {
      init: false,
      add: false,
    };
    this.template = {
      activity: null,
      description: null,
      message: null,
      name: null,
      reason: null,
    };
    this.loading.init = true;

    return this.SmsMediator.getApiScheme().then((schema) => {
      this.availableActivities = [];
      angular.forEach(schema.models['sms.TypeTemplateEnum'].enum, (id) => {
        this.availableActivities.push({
          id,
          label: this.$translate.instant(`sms_sms_templates_add_activity_type_${id}`),
        });
      });
      return this.availableActivities;
    }).finally(() => {
      this.loading.init = false;
    });
  }

  /**
     * Add templates.
     */
  add() {
    this.loading.add = true;
    return this.$q.all([
      this.api.sms.templates.create({
        serviceName: this.$stateParams.serviceName,
      }, this.template).$promise.catch(error => this.cancel({
        type: 'API',
        msg: error,
      })),
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.add = false;
      this.added = true;
      return this.$timeout(() => this.close(), 1500);
    });
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
});
