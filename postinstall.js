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
    buildConfig: path.join(__dirname, 'src', 'vue-devtools', 'shells', 'createConfig.js'),
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
      if (err.stderr) {
        console.log('STDERR: ' + err.stderr.toString());
      }
      if (err.stdout) {
        console.log('STDOUT: ' + err.stdout.toString());
      }
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
    if (this.data.anErrorOccured) {
      return;
    }
    console.log('Vue-DevTools: Downloading latest Vue-DevTools source code');

    let executable = 'git clone --quiet';
    let url = 'https://github.com/vuejs/vue-devtools.git';
    let branch = '-b master';

    let clonedLocation;
    if (process.platform === 'win32') {
      clonedLocation = '"' + this.data.clonedLocation + '"';
    } else {
      // Regex replaces spaces with a escaped spaces
      // 'path with  space' => 'path\ with\ \ space'
      clonedLocation = this.data.clonedLocation.replace(/[ ]/g, '\\ ');
    }

    let args = [
      executable,
      url,
      branch,
      clonedLocation
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
        clonedLocation
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
  modifyWebpackConfig: function () {
    if (this.data.anErrorOccured) {
      return;
    }
    console.log('Vue-DevTools: Modifying Webpack Configuration');

    let config = '';

    try {
      config = fs.readFileSync(this.data.buildConfig);
    } catch (err) {
      console.log('Vue-DevTools: Error reading Vue-Devtools config file.');
      this.data.anErrorOccured = true;
      return;
    }

    config = String(config);
    // Convert CRLF to LF
    config = config.split('\r\n').join('\n');
    config = config.split('\n');

    config = config.filter(function (line) {
      return !line.includes('exclude: /node_modules');
    });

    config = config.join('\n');

    try {
      fs.writeFileSync(this.data.buildConfig, config);
    } catch (err) {
      console.log('Vue-DevTools: Error writing Vue-Devtools config file.');
      this.data.anErrorOccured = true;
      return;
    }
  },
  npmRunBuild: function () {
    if (this.data.anErrorOccured) {
      return;
    }
    console.log('Vue-DevTools: Building Vue-DevTools');

    process.chdir(this.data.builtExtension);

    if (process.platform === 'win32') {
      this.runner('..\\..\\node_modules\\.bin\\webpack.cmd --hide-modules');
    } else {
      this.runner('node ../../node_modules/.bin/webpack --hide-modules');
    }

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
   * Fix manifest.json permissions to allow proxy injection in nw.js > 0.31.5
   * @see https://github.com/nwjs/nw.js/issues/6744#issuecomment-410476111
   */
  fixPermissions: function () {
    if (this.data.anErrorOccured) {
      return;
    }
    console.log('Vue-DevTools: Fixing Vue-DevTools permissions');
    const manifestFilePath = path.resolve(this.data.destination, 'manifest.json');
    const manifest = require(manifestFilePath);
    manifest.permissions.push('*://*/*');
    try {
      fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, null, 2));
    } catch (error) {
      this.data.anErrorOccured = true;
      console.log('Vue-DevTools: Error saving manifest.json file');
      console.log('Vue-DevTools:', error);
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
    this.modifyWebpackConfig();
    this.npmRunBuild();
    this.relocateDevTools();
    this.fixPermissions();
    this.setSuccessFlag();

    if (this.data.anErrorOccured) {
      console.log('Vue-DevTools: Finished with errors.');
    } else {
      console.log('Vue-DevTools: Success.');
    }
  }
};

postInstall.runEverything();
