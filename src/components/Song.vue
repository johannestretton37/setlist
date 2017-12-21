<template>
  <li class="song-item-container" draggable="true">
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

