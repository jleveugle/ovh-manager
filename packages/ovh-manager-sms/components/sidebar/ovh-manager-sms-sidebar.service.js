import angular from 'angular';

export default /* @ngInject */ function ($translate, SidebarMenu, SmsMediator) {
  const self = this;

  self.mainSectionItem = null;

  /*= =======================================
    =            SUBITEMS LOADING            =
    ======================================== */

  self.loadSmsMainSection = function loadSmsMainSection() {
    // console.log(self.mainSectionItem);

    return SmsMediator.initAll().then((smsDetails) => {
      angular.forEach(smsDetails, (smsDetail) => {
        // console.log(SidebarMenu, smsDetail);

        SidebarMenu.addMenuItem({
          id: smsDetail.name,
          title: smsDetail.description || smsDetail.name,
          state: 'sms.dashboard',
          stateParams: {
            serviceName: smsDetail.name,
          },
        }); // , self.mainSectionItem);
      });
    });
  };

  /* -----  End of SUBITEMS LOADING  ------*/

  /*= =====================================
    =            INITIALIZATION            =""
    ====================================== */

  self.init = function init() {
    self.mainSectionItem = SidebarMenu.addMenuItem({
      title: $translate.instant('telecom_sidebar_section_sms'),
      error: $translate.instant('telecom_sidebar_load_error'),
      id: 'telecom-sms-section',
      category: 'sms',
      icon: 'ovh-font ovh-font-message',
      allowSubItems: true,
      onLoad: self.loadSmsMainSection,
      loadOnState: 'sms',
    });

    return self.mainSectionItem;
  };

  /* -----  End of INITIALIZATION  ------*/
}
