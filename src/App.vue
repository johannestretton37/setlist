<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import SetList from './components/SetList'
import Songs from './components/Songs'
import Scroller from './components/Scroller'

import {config} from '../config/firebaseConfig'
import firebase from 'firebase'
import firebaseui from 'firebaseui'

export default {
  name: 'app',
  components: {
    SetList,
    Songs,
    Scroller
  },
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  .center-box {
    margin: auto;
    padding-bottom: 5%;
  }
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
</style>
