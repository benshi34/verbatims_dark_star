import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
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

// function writeUserData(name, email) {
// }

const db = getDatabase();

export function writeUserData(username, email) {
  set(ref(db, "users/" + username), {
    email: email,
  });
}
