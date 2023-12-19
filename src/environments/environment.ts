// DEFAULT ENVIRONMENT - ng serve will use In-Memory Database
// ng serve

export const API_SERVER = '/api';

export const environment = {
  production: false,
  dev: true,
  remote: false,
  apiServer: API_SERVER,
  appDKey: 'AD-AAB-AAJ-VUB',
  dateFormat: 'MM/DD/YYYY',
  loggingUrl: '', // this is not needed for local development, there would be no logging server to send the logs to
  powerBiGroupId: 'dbfd3a36-1c9d-4c08-b1fe-4be9c4eae6bd',
  howToDocURI: 'https://devvrthelp9501.blob.core.windows.net/devverticehelphes/Jurne/Jurne-How_To_Instructions.pdf'
};
