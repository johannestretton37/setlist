<template>
  <div id="app">
    <SetList :setListIndex="0"></SetList>
    <!-- <img src="./assets/logo.png"> -->
  </div>
</template>

<script>
import SetList from './components/SetList'
import Songs from './components/Songs'
import store from './Store'

export default {
  name: 'app',
  store,
  components: {
    SetList,
    Songs
  }
}
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
.left {
  text-align: left;
}
.right {
  text-align: right;
}
</style>
