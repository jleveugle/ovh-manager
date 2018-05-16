export default function ($stateProvider) {
    $stateProvider.state("welcome", {
        url: "/welcome",
        template: require('./ovh-manager-welcome.html')
    });
}