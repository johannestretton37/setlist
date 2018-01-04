<template>
  <div>
    <h2>{{ setList ? setList.name : this.newSetListTitle || 'Welcome' }}</h2>
    <div class="new-song-form">
      <transition
        name="fade-right-to-left"
        v-on:after-enter="afterEnter">
        <form
          v-if="setList === null"
          key="addSetList"
          class="add-setlist-form"
          @submit.prevent="addSetList">
          <h3 style="grid-area: header">New SetList</h3>
          <input type="text" style="grid-area: title" class="center" autofocus v-model="newSetListTitle" placeholder="Name" />
          <button style="grid-area: submit">Create SetList</button>
        </form>
        <form
          v-else
          key="addNewSong"
          class="add-song-form"
          @submit.prevent="addSong">
          <h3 style="grid-area: header">Add new song</h3>
          <input type="text" style="grid-area: title" class="center" autofocus v-model="newSongTitle" placeholder="Song Title" />
          <input type="text" style="grid-area: duration" class="center duration" v-model="newSongDuration" placeholder="0:00" />
          <input type="text" style="grid-area: artist" class="center" v-model="newSongArtist" placeholder="Artist (optional)" />
          <button style="grid-area: submit">Add song to list</button>
        </form>
      </transition>
    </div>
    <Songs v-if="setList" :songs="setList.songs"></Songs>
  </div>
</template>

<script>
import Songs from './Songs'
import { mapGetters } from 'vuex'
import SetList from '../Models/SetList'
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
      newSetListTitle: '',
      newSongTitle: '',
      newSongArtist: '',
      newSongDuration: ''
    }
  },
  methods: {
    addSetList() {
      let newSetList = new SetList(this.newSetListTitle)
      this.$store.commit('addSetList', newSetList)
      this.resetForm()
    },
    addSong() {
      let newSong = new Song(
        this.newSongTitle,
        this.newSongArtist,
        this.toSeconds(this.newSongDuration)
      )
      this.$store.commit('addSong', newSong)
      this.resetForm()
    },
    resetForm() {
      this.newSetListTitle = ''
      this.newSongTitle = ''
      this.newSongArtist = ''
      this.newSongDuration = ''
      document.activeElement.blur()
    },
    afterEnter(element) {
      let initialInput = element.querySelector('input[autofocus]')
      initialInput.focus()
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
@import '../Styles/animations';
.new-song-form {
  position: relative;
  form {
    display: grid;
    position: relative;
    width: 100%;
    background-color: rgb(237, 251, 252);
    border: 1px solid rgb(243, 250, 252);
    border-radius: 8px;
    padding: 10px 0;
    justify-content: center;
    grid-gap: 0.3em;
    grid-template-rows: 1fr auto auto auto auto;
    grid-template-columns: 20px 1fr 20px;
    grid-template-areas: '. header .' '. title .' '. duration. ' '. artist .'
      '. submit .';
    @media screen and (min-width: 480px) {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      grid-template-areas: 'header header header header header'
        '. title title title duration' '. artist artist artist .'
        '. . submit . .';
    }
    @media screen and (min-width: 960px) {
      margin: auto;
      width: 960px;
      background: none;
    }
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
  transition: all 300ms ease-out;
  &:focus,
  &:active {
    color: #000;
    background-color: rgb(173, 214, 230);
    box-shadow: 0 0 16px rgba(255, 255, 255, 0.7) inset;
    border: 1px solid rgb(162, 226, 252);
  }
  &.duration {
    color: rgb(19, 46, 61);
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
    grid-template-rows: [preSlot] auto [songInfo] $itemHeight * 1px [postSlot]
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

