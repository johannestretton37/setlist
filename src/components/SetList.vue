<template>
  <div>
    <h1 v-if="setList">{{ setList.name }}</h1>
    <div class="new-song-form">
      <form @submit.prevent="addSong">
        <h2 style="grid-area: header">Add new song</h2>
        <input style="grid-area: artist" class="center" v-model="newSongArtist" placeholder="Artist (optional)" />
        <input style="grid-area: title" class="center" v-model="newSongTitle" placeholder="Song Title" />
        <input style="grid-area: duration" class="center duration" v-model="newSongDuration" placeholder="0:00" />
        <button style="grid-area: submit">Add song to list</button>
      </form>
    </div>
    <Songs :songs="setList.songs"></Songs>
  </div>
</template>

<script>
import Songs from './Songs'
import { mapGetters } from 'vuex'
import Song from '../Models/Song'

export default {
  name: 'SetList',
  components: {
    Songs
  },
  computed: {
    ...mapGetters(['setList'])
  },
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
@import '../Styles/variables';
.new-song-form {
  form {
    display: grid;
    grid-template-rows: 1fr 0.75fr 0.75fr 0.75fr;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'header header header header header'
      '. title title title duration' '. artist artist artist .' '. . submit . .';
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
    grid-template-rows: [preSlot] auto [songInfo] $songInfoHeight [postSlot]
      auto;
    grid-template-columns: 80px 1fr 2fr 1fr 80px;
    grid-template-areas: 'pre pre pre pre pre' 'order artist title . duration'
      'post post post post post';
    align-items: center;
    padding: 0;
  }
}

.medium-width {
  max-width: 800px;
}
</style>

