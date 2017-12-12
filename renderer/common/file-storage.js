
let storage;
function getStorage() {
  if (!storage)storage = require('electron-json-storage');
  return storage;
}

module.exports = {
  getStorage
};
