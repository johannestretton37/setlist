import Vue from 'vue'
import Vuex from 'vuex'
import SetList from './Models/SetList'
import Song from './Models/Song'
import firebase from 'firebase'

Vue.use(Vuex)

const getOrCreateUser = async user => {
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

const getUsersRef = async () => {
  return new Promise(async resolve => {
    const db = firebase.firestore()
    try {
      const ref = await db.collection('users')
      return resolve(ref)
    } catch (error) {
      return resolve(false)
    }
  })
}

const getSetListsRef = async () => {
  return new Promise(async resolve => {
    const db = firebase.firestore()
    try {
      const ref = await db.collection('setlists')
      return resolve(ref)
    } catch (error) {
      return resolve(false)
    }
  })
}

const getUsersLastSetListId = uid => {
  return new Promise(async resolve => {
    const usersRef = await getUsersRef()
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

const getSetLists = async uid => {
  const setListsRef = await getSetListsRef()
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

const persistCurrentSetListId = (uid, setListId) => {
  return new Promise(async resolve => {
    const usersRef = await getUsersRef()
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

const deleteCurrentSetListId = uid => {
  return new Promise(async resolve => {
    const usersRef = await getUsersRef()
    return usersRef.doc(uid).update({
      currentSetListId: firebase.firestore.FieldValue.delete()
    })
  })
}

const allowedFields = ['title', 'subtitle', 'users']

/**
 * Persist SetList to firestore
 *
 * @param {string} setListId - The SetList's uid
 * @param {object} propsToChange - The properties to save as key value pairs
 */
const persistSetList = (setListId, propsToChange) => {
  return new Promise(async resolve => {
    console.log('PERSISTING', setListId)
    console.table(propsToChange)
    const setListsRef = await getSetListsRef()
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

let unsubscribeSetListWatch
let unsubscribeSongsWatch
const watchSetList = setListId => {
  // Start watching setList with passed id
  return getSetListsRef().then(ref => {
    // Stop watching any open setLists
    if (unsubscribeSetListWatch !== undefined) {
      console.log('unsubscribing from setlist watch')
      unsubscribeSetListWatch()
    }
    // Watch setList
    unsubscribeSetListWatch = ref.doc(setListId).onSnapshot(setListDoc => {
      if (!setListDoc.metadata.fromCache) {
        console.log('[SETLIST]  === UPDATE UI ===')
        const setList = setListDoc.data()
        console.log(setList)
        store.commit('loadSetList', setList)
      } else {
        console.log('[SETLIST] local update only')
      }
    })
    // Watch setLists's songs
    // Stop watching any open songs
    if (unsubscribeSongsWatch !== undefined) {
      console.log('unsubscribing from songs watch')
      unsubscribeSongsWatch()
    }
    unsubscribeSongsWatch = ref
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
              store.commit('addSong', { newSong: song, persist: false })
            }
            if (change.type === 'modified') {
              const songDocData = change.doc.data()
              let song = Song.songFromDocData(songDocData, change.doc.id)
              console.log('Modified song: ', song)
              store.commit('editSong', { updatedSong: song, persist: false })
            }
            if (change.type === 'removed') {
              const songDocData = change.doc.data()
              let song = Song.songFromDocData(songDocData, change.doc.id)
              console.log('Removed song: ', song)
              store.commit('deleteSong', { id: song.id, persist: false })
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

const store = new Vuex.Store({
  state: {
    user: undefined,
    setLists: {},
    setListId: '',
    draggedItem: null,
    draggingOverItemId: '',
    itemPositions: {},
    targetSlot: -1,
    wasMoved: '',
    isDragging: false,
    isScrolling: false
  },
  getters: {
    setList: state => {
      return state.setLists[state.setListId] || null
    },
    setLists: state => {
      return state.setLists || {}
    }
  },
  actions: {
    createSetList: async ({ state, commit }, newSetList) => {
      let setListsRef = await getSetListsRef()
      let newSetListRef = await setListsRef.add({
        title: newSetList.title,
        subtitle: newSetList.subtitle,
        users: {
          [state.user.uid]: true
        }
      })
      const newSetListDoc = await newSetListRef.get()
      const setList = newSetListDoc.data()
      const setListId = newSetListRef.id
      commit('loadSetList', setList)
      commit('updateSetListId', setListId)
    },
    getUserSetLists: async ({ state, commit }) => {
      let setLists = await getSetLists(state.user.uid)
      if (Object.keys(setLists).length > 0) {
        let setListId = await getUsersLastSetListId(state.user.uid)
        if (!setListId) {
          setListId = Object.keys(setLists)[0]
          if (setListId) {
            if (setLists[setListId]) {
              persistCurrentSetListId(state.user.uid, setListId)
            } else {
              deleteCurrentSetListId(state.user.uid)
            }
          }
        }
        commit('loadSetLists', setLists)
        commit('updateSetListId', setListId)
        watchSetList(setListId)
      } else {
        console.warn('No setlists found')
      }
    },
    openSetList: async ({ state, commit }, setListId) => {
      commit('closeSetList')
      // await persistCurrentSetListId(state.user.uid, setListId)
      await watchSetList(setListId)
      commit('updateSetListId', setListId)
    }
  },
  mutations: {
    /* Authorization */
    loggedIn(state, user) {
      state.user = user
    },
    loggedOut(state) {
      state.user = undefined
      state.setLists = {}
      state.setListId = ''
    },
    /* SetList management */
    loadSetLists(state, setLists) {
      state.setLists = setLists
    },
    loadSetList(state, setList) {
      state.setLists[setList.id] = setList
    },
    closeSetList(state) {
      state.setListId = null
    },
    updateSetListId(state, setListId) {
      state.setListId = setListId
    },
    /* Song manipulation */
    addSong(state, { newSong, persist }) {
      console.log('Will maybe add song', newSong, 'persist =', persist)
      if (!persist) {
        // If persist is false, that means that this change came from database
        // Get local song
        let localSong = this.getters.setList.songs[newSong.index]
        if (localSong !== undefined && localSong.isEqual(newSong)) {
          // Do nothing
        } else {
          // Update UI
          this.getters.setList.songs.splice(newSong.index, 0, newSong)
        }
      } else {
        // Update UI and persist changes to database
        this.getters.setList.songs.splice(newSong.index, 0, newSong)
        persistSetList(state.setListId, { songs: this.getters.setList.songs })
      }
    },
    editSong(state, { updatedSong, persist }) {
      if (!persist) {
        // If persist is false, that means that this change came from database
        // Get local song
        let localSong = this.getters.setList.songs[updatedSong.index]
        if (localSong !== undefined && localSong.isEqual(updatedSong)) {
          // Do nothing
        } else {
          // Update UI
          this.getters.setList.songs.splice(updatedSong.index, 1, updatedSong)
        }
      } else {
        // Update UI and persist changes to database
        this.getters.setList.songs.splice(updatedSong.index, 1, updatedSong)
        persistSetList(state.setListId, { songs: this.getters.setList.songs })
      }
    },
    deleteSong(state, { id, persist }) {
      if (!persist) {
        // If persist is false, that means that this change came from database
        // Get local song
        let localSong = this.getters.setList.songs.find(song => song.id === id)
        if (localSong !== undefined) {
          // Delete song from UI
          this.getters.setList.songs = this.getters.setList.songs.filter(
            song => song.id !== id
          )
        }
      } else {
        // Update UI and persist changes to database
        this.getters.setList.songs = this.getters.setList.songs.filter(
          song => song.id !== id
        )
        persistSetList(state.setListId, { songs: this.getters.setList.songs })
      }
    },
    draggedItemEnd(state) {
      if (
        state.draggedItem &&
        state.draggedItem.id !== state.draggingOverItemId
      ) {
        let draggedItemIndex = indexFor(
          this.getters.setList,
          state.draggedItem.id
        )
        // Remove draggedItem from array
        this.getters.setList.songs.splice(draggedItemIndex, 1)
        // Insert draggedItem at new position.
        // Account for offset, since we just removed an object from array
        let offset = draggedItemIndex > state.targetSlot ? 0 : -1
        this.getters.setList.songs.splice(
          state.targetSlot + offset,
          0,
          state.draggedItem
        )
        state.wasMoved = state.draggedItem.id
      }
      // Reset dragging related state variables
      state.draggedItem = null
      state.isDragging = false
      state.draggingOverItemId = ''
      state.targetSlot = -1
      persistSetList(state.setListId, { songs: this.getters.setList.songs })
    },
    /* Temporary state vars */
    scroll(state, isScrolling) {
      state.isScrolling = isScrolling
    },
    draggedItem(state, draggedItem) {
      state.draggedItem = draggedItem
      state.isDragging = true
      state.wasMoved = ''
    },
    itemWasMoved(state) {
      state.wasMoved = ''
    },
    draggingOverItemId(state, info) {
      state.draggingOverItemId = info.id
      state.targetSlot = info.targetSlot
    },
    itemPositions(state, itemPositions) {
      state.itemPositions = itemPositions
    }
  }
})

const indexFor = (setList, uid) => {
  return setList.songs.findIndex(item => item.id === uid)
}

export default store
