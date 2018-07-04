# nw-vue-devtools

[![Build Status](https://travis-ci.org/TheJaredWilcurt/nw-vue-devtools.svg?branch=master)](https://travis-ci.org/TheJaredWilcurt/nw-vue-devtools)

This is a devDependency for adding Vue-DevTools into NW.js.

![screenshot](https://user-images.githubusercontent.com/4629794/42295950-a94531c2-7fbd-11e8-8d22-bf67ba35509c.png)



## Prerequisites:

You must have Git, Node, and npm installed globally.



## Instructions

1. `npm install --save-dev nw-vue-devtools`
1. Add this to your `package.json`:
    ```js
    "chromium-args": "--load-extension='./node_modules/nw-vue-devtools/extension'",
    ```
1. Vue.js must be in use in your app, and cannot be minified (`vue.js` not `vue.min.js`).

If you are using `nwjs-builder-phoenix` then add in `"chromium-args"` to your `package.json` `build.strippedProperties` array.



## How it works:

This dependency will run an npm script that:

* Clones down the latest source code for [Vue-DevTools](https://github.com/vuejs/vue-devtools) `master` branch.
* Installs the dependencies for Vue-DevTools.
* Builds the source code for Vue-DevTools.
* Places the built version in `node_modules/nw-vue-devtools/extension`.
* Tries to recover from past failures on future re-runs.
* Skips everything if the extension had already been built successfully.
