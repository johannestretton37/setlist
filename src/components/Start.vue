<template>
  <div>
    <h1>SetLister 0.0.3</h1>
    <h2 v-if="user">Welcome {{user.name}}</h2>
    <p v-if="user">This is you: <img :src="user.avatar" style="width:30px;" /></p>
    <button v-if="user" @click.prevent="logout">Log out</button>
    <a :href="spotifyLoginUrl">Login to Spotify</a>
    <Scroller></Scroller>
    <SetList></SetList>
    <img id="dragImg" :src="pixel">
  </div>
</template>

<script>
import {mapState} from 'vuex'
import SetList from './SetList'
import Songs from './Songs'
import Scroller from './Scroller'
import pixel from '../assets/pixel.png'
import axios from 'axios'
import firebase from 'firebase'

export default {
  name: 'start',
  data: function() {
    return {
      pixel: pixel,
      spotifyLoginUrl: `https://accounts.spotify.com/authorize/?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI_ENC}&scope=playlist-modify-public%20user-read-email&state=spotifylogin`
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    SetList,
    Songs,
    Scroller
  },
}
</script>

<style lang="scss" scoped>
#dragImg {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
}
</style>


