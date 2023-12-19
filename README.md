# Vertice 3.0

##Warning
Do not attempt to run this application locally using the master branch. It is obsolete and not used at this time. 

## Setup Instructions
#### Note: This application is best developed in WebStorm or VS Code, but requires no IDE for just running the application locally.
1. (Potentially only for Windows) Run `git config --global core.longpaths true` so that git can manage such long file paths
2. Clone this repo (http://git.hestest.com:7990/scm/ver/vertice-ui.git)
3. Open the cloned local directory in your choice of IDE
4. Install Node.js 16 LTS and Node Package Manager (npm). You may already have these so try `node -v` and `npm -v` first.
   1. For Windows, use the "Software Center" to download the latest node version which comes with npm
   2. For macOS, run `brew install node` and `brew install npm`
5. Install the Angular Command Line Interface, run `npm install -g @angular/cli`
6. Run `npm install` inside the root of the project directory
   1. If you get a 403 error while connecting to our internal Nexus, edit the .npmrc file to remove the semicolon on the 3rd line and try again. EDIT: Can you just do something like `npm install --registry=https://registry.npmjs.org/`?
   2. TODO: Work with security to fix this so that it's not a problem from employee's computers
7. Verify that the port number in [environment.dev-local.ts](./src/environments/environment.dev-local.ts) matches the port you ran your local [ngVertice-Service](http://git.hestest.com/projects/VER/repos/ngvertice-service/browse) on. Then run `ng serve -c dev-local` and access http://localhost:4200/preferences to view Vertice 3.0.
   1. Running `ng serve` without the config parameter will run the project in "In Memory Web Api" mode which is deprecated, but mocks API responses and can be used if needed.
   2. NOTE: If you get an error about `ng serve` being unrecognized, make sure to close and re-open your terminal since having installed the Angular CLI

## Environments
Inside the project, there are multiple "environment.ts" files. These files are swapped depending on the -c flag. When using the environment files in any other 'ts' file, you should only import the "./src/environments/environment.ts" file!

## In Memory Web API
By default (using just `ng serve`), the UI will run under an "In Memory" mode that will loop-back all http calls. This is configured using the [In memory data service](.src/app/in-memory-data.service.ts).
The object returned from the `createDb()` method gives a key value pair mapping to the endpoints called from any http client service.

## [Module List](./src/app/modules/README.md)
