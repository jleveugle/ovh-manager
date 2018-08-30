export default class TelecomSmsSmsPendingReadCtrl {
  constructor($uibModalInstance, pendingSms) {
    'ngInject';

    this.$uibModalInstance = $uibModalInstance;
    this.pendingSms = pendingSms;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
