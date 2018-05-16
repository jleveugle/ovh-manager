import LicenseCtrl from './ovh-manager-license.controller';

export default ($stateProvider) => {
    $stateProvider.state("license", {
        "abstract": true,
        url: "/configuration/license",
        template: "<ui-view/>",
        resolve: {
            translations: ($translate, asyncLoader) =>
                import(`./translations/Messages_${$translate.use()}.xml`).then(module =>
                    asyncLoader.addTranslations(module.default)
                )
            
        }
    });
    $stateProvider.state("license.dashboard", {
        url: "",
        template: require("./ovh-manager-license.html"),
        controller: LicenseCtrl
    });
};