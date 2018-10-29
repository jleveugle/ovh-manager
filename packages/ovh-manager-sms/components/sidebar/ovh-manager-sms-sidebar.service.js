import angular from 'angular';

export default /* @ngInject */ function ($translate, SidebarMenu, SmsMediator) {
  const self = this;

  self.mainSectionItem = null;

  /*= =======================================
    =            SUBITEMS LOADING            =
    ======================================== */

  self.loadSmsMainSection = function loadMainSection(mainSectionItem) {
    return SmsMediator.initAll().then((smsDetails) => {
      angular.forEach(smsDetails, (smsDetail) => {
        SidebarMenu.addMenuItem({
          id: smsDetail.name,
          title: smsDetail.description || smsDetail.name,
          state: 'sms.dashboard',
          stateParams: {
            serviceName: smsDetail.name,
          },
        }, mainSectionItem);
      });
    });
  };

  /* -----  End of SUBITEMS LOADING  ------*/
}
