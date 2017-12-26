<template>
  <div>
    <!-- <ul class="song-items-container"> -->
    <transition-group tag="ul" class="song-items-container" name="rearrange">
      <Song
        v-for="(song, order) in songs"
        :order="order + 1"
        :key="song.id"
        :song="song">
      </Song>
      <hr :key="'divider'">
      <SongsTotal
        v-if="songs.length > 0"
        :key="'total'"
        :songs="songs"></SongsTotal>
    </transition-group>
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

.rearrange-move {
  transition: transform 400ms;
  &.wasMoved {
    transition: none;
    z-index: 999;
  }
}

</style>
