// This script runs at the beginning of all of your unit tests
// Jest will use the mocked module whenever
// you import the modules defined in this file
// use modules inside __mock__ folder
jest.mock('electron', () => require('./__mock__/electron'));
jest.mock('electron-json-storage', () => require('./__mock__/electron-json-storage'));
