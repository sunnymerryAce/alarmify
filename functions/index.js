const fetch = require('node-fetch');
const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions
  .region('asia-northeast1')
  .https.onRequest((request, response) => {
    response.send('Hello from Firebase!');
  });

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.playSpotify = functions
  .region('asia-northeast1')
  .pubsub.topic('spotify-cron')
  .onPublish((message) => {
    const pubsubMessage = message.data;
    console.log('from local');
    console.log(Buffer.from(pubsubMessage, 'base64').toString());
  });

exports.scheduleAlarm = functions
  .region('asia-northeast1')
  .https.onRequest((request, response) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    console.log('fetch start');
    return fetch(
      'https://cloudscheduler.googleapis.com/v1/projects/alarmify-5f826/locations/spotify-cron',
    )
      .then((res) => {
        console.log(res);
        response.send(res);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  });
