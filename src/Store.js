import Vue from 'vue'
import Vuex from 'vuex'
import SetList from './Models/SetList'
import Song from './Models/Song'
import FirestoreDatabaseConnection from './FirestoreDatabaseConnection'

Vue.use(Vuex)

// Init database connection
const db = new FirestoreDatabaseConnection(store)

// Init store
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
    isScrolling: false,
    notifications: [],
    displayNotification: false
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
      let setListsRef = await db.getCollectionRef('setlists')
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
      let setLists = await db.getSetLists(state.user.uid)
      if (Object.keys(setLists).length > 0) {
        let setListId = await db.getUsersLastSetListId(state.user.uid)
        if (!setListId) {
          setListId = Object.keys(setLists)[0]
          if (setListId) {
            if (setLists[setListId]) {
              db.persistCurrentSetListId(state.user.uid, setListId)
            } else {
              db.deleteCurrentSetListId(state.user.uid)
            }
          }
        }
        commit('loadSetLists', setLists)
        commit('updateSetListId', setListId)
        db.watchSetList(setListId)
      } else {
        console.warn('No setlists found')
      }
    },
    openSetList: async ({ state, commit }, setListId) => {
      commit('closeSetList')
      // await db.persistCurrentSetListId(state.user.uid, setListId)
      await db.watchSetList(setListId)
      commit('updateSetListId', setListId)
    },
    inviteCollaboratorToSetList: async (
      { state, commit },
      { setListId, invitedEmail }
    ) => {
      try {
        let result = await db.inviteCollaborator(
          invitedEmail,
          state.user.uid,
          setListId
        )
        console.log('Invitation complete', result)
        commit('displayNotification', {
          title: 'Invitation sent',
          message: result
        })
      } catch (error) {
        console.error(error)
      }
    }
  },
  mutations: {
    /* Notifications */
    displayNotification(state, info) {
      state.notifications.push(info)
      state.displayNotification = true
    },
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
    editSetList(state, { editedSetList, persist }) {
      let localSetList = this.getters.setList
      // extract songs, we'll handle them separately
      let { songs, ...edits } = editedSetList
      let setList = Object.assign(localSetList, edits)
      // state.setLists[setList.id] = setList
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
