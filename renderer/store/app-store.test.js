jest.mock('electron-json-storage');

import AppStore from './app-store';

describe('AppStore', () => {
  beforeEach(async () => {
  });

  test('addFavorite should add', () => {
    AppStore.addFavorite({ id: 1, name: 'name' });
    expect(AppStore.favorites.length).toBe(1);
  });
});
