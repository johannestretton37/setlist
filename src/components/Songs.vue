<template>
  <div class="songs">
    <transition-group tag="ul" class="song-items-container" name="rearrange">
      <Song
        v-for="(song, order) in songs"
        :order="order + 1"
        :key="song.index"
        :song="song">
      </Song>
      <hr :key="'divider'">
      <SongsTotal
        v-if="songs.length > 0"
        :key="'total'"
        :songs="songs"></SongsTotal>
    </transition-group>
    <div id="draggedItemPlaceholder" v-if="isDragging">
      <Song :song="draggedItemPlaceholder"></Song>
    </div>
  </div>
</template>

<script>
import Song from './Song'
import SongModel from '../Models/Song'
import SongsTotal from './SongsTotal'

export default {
  name: 'Songs',
  components: {
    Song,
    SongsTotal
  },
  props: ['songs'],
  computed: {
    draggedItemPlaceholder() {
      let draggedItemPlaceholder = new SongModel(
        this.$store.state.draggedItem.index,
        this.$store.state.draggedItem.title,
        this.$store.state.draggedItem.artist,
        this.$store.state.draggedItem.duration
      )
      return draggedItemPlaceholder
    },
    isDragging() {
      return this.$store.state.isDragging
    }
  }
}
</script>

<style lang="scss" scoped>
hr {
  border: none;
  border-bottom: 1px solid #eee;
}

.songs {
  ul {
    overflow: hidden;
    li {
      position: relative;
    }
  }
}
.rearrange-move {
  transition: transform 400ms;
  &.wasMoved {
    transition: none;
    z-index: 999;
  }
}

#draggedItemPlaceholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  z-index: 9999;
  li {
    padding: 0.5em 0;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
  }
}
</style>
