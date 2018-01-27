<template>
  <section class="center-box">
    <h1>Log in</h1>
    <p>{{status}}</p>
    <div id="firebaseui-auth-container" @mousedown="startLogIn"></div>
  </section>
</template>

<script>
import SetList from './SetList'
import Songs from './Songs'
import Scroller from './Scroller'

import firebase from 'firebase'
import firebaseui from 'firebaseui'
import '../../node_modules/firebaseui/dist/firebaseui.css'

export default {
  name: 'login',
  components: {
    SetList,
    Songs,
    Scroller
  },
  data() {
    return {
      status: 'Connecting to Google...'
    }
  },
  methods: {
    startLogIn: function() {
      this.status = 'Logging in. Please wait...'
    }
  },
  mounted() {
    let ui = new firebaseui.auth.AuthUI(firebase.auth())
    firebase.auth().useDeviceLanguage()
    ui.start('#firebaseui-auth-container', {
      signInSuccessUrl: '/',
      signInOptions: [
        // List of OAuth providers supported.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        uiShown: () => {
          this.status = 'Log in with your Google account to start using the app'
        }
      },
      tosUrl: '/tos'
      // Other config options...
    });


//       firebase.auth().onAuthStateChanged(function(user) {
//           if (user) {
//             // User is signed in.
//             var displayName = user.displayName;
//             var email = user.email;
//             var emailVerified = user.emailVerified;
//             var photoURL = user.photoURL;
//             var uid = user.uid;
//             var phoneNumber = user.phoneNumber;
//             var providerData = user.providerData;
//             user.getIdToken().then(function(accessToken) {
// console.log('Signed in')
// console.log('Sign out')
// console.log(JSON.stringify({
//                 displayName: displayName,
//                 email: email,
//                 emailVerified: emailVerified,
//                 phoneNumber: phoneNumber,
//                 photoURL: photoURL,
//                 uid: uid,
//                 accessToken: accessToken,
//                 providerData: providerData
//               }, null, '  '));
//             });
//           } else {
//             // User is signed out.
// console.log('Signed out')
// console.log('Sign in')
// console.log('null')
//           }
//         }, function(error) {
//           console.log(error);
//         });





// try {
    //   // let response = await axios.get('/search/Let%20it%20be')
    //   // let response = await axios.get('/api/setlists')
    //   // setTimeout(() => {
    //   //   this.$store.commit('loadSetLists', response.data)
    //   // }, 1500)
    //   // Log user in
    //   axios.get(url).then(res => console.log(res))
    // } catch (err) {
    //   console.log(err)
    // }
  },
}
</script>

<style lang="scss">
#firebaseui-auth-container {
  .firebaseui-info-bar {
    margin-top: 20px;
  }

  .mdl-shadow--2dp {
    box-shadow: none;
  }

  .mdl-progress {
    height: 5px;
  }

  div.mdl-progress::after {
    color: rgb(37, 77, 37);
    font-size: 1.5em;
    content: 'Authenticating. Please wait...';
    display: block;
    margin: 20px auto;
    text-align: center;
  }
}
</style>
