import { observable } from 'mobx';
import storage from 'electron-json-storage';

import logger from '../common/logger';

function saveToDisk(key, data) {
  storage.set(key, data, null, (err) => {
    if (err) {
      logger.error(`storage set ${key}`, err);
    }
  });
}

// TODO: refine this match
function ruleEquals(ruleA, ruleB) {
  return ruleA.id === ruleB.id &&
    ruleA.name === ruleB.name;
}

class AppStore {
  @observable name = 'oi';
  @observable favorites = [];

  constructor() {
    this.init();
  }

  async init() {
    const storageMode = (process.env.STORAGEMODE || '').trim().toLowerCase();
    if (storageMode === 'tmpdir') {
      storage.setDataPath(require('os').tmpdir()); // eslint-disable-line global-require
    }
    logger.debug(`Local storage location: ${storage.getDataPath()}`);

    this.reload();
  }

  addFavorite(rule) {
    rule.count = (rule.count || 0) + 1;
    if (!this.favorites.find(i => ruleEquals(i, rule))) {
      this.favorites.push(rule);
    }
    // note: observable sort returns a new instance
    this.favorites = this.favorites.sort((a, b) => (b.count || 0) - (a.count || 0));
    saveToDisk('favorite-rules', this.favorites.slice());
  }

  reload() {
    storage.get('favorite-rules', null, (err, data) => {
      if (err) {
        logger.error('failed to load from storage', err);
      }
      this.favorites = data || [];
    });
  }

  removeFavorite(rule) {
    const item = this.favorites.find(i => ruleEquals(i, rule));
    if (item) {
      this.favorites.remove(item);
    }
    saveToDisk('favorite-rules', this.favorites);
  }

  clear() {
    this.favorites = [];
    saveToDisk('favorite-rules', this.favorites);
  }
}

const appStore = new AppStore();

export default appStore;
