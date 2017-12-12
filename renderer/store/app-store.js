import { observable, computed, action } from 'mobx';

import logger from '../common/logger';
import { getStorage } from '../common/file-storage';


function saveToDisk(key, data) {
  if (!getStorage()) { return; }
  getStorage().set(key, data, null, (err) => {
    if (err) {
      logger.error(`storage set ${key}`, err);
    }
  });
}

function mostOcurrences(list, name) {
  if (!list[0]) { return null; }
  let top = list[0][name];
  const counts = {};
  for (let i = 0; i < list.length; i += 1) {
    const e = list[i];
    const c = (e.count || 1) / 2;
    counts[e[name]] = (counts[e[name]] || 1) + 1 + c;
    if (counts[top] < counts[e[name]]) {
      top = e[name];
    }
  }
  return top;
}

function ruleEquals(ruleA, ruleB) {
  console.log(ruleA, ruleB);
  if (!ruleA.id || !ruleB.id) {
    console.log('full comparison');
    const listA = ruleA.ipList || [];
    const listB = ruleB.ipList || [];

    if ((!ruleA.groupId || !ruleB.groupId) && ruleA.groupName !== ruleB.groupName) {
      return false;
    }

    return ruleA.description === ruleB.description &&
      ruleA.fromPort === ruleB.fromPort &&
      ruleA.toPort === ruleB.toPort &&
      ruleA.region === ruleB.region &&
      ruleA.groupId === ruleB.groupId &&
      listA.length === listB.length &&
      listA.every((v, i) => v === listB[i]);
  }

  return ruleA.id === ruleB.id;
}

class AppStore {
  @observable name = 'oi';
  @observable favorites = [];
  @observable events = '';
  @observable regions = ['us-east-1', 'sa-east-1'];
  @observable selectedRules = [];
  @observable ruleForm = {
    groupId: '',
    description: '',
    ipList: '',
    fromPort: '',
    toPort: '',
    region: ''
  };

  constructor() {
    this.init();
  }

  async init() {
    if (getStorage()) {
      const storageMode = (process.env.STORAGEMODE || '').trim().toLowerCase();
      if (storageMode === 'tmpdir') {
        getStorage().setDataPath(require('os').tmpdir()); // eslint-disable-line global-require
      }
      logger.debug(`Local storage location: ${getStorage().getDataPath()}`);

      this.reload();
    }
  }

  addFavorite(rule) {
    const list = this.favorites.slice();
    const existingRule = list.find(i => ruleEquals(i, rule));
    if (!existingRule) {
      rule.id = rule.id || new Date().getTime();
      rule.count = (rule.count || 0) + 1;
      rule.ipList = (rule.ipList || []).sort();
      if (list.length > 100) {
        list.pop();
      }
      list.push(rule);
    } else {
      existingRule.count = (existingRule.count || 0) + 1;
    }
    // note: observable sort returns a new instance
    this.favorites = list.sort((a, b) => (b.count || 0) - (a.count || 0));
    saveToDisk('favorite-rules', list);
  }

  @action reload() {
    if (!getStorage()) { return; }
    getStorage().get('favorite-rules', null, (err, data) => {
      if (err) {
        logger.error('failed to load from storage', err);
      }
      this.favorites = data || [];

      if (data && data[0]) {
        this.setRuleForm({
          groupId: mostOcurrences(data, 'groupId'),
          description: mostOcurrences(data, 'description'),
          ipList: '',
          fromPort: mostOcurrences(data, 'fromPort'),
          toPort: mostOcurrences(data, 'toPort'),
          region: mostOcurrences(data, 'region')
        });
      }
    });

    getStorage().get('aws-regions', null, (err, data) => {
      if (err) {
        logger.error('failed to load from storage', err);
      }
      this.regions = data || [];
    });

    this.selectedRules = [];
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
    this.selectedRules = [];
    saveToDisk('favorite-rules', this.favorites);
  }

  clearEvents() {
    this.events = '';
  }

  printEvent(t, overwrite) {
    const maxLen = 12000;
    const text = (t && typeof t !== 'string') ? JSON.stringify(t) : (t || '');
    let content = this.events || '';
    const newText = `${new Date().toLocaleString()}\n${text}`;
    content = overwrite ? newText : `${newText}\n${content.substr(0, maxLen)}`;
    this.events = content;
    logger.info(t);
  }

  setAwsRegions(regions) {
    this.regions = regions;
    saveToDisk('aws-regions', this.regions.slice());
  }

  sendAwsCliNotFound() {
    /* eslint-disable */
    alert(`
      AWS Command Line not installed.
    `);
    /* eslint-enable */
  }

  setRuleForm(rule) {
    const from = rule.fromPort || '';
    const to = rule.toPort || '';
    const port = from !== to ? `${from} - ${to}` : `${from}`;

    this.ruleForm = {
      description: rule.description || '',
      groupId: rule.groupId || '',
      region: rule.region || 'sa-east-1',
      port,
      ipList: rule.ipList && rule.ipList.slice ? rule.ipList.slice().join(', ') : rule.ipList
    };
  }

  @computed get isEmptySelection() {
    return !this.selectedRules.length;
  }

  @action addSelection(rule) {
    if (rule) {
      const list = (this.selectedRules || []).slice().filter(r => rule.id !== r.id);
      list.push(rule);
      this.selectedRules = list;
      this.setRuleForm(rule);
    }
  }

  removeSelection(rule) {
    this.selectedRules = (this.selectedRules || []).slice().filter(r => rule.id !== r.id);
  }

  toggleSelection(checked) {
    this.selectedRules = checked ?
      this.favorites.slice() :
      [];
  }
}

const appStore = new AppStore();

export default appStore;
