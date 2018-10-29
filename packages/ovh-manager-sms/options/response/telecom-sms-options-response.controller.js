import angular from 'angular';
import _ from 'lodash';

import smsOptionsResponseAddTemplate from './add/telecom-sms-options-response-add.html';
import smsOptionsResponseAddController from './add/telecom-sms-options-response-add.controller';
import smsOptionsResponseEditTemplate from './edit/telecom-sms-options-response-edit.html';
import smsOptionsResponseEditController from './edit/telecom-sms-options-response-edit.controller';
import smsOptionsResponseRemoveTemplate from './remove/telecom-sms-options-response-remove.html';
import smsOptionsResponseRemoveController from './remove/telecom-sms-options-response-remove.controller';

export default class TelecomSmsOptionsResponseCtrl {
  constructor($q, $stateParams, $translate, $uibModal, OvhApiSms, SmsMediator, Toast, ToastError) {
    'ngInject';

    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.api = {
      sms: OvhApiSms.v6(),
      smsSenders: OvhApiSms.Senders().v6(),
    };
    this.SmsMediator = SmsMediator;
    this.Toast = Toast;
    this.ToastError = ToastError;
  }

  $onInit() {
    this.loading = {
      init: false,
      action: false,
    };
    this.enums = {};
    this.service = null;
    this.smsResponse = {};
    this.senders = null;
    this.urlPattern = /^(https?):\/\/.*$/;
    this.message = {
      coding: '7bit',
      defaultSize: 160,
      remainingCharacters: null,
      equivalence: null, // number of SMS that will be sent
      maxlength: null,
      maxLengthReached: false,
    };

    this.loading.init = true;
    return this.$q.all({
      enums: this.fetchEnums(),
      service: this.fetchService(),
      senders: this.fetchSenders(),
    }).then((responses) => {
      this.enums = responses.enums;

      // Reordered available responses
      // ["cgi", "none", "text"] => ["none", "cgi", "text"]
      this.enums.smsResponseType.splice(0, 0, this.enums.smsResponseType.splice(1, 1)[0]);
      this.service = angular.copy(responses.service);
      this.smsResponse = angular.copy(_.result(this.service, 'smsResponse'));
      this.senders = responses.senders;
      this.computeRemainingChar();
    }).catch((err) => {
      this.ToastError(err);
    }).finally(() => {
      this.loading.init = false;
    });
  }

  /**
   * Fetch enums.
   * @return {Promise}
   */
  fetchEnums() {
    return this.SmsMediator.getApiScheme().then((schema) => {
      const smsResponseTypeEnum = {
        smsResponseType: schema.models['sms.ResponseTypeEnum'].enum,
      };
      return smsResponseTypeEnum;
    });
  }

  /**
   * Fetch service.
   * @return {Promise}
   */
  fetchService() {
    return this.api.sms.get({
      serviceName: this.$stateParams.serviceName,
    }).$promise;
  }

  /**
   * Fetch all enabled senders.
   * @return {Promise}
   */
  fetchSenders() {
    return this.api.smsSenders.query({
      serviceName: this.$stateParams.serviceName,
    }).$promise.then(sendersIds => this.$q.all(_.map(sendersIds, sender => this.api.smsSenders.get({
      serviceName: this.$stateParams.serviceName,
      sender,
    }).$promise)).then(senders => _.filter(senders, { status: 'enable' })));
  }

  /**
   * Compute remaining characters.
   * @return {Object}
   */
  computeRemainingChar() {
    return _.assign(this.message, this.SmsMediator.getSmsInfoText(
      this.smsResponse.text,
      false, // suffix
    ));
  }

  /**
   * Set response action.
   * @return {Promise}
   */
  setResponseAction() {
    this.loading.action = true;
    return this.api.sms.edit({
      serviceName: this.$stateParams.serviceName,
    }, {
      smsResponse: {
        cgiUrl: this.smsResponse.cgiUrl,
        responseType: this.smsResponse.responseType,
        text: this.smsResponse.text,
        trackingOptions: this.smsResponse.trackingOptions,
      },
    }).$promise.then(() => {
      this.service.smsResponse = this.smsResponse;
      this.smsResponse = angular.copy(_.result(this.service, 'smsResponse'));
      this.Toast.success(this.$translate.instant('sms_options_response_action_status_success'));
    }).catch((err) => {
      this.ToastError(err);
    }).finally(() => {
      this.loading.action = false;
    });
  }

  /**
   * Add tracking options.
   */
  addTrackingOptions() {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsOptionsResponseAddTemplate,
      controller: smsOptionsResponseAddController,
      controllerAs: 'OptionsResponseAddCtrl',
      resolve: {
        params: () => {
          const params = {
            service: this.service,
            senders: this.senders,
          };
          return params;
        },
      },
    });
    modal.result.then(() => this.fetchService().then((service) => {
      this.service = angular.copy(service);
      this.smsResponse = angular.copy(_.result(this.service, 'smsResponse'));
    })).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_options_response_tracking_add_option_ko', { error: error.message }));
      }
    });
  }

  /**
   * Edit tracking options.
   * @param  {Number} $index
   * @param  {Object} option
   */
  editTrackingOptions($index, option) {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsOptionsResponseEditTemplate,
      controller: smsOptionsResponseEditController,
      controllerAs: 'OptionsResponseEditCtrl',
      resolve: {
        service: () => this.service,
        senders: () => this.senders,
        index: () => $index,
        option: () => option,
      },
    });
    modal.result.then(() => this.fetchService().then((service) => {
      this.service = angular.copy(service);
      this.smsResponse = angular.copy(_.result(this.service, 'smsResponse'));
    })).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_options_response_tracking_edit_option_ko', { error: error.message }));
      }
    });
  }

  /**
   * Remove tracking options.
   * @param  {Number} $index
   * @param  {Object} option
   */
  removeTrackingOptions($index, option) {
    const modal = this.$uibModal.open({
      animation: true,
      template: smsOptionsResponseRemoveTemplate,
      controller: smsOptionsResponseRemoveController,
      controllerAs: 'OptionsResponseRemoveCtrl',
      resolve: {
        service: () => this.service,
        index: () => $index,
        option: () => option,
      },
    });
    modal.result.then(() => this.fetchService().then((service) => {
      this.service = angular.copy(service);
      this.smsResponse = angular.copy(_.result(this.service, 'smsResponse'));
    })).catch((error) => {
      if (error && error.type === 'API') {
        this.Toast.error(this.$translate.instant('sms_options_response_tracking_remove_option_ko', { error: error.message }));
      }
    });
  }

  /**
   * Has changed helper.
   * @return {Boolean}
   */
  hasChanged() {
    return !(
      this.service.smsResponse.responseType === this.smsResponse.responseType
        && this.service.smsResponse.cgiUrl === this.smsResponse.cgiUrl
        && this.service.smsResponse.text === this.smsResponse.text
    );
  }
}
