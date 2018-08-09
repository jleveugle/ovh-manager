import sidebarMenu from 'ovh-angular-sidebar-menu';

export default angular
    .module("ovh-manager-sidebar", [ sidebarMenu ])
    .run(SidebarMenu => {
        SidebarMenu.setInitializationPromise(
            new Promise(resolve => {
                SidebarMenu.addMenuItem({
                    title: "Licences",
                    state: "license.dashboard"
                });

                resolve();
            })
        )
    })
    .name;
