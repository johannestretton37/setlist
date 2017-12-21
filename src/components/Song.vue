<template>
  <li :id="order"
    class="song-item-container" 
    draggable="true"
    @dragstart="handleDragStart"
    @drag="handleDrag"
    @dragenter="handleDragEnter">
    <span class="order">
      {{ order }}
    </span>
    <span class="artist left">
      {{ song.artist }}
    </span>
    <span class="title">
      {{ song.title }}
    </span>
    <span>&nbsp;</span>
    <span>
      {{ duration }}
    </span>
  </li>
</template>

<script>
export default {
  name: 'Song',
  props: [
    'song',
    'order'
  ],
  methods: {
    handleDragStart (e) {
      e.dataTransfer.setData('text/plain', 'this.order')
      this.$store.commit('draggedItem', this.song)
      console.error(this.order)
    },
    handleDrag (e) {
      let songId = this.$store.draggedItem
      console.log(songId)
    },
    handleDragEnter (e) {
      let songId = this.$store.draggedItem
      console.warn(songId)
      if (e.target.id != songId.id) {
        e.target.style.backgroundColor = '#F0F'
      }
//      let songId = e.dataTransfer.getData('songId')
    }
  },
  computed: {
    duration: function () {
      let minutes = Math.floor(this.song.duration / 60)
      let seconds = this.song.duration % 60
      if (seconds < 10) seconds = `0${seconds}`
      return `${minutes}:${seconds}`
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  .artist {
    text-transform: uppercase;
  }
  .order, .artist {
    color: #999;
  }
  .title {
    font-weight: bold;
  }
}
</style>

