angular
  .module('managerApp')
  .controller('TelecomSmsOptionsResponseRemoveCtrl', class TelecomSmsOptionsResponseRemoveCtrl {
    constructor(
      $q, $stateParams, $timeout, $uibModalInstance,
      OvhApiSms, SmsMediator, service, index, option,
    ) {
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$uibModalInstance = $uibModalInstance;
      this.api = {
        sms: OvhApiSms.v6(),
      };
      this.SmsMediator = SmsMediator;
      this.service = service;
      this.index = index;
      this.option = option;
    }

    $onInit() {
      this.loading = {
        removeTrackingOption: false,
      };
      this.removed = false;
      this.model = {
        service: angular.copy(this.service),
        index: this.index,
        option: this.option,
      };
    }

    /**
       * Remove sms response tracking options.
       * @return {Promise}
       */
    remove() {
      this.loading.removeTrackingOption = true;
      _.remove(
        this.model.service.smsResponse.trackingOptions,
        this.model.service.smsResponse.trackingOptions[this.model.index],
      );
      return this.$q.all([
        this.api.sms.edit({
          serviceName: this.$stateParams.serviceName,
        }, {
          smsResponse: {
            trackingOptions: this.model.service.smsResponse.trackingOptions,
            responseType: this.model.service.smsResponse.responseType,
          },
        }).$promise,
        this.$timeout(angular.noop, 1000),
      ]).then(() => {
        this.loading.removeTrackingOption = false;
        this.removed = true;
        return this.$timeout(() => this.close(), 1000);
      }).catch(error => this.cancel({
        type: 'API',
        msg: error,
      }));
    }

    cancel(message) {
      return this.$uibModalInstance.dismiss(message);
    }

    close() {
      return this.$uibModalInstance.close(true);
    }
  });
