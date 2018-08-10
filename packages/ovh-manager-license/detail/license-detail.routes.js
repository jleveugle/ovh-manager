import ctrl from "./license-detail.controller";

export default ($stateProvider) => {
    "ngInject";

    $stateProvider.state("license.detail", {
        url: "/:licenceId/detail",
        template: require("./license-detail.html"),
        controller: ctrl,
        translations: ["license"]
    });
};
