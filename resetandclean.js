/* eslint-disable no-console */

let fs = require('fs');
let path = require('path');
let exec = require('child_process').execSync;

let taskRunner = {
  runner: function (args) {
    console.log(args);
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
  deleteFolder: function (folder) {
    let directory = path.join('.', folder);

    if (fs.existsSync(directory)) {
      if (process.platform === 'win32') {
        this.runner('rd /s /q ' + folder);
      } else {
        this.runner('rm -r -f ' + folder);
      }
    }
    if (fs.existsSync(directory)) {
      this.deleteFolder(folder);
    }
  },
  deleteFile: function (file) {
    let item = path.join('.', file);

    if (fs.existsSync(item)) {
      fs.unlinkSync(item);
    }

    if (fs.existsSync(item)) {
      this.deleteFile(file);
    }
  },
  resetAndClean: function () {
    this.deleteFolder('src');
    this.deleteFolder('extension');
    this.deleteFolder('node_modules');
    this.deleteFile('package-lock.json');
  }
};

taskRunner.resetAndClean();
