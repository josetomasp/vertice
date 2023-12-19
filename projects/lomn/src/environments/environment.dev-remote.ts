// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.dev-remote.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

// FACTORY INSTANCE ENVIRONMENT
// ng serve -c dev-remote
// ng serve --configuration=dev-remote

export const API_SERVER = '/ngVertice-Service/service';

export const environment = {
  appDKey: 'AD-AAB-AAJ-VUB',
  production: false,
  dev: false,
  remote: true,
  dateFormat: 'MM/DD/YYYY',
  apiServer: API_SERVER,
  loggingUrl: '/logger',
  powerBiGroupId: '2d44d5c0-02ca-4440-9d34-11c4c80e89c8' //NEW lomn-wrapper group id
  // powerBiGroupId: '06de043f-95fc-4a02-8d35-d0306072ab14' //OLD prod group id
  // powerBiGroupId: 'dbfd3a36-1c9d-4c08-b1fe-4be9c4eae6bd' //NEW prod group id
};
