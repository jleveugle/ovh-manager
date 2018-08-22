angular
  .module('managerApp')
  .controller('TelecomSmsOptionsResponseAddCtrl', class TelecomSmsOptionsResponseAddCtrl {
    constructor(
      $q, $stateParams, $timeout, $uibModalInstance,
      params, OvhApiSms, SmsMediator, ToastError,
    ) {
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$uibModalInstance = $uibModalInstance;
      this.api = {
        sms: OvhApiSms.v6(),
      };
      this.service = params.service;
      this.senders = params.senders;
      this.SmsMediator = SmsMediator;
      this.ToastError = ToastError;
    }

    $onInit() {
      this.loading = {
        init: false,
        addTrackingOption: false,
      };
      this.added = false;
      this.model = {
        service: angular.copy(this.service),
        senders: angular.copy(this.senders),
      };
      this.availableTrackingMedia = [];
      this.trackingOptions = {};
      this.targetNumberPattern = /^(\+|0{2}?)\d+$/;

      this.loading.init = true;
      return this.SmsMediator.initDeferred.promise
        .then(() => this.SmsMediator.getApiScheme().then((schema) => {
          this.availableTrackingMedia = _.pull(schema.models['sms.ResponseTrackingMediaEnum'].enum, 'voice');
          return this.availableTrackingMedia;
        })).catch((err) => {
          this.ToastError(err);
        }).finally(() => {
          this.loading.init = false;
        });
    }

    /**
     * Reset tracking options.
     */
    resetTrackingOptions() {
      this.trackingOptions.sender = '';
      this.trackingOptions.target = '';
    }

    /**
     * Handle tracking sender number.
     */
    handleTrackingSenderNumber() {
      this.trackingOptions.sender = _.has(this.trackingSender, 'sender') ? this.trackingSender.sender : '';
    }

    /**
     * Restrict target number.
     */
    restrictTargetNumber() {
      if (this.trackingOptions.target) {
        this.trackingOptions.target = this.trackingOptions.target.replace(/[^0-9+]/g, '');
      }
    }

    /**
     * Add sms response tracking options.
     * @return {Promise}
     */
    add() {
      this.loading.addTrackingOption = true;
      this.model.service.smsResponse.trackingOptions.push(this.trackingOptions);
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
        this.loading.addTrackingOption = false;
        this.added = true;
        return this.$timeout(() => this.close(), 1000);
      }).catch(error => this.cancel({
        type: 'API',
        message: error.data.message,
      }));
    }

    cancel(message) {
      return this.$uibModalInstance.dismiss(message);
    }

    close() {
      return this.$uibModalInstance.close(true);
    }
  });
