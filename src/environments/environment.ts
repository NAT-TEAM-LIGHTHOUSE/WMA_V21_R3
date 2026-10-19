// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
   lhsServerUrl: ["http://192.168.100.21:8888/lhsws_wma/",
    "http://203.193.167.118:9003/lhsws_wma/",
    "https://app.lighthouseerp.com/lhsws_wma/",
    "https://wma.lighthouseindia.com/lhsws_wma/"],

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
