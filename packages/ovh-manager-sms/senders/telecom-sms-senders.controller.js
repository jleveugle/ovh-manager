import angular from 'angular';
import _ from 'lodash';

import smsSendersEditTemplate from './edit/telecom-sms-senders-edit.html';
import smsSendersEditController from './edit/telecom-sms-senders-edit.controller';
import smsSendersRemoveTemplate from './remove/telecom-sms-senders-remove.html';
import smsSendersRemoveController from './remove/telecom-sms-senders-remove.controller';
import smsSendersTerminateTemplate from './terminate/telecom-sms-senders-terminate.html';
import smsSendersTerminateController from './terminate/telecom-sms-senders-terminate.controller';

export default class TelecomSmsSendersCtrl {
  constructor(
    $stateParams, $q, $filter, $timeout, $uibModal, $translate,
    OvhApiSms, Toast, ToastError,
  ) {
    'ngInject';

    this.$stateParams = $stateParams;
    this.$q = $q;
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.api = {
      sms: {
        senders: OvhApiSms.Senders().v6(),
        virtualNumbers: OvhApiSms.VirtualNumbers().v6(),
      },
    };
    this.Toast = Toast;
    this.ToastError = ToastError;
  }

  $onInit() {
    this.senders = {
      raw: [],
      paginated: null,
      sorted: null,
      selected: {},
      orderBy: 'sender',
      orderDesc: false,
      isLoading: false,
      isDeleting: false,
      hasExpiration: false,
    };
    this.refresh();
  }

  /**
   * Refresh senders' list.
   * @return {Promise}
   */
  refresh() {
    this.senders.isLoading = true;
    this.resetAllCache();
    return this.fetchSenders().then(senders => this.$q.all(_.map(senders, (sender) => {
      _.set(sender, 'serviceInfos', null);
      if (sender.type === 'virtual') {
        const number = `00${_.trimLeft(sender.sender, '+')}`;
        return this.api.sms.virtualNumbers
          .getVirtualNumbersServiceInfos({ number }).$promise
          .then((serviceInfos) => {
            _.set(sender, 'serviceInfos', serviceInfos);
            return sender;
          });
      }
      return this.$q.resolve(sender);
    })).then((sendersResult) => {
      this.senders.raw = sendersResult;
      this.senders.hasExpiration = _.some(this.senders.raw, 'serviceInfos.renew.deleteAtExpiration');
      this.sortSenders();
    })).catch((err) => {
      this.ToastError(err);
    }).finally(() => {
      this.senders.isLoading = false;
    });
  }

  /**
   * Reset all cache.
   */
  resetAllCache() {
    this.api.sms.senders.resetAllCache();
    this.api.sms.virtualNumbers.resetAllCache();
  }

  /**
   * Fetch all senders.
   * @return {Promise}
   */
  fetchSenders() {
    return this.api.sms.senders
      .query({
        serviceName: this.$stateParams.serviceName,
      }).$promise
      .then(sendersIds => this.$q
        .all(_.map(_.chunk(sendersIds, 50), chunkIds => this.api.sms.senders.getBatch({
          serviceName: this.$stateParams.serviceName,
          sender: chunkIds.join('|'),
        }).$promise))
        .then(chunkResult => _.pluck(_.flatten(chunkResult), 'value')));
  }

  /**
   * Sort senders.
   */
  sortSenders() {
    let data = angular.copy(this.senders.raw);
    data = this.$filter('orderBy')(
      data,
      this.senders.orderBy,
      this.senders.orderDesc,
    );
    this.senders.sorted = data;
  }

  /**
   * Order senders.
   * @param  {String} by
   */
  orderBy(by) {
    if (this.senders.orderBy === by) {
      this.senders.orderDesc = !this.senders.orderDesc;
    } else {
      this.senders.orderBy = by;
    }
    this.sortSenders();
  }

  /**
   * Get all senders selected.
   * @return {Array}
   */
  getSelection() {
    return _.filter(this.senders.raw, sender => sender && sender.type !== 'virtual' && this.senders.selected && this.senders.selected[sender.sender]);
  }

  /**
   * Delete all selected senders.
   * @return {Promise}
   */
  deleteSelectedSenders() {
    const senders = this.getSelection();
    const queries = senders.map(sender => this.api.sms.senders.delete({
      serviceName: this.$stateParams.serviceName,
      sender: sender.sender,
    }).$promise);
    this.senders.isDeleting = true;
    queries.push(this.$timeout(angular.noop, 500)); // avoid clipping
    this.Toast.info(this.$translate.instant('sms_senders_delete_senders_success'));
    return this.$q.all(queries).then(() => {
      this.senders.selected = {};
      return this.refresh();
    }).catch((err) => {
      this.ToastError(err);
    }).finally(() => {
      this.senders.isDeleting = false;
    });
  }

  /**
   * Opens a modal to edit a given sender.
   * @param  {Object} sender
   */
  edit(sender) {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsSendersEditTemplate,
      controller: smsSendersEditController,
      controllerAs: 'SendersEditCtrl',
      resolve: { sender: () => sender },
    });
    modal.result.then(() => this.refresh()).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_senders_edit_sender_ko', { error: _.get(error, 'msg.data.message') }));
      }
    });
  }

  /**
   * Opens a modal to remove a given sender.
   * @param  {Object} sender
   */
  remove(sender) {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsSendersRemoveTemplate,
      controller: smsSendersRemoveController,
      controllerAs: 'SendersRemoveCtrl',
      resolve: { sender: () => sender },
    });
    modal.result.then(() => this.refresh()).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_senders_remove_sender_ko', { error: _.get(error, 'msg.data.message') }));
      }
    });
  }

  /**
   * Opens a modal to terminate a given sender.
   * @param  {Object} sender
   */
  terminate(sender) {
    const modal = this.$uibModal.open({
      animation: true,
      templateUrl: smsSendersTerminateTemplate,
      controller: smsSendersTerminateController,
      controllerAs: 'SendersTerminateCtrl',
      resolve: { sender: () => sender },
    });
    modal.result.then(() => this.refresh()).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_senders_terminate_sender_ko', { error: _.get(error, 'msg.data.message') }));
      }
    });
  }

  /**
   * Can edit helper.
   * @param  {Object} sender
   * @return {Boolean}
   */
  static canEdit(sender) {
    if (sender.status === 'waitingValidation') {
      return false;
    }
    return sender.type === 'virtual' ? sender.serviceInfos.status !== 'expired' : true;
  }

  /**
   * Can terminate helper.
   * @param  {Object} sender
   * @return {Boolean}
   */
  static canTerminate(sender) {
    return sender.type === 'virtual'
      && sender.serviceInfos.canDeleteAtExpiration
      && sender.serviceInfos.status !== 'expired';
  }

  /**
   * Get senders deleted at expiration.
   * @return {Array}
   */
  getSendersDeletedAtExpiration() {
    return _.filter(this.senders.raw, 'serviceInfos.renew.deleteAtExpiration');
  }
}
