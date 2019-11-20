import firebase from '@firebase/app';
import '@firebase/firestore';
import { FirebaseFirestore } from '@firebase/firestore-types';
import '@firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCyR8VclxXZa0f4wlV34I2FUOohjkSRk2o',
  authDomain: 'm33tings-f3b6b.firebaseapp.com',
  databaseURL: 'https://m33tings-f3b6b.firebaseio.com',
  projectId: 'm33tings-f3b6b',
  storageBucket: 'm33tings-f3b6b.appspot.com',
  messagingSenderId: '808640698589',
  appId: '1:808640698589:web:70845fbad2eb2be20d6334',
  measurementId: 'G-E4WCZC70X3',
};

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(firebaseConfig);

// @ts-ignore
const _db = firebase.firestore();
const db = _db as FirebaseFirestore;

export default db;
