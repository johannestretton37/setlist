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
  name: 'Song',
  props: ['song', 'order'],
  methods: {
    /** 
     * Dragged item events
     */
    handleDragStart(e) {
      e.dataTransfer.dropEffect = 'move';
      this.$store.commit('draggedItem', this.song);
    },
    handleDrag(e) {
      // let draggedItem = this.draggedItem
      // console.log(draggedItem)
    },
    handleDragEnd(e) {
      this.$store.commit('draggedItemEnd')
      // let draggedItem = this.draggedItem
      // console.log(draggedItem)
    },
    handleDragEnter(e) {
      if (e.target.className.indexOf('song-item-container') !== -1) {
        this.$store.commit('draggingOverItemId', {
          id: e.target.id,
          targetSlot: -1,
          slotPre: false,
          slotPost: false
        })
      }
    },
    /**
     * Target (hovered) item events
     */
    handleDragOver(e) {
      if (e.target.className.indexOf('song-item-container') !== -1) {
        const rect = e.target.getBoundingClientRect()
        let showEmptySlotAfterSong = false
        if (
          e.clientY > rect.top + rect.height * 0.5 &&
          e.clientY < rect.bottom
        ) {
          showEmptySlotAfterSong = true
        }
        let targetSlot = showEmptySlotAfterSong ? this.order : this.order - 1
        this.$store.commit('draggingOverItemId', {
          id: e.target.id,
          targetSlot
        })
      }
    }
  },
  computed: {
    slotClasses() {
      return {
        blankSpot:
          this.draggedItem != null && this.song.id === this.draggedItem.id,
        draggingOver: this.draggingOverThis,
        targetSlotPre: this.targetSlot === this.order - 1,
        targetSlotPost: this.targetSlot === this.order,
        wasMoved: this.wasMoved === this.song.id
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
    draggingOverThis() {
      return this.draggingOverItemId === this.song.id
    },
    draggingOverItemId() {
      return this.$store.state.draggingOverItemId
    },
    targetSlot() {
      return this.$store.state.targetSlot
    },
    wasMoved() {
      return this.$store.state.wasMoved
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../Styles/variables";
li {
  .slot {
    &.preSlot {
      grid-area: pre;
    }
    &.postSlot {
      grid-area: post;
    }
    &.preSlot,
    &.postSlot {
      transition: height 200ms linear;
      background-color: rgb(139, 235, 248);
      height: 0px;
    }
  }
  &.targetSlotPost {
    .slot {
      &.postSlot {
        height: 10px;
      }
    }
  }
  &.targetSlotPre {
    .slot {
      &.preSlot {
        height: 10px;
      }
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

.wasMoved {
  background: white;
}
</style>

