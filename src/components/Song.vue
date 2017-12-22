<template>
  <li
    :id="song.id"
    class="song-item-container" 
    :class="slotClasses"
    draggable="true"
    @dragstart="handleDragStart"
    @drag="handleDrag"
    @dragend="handleDragEnd"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver">
    <div v-show="order == 1" class="slot preSlot"></div>
    <span class="songInfo order">
      {{ order }}
    </span>
    <span class="songInfo artist left">
      {{ song.artist }}
    </span>
    <span class="songInfo title">
      {{ song.title }}
    </span>
    <span class="songInfo duration">
      {{ duration }}
    </span>
    <div v-show="order !== undefined" class="slot postSlot"></div>
  </li>
</template>

<script>
export default {
  name: "Song",
  props: ["song", "order"],
  methods: {
    // Dragged item events
    handleDragStart(e) {
      this.$store.commit("draggedItem", this.song)
    },
    handleDrag(e) {
      // let draggedItem = this.draggedItem
      // console.log(draggedItem)
    },
    handleDragEnd(e) {
      this.$store.commit("draggedItemEnd")
      // let draggedItem = this.draggedItem
      // console.log(draggedItem)
    },
    handleDragEnter(e) {
      if (e.target.className.indexOf("song-item-container") !== -1) {
        this.$store.commit("draggingOverItemId", { id: e.target.id, slotBefore: false, slotAfter: false})
      }
    },
    // Target (hovered) item events
    handleDragOver (e) {
      const rect = e.target.getBoundingClientRect()
      let slotBefore = false
      let slotAfter = false
      if (e.clientY > rect.top - 10 && e.clientY < rect.bottom - (rect.height * 0.5) - 10) {
        slotBefore = true
      } else if (e.clientY > rect.top + (rect.height * 0.5) + 10 && e.clientY < rect.bottom + 10) {
        slotAfter = true
      }
      this.$store.commit('draggingOverItemId', { id: e.target.id, slotBefore, slotAfter })
    }
  },
  computed: {
    slotClasses() {
      return {
        blankSpot:
          this.draggedItem != null && this.song.id === this.draggedItem.id,
        draggingOver: this.draggingOverThis,
        slotPre: this.draggingOverThis,
        slotPost: this.draggingOverThis,
      }
    },
    duration() {
      let minutes = Math.floor(this.song.duration / 60)
      let seconds = this.song.duration % 60
      if (seconds < 10) seconds = `0${seconds}`
      return `${minutes}:${seconds}`
    },
    draggedItem() {
      return this.$store.state.draggedItem
    },
    draggingOverThis () {
      return this.draggingOverItemId === this.song.id
    },
    draggingOverItemId() {
      return this.$store.state.draggingOverItemId
    },
    slotBefore () {
      return this.$store.state.slotBefore
    },
    slotAfter () {
      return this.$store.state.slotAfter
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../Styles/variables';
li {
  .slot {
    &.preSlot {
      grid-area: pre;
    }
    &.postSlot {
      grid-area: post;
    }
    &.preSlot, &.postSlot {
      background-color: #555;
      height: 0px;
    }
  }
  .songInfo {
//    line-height: $songInfoHeight;
  }
  .artist {
    grid-area: artist;
    text-transform: uppercase;
  }
  .order {
    grid-area: order;
  }
  .order,
  .artist {
    color: #999;
  }
  .title {
    grid-area: title;
    font-weight: bold;
  }
  .duration {
    grid-area: duration;
  }
  border-top: 5px solid rgba(147, 213, 240, 0);
  border-bottom: 5px solid rgba(147, 213, 240, 0);
  transition: border 200ms linear;

}
.blankSpot {
  opacity: 0.1;
}
// .draggingOver {
//   background-color: rgba(236, 217, 155, 0.5);
// }
.slotBefore, .slotAfter {
  border-color: rgba(147, 213, 240, 0);
  border-style: solid;
  border-left: none;
  border-right: none;
}
.slotBefore {
  border-top-color: rgba(147, 213, 240, 1);
  border-top-width: 10px;
  border-bottom-color: rgba(147, 213, 240, 0);
  border-bottom-width: 0px;
}
.slotAfter {
  border-top-color: rgba(147, 213, 240, 0);
  border-top-width: 0px;
  border-bottom-color: rgba(147, 213, 240, 1);
  border-bottom-width: 10px;
}
</style>

