import SetList from './Models/SetList'
import Song from './Models/Song'
import firebase from 'firebase'

class FirestoreDatabaseConnection {
  constructor(store) {
    this.store = store
    this.unsubscribeSetListWatch
    this.unsubscribeSongsWatch
  }

  getOrCreateUser = async user => {
    const db = firebase.firestore()
    try {
      debugger
      let users = await db.collection('users')
      debugger
      let user = await users.doc(user.uid)
      debugger
      let userDoc = await user.get()
      debugger
      if (userDoc.exists) {
        let storedUser = userDoc.data()
        return storedUser
      } else {
        // create user
        db
          .collection('users')
          .doc(user.uid)
          .set(user)
          .then(() => {
            return user
          })
      }
    } catch (error) {
      console.log('error')
      console.log(error)
    }
  }

  /**
   * Get a reference to a firestore collection
   * @param {string} collection - Identifier for the collection to get.
   * Possible values are: `setlists`, `users`, `invitations`
   */
  getCollectionRef = async collection => {
    return new Promise(async resolve => {
      const db = firebase.firestore()
      try {
        const ref = await db.collection(collection)
        return resolve(ref)
      } catch (error) {
        return resolve(false)
      }
    })
  }

  /**
   * Invite someone to collaborate on a setlist
   * @param {string} invitedEmail - An email address to the new collaborator
   * @param {string} inviterId - A uid for the person inviting
   * @param {string} setListId - The setlist id to collaborate on
   */
  inviteCollaborator = (invitedEmail, inviterId, setListId) => {
    // invitedEmail = 'sofie.forsman@gmail.com'
    return new Promise(async (resolve, reject) => {
      console.log(
        `${inviterId} invites ${invitedEmail} to setlist ${setListId}`
      )
      try {
        let invitationsRef = await this.getCollectionRef('invitations')
        // Get all invites user has sent
        let invites = await invitationsRef
          .where('inviter', '==', inviterId)
          .get()
        // Check if `invitedEmail` has already been invited
        let alreadyInvited = false
        invites.forEach(invite => {
          let existingInvite = invite.data()
          if (
            existingInvite.setListId === setListId &&
            existingInvite.invited === invitedEmail
          ) {
            alreadyInvited = true
          }
        })
        if (alreadyInvited) {
          return reject(`${invitedEmail} is already invited to this SetList`)
        } else {
          // Create new invitation
          let result = await invitationsRef.doc().set({
            invited: invitedEmail,
            inviter: inviterId,
            setListId
          })
          return resolve(`${invitedEmail} successfully invited`)
        }
      } catch (error) {
        return reject(error)
      }
    })
  }

  getUsersLastSetListId = uid => {
    return new Promise(async resolve => {
      const usersRef = await this.getCollectionRef('users')
      if (!usersRef) return resolve(undefined)
      try {
        const userRef = await usersRef.doc(uid)
        const userDoc = await userRef.get()
        if (userDoc.exists) {
          let user = userDoc.data()
          return resolve(user.currentSetListId)
        } else {
          return resolve(undefined)
        }
      } catch (error) {
        return resolve(undefined)
      }
    })
  }

  getSetLists = async uid => {
    const setListsRef = await this.getCollectionRef('setlists')
    if (!setListsRef) return undefined
    return setListsRef
      .where(`users.${uid}`, '==', true)
      .get()
      .then(async setListSnapshot => {
        let setLists = {}
        let setListPromises = []
        // Loop through setlists
        setListSnapshot.forEach(setlistDoc => {
          const setListData = setlistDoc.data()
          let setList = SetList.setListFromDocData(setListData, setlistDoc.id)
          // Get songs
          let setListPromise = setlistDoc.ref
            .collection('songs')
            .get()
            .then(snapshot => {
              snapshot.forEach(songDoc => {
                // Loop through songs
                const songData = songDoc.data()
                let song = Song.songFromDocData(songData, songDoc.id)
                setList.songs.push(song)
              })
              setLists[setList.id] = setList
            })
          setListPromises.push(setListPromise)
        })
        await Promise.all(setListPromises)
        return setLists
      })
  }

  persistCurrentSetListId = (uid, setListId) => {
    return new Promise(async resolve => {
      const usersRef = await this.getCollectionRef('users')
      await usersRef.doc(uid).set(
        {
          currentSetListId: setListId
        },
        {
          merge: true
        }
      )
      return resolve()
    })
  }

  deleteCurrentSetListId = uid => {
    return new Promise(async resolve => {
      const usersRef = await this.getCollectionRef('users')
      return usersRef.doc(uid).update({
        currentSetListId: firebase.firestore.FieldValue.delete()
      })
    })
  }

  /**
   * Persist SetList to firestore
   *
   * @param {string} setListId - The SetList's uid
   * @param {object} propsToChange - The properties to save as key value pairs
   */
  persistSetList = (setListId, propsToChange) => {
    const allowedFields = ['title', 'subtitle', 'users']
    return new Promise(async resolve => {
      console.log('PERSISTING', setListId)
      console.table(propsToChange)
      const setListsRef = await this.getCollectionRef('setlists')
      if (!setListsRef) return resolve(undefined)
      let setListDoc = {}
      Object.entries(propsToChange).forEach(([key, val]) => {
        if (allowedFields.includes(key)) {
          switch (key) {
            case 'users':
              console.log('ignore users for now')
              break
            default:
              console.log(key, 'modified locally to ->', val)
              setListDoc[key] = val
              break
          }
        }
      })

      const db = firebase.firestore()
      let batch = db.batch()
      batch.set(setListsRef.doc(setListId), setListDoc, { merge: true })

      if (propsToChange.songs) {
        // Sort stored songs in an array
        const storedSongsCollection = await setListsRef
          .doc(setListId)
          .collection('songs')
          .orderBy('index')
          .get()
        let storedSongs = []
        storedSongsCollection.forEach(snapshot => {
          let storedSong = snapshot.data()
          storedSong.id = snapshot.id
          storedSongs.push(storedSong)
        })
        console.log('storedSongs array:')
        console.table(storedSongs)
        let songsToStore = {}
        let i = 0
        storedSongs.forEach(storedSong => {
          const localSong = propsToChange.songs[i]
          if (localSong) {
            // Compare
            console.log('comparing stored to local:')
            console.table([storedSong, localSong])
            if (
              storedSong.id !== localSong.id ||
              storedSong.index !== localSong.index
            ) {
              console.log('The above are not the same')
              console.log('batch.DELETE stored song with key', i)
              let docRef = setListsRef
                .doc(setListId)
                .collection('songs')
                .doc(`${i}`)
              batch.delete(docRef)
              let localSongSerialized = localSong.toStorage()
              localSongSerialized.index = i
              console.log('batch.ADD localSongSerialized', localSongSerialized)
              batch.set(docRef, localSongSerialized)
            }
            i++
          }
        })
        console.log('Looped through storedSongs, i =', i)
        let songsToAdd = propsToChange.songs.slice(i)
        if (songsToAdd.length > 0) {
          console.log(songsToAdd.length, 'songs were added:', songsToAdd)
          songsToAdd.forEach((song, x) => {
            console.log('Add song with index', x + i)
            let localSongSerialized = song.toStorage()
            localSongSerialized.index = x + i
            let docRef = setListsRef
              .doc(setListId)
              .collection('songs')
              .doc(`${x + i}`)
            batch.set(docRef, localSongSerialized)
          })
        } else {
          console.log('No more songs...', propsToChange.songs)
        }
      }
      return batch.commit()
    })
  }

  watchSetList = setListId => {
    // Start watching setList with passed id
    return this.getCollectionRef('setlists').then(ref => {
      // Stop watching any open setLists
      if (this.unsubscribeSetListWatch !== undefined) {
        console.log('unsubscribing from setlist watch')
        this.unsubscribeSetListWatch()
      }
      // Watch setList
      this.unsubscribeSetListWatch = ref
        .doc(setListId)
        .onSnapshot(setListDoc => {
          if (!setListDoc.metadata.fromCache) {
            console.log('[SETLIST]  === UPDATE UI ===')
            const setListData = setListDoc.data()
            let setList = SetList.setListFromDocData(setListData, setListDoc.id)
            console.log(setList)
            this.store.commit('editSetList', {
              editedSetList: setList,
              persist: false
            })
          } else {
            console.log('[SETLIST] local update only')
          }
        })
      // Watch setLists's songs
      // Stop watching any open songs
      if (this.unsubscribeSongsWatch !== undefined) {
        console.log('unsubscribing from songs watch')
        this.unsubscribeSongsWatch()
      }
      this.unsubscribeSongsWatch = ref
        .doc(setListId)
        .collection('songs')
        .onSnapshot(snapshot => {
          snapshot.docChanges.forEach(change => {
            if (!change.doc.metadata.fromCache) {
              console.log('[SONGS]  === UPDATE UI ===')
              if (change.type === 'added') {
                console.log('New song: ', change.doc.data())
                const songDocData = change.doc.data()
                let song = Song.songFromDocData(songDocData, change.doc.id)
                console.log('addSong', song)
                this.store.commit('addSong', { newSong: song, persist: false })
              }
              if (change.type === 'modified') {
                const songDocData = change.doc.data()
                let song = Song.songFromDocData(songDocData, change.doc.id)
                console.log('Modified song: ', song)
                this.store.commit('editSong', {
                  updatedSong: song,
                  persist: false
                })
              }
              if (change.type === 'removed') {
                const songDocData = change.doc.data()
                let song = Song.songFromDocData(songDocData, change.doc.id)
                console.log('Removed song: ', song)
                this.store.commit('deleteSong', { id: song.id, persist: false })
              }
              // if (change.doc.metadata.hasPendingWrites) {
              //   debugger
              // } else {
              //   debugger
              // }
            } else {
              console.log('[SONGS] local update only')
            }
          })
        })
    })
  }
}

export default FirestoreDatabaseConnection
