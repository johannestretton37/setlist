<template>
  <div id="app">
    <SetList></SetList>
    <img id="dragImg" :src="pixel">
  </div>
</template>

<script>
import SetList from './components/SetList'
import Songs from './components/Songs'
import pixel from './assets/pixel.png'

export default {
  name: 'app',
  data: function() {
    return {
      pixel: pixel
    }
  },
  components: {
    SetList,
    Songs
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
.center {
  text-align: center;
}
.left {
  text-align: left;
}
.right {
  text-align: right;
}
#dragImg {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
