import LicenseCtrl from './ovh-manager-license.controller';

export default /* @ngInject */ ($stateProvider) => {
    $stateProvider.state("license", {
        "abstract": true,
        url: "/configuration/license",
        template: "<ui-view/>",
        resolve: {
            translations: /* @ngInject */ ($translate, asyncLoader) =>
                import(`./translations/Messages_${$translate.use()}.xml`).then(module =>
                    asyncLoader.addTranslations(module.default).then(() => $translate.refresh()).then(() => true)                    
                )    
        }
    });
    $stateProvider.state("license.dashboard", {
        url: "",
        template: require("./ovh-manager-license.html"),
        controller: LicenseCtrl
    });
};