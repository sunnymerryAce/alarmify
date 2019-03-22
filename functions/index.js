const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.fetchSpotify = (req, res) => {
  const clientId = '8be6bb9bbc644e93ade9e6ba983fa7b2';
  const clientSecret = '995b78a6b80c4b6c8bacb8443e24ceaf';
  const redirectUri = 'https://alarmify-5f826.firebaseapp.com/';
  const scopes = 'user-read-private user-read-email';
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  const https = require('https');
  const URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;

  https
    .get(URL, (getRes) => {
      let body = '';
      getRes.setEncoding('utf8');
      getRes.on('data', (chunk) => {
        body += chunk;
      });
      getRes.on('end', () => {
        const responseJson = JSON.parse(body);
        res.status(200).send(responseJson);
      });
    })
    .on('error', (e) => {
      console.error(e);
      res.status(500).send(e);
    });
};
