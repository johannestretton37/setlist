import Vue from 'vue'
import Vuex from 'vuex'
import SetList from './Models/SetList'
import Song from './Models/Song'

Vue.use(Vuex)

let setList = new SetList()
setList.name = 'Setlist 1'
setList.songs = [
  new Song('Song nr 1', 'Artist', 193),
  new Song('Song 2', 'Blur', 122)
]

const store = new Vuex.Store({
  state: {
    setLists: [setList]
  },
  mutations: {
    addSong(state, newSong) {
      state.setLists[0].songs.push(newSong)
    }
  }
})

export default store
