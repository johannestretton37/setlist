<template>
  <div class="songs-container">
    <div class="songs">
      <transition-group tag="ul" class="song-items-container" name="rearrange">
        <template v-for="(song, order) in songs">
          <Song
            :order="order + 1"
            :key="song.index"
            :song="song">
          </Song>
          <div
            class="divider encore"
            v-if="encoreStart == order"
            :key="'encoreDivider' + order">
          </div>
        </template>
        <div class="divider total" :key="'totalDivider'"></div>
        <SongsTotal
          v-if="songs.length > 0"
          :key="'total'"
          :songs="songs"></SongsTotal>
      </transition-group>
      <div id="draggedItemPlaceholder" v-if="isDragging">
        <Song :song="draggedItemPlaceholder"></Song>
      </div>
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
    },
    encoreStart() {
      /**
       * Zero-indexed
       * Returning -1 will not render encore divider
       * Returning 0 will render all songs but the first encores
       */
      return this.$store.getters.setList.encoreStart || -1
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  &.divider {
    width: 100%;
    margin: 10px auto;
    border: none;
    &.encore {
      position: relative;
      height: 1px;
      border-bottom: 1px solid #eee;
      &:after {
        display: block;
        position: absolute;
        padding: 0;
        top: -4px;
        left: 40%;
        width: 20%;
        font-size: 10px;
        line-height: 10px;
        text-align: center;
        color: rgb(135, 144, 161);
        background-color: #fff;
        content: 'ENCORES';
      }
    }
    &.total {
      height: 3px;
      border-bottom: 3px double #eee;
    }
  }
}

.songs-container {
  .songs {
    border-radius: 5px;
    background: #fff;
    margin: auto;
    .song-items-container {
      padding-top: 30px;
      padding-bottom: 11px;
    }
    ul {
      overflow: hidden;
      li {
        position: relative;
      }
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
