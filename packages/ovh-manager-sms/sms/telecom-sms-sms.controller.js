export default class TelecomSmsSmsCtrl {
  constructor($translate) {
    'ngInject';

    this.$translate = $translate;
  }

  $onInit() {
    this.actions = [{
      name: 'sms_compose',
      main: true,
      picto: 'ovh-font-sms',
      sref: 'sms.sms.compose',
      text: this.$translate.instant('sms_sms_compose'),
    }, {
      name: 'sms_history',
      main: true,
      picto: 'ovh-font-SMSEmitting',
      sref: 'sms.sms.outgoing',
      text: this.$translate.instant('sms_sms_history'),
    }, {
      name: 'sms_received',
      main: true,
      picto: 'ovh-font-SMSReceiving',
      sref: 'sms.sms.incoming',
      text: this.$translate.instant('sms_sms_received'),
    }, {
      name: 'sms_pending',
      main: true,
      picto: 'ovh-font-SMSPlanned',
      sref: 'sms.sms.pending',
      text: this.$translate.instant('sms_sms_pending'),
    }, {
      name: 'sms_manage_hlrs',
      sref: 'sms.sms.hlr',
      text: this.$translate.instant('sms_sms_manage_hlrs'),
    }, {
      name: 'sms_manage_templates',
      sref: 'sms.sms.templates',
      text: this.$translate.instant('sms_sms_manage_templates'),
    }];
  }
}
