# nw-vue-devtools

[![Build Status](https://travis-ci.org/TheJaredWilcurt/nw-vue-devtools.svg?branch=master)](https://travis-ci.org/TheJaredWilcurt/nw-vue-devtools)

This is a devDependency for adding Vue-DevTools into NW.js.



## Prerequisites:

* Git must be installed globally
* Node 4 or above
* npm 3 or above



## Instructions

1. `npm install --save-dev nw-vue-devtools`
1. Add this to your `package.json`:
    ```js
    "chromium-args": "--load-extension='./node_modules/nw-vue-devtools/extension'",
    ```
1. Vue.js must be in use in your app, and cannot be minified (`vue.js` not `vue.min.js`).

If you are using `nwjs-builder-phoenix` then add in `"chromium-args"` to your `package.json` `build.strippedProperties`.



## How it works:

This dependency will run an npm script that:

* Clones down the latest source code for Vue-DevTools `master` branch.
* Installs the dependencies for Vue-DevTools.
* Builds the source code for Vue-DevTools.
* Places the built version in `node_modules/nw-vue-devtools/extension`.
* Tries to recover from past failures on future re-runs.
* Skips everything if the extension had already been built successfully.
