<template>
  <div>
    <ul class="song-items-container">
      <Song
        v-for="(song, order) in songs"
        :order="order + 1"
        :key="song.id"
        :song="song">
      </Song>
      <hr>
      <SongsTotal v-if="songs.length > 0" :songs="songs"></SongsTotal>
    </ul>
  </div>
</template>

<script>
import Song from './Song'
import SongsTotal from './SongsTotal'

export default {
  name: 'Songs',
  components: {
    Song,
    SongsTotal
  },
  props: [
    'songs'
  ]
}
</script>

<style lang="scss" scoped>
hr {
  border: none;
  border-bottom: 1px solid #eee;
}
</style>
