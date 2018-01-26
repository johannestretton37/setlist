import firebase from 'firebase'
import { config } from './firebaseConfig'
import 'firebase/firestore'
firebase.initializeApp(config)

require('./server')
