<template>
  <div id="app">
    <h1>SetLister 0.0.3</h1>
    <Scroller></Scroller>
    <SetList></SetList>
    <img id="dragImg" :src="pixel">
  </div>
</template>

<script>
import SetList from './components/SetList'
import Songs from './components/Songs'
import Scroller from './components/Scroller'
import pixel from './assets/pixel.png'
import axios from 'axios'

export default {
  name: 'app',
  data: function() {
    return {
      pixel: pixel
    }
  },
  components: {
    SetList,
    Songs,
    Scroller
  },
  async created() {
    try {
      let response = await axios.get('/api/setlists')
      setTimeout(() => {
        this.$store.commit('loadSetLists', response.data)
      }, 2000)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
}

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
