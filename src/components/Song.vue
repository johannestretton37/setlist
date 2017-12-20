<template>
  <li class="song-item-container">
    <span class="order">
      {{ order }}
    </span>
    <span class="title">
      {{ song.title }}
    </span>
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
  .order {
    color: #999;
  }
  .title {
    font-weight: bold;
  }
}
</style>

