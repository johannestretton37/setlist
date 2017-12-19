<template>
  <div id="app">
    <SetList
      v-bind:setlist="setlist">
    </SetList>
    <img src="./assets/logo.png">
  </div>
</template>

<script>
import SetList from './components/SetList'
import Songs from './components/Songs'

export default {
  name: 'app',
  components: {
    SetList,
    Songs
  },
  data () {
    return {
      setlist: {
        name: 'Setlist 1',
        songs: [
          { id: 0, title: 'Song Item 1', duration: 193 },
          { id: 1, title: 'Song Item 2', duration: 122 }
        ]
      }
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
ul, li {
  margin: 0;
  padding: 0;
}
.center {
  text-align: center;
}
.right {
  text-align: right;
}
</style>
