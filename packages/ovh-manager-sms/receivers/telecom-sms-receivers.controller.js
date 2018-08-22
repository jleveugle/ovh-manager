angular
  .module('managerApp')
  .controller('TelecomSmsReceiversCtrl', class TelecomSmsReceiversCtrl {
    constructor(
      $scope, $stateParams, $q, $filter, $uibModal, $translate, $timeout,
      OvhApiSms, CSVParser, Toast, ToastError, URLS,
    ) {
      this.$filter = $filter;
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.$uibModal = $uibModal;
      this.api = {
        sms: {
          receivers: OvhApiSms.Receivers().v6(),
          task: OvhApiSms.Task().v6(),
        },
      };
      this.CSVParser = CSVParser;
      this.Toast = Toast;
      this.ToastError = ToastError;
      this.constant = { URLS };
    }

    $onInit() {
      this.receivers = {
        raw: [],
        paginated: null,
        sorted: null,
        selected: {},
        orderBy: 'description',
        orderDesc: false,
        isLoading: false,
        isReading: false,
        isCleaning: false,
        isDeleting: false,
      };
      this.slot = {
        raw: [],
        available: [],
        count: null,
        isFull: false,
        threshold: 9,
      };
      this.csv = {
        raw: null,
        data: null,
      };
      this.urls = {
        receivers: _.get(this.constant.URLS, 'guides.sms.receivers'),
      };

      this.receivers.isLoading = true;
      return this.fetchReceivers().then((receivers) => {
        this.receivers.raw = angular.copy(receivers);
        this.sortReceivers();
      }).catch((err) => {
        this.ToastError(err);
      }).finally(() => {
        this.receivers.isLoading = false;
      });
    }

    /**
     * Fetch all receivers.
     * @return {Promise}
     */
    fetchReceivers() {
      return this.api.sms.receivers.query({
        serviceName: this.$stateParams.serviceName,
      }).$promise.then((receiversIds) => {
        this.slot.raw = receiversIds;

        // slotId isn't auto generated :( and must be in the range 1…9.
        for (let i = 1; i <= this.slot.threshold; i += 1) {
          if (_.indexOf(this.slot.raw, i) === -1) {
            this.slot.available.push(i);
          }
        }
        this.slot.count = receiversIds.length;
        this.slot.isFull = this.slot.count >= this.slot.threshold;
        return this.$q.all(_.map(receiversIds, slotId => this.api.sms.receivers.get({
          serviceName: this.$stateParams.serviceName,
          slotId,
        }).$promise));
      });
    }

    /**
     * Sort receivers.
     */
    sortReceivers() {
      let data = angular.copy(this.receivers.raw);
      data = this.$filter('orderBy')(
        data,
        this.receivers.orderBy,
        this.receivers.orderDesc,
      );
      this.receivers.sorted = data;
    }

    /**
     * Order receiver list.
     * @param  {String} by
     */
    orderBy(by) {
      if (this.receivers.orderBy === by) {
        this.receivers.orderDesc = !this.receivers.orderDesc;
      } else {
        this.receivers.orderBy = by;
      }
      this.sortReceivers();
    }

    /**
     * Get all receivers selected.
     * @return {Array}
     */
    getSelection() {
      return _.filter(
        this.receivers.raw,
        receiver => receiver && this.receivers.selected && this.receivers.selected[receiver.slotId],
      );
    }

    /**
     * Refresh receivers' list.
     * @return {Promise}
     */
    refresh() {
      this.api.sms.receivers.resetAllCache();
      this.slot.available = [];
      this.receivers.isLoading = true;
      return this.fetchReceivers().then((receivers) => {
        this.receivers.raw = angular.copy(receivers);
        this.sortReceivers();
      }).catch((err) => {
        this.ToastError(err);
      }).finally(() => {
        this.receivers.isLoading = false;
      });
    }

    /**
     * Opens a modal to add a receiver list.
     */
    add() {
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/receivers/add/telecom-sms-receivers-add.html',
        controller: 'TelecomSmsReceiversAddCtrl',
        controllerAs: 'ReceiversAddCtrl',
        resolve: { slot: () => this.slot },
      });
      modal.result.then(() => this.refresh(), (error) => {
        if (error && error.type === 'API') {
          this.Toast.error(this.$translate.instant('sms_receivers_add_receiver_ko', { error: _.get(error, 'msg.data.message') }));
        }
      });
    }

    /**
     * Opens a modal to edit a given receiver list.
     * @param  {Object} receiver
     */
    edit(receiver) {
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/receivers/edit/telecom-sms-receivers-edit.html',
        controller: 'TelecomSmsReceiversEditCtrl',
        controllerAs: 'ReceiversEditCtrl',
        resolve: { receiver: () => receiver },
      });
      modal.result.then(() => this.refresh(), (error) => {
        if (error && error.type === 'API') {
          this.Toast.error(this.$translate.instant('sms_receivers_edit_receiver_ko', { error: _.get(error, 'msg.data.message') }));
        }
      });
    }

    /**
     * Opens a modal to read a given receiver list.
     * @param  {Object} receiver
     */
    read(receiver) {
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/receivers/read/telecom-sms-receivers-read.html',
        controller: 'TelecomSmsReceiversReadCtrl',
        controllerAs: 'ReceiversReadCtrl',
        resolve: {
          receiver: () => receiver,
          csv: () => this.getCsvData(receiver),
        },
      });
      this.receivers.isReading = true;
      modal.rendered.then(() => {
        this.receivers.isReading = false;
      });
    }

    /**
     * Opens a modal to clean a given receiver list.
     * @param  {Object} receiver
     */
    clean(receiver) {
      if (this.receivers.isCleaning) {
        return this.$q.when(null);
      }
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/receivers/clean/telecom-sms-receivers-clean.html',
        controller: 'TelecomSmsReceiversCleanCtrl',
        controllerAs: 'ReceiversCleanCtrl',
        resolve: { receiver: () => receiver },
      });
      modal.result.then((response) => {
        if (_.has(response, 'taskId')) {
          this.receivers.isCleaning = true;
          return this.api.sms.task.poll(this.$scope, {
            serviceName: this.$stateParams.serviceName,
            taskId: response.taskId,
          }).finally(() => {
            this.receivers.isCleaning = false;
            this.refresh();
          });
        }
        return response;
      }).catch((error) => {
        if (error && error.type === 'API') {
          this.Toast.error(this.$translate.instant('sms_receivers_clean_receiver_ko', { error: _.get(error, 'msg.data.message') }));
        }
      });
      return modal;
    }

    /**
     * Get CSV data.
     * @param  {Object} receiver
     * @return {Promise}
     */
    getCsvData(receiver) {
      return this.api.sms.receivers.getCsv({
        serviceName: this.$stateParams.serviceName,
        slotId: receiver.slotId,
      }).$promise.then((csv) => {
        this.CSVParser.setColumnSeparator(';');
        this.CSVParser.setDetectTypes(false);
        try {
          this.csv.data = this.CSVParser.parse(csv.data);
        } catch (err) {
          this.csv.data = null;
          this.Toast.error(this.$translate.instant('sms_receivers_read_receiver_parse_ko', { error: _.get(err, 'msg.data.message') }));
        }
        return this.csv.data;
      }).catch((err) => {
        this.receivers.isReading = false;
        this.ToastError(err);
      });
    }

    /**
     * Set filename based on service name and receiver description.
     * @param {Object} receiver
     */
    setFilename(receiver) {
      return `${_.kebabCase([
        this.$stateParams.serviceName,
        this.$translate.instant('sms_tabs_contacts'),
        receiver.description,
      ].join())}.csv`;
    }

    /**
     * Opens a modal to remove a given receiver's list.
     * @param  {Object} receiver
     */
    remove(receiver) {
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/receivers/remove/telecom-sms-receivers-remove.html',
        controller: 'TelecomSmsReceiversRemoveCtrl',
        controllerAs: 'ReceiversRemoveCtrl',
        resolve: { receiver: () => receiver },
      });
      modal.result.then(() => this.refresh(), (error) => {
        if (error && error.type === 'API') {
          this.Toast.error(this.$translate.instant('sms_receivers_remove_receiver_ko', { error: _.get(error, 'msg.data.message') }));
        }
      });
    }

    /**
     * Delete selected receivers.
     * @return {Promise}
     */
    deleteSelectedReceivers() {
      const receivers = this.getSelection();
      const queries = receivers.map(receiver => this.api.sms.receivers.delete({
        serviceName: this.$stateParams.serviceName,
        slotId: receiver.slotId,
      }).$promise);
      this.receivers.isDeleting = true;
      queries.push(this.$timeout(angular.noop, 500)); // avoid clipping
      this.Toast.info(this.$translate.instant('sms_receivers_delete_receivers_success'));
      return this.$q.all(queries).then(() => {
        this.receivers.selected = {};
        return this.refresh();
      }).catch((err) => {
        this.ToastError(err);
      }).finally(() => {
        this.receivers.isDeleting = false;
      });
    }
  });
