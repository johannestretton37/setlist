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
    draggedItem: null,
    draggingOverItemId: '',
    slotBefore: false,
    slotAfter: false
  },
  mutations: {
    addSong(state, newSong) {
      state.setLists[0].songs.push(newSong)
    },
    draggedItem(state, draggedItem) {
      state.draggedItem = draggedItem
    },
    draggedItemEnd(state) {
      state.draggedItem = null
      state.draggingOverItemId = ''
      state.slotBefore = false
      state.slotAfter = false
    },
    draggingOverItemId(state, info) {
      state.draggingOverItemId = info.id
      state.slotBefore = info.slotBefore
      state.slotAfter = info.slotAfter
    }
  }
})

export default store
