const { getUserPlaylists } = require('../common/common');

// getPlaylists
describe('getPlaylists', () => {
  test('get "items prperty" correctly', async () => {
    // Firestoreから取ってくる
    const accessToken = '';
    const data = await getUserPlaylists(accessToken);
    expect(data).toHaveProperty('items');
  });
});
