/* globals describe,test,expect,beforeEach */

import storage from 'electron-json-storage';
import AppStore from './app-store';

describe('AppStore', () => {
  beforeEach(async () => {
    AppStore.clear();
  });

  test('addFavorite should add', () => {
    AppStore.addFavorite({ id: 1, description: 'name' });
    expect(AppStore.favorites.length).toBe(1);
  });

  test('addFavorite should sort by count', () => {
    AppStore.addFavorite({ id: 1, description: 'rule 1', count: 3 });
    AppStore.addFavorite({ id: 2, description: 'rule 2', count: 10 });
    AppStore.addFavorite({ id: 3, description: 'rule 3', count: 2 });
    expect(AppStore.favorites.length).toBe(3);
    expect(AppStore.favorites[0].description).toBe('rule 2');
    expect(AppStore.favorites[1].description).toBe('rule 1');
    expect(AppStore.favorites[2].description).toBe('rule 3');
  });

  test('reload should load data from disk', () => {
    storage.setResults({ 'favorite-rules': [{ id: 1, description: 'reload-test' }] });
    AppStore.reload();
    expect(AppStore.favorites.length).toBe(1);
    expect(AppStore.favorites[0].description).toBe('reload-test');
  });

  test('remove should delete item', () => {
    AppStore.addFavorite({ id: 1, description: 'name 1', count: 3 });
    AppStore.addFavorite({ id: 2, description: 'name 2', count: 3 });
    AppStore.removeFavorite(AppStore.favorites[0]);
    expect(AppStore.favorites.length).toBe(1);
  });

  test('clear should delete all', () => {
    AppStore.addFavorite({ id: 1, description: 'name' });
    AppStore.clear();
    expect(AppStore.favorites.length).toBe(0);
  });
});
