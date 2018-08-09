# OVH Manager Proof of Concept

# How to install

## Installer

If you want to install this PoC quickly, you can use this script to have a clean installation:

```bash
wget https://raw.githubusercontent.com/jleveugle/ovh-manager-poc-installer/master/ovh-manager-poc-installer.sh && chmod +x ovh-manager-poc-installer.sh && ./ovh-manager-poc-installer.sh
```

A folder named `ovh-manager-poc` will be created. To start the one manager, you should do:

```bash
cd ovh-manager-poc/ovh-manager && yarn start
```

Enjoy ;)

## Manual installation

Clone this repository and let's go at the root of the folder :)

```bash
cd ovh-manager-poc
```

Install it by using yarn >= 1.7 (we are using workspace feature: https://yarnpkg.com/lang/en/docs/cli/workspace/)

```bash
yarn install
```

To work, you should have theses dependencies installed locally:

* ovh-utils-angular
* ovh-angular-http
* ovh-angular-sso-auth
* ovh-angular-sidebar-menu

For each, you have to clone it, install it and link it using `yarn link`.

```bash
cd ovh-utils-angular #ovh-angular-http / ovh-angular-sso-auth / ovh-angular-sidebar-menu
yarn install
yarn link
```

Once these actions realized, you can link each library in the one-manager project. At the root folder:

```bash
yarn link @ovh-ux/ovh-utils-angular
yarn link ovh-angular-http
yarn link ovh-angular-sso-auth
yarn link ovh-angular-sidebar-menu
```

# Start

```bash
yarn start
```

By default, the UI is available at: http://localhost:8080

A Bundler Analyzer is available at: http://localhost:8888

See you :)