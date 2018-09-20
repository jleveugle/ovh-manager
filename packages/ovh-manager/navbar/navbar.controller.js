export default class NavbarController {
  constructor(ManagerNavbarService) {
    'ngInject';

    this.ManagerNavbarService = ManagerNavbarService;
    this.responsiveLinks = [];

    this.ManagerNavbarService.getNavbar().then(({ brand, managerLinks, internalLinks }) => {
      this.brand = brand;
      this.managerLinks = managerLinks;
      this.internalLinks = internalLinks;
    });
  }
}
