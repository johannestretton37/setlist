<template>
  <Song :song="total">
  </Song> 
</template>

<script>
import Song from './Song'
export default {
  name: 'SongsTotal',
  props: [
    'songs'
  ],
  components: {
    Song
  },
  computed: {
    total: function () {
      let nrOfSongs = 0
      let totalDuration = 0
      this.songs.forEach(song => {
        nrOfSongs++
        totalDuration += song.duration
      })
      return {
        title: `${nrOfSongs} songs in total`,
        duration: totalDuration
      }
    }
  }
}
</script>

