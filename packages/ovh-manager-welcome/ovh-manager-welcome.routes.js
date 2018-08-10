export default function ($stateProvider) {
    "ngInject";

    $stateProvider.state("welcome", {
        url: "/welcome",
        template: require('./ovh-manager-welcome.html')
    });
}