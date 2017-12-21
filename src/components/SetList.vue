<template>
  <div>
    <h1>{{ setList.name }}</h1>
    <div class="add-new-form">
      <form @submit.prevent="addSong" class="song-items-container">
        <h2>Add new song</h2>
        <div class="song-item-container">
          <input class="center" v-model="newSongArtist" placeholder="Artist (optional)" style="grid-column: 2 / 5" />
        </div>
        <div class="song-item-container">
          <input class="center" v-model="newSongTitle" placeholder="Song Title" style="grid-column: 2 / 5" />
          <input class="center duration" v-model="newSongDuration" placeholder="0:00" />
        </div>
        <button>Add song to list</button>
      </form>
    </div>

    <Songs :songs="setList.songs"></Songs>
  </div>
</template>

<script>
import Songs from './Songs'
import { mapState } from 'vuex'
import Song from '../Models/Song'

export default {
  name: 'SetList',
  components: {
    Songs
  },
  computed: mapState({
    setList(state) {
      return state.setLists[this.setListIndex]
    }
  }),
  props: ['setListIndex'],
  data() {
    return {
      newSongTitle: '',
      newSongArtist: '',
      newSongDuration: ''
    }
  },
  methods: {
    addSong() {
      let newSong = new Song(
        this.newSongTitle,
        this.newSongArtist,
        this.toSeconds(this.newSongDuration)
      )
      this.$store.commit('addSong', newSong)
    },
    toSeconds: function(input) {
      if (input === '') return 0
      let parts = input.split(/[:,.]/gi)
      if (parts.length <= 1) return parseInt(input, 10)
      let minutes = parseInt(parts[0].trim(), 10)
      let seconds = parseInt(parts[1].trim(), 10)
      return minutes * 60 + seconds
    },
    notEmpty: function(value) {
      return {
        empty: value === ''
      }
    }
  }
}
</script>

<style lang="scss">
.add-new-form {
  form {
    border: 1px solid rgb(243, 250, 252);
    border-radius: 8px;
    background-color: rgb(237, 251, 252);
    padding: 10px 80px;
  }
}
input,
button {
  display: block;
  min-width: 90%;
  font-size: 1rem;
  appearance: none;
  outline: none;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem 0;
  background-color: rgb(152, 188, 202);
  color: white;
  &:focus,
  &:active {
    color: #000;
  }
  &.duration {
    background-color: rgba(152, 188, 202, 0.3);
  }
  &.empty {
    color: white;
    border-color: rgb(95, 28, 28);
    background-color: rgb(245, 198, 190);
  }
}
button {
  display: block;
  margin: 1rem auto;
  min-width: 200px;
  background-color: rgb(21, 79, 105);
  color: #fff;
}
::-webkit-input-placeholder {
  color: rgb(19, 46, 61);
}

.song-items-container {
  margin: 2em auto;
  @extend .medium-width;
  .song-item-container {
    display: grid;
    grid-template-columns: 80px 1fr 2fr 1fr 80px;
    grid-gap: 0.3em;
    padding: 0.2em 0;
  }
}

.medium-width {
  max-width: 800px;
}
</style>

