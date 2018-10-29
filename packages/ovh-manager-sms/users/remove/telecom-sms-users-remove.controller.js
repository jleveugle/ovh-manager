import angular from 'angular';

export default class TelecomSmsUsersRemoveCtrl {
  constructor($q, $stateParams, $timeout, $uibModalInstance, OvhApiSms, user) {
    'ngInject';

    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        users: OvhApiSms.Users().v6(),
      },
    };
    this.user = user;
  }

  $onInit() {
    this.loading = {
      removeUser: false,
    };
    this.removed = false;
    this.model = {
      user: angular.copy(this.user),
    };
  }

  /**
   * Remove sms api user api.
   * @return {Promise}
   */
  remove() {
    this.loading.removeUser = true;
    return this.$q.all([
      this.api.sms.users.delete({
        serviceName: this.$stateParams.serviceName,
        login: this.model.user.login,
      }).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.removeUser = false;
      this.removed = true;
      return this.$timeout(() => this.close(), 1500);
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
}
