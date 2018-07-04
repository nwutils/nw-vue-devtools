/* eslint-disable no-console */

let fs = require('fs');
let path = require('path');
let exec = require('child_process').execSync;

let taskRunner = {
  runner: function (args) {
    try {
      let runner = exec(args);

      let output = runner.toString().trim();
      if (output) {
        console.log(output);
      }
    } catch (err) {
      // console.log(err);
    }
  },
  resetAndClean: function () {
    if (process.platform === 'win32') {
      this.runner('rd /s /q src');
      this.runner('rd /s /q src');
      this.runner('rd /s /q src');
      this.runner('rd /s /q extension');
      this.runner('rd /s /q extension');
      this.runner('rd /s /q extension');
      this.runner('rd /s /q node_modules');
      this.runner('rd /s /q node_modules');
      this.runner('rd /s /q node_modules');
    } else {
      this.runner('rm -r -f src');
      this.runner('rm -r -f extension');
      this.runner('rm -r -f node_modules');
    }

    let lock = path.join('.', 'package-lock.json');
    if (fs.existsSync(lock)) {
      fs.unlinkSync(lock);
    }
  }
};

taskRunner.resetAndClean();
