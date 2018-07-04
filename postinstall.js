/* eslint-disable no-console */

let fs = require('fs');
let path = require('path');
let exec = require('child_process').execSync;

let postInstall = {
  data: {
    alreadyBeenRan: false,
    anErrorOccured: false,
    // __dirname is the path to the folder that contains postinstall.js
    originalDir: __dirname + '',
    clonedLocation: path.join(__dirname, 'src', 'vue-devtools'),
    builtExtension: path.join(__dirname, 'src', 'vue-devtools', 'shells', 'chrome'),
    destination: path.join(__dirname, 'extension'),
    flagFile: path.join(__dirname, 'extension', 'flag.txt')
  },
  /**
   * Attempts to synchronously run an executable in a child process.
   * Catches errors and logs them.
   * @param  {string} args  The command to be ran in the command prompt/terminal.
   */
  runner: function (args) {
    try {
      let runner = exec(args);

      let output = runner.toString().trim();
      if (output) {
        // console.log('Vue-DevTools:', output);
      }
    } catch (err) {
      this.data.anErrorOccured = true;
      console.log('Vue-DevTools:', err);
    }
  },
  /**
   * Checks if the flag file exists, signalling that everything else ran successfully.
   */
  checkIfPreviouslySuccessful: function () {
    if (fs.existsSync(this.data.flagFile)) {
      this.data.alreadyBeenRan = true;
    }
  },
  cleanClonedLocation: function () {
    let src = path.join(this.data.originalDir, 'src');
    if (process.platform === 'win32') {
      this.runner('rd /s /q ' + src);
    } else {
      this.runner('rm -r -f ' + src);
    }
  },
  /**
   * Attempt to clone Vue-DevTools with HTTPS, if that fails,
   * try cloning with SSH, if that fails, log error.
   */
  gitClone: function () {
    if (fs.existsSync(this.data.builtExtension)) {
      return;
    }
    if (fs.existsSync(this.data.clonedLocation)) {
      this.cleanClonedLocation();
    }
    console.log('Vue-DevTools: Downloading Vue-DevTools source code');

    let executable = 'git clone --quiet';
    let url = 'https://github.com/vuejs/vue-devtools.git';
    let branch = '-b master';

    let args = [
      executable,
      url,
      branch,
      this.data.clonedLocation
    ].join(' ').trim();

    try {
      // httpsRunner
      exec(args);
    } catch (err) {
      url = 'git@github.com:vuejs/vue-devtools.git';

      args = [
        executable,
        url,
        branch,
        this.data.clonedLocation
      ].join(' ').trim();

      try {
        // sshRunner
        exec(args);
      } catch (error) {
        this.data.anErrorOccured = true;
        console.log('Vue-DevTools: Error downloading Vue-DevTools.');
        console.log(error);
      }
    }
  },
  npmInstall: function () {
    if (this.data.anErrorOccured) {
      return;
    }
    console.log('Vue-DevTools: Installing Vue-DevTools dependencies');

    process.chdir(this.data.clonedLocation);

    this.runner('npm install');

    process.chdir(this.data.originalDir);
  },
  npmRunBuild: function () {
    if (this.data.anErrorOccured) {
      return;
    }
    console.log('Vue-DevTools: Building Vue-DevTools');

    process.chdir(this.data.clonedLocation);

    this.runner('npm run build');

    process.chdir(this.data.originalDir);
  },
  relocateDevTools: function () {
    if (this.data.anErrorOccured) {
      return;
    }
    console.log('Vue-DevTools: Installing Vue-DevTools in NW.js');
    try {
      fs.renameSync(this.data.builtExtension, this.data.destination);
    } catch (err) {
      this.data.anErrorOccured = true;
      console.log('Vue-DevTools:', err);
    }
  },
  /**
   * Create a text file in the extension directory to
   * signify the operation completed successfully.
   */
  setSuccessFlag: function () {
    if (this.data.anErrorOccured) {
      return;
    }
    try {
      fs.writeFileSync(this.data.flagFile, 'Success.');
    } catch (err) {
      this.data.anErrorOccured = true;
      console.log('Vue-DevTools: Error creating flag file');
      console.log('Vue-DevTools:', err);
    }
  },
  runEverything: function () {
    this.checkIfPreviouslySuccessful();
    if (this.data.alreadyBeenRan) {
      return;
    }
    this.gitClone();
    this.npmInstall();
    this.npmRunBuild();
    this.relocateDevTools();
    this.setSuccessFlag();

    console.log('Vue-DevTools: Success.');
  }
};

postInstall.runEverything();