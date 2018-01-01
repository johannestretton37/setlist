import Vue from 'vue'
import Vuex from 'vuex'
import SetList from './Models/SetList'
import Song from './Models/Song'

Vue.use(Vuex)

/***** MOCKUP START *****/
let setList = new SetList('Setlist 1')
setList.songs = [
  new Song('Song nr 1', 'Artist', 193),
  new Song('Song 2', 'Blur', 142),
  new Song('Song nr 3', 'Artdsdft', 344),
  new Song('Song 4', 'sdfdf', 31),
  new Song('Song nr 5', 'Artistdfsf', 993),
  new Song('Song 6', 'gwrf', 747)
]
let setLists = [setList]
/****** MOCKUP END ******/

const store = new Vuex.Store({
  state: {
    setLists: [], //setLists,
    setListIndex: 0,
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
      return state.setLists[state.setListIndex] || null
    }
  },
  mutations: {
    scroll(state, isScrolling) {
      state.isScrolling = isScrolling
    },
    addSetList(state, newSetList) {
      state.setListIndex = state.setLists.length
      state.setLists.push(newSetList)
    },
    addSong(state, newSong) {
      this.getters.setList.songs.push(newSong)
    },
    deleteSong(state, id) {
      this.getters.setList.songs = this.getters.setList.songs.filter(song => song.id !== id)
    },
    draggedItem(state, draggedItem) {
      state.draggedItem = draggedItem
      state.isDragging = true
      state.wasMoved = ''
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
