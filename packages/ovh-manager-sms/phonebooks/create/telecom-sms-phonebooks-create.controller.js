import _ from 'lodash';

export default class TelecomSmsPhonebooksCreateCtrl {
  constructor($state, $stateParams, OvhApiSms, ToastError) {
    'ngInject';

    this.$state = $state;
    this.$stateParams = $stateParams;
    this.api = {
      sms: {
        phonebooks: OvhApiSms.Phonebooks().v6(),
      },
    };
    this.ToastError = ToastError;
  }

  $onInit() {
    this.phonebookToAdd = {
      name: null,
      isAdding: false,
    };
  }

  /**
     * Create a phonebook.
     * @return {Promise}
     */
  create() {
    this.phonebookToAdd.isAdding = true;
    return this.api.sms.phonebooks.create({
      serviceName: this.$stateParams.serviceName,
    }, _.pick(this.phonebookToAdd, 'name')).$promise.then(phonebook => this.$state.go('sms.phonebooks', {
      bookKey: phonebook.bookKey,
    })).catch((err) => {
      this.ToastError(err);
    }).finally(() => {
      this.phonebookToAdd.isAdding = false;
    });
  }
}
