import template from './ovh-manager-sms.html';
import controller from './ovh-manager-sms.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms', {
    url: '/sms/:serviceName',
    template,
    controller,
    controllerAs: 'TelecomSmsCtrl',
    abstract: true,
    resolve: {
      initSms: /* @ngInject */ ($q, $stateParams, SmsMediator) => {
        // init sms services
        SmsMediator
          .initAll()
          .then(smsDetails => SmsMediator.setCurrentSmsService(
            smsDetails[$stateParams.serviceName],
          ));

        return $q.when({ init: true });
      },
      $title: /* @ngInject */ ($translate, OvhApiSms, $stateParams) => OvhApiSms.v6()
        .get({
          serviceName: $stateParams.serviceName,
        }).$promise
        .then(data => $translate.instant('sms_page_title', { name: data.description || $stateParams.serviceName }, null, null, 'escape'))
        .catch(() => $translate('sms_page_title', { name: $stateParams.serviceName })),
      translations: /* @ngInject */ ($q, $translate, asyncLoader) => $q.all(
        import(`./translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default)),
        import(`@ovh-ux/ovh-manager-toolbox-telecom/translations/Messages_${$translate.use()}.xml`).then(module => asyncLoader.addTranslations(module.default)),
      )
        .then(() => $translate.refresh()).then(() => true),
    },
  });
};
