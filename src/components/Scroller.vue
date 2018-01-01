<template>
  <div></div>
</template>

<script>
export default {
  name: 'Scroller',
  data() {
    return {
      scrollTimer: null
    }
  },
  methods: {
    handleScroll(e) {
      if (this.scrollTimer === null) {
        this.$store.commit('scroll', true)
        this.scrollTimer = setTimeout(() => {
          clearTimeout(this.scrollTimer)
          this.scrollTimer = null
          this.$store.commit('scroll', false)
        }, 700)
      }
    }
  },
  created: function() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed: function() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

