class storage {
  dataPath;
  dataSet = [];
  returnError;

  setDataPath(directory) {
    this.dataPath = directory;
  }
  getDataPath() {
    return this.dataPath;
  }
  get(key, options, callback) {
    callback(this.returnError, this.dataSet[key]);
  }
  set(key, json, options, callback) {
    this.dataSet[key] = json;
    callback(this.returnError);
  }
  clear() {
    this.dataSet = [];
    this.returnError = null;
  }

  setResults(data) {
    this.dataSet = data;
  }

  setReturnError(value) {
    this.returnError = value;
  }
}

export default new storage();
