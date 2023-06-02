import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
// const { getDatabase } = require("firebase-admin/database");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLsy5habx2I7n904DZ3_aDUywNwgbudSI",
  authDomain: "verbatims-4622f.firebaseapp.com",
  projectId: "verbatims-4622f",
  storageBucket: "verbatims-4622f.appspot.com",
  messagingSenderId: "387906900681",
  appId: "1:387906900681:web:e8b32d5f24812d000ef318",
  measurementId: "G-6YB9K09RE0",
  databaseURL: "https://verbatims-4622f-default-rtdb.firebaseio.com/",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
// Call this to create the user
export function createUserAuth(email, password, username) {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: username,
        })
          .then(() => {
            resolve(user.uid);
          })
          .catch((error) => {
            reject(error.message);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        reject(errorMessage);
      });
  });
}

// Call this to create the user
export function loginUserAuth(email, password) {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        resolve(user.uid);
      })
      .catch((error) => {
        const errorMessage = error.message;
        reject(error.message);
      });
  });
}

// Rishi code
//export function MostRecentMessage(groupID, message) {
//    firebase.database().ref('groups/' + groupID).set({
//      MostRecentMessage: message
//    });
//}

//export function getMessage(groupID){
//  var messageDisplay = firebase.database().ref('groups/' + groupID + '/MostRecentMessage');
//  messageDisplay.on('value', (snapshot) => {
//    const data = snapshot.val();
 //   updateMessage(postElement, data);
//});
//}

//export function getTimeStamp(postID){
//  const dbRef = ref(getDatabase());
//  var timeDisplay = dbRef.ref('SentVerbatims/' + postID + '/timestamp');
//  timeDisplay.on('value', (snapshot) => {
//    return snapshot.val();
//});
//}