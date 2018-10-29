import angular from 'angular';
import _ from 'lodash';

import smsUsersAddTemplate from './add/telecom-sms-users-add.html';
import smsUsersAddController from './add/telecom-sms-users-add.controller';
import smsUsersTemplateTemplate from './templates/telecom-sms-users-templates.html';
import smsUsersTemplateController from './templates/telecom-sms-users-templates.controller';
import smsUsersChangePasswordTemplate from './change-password/telecom-sms-users-change-password.html';
import smsUsersChangePasswordController from './change-password/telecom-sms-users-change-password.controller';
import smsUsersQuotaTemplate from './quota/telecom-sms-users-quota.html';
import smsUsersQuotaController from './quota/telecom-sms-users-quota.controller';
import smsUsersLimitTemplate from './limit/telecom-sms-users-limit.html';
import smsUsersLimitController from './limit/telecom-sms-users-limit.controller';
import smsUsersRestrictTemplate from './restrict/telecom-sms-users-restrict.html';
import smsUsersRestrictController from './restrict/telecom-sms-users-restrict.controller';
import smsUsersCallbackTemplate from './callback/telecom-sms-users-callback.html';
import smsUsersCallbackController from './callback/telecom-sms-users-callback.controller';
import smsUsersRemoveTemplate from './remove/telecom-sms-users-remove.html';
import smsUsersRemoveController from './remove/telecom-sms-users-remove.controller';

export default class TelecomSmsUsersCtrl {
  constructor(
    $stateParams, $q, $filter, $uibModal, $translate,
    OvhApiSms, SmsMediator, Toast, ToastError,
  ) {
    'ngInject';

    this.$filter = $filter;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.api = {
      sms: OvhApiSms.v6(),
      smsUsers: OvhApiSms.Users().v6(),
    };
    this.SmsMediator = SmsMediator;
    this.Toast = Toast;
    this.ToastError = ToastError;
  }

  $onInit() {
    this.service = null;
    this.users = {
      raw: null,
      paginated: null,
      sorted: null,
      orderBy: 'login',
      orderDesc: false,
      isLoading: false,
    };
    this.refresh().then(() => {
      this.service = this.SmsMediator.getCurrentSmsService();
    });
  }

  /**
   * Refresh all sms api users list.
   * @return {Promise}
   */
  refresh() {
    this.api.smsUsers.resetAllCache();
    this.users.isLoading = true;
    return this.fetchUsers().then((users) => {
      this.users.raw = angular.copy(users);
      this.sortUsers();
    }).catch((err) => {
      this.ToastError(err);
    }).finally(() => {
      this.users.isLoading = false;
    });
  }

  /**
   * Fetch all sms api users.
   * @return {Promise}
   */
  fetchUsers() {
    return this.api.smsUsers.query({
      serviceName: this.$stateParams.serviceName,
    }).$promise.then(loginIds => this.$q.all(_.map(loginIds, login => this.api.smsUsers.get({
      serviceName: this.$stateParams.serviceName,
      login,
    }).$promise)));
  }

  /**
   * Sort sms api users.
   */
  sortUsers() {
    let data = angular.copy(this.users.raw);
    data = this.$filter('orderBy')(
      data,
      this.users.orderBy,
      this.users.orderDesc,
    );
    this.users.sorted = data;
  }

  /**
   * Order sms api user list.
   * @param  {String} by
   */
  orderBy(by) {
    if (this.users.orderBy === by) {
      this.users.orderDesc = !this.users.orderDesc;
    } else {
      this.users.orderBy = by;
    }
    this.sortUsers();
  }

  /**
   * Opens a modal to add a sms api user.
   */
  add() {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsUsersAddTemplate,
      controller: smsUsersAddController,
      controllerAs: 'UsersAddCtrl',
    });
    modal.result.then(() => this.refresh()).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_users_add_user_ko', { error: _.get(error, 'msg.data.message') }));
      }
    });
  }

  /**
   * Opens a modal to manager templates.
   */
  templates() {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsUsersTemplateTemplate,
      controller: smsUsersTemplateController,
      controllerAs: 'UsersTemplatesCtrl',
      resolve: { service: () => this.service },
    });
    modal.result.then(() => this.api.sms.get({
      serviceName: this.$stateParams.serviceName,
    }).$promise.then((service) => {
      this.service = service;
    }).catch(error => this.ToastError(error))).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_users_templates_update_ko', { error: _.get(error, 'msg.data.message') }));
      }
    });
  }

  /**
   * Opens a modal to change password for a given sms api user.
   * @param  {Ressource} user An api user.
   */
  changePassword(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsUsersChangePasswordTemplate,
      controller: smsUsersChangePasswordController,
      controllerAs: 'UsersChangePasswordCtrl',
      resolve: { user: () => user },
    });
    modal.result.then(() => this.refresh()).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_users_change_password_user_ko', { error: _.get(error, 'msg.data.message') }));
      }
    });
  }

  /**
   * Opens a modal to set quota for a given sms api user.
   * @param  {Ressource} user An api user.
   */
  quota(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsUsersQuotaTemplate,
      controller: smsUsersQuotaController,
      controllerAs: 'UsersQuotaCtrl',
      resolve: {
        params: () => {
          const params = {
            user,
            service: this.service,
          };
          return params;
        },
      },
    });
    modal.result.then(() => this.refresh()).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_users_quota_user_ko', { error: _.get(error, 'msg.data.message') }));
      }
    });
  }

  /**
   * Opens a modal to set limit for a given sms api user.
   * @param  {Ressource} user An api user.
   */
  limit(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsUsersLimitTemplate,
      controller: smsUsersLimitController,
      controllerAs: 'UsersLimitCtrl',
      resolve: { user: () => user },
    });
    modal.result.then(() => this.refresh()).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_users_limit_user_ko', { error: _.get(error, 'msg.data.message') }));
      }
    });
  }

  /**
   * Opens a modal to set restrict for a given sms api user.
   * @param  {Ressource} user An api user.
   */
  restrict(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsUsersRestrictTemplate,
      controller: smsUsersRestrictController,
      controllerAs: 'UsersRestrictByIpCtrl',
      resolve: { user: () => user },
    });
    modal.result.then(() => this.refresh()).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_users_restrict_user_ko', { error: _.get(error, 'msg.data.message') }));
      }
    });
  }

  /**
   * Opens a modal to set callback URL for a given sms api user.
   * @param  {Ressource} user An api user.
   */
  callback(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsUsersCallbackTemplate,
      controller: smsUsersCallbackController,
      controllerAs: 'UsersCallbackCtrl',
      resolve: { user: () => user },
    });
    modal.result.then(() => this.refresh()).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_users_callback_user_ko', { error: _.get(error, 'msg.data.message') }));
      }
    });
  }

  /**
   * Opens a modal to remove a given sms api user.
   * @param  {Ressource} user An api user.
   */
  remove(user) {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsUsersRemoveTemplate,
      controller: smsUsersRemoveController,
      controllerAs: 'UsersRemoveCtrl',
      resolve: { user: () => user },
    });
    modal.result.then(() => this.refresh()).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_users_remove_user_ko', { error: _.get(error, 'msg.data.message') }));
      }
    });
  }
}
