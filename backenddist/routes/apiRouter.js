'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _firebaseBackend = require('../firebaseBackend');

var _firebaseBackend2 = _interopRequireDefault(_firebaseBackend);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'firebase/firestore'
var router = _express2.default.Router();
// const db = firebase.firestore()

// const log = function() {
//   console.log(chalk.cyan('|'), ...arguments)
// }

// /***** MOCKUP START *****/
// /*
// let setList = {
//   name: 'Setlist 1',
//   songs: [
//     {
//       id: 'randomId1',
//       title: 'Song nr 1',
//       artist: 'Artist',
//       duration: 193
//     },
//     {
//       id: 'randomId2',
//       title: 'Song 2',
//       artist: 'Blur',
//       duration: 142
//     },
//     {
//       id: 'randomId3',
//       title: 'Song nr 3',
//       artist: 'Artdsdft',
//       duration: 344
//     },
//     {
//       id: 'randomId4',
//       title: 'Song 4',
//       artist: 'sdfdf',
//       duration: 31
//     },
//     {
//       id: 'randomId5',
//       title: 'Song nr 5',
//       artist: 'Artistdfsf',
//       duration: 993
//     },
//     {
//       id: 'randomId6',
//       title: 'Song 6',
//       artist: 'gwrf',
//       duration: 747
//     }
//   ]
// }

// let setLists = [setList]
// */
// /****** MOCKUP END ******/

// /****** firebase cloud start ******/
// /**
//  * |__ setlists [collection]
//  *    |__ setList [doc]
//  *       |__ songs [collection]
//  *          |__ song [doc]
//  *
//  */
// let setListsRef = db.collection('setlists')
// let setListRef = setListsRef.doc('FRxLwlVoLkKmBzXUrgGC')
// const createSetList = async setList => {
//   const setListDoc = await setListsRef.add(setList)
//   setListRef = setListDoc
//   log('created with id:', setListDoc.id)
//   log('created with ref:', setListDoc.ref)
// }

// const addSong = async song => {
//   const songDoc = await setListRef.collection('songs').add(song)
//   log('song added with id:', songDoc.id)
// }

// const getSetLists = async userId => {
//   return new Promise(async (resolve, reject) => {
//     let snapshot = await setListsRef.where(`users.${userId}`, '==', true).get()
//     if (snapshot) {
//       let setLists = []
//       let promises = []
//       snapshot.forEach(setListDoc => {
//         let setList = {
//           id: setListDoc.id,
//           ...setListDoc.data(),
//           songs: []
//         }
//         setLists.push(setList)
//         promises.push(
//           setListDoc.ref
//             .collection('songs')
//             .get()
//             .then(songs => {
//               songs.forEach(song => {
//                 setList.songs.push({
//                   id: song.id,
//                   ...song.data()
//                 })
//               })
//             })
//         )
//       })
//       await Promise.all(promises)
//       resolve(setLists)
//     } else {
//       log('There are no setlists yet')
//     }
//   })
// }

// let exampleSetList = {
//   title: 'Kraken 2017',
//   subtitle: 'KSM3',
//   users: {
//     johannes: true
//   }
// }
// let exampleSong = {
//   title: 'Smaragds',
//   artist: 'King',
//   duration: 562
// }
// // createSetList(exampleSetList)
// // addSong(exampleSong)
// const userId = 'johannes'

// /**
//  * '/api'
//  */
// router.route('/setlists').get(async (req, res) => {
//   let setLists = await getSetLists(userId)
//   res.json(setLists)
// })

// router.get('/', (req, res) => {
//   res.json({ response: 'api success', data: 'main route: /' })
// })

// // Validate `user` parameter
// router.param('user', (req, res, next, user) => {
//   log('Validating', user)

//   // Validate here
//   // ...

//   // Save validated user to request
//   req.user = user.toUpperCase()
//   next()
// })

// router.route('/auth/:user').get((req, res) => {
//   res.json({ response: `Please, authenticate yourself, ${req.user}` })
// })

module.exports = router;