import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCuN7N8U2gVXBOrmHnk2EfCF8RPXmnmUT0",
  authDomain: "learn-react-25cb8.firebaseapp.com",
  databaseURL: "https://learn-react-25cb8.firebaseio.com",
  projectId: "learn-react-25cb8",
  storageBucket: "learn-react-25cb8.appspot.com",
  messagingSenderId: "1029402752105",
  appId: "1:1029402752105:web:b2ae2231de4bad62511ef8",
  measurementId: "G-0N94KY4MHW"
};

firebase.initializeApp(firebaseConfig);

export const firebaseDb = firebase.database().ref();
