<template>
  <div class="center-box">
    <header>
      <h1>SetLister</h1>
      <p>[BETA Version]</p>
      <div class="avatar">
        <p v-if="user"><b>{{user.name}}</b>&nbsp;<img v-if="user" :src="user.avatar" style="width:30px;border-radius:50%;" /></p>
        <button v-if="user" @click.prevent="logout">Log out</button>
      </div>
    </header>
    <div v-if="user">
      <p style="width:70%;margin:0.5em auto;">If you have Spotify Premium, you'll be able to save your SetList as a Spotify playlist.
        You may also listen to music and search the Spotify library. 
      </p>
      <a :href="spotifyLoginUrl">Login to Spotify</a>
    </div>
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


