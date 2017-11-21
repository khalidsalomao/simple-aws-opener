import { observable } from 'mobx';
import os from 'os';
import storage from 'electron-json-storage';

import logger from '../common/logger';


function saveToDisk(key, data) {
  storage.set(key, data, null, (err) => {
    if (err) {
      logger.error(`storage set ${key}`, err);
    }
  });
}

class AppStore {
  @observable favorites = []

  constructor() {
    storage.setDataPath(os.tmpdir());
    logger.debug(`Local storage location: ${storage.getDefaultDataPath()}`);
  }

  addFavorite(rule) {
    rule.count = (rule.count || 0) + 1;
    if (!this.favorites.find(i => i === rule)) {
      this.favorites.push(rule);
    }
    this.favorites.sort((a, b) => (a.count || 0) - (b.count || 0));
    saveToDisk('favorite-rules', this.favorites);
  }

  clear() {
    this.favorites = [];
    saveToDisk('favorite-rules', this.favorites);
  }
}

const appStore = new AppStore();

export default appStore;
