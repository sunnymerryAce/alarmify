// offline test

// Require firebase-admin so we can stub out some of its methods.
const admin = require('firebase-admin');
// オンラインテストの場合はfirebase configが必須
const FIREBASE_CONFIG = {};
const firebaseTest = require('firebase-functions-test')(FIREBASE_CONFIG);
// const test = require('firebase-functions-test')();

const { getPlaylists } = require('../index');

// 非HTTP関数をテストする場合はtest.wrap で関数をラップする
const getPlaylistsWrapped = firebaseTest.wrap(getPlaylists);

// common.jsをモック化
jest.mock('../common/common');

// getPlaylists
describe('getPlaylists', () => {
  test.skip('get playlists correctly', () => {
    expect(getPlaylistsWrapped({})).toMatchObject({
      key: 1,
      value: {},
    });
  });
});
