angular.module('managerApp').controller('TelecomSmsSmsComposeAddReceiversListsCtrl', class TelecomSmsSmsComposeAddReceiversListsCtrl {
  constructor($stateParams, $timeout, $uibModalInstance, SmsMediator, receivers) {
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.SmsMediator = SmsMediator;
    this.receivers = receivers;
  }

  $onInit() {
    this.loading = {
      addReceiversLists: false,
    };
    this.added = false;
    this.model = {
      receivers: angular.copy(this.receivers),
    };
  }

  /**
     * Add receivers' lists.
     * @return {Promise}
     */
  add() {
    this.loading.addReceiversLists = true;
    return this.$timeout(angular.noop, 1000).then(() => {
      this.loading.addReceiversLists = false;
      this.added = true;
      return this.$timeout(this.close(this.model.receivers), 3000);
    });
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(this.model.receivers);
  }

  /**
     * Has selected helper.
     * @return {Boolean}
     */
  hasSelected() {
    return _.some(this.receivers, { isSelected: true });
  }
});
