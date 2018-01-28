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
    <hr>
    <Scroller></Scroller>
    <div v-if="Object.keys(setLists).length > 0" class="setlists-manager">
      <button v-if="!showCreateSetListForm" @click="showCreateSetListForm = !showCreateSetListForm">Add new SetList</button>
      <form
        v-if="showCreateSetListForm"
        key="createSetList"
        class="add-setlist-form"
        @submit.prevent="createSetList">
        <h3 style="grid-area: header">New SetList</h3>
        <input type="text" style="grid-area: title" class="center" autofocus v-model="newSetListTitle" placeholder="Name" />
        <button style="grid-area: submit">Create SetList</button>
        <button @click.prevent="showCreateSetListForm = !showCreateSetListForm" style="grid-area: cancel">Cancel</button>
      </form>
      <ul>
        <li v-for="(setList, id) in setLists" :key="id" v-if="setListId !== id">
          <button @click="openSetList(id)">Open {{setList.title}}</button>
        </li>
      </ul>
    </div>
    <hr>
    <SetList></SetList>
    <img id="dragImg" :src="pixel">
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SetListModel from '../Models/SetList'
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
      showCreateSetListForm: false,
      newSetListTitle: '',
      pixel: pixel,
      spotifyLoginUrl: `https://accounts.spotify.com/authorize/?client_id=${
        process.env.SPOTIFY_CLIENT_ID
      }&response_type=code&redirect_uri=${
        process.env.REDIRECT_URI_ENC
      }&scope=playlist-modify-public%20user-read-email&state=spotifylogin`
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut()
    },
    createSetList() {
      let newSetList = new SetListModel(this.newSetListTitle)
      this.$store.dispatch('createSetList', newSetList)
      this.resetForm()
    },
    openSetList(setListId) {
      this.$store.commit('openSetList', setListId)
    },
    resetForm() {
      this.newSetListTitle = ''
      document.activeElement.blur()
    }
  },
  computed: {
    ...mapState(['user', 'setListId']),
    ...mapGetters(['setLists'])
  },
  components: {
    SetList,
    Songs,
    Scroller
  }
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
