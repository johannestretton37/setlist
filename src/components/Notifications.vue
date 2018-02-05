<template>
  <div class="notifications-container">
    <div class="notifications">
      <div class="notification" v-for="notification in notifications" :key="notification.id">
        <p class="title">Title</p>
        <p class="message">Message</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Notifications',
  computed: {
    ...mapState(['notifications', 'displayNotification'])
  },
  data() {
    return {
      displayTimer: null
    }
  },
  methods: {
    startDisplayTimer(target) {
      this.stopIdleTimer()
      this.displayTimer = setTimeout(() => {
        if (this.displayTimer) {
          this.stopDisplayTimer()
          console.log('User idle, performing search for:', target.value)
        }
      }, 5000)
    },
    stopDisplayTimer() {
      clearTimeout(this.displayTimer)
    }
  }
}
</script>

<style lang="scss">
@import '../Styles/variables';
@import '../Styles/animations';
.notifications-container {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  .notifications {
    margin: auto;
    .notification {
      background: #fff;
      border-radius: 8px;
      .title {
        font-weight: bold;
      }
      .message {
        color: #444;
      }
    }
  }
}
</style>
