<template>
  <div>
    <div class="setlist-container">
      <template v-if="setList">
        <h2>{{setList.title}}</h2>
        <p><i>{{setList.subtitle}}</i></p>
        <Songs :songs="setList.songs"></Songs>
      </template>
    </div>
    <div class="new-song-form">
      <form
        key="addNewSong"
        class="add-song-form"
        @submit.prevent="addSong">
        <h3 style="grid-area: header">Add new song</h3>
        <input type="text" @input="handleInput" data-model="songTitle" style="grid-area: title" class="center" autofocus v-model="newSongTitle" placeholder="Song Title" />
        <input type="text" @input="handleInput" data-model="songDuration" style="grid-area: duration" class="center duration" v-model="newSongDuration" placeholder="0:00" />
        <input type="text" @input="handleInput" data-model="songArtist" style="grid-area: artist" class="center" v-model="newSongArtist" placeholder="Artist (optional)" />
        <button style="grid-area: submit">Add song to list</button>
      </form>
    </div>
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
      idleTimer: null,
      newSetListTitle: '',
      newSongTitle: '',
      newSongArtist: '',
      newSongDuration: ''
    }
  },
  methods: {
    // createSetList() {
    //   let newSetList = new SetList(this.newSetListTitle)
    //   this.$store.dispatch('createSetList', newSetList)
    //   this.resetForm()
    // },
    handleInput(e) {
      this.startIdleTimer(e.target)
      const input = e.target.value
      switch (e.target.dataset.model) {
        case 'songTitle':
          if (input.length > 2) {
            console.log('Searching for', input)
            this.stopIdleTimer()
          }
          break
      }
    },
    handleBlur(e) {
      this.stopIdleTimer()
    },
    startIdleTimer(target) {
      this.stopIdleTimer()
      // let target = target
      this.idleTimer = setTimeout(() => {
        if (this.idleTimer) {
          this.stopIdleTimer()
          console.log('User idle, performing search for:', target.value)
        }
      }, 2000)
    },
    stopIdleTimer() {
      clearTimeout(this.idleTimer)
    },
    addSong() {
      let newSong = new Song(
        this.setList.songs.length,
        this.newSongTitle,
        this.newSongArtist,
        this.toSeconds(this.newSongDuration)
      )
      newSong.id = `${this.setList.songs.length}`
      if (newSong.isValid()) {
        this.$store.commit('addSong', { newSong, persist: true })
        this.resetForm()
      }
    },
    resetForm() {
      this.newSetListTitle = ''
      this.newSongTitle = ''
      this.newSongArtist = ''
      this.newSongDuration = ''
      document.activeElement.blur()
    },
    onEnter(element) {
      document.querySelector('.new-song-form').style.height =
        element.getBoundingClientRect().height + 'px'
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
    grid-template-areas:
      '. header .' '. title .' '. duration. ' '. artist .'
      '. submit .';
    @media screen and (min-width: 480px) {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      grid-template-areas:
        'header header header header header'
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

.setlist-container {
  background: #e4f2f3;
  padding: 10px;
}
.song-items-container {
  margin: auto;
  @extend .medium-width;
  .song-item-container {
    display: grid;
    grid-template-rows:
      [preSlot] auto [songInfo] $itemHeight * 1px [postSlot]
      auto;
    grid-template-columns: 80px 1fr 2fr 1fr 80px;
    grid-template-areas:
      'pre pre pre pre pre' 'order artist title . duration'
      'post post post post post';
    align-items: center;
    padding: 0;
  }
}

.medium-width {
  max-width: 800px;
}
</style>
