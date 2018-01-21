import firebase from 'firebase'
import { config } from '../../config/firebaseConfig'
import 'firebase/firestore'
firebase.initializeApp(config)

require('./server')
