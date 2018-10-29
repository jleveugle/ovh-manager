import angular from 'angular';
import _ from 'lodash';

export default class TelecomSmsPhonebooksPhonebookContactCreateCtrl {
  constructor(
    $q, $stateParams, $timeout, $uibModalInstance,
    data, Phonebookcontact, OvhApiSms, TelephonyMediator,
  ) {
    'ngInject';

    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.data = data;
    this.Phonebookcontact = Phonebookcontact;
    this.api = {
      sms: {
        phonebookContact: OvhApiSms.Phonebooks().PhonebookContact().v6(),
      },
    };
    this.TelephonyMediator = TelephonyMediator;
  }

  $onInit() {
    this.phonebook = angular.copy(this.data.phonebook);
    this.groupsAvailable = angular.copy(this.data.groupsAvailable);
    this.phonecontactForm = {
      surname: null,
      name: null,
      group: null,
      homePhone: null,
      homeMobile: null,
      workPhone: null,
      workMobile: null,
      isCreating: false,
      hasBeenCreated: false,
    };
  }

  /**
   * Set group.
   * @param {Object} $event
   * @param {String} group
   */
  setGroup($event, group) {
    $event.preventDefault();
    this.phonecontactForm.group = group;
  }

  /**
   * Create new phonebook contact.
   * @return {Promise}
   */
  create() {
    this.phonecontactForm.isCreating = true;
    return this.$q.all([
      this.api.sms.phonebookContact.create({
        serviceName: this.$stateParams.serviceName,
        bookKey: _.get(this.phonebook, 'bookKey'),
      }, this.Phonebookcontact.getContactData(this.phonecontactForm)).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.phonecontactForm.isCreating = false;
      this.phonecontactForm.hasBeenCreated = true;
      return this.$timeout(() => this.close(), 1500);
    }).catch(error => this.cancel({
      type: 'API',
      msg: error,
    }));
  }

  /**
   * Is valid number.
   * @param  {String}  value
   * @return {Boolean}
   */
  isValidNumber(value) {
    return !_.isEmpty(value) ? this.TelephonyMediator.IsValidNumber(value) : true;
  }

  /**
   * Handle contact phone number.
   * @return {Boolean}
   */
  handleContactPhoneNumber() {
    return this.Phonebookcontact.hasAtLeastOnePhoneNumber(this.phonecontactForm);
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
