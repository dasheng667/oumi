const fs = require('fs-extra');

exports.writeJSON = function(filePath, data, callback) {
  fs.createFileSync(filePath);
  fs.writeFile(filePath, JSON.stringify(data, null, '\t'), null, (err, data2) => {
    if (typeof callback === 'function') {
      callback(err, data2);
    }
  });
}


exports.createFileSync = function createFileSync(filePath) {
  fs.createFileSync(filePath);
}

exports.ensureDirSync = function ensureDirSync(filePath) {
  fs.ensureDirSync(filePath);
}

exports.writeFile = function writeFile(filePath, content, options) {
  const { isCreateFile = true } = options || {};
  if(isCreateFile){
    fs.createFileSync(filePath);
  }
  fs.writeFile(filePath, content, null, () => {});
}

exports.getModuleExport = exports => exports.__esModule ? exports.default : exports