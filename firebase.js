import firebase from "firebase";
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDRntfsVA9__dtJqWv6XiVh2ddyb6SE8lw",
    authDomain: "cars-8bccf.firebaseapp.com",
    projectId: "cars-8bccf",
    storageBucket: "cars-8bccf.appspot.com",
    messagingSenderId: "740313566237",
    appId: "1:740313566237:web:1dfe290b6ef49e9fe50af4"
  };
const app = !firebase.apps.length 
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const storage = app.storage();
const provider = new firebase.auth.GoogleAuthProvider();
const providerWithEmail = new firebase.auth.EmailAuthProvider();
export { db, auth, provider, storage};
