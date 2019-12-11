import firebase from 'firebase';
import 'firebase/functions';
import CONFIG from '../util/CONFIG';

if (!firebase.apps.length) {
  firebase.initializeApp(CONFIG.FIREBASE_CONFIG);
}

export const getUserFromFirestore = firebase
  .functions()
  .httpsCallable('getUserFromFirestore');
export const getPlaylists = firebase.functions().httpsCallable('getPlaylists');

export const scheduleAlarm = firebase
  .functions()
  .httpsCallable('scheduleAlarm');
