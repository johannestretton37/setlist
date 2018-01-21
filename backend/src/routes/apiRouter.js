import express from 'express'
import firebase from 'firebase'
import chalk from 'chalk'
const router = express.Router()
import 'firebase/firestore'
const db = firebase.firestore()

const log = function() {
  console.log(chalk.cyan('|'), ...arguments)
}

/****** firebase cloud start ******/
/**
 * |__ setlists [collection]
 *    |__ setList [doc]
 *       |__ songs [collection]
 *          |__ song [doc]
 *
 */
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

let exampleSetList = {
  title: 'Kraken 2017',
  subtitle: 'KSM3',
  users: {
    johannes: true
  }
}
let exampleSong = {
  title: 'Smaragds',
  artist: 'King',
  duration: 562
}
// createSetList(exampleSetList)
// addSong(exampleSong)
const userId = 'johannes'

/**
 * '/api'
 */
router.route('/setlists').get(async (req, res) => {
  let setLists = await getSetLists(userId)
  res.json(setLists)
})

router.get('/', (req, res) => {
  res.json({ response: 'api success', data: 'main route: /' })
})

// Validate `user` parameter
router.param('user', (req, res, next, user) => {
  log('Validating', user)

  // Validate here
  // ...

  // Save validated user to request
  req.user = user.toUpperCase()
  next()
})

router.route('/auth/:user').get((req, res) => {
  res.json({ response: `Please, authenticate yourself, ${req.user}` })
})

module.exports = router
