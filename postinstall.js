let fs = require('fs');
let path = require('path');
let exec = require('child_process').execSync;

let originalDir = __dirname + '';
let clonedLocation = '';
let destination = '';
let weAreInsideNodeModules = false;
let alreadyBeenRan = false;

let postInstall = {
  checkForClonedLocation: function () {
    let nodeModules = path.join(originalDir, 'node_modules');
    let nodeModulesDevTools = path.join(nodeModules, 'vue-devtools');
    let parentNodeModules = path.resolve(originalDir, '..');
    let parentDevTools = path.join(originalDir, '..', 'vue-devtools');

    if (fs.existsSync(nodeModules) && fs.existsSync(nodeModulesDevTools)) {
      clonedLocation = nodeModulesDevTools;
    } else if (path.basename(parentNodeModules) === 'node_modules') {
      weAreInsideNodeModules = true;
      if (fs.existsSync(parentDevTools)) {
        clonedLocation = parentDevTools;
      }
    }
  },
  setDestination: function () {
    if (weAreInsideNodeModules) {
      destination = path.join(originalDir, '..', 'vue-devtools');
    } else {
      destination = path.join(originalDir, 'node_modules', 'vue-devtools');
    }
    destination = path.join(originalDir, 'vue-devtools');
  },
  checkIfPreviouslySuccessful: function () {
    alreadyBeenRan = false;
  },
  runner: function (args) {
    try {
      let runner = exec(args);

      let output = runner.toString().trim();
      if (output) {
        // console.log(output);
      }
    } catch (err) {
      console.log(err);
    }
  },
  gitClone: function () {
    console.log('Downloading Vue-DevTools source code');

    let executable = 'git clone --quiet';
    let url = 'https://github.com/vuejs/vue-devtools.git';
    let branch = '-b master';

    let args = [
      executable,
      url,
      branch,
      destination
    ].join(' ').trim();

    try {
      let httpsRunner = exec(args);
    } catch (err) {
      url = 'git@github.com:vuejs/vue-devtools.git';

      args = [
        executable,
        url,
        branch,
        destination
      ].join(' ').trim();

      try {
        let sshRunner = exec(args);
      } catch (error) {
        console.log('Error downloading Vue-DevTools.');
        console.log(error);
      }
    }
  },
  npmInstallDevTools: function () {
    console.log('Installing Vue-DevTools dependencies');

    process.chdir(destination);

    this.runner('npm install');

    process.chdir(originalDir);
  },
  buildDevTools: function () {
    console.log('Building Vue-DevTools');

    process.chdir(destination);

    this.runner('npm run build');

    process.chdir(originalDir);
  },
  relocateDevTools: function () {
    console.log('Installing Vue-DevTools in NW.js');
    try {
      fs.renameSync(destination, path.join(originalDir, 'node_modules', 'vue-devtools'));
    } catch (err) {
      console.log(err);
    }
  },
  runEverything: function () {
    this.checkForClonedLocation();
    this.setDestination();
    this.checkIfPreviouslySuccessful();
    // If we've already ran this once, we don't need to re-run it on every `npm install`
    if (!clonedLocation) {
      this.gitClone();
      this.checkForClonedLocation();
    }
    if (!alreadyBeenRan) {
      this.npmInstallDevTools();
      this.buildDevTools();
      // this.relocateDevTools();
    }
  }
};

postInstall.runEverything();
