import Vue from 'vue'
import Vuex from 'vuex'
import SetList from './Models/SetList'
import Song from './Models/Song'

Vue.use(Vuex)

let setList = new SetList()
setList.name = 'Setlist 1'
setList.songs = [
  new Song('Song nr 1', 'Artist', 193),
  new Song('Song 2', 'Blur', 142),
  new Song('Song nr 3', 'Artdsdft', 344),
  new Song('Song 4', 'sdfdf', 31),
  new Song('Song nr 5', 'Artistdfsf', 993),
  new Song('Song 6', 'gwrf', 747)
]

const store = new Vuex.Store({
  state: {
    setLists: [setList],
    setListIndex: 0,
    draggedItem: null,
    draggingOverItemId: '',
    targetSlot: -1,
    // slotPre: false,
    // slotPost: false
  },
  mutations: {
    addSong(state, newSong) {
      state.setLists[state.setListIndex].songs.push(newSong)
    },
    draggedItem(state, draggedItem) {
      state.draggedItem = draggedItem
    },
    draggedItemEnd(state) {
      let draggedItemIndex = indexFor(state.setLists[state.setListIndex], state.draggedItem.id)
      // Remove draggedItem from array
      state.setLists[state.setListIndex].songs.splice(draggedItemIndex, 1)
      // Insert draggedItem at new position.
      // Account for offset, since we just removed an object from array
      let offset = draggedItemIndex > state.targetSlot ? 0 : -1
      state.setLists[state.setListIndex].songs.splice(state.targetSlot + offset, 0, state.draggedItem)
      // Reset dragging related state variables
      state.draggedItem = null
      state.draggingOverItemId = ''
      state.targetSlot = -1
      state.slotPre = false
      state.slotPost = false
    },
    draggingOverItemId(state, info) {
      state.draggingOverItemId = info.id
      state.targetSlot = info.targetSlot
      // state.slotPre = info.slotPre
      // state.slotPost = info.slotPost
    }
  }
})

const indexFor = (setList, uid) => {
  return setList.songs.findIndex(item => item.id === uid)
}

export default store
