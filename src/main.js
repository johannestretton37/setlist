// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import store from './Store'
import router from './router'

import firebase from 'firebase'
import firebaseui from 'firebaseui'
import 'firebase/firestore'
import { config } from '../config/firebaseConfig'

Vue.use(VueRouter)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  created() {
    firebase.initializeApp(config)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        store.commit('loggedIn', {
          uid: user.uid,
          name: user.displayName,
          avatar: user.photoURL
        })
        console.log('Logged in')
        this.$router.push('/')
      } else {
        store.commit('loggedOut')
        console.log('Logged out')
        this.$router.push('/login')
      }
    })
  },
  el: '#app',
  template: '<App/>',
  components: { App }
})
