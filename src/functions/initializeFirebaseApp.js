import firebase from 'firebase';
import 'firebase/functions';
// Your web app's Firebase configuration
import FIREBASE_CONFIG from '../helper/FIREBASE_CONFIG';

const initializeFirebaseApp = () => {
  // Initialize Firebase
  firebase.initializeApp(FIREBASE_CONFIG);
};

export default initializeFirebaseApp;
