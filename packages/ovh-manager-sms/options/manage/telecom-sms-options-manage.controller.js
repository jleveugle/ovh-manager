import smsOptionsManageUpdateTemplate from './update/telecom-sms-options-manage-update.html';
import smsOptionsManageUpdateController from './update/telecom-sms-options-manage-update.controller';

export default class TelecomSmsOptionsManageCtrl {
  constructor($uibModal, SmsMediator, ToastError) {
    'ngInject';

    this.$uibModal = $uibModal;
    this.SmsMediator = SmsMediator;
    this.ToastError = ToastError;
  }

  $onInit() {
    this.loading = {
      init: false,
    };
    this.service = null;

    this.loading.init = true;
    return this.SmsMediator.initDeferred.promise.then(() => {
      this.service = this.SmsMediator.getCurrentSmsService();
    }).catch((err) => {
      this.ToastError(err);
    }).finally(() => {
      this.loading.init = false;
    });
  }

  /**
   * Opens a modal to manage sms' options.
   * @param  {Object} service SmsService.
   */
  update(service) {
    this.$uibModal.open({
      animation: true,
      template: smsOptionsManageUpdateTemplate,
      controller: smsOptionsManageUpdateController,
      controllerAs: 'OptionsManageUpdateCtrl',
      resolve: { service: () => service },
    });
  }
}
