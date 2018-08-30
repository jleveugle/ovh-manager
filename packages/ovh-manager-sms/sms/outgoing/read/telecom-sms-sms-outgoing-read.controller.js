export default class TelecomSmsSmsOutgoingReadCtrl {
  constructor($uibModalInstance, outgoingSms, outgoingSmsHlr) {
    'ngInject';

    this.$uibModalInstance = $uibModalInstance;
    this.outgoingSms = outgoingSms;
    this.outgoingSmsHlr = outgoingSmsHlr;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
