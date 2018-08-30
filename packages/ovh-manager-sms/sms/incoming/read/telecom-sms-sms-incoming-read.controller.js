export default class TelecomSmsSmsIncomingReadCtrl {
  constructor($uibModalInstance, incomingSms) {
    'ngInject';

    this.$uibModalInstance = $uibModalInstance;
    this.incomingSms = incomingSms;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
