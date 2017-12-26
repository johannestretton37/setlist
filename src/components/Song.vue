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
      e.dataTransfer.dropEffect = 'move'
      // let img = document.getElementById('dragImg')
      // e.dataTransfer.setDragImage(img, 0, 0)
      this.$store.commit('draggedItem', this.song)
    },
    handleDrag(e) {
      // let placeholder = document.getElementById('draggedItemPlaceholder')
      // let posY = e.clientY - (placeholder.getBoundingClientRect().height * 0.5) + window.pageYOffset
      // placeholder.style.transform = `translateY(${posY}px)`
    },
    handleDragEnd(e) {
      this.$store.commit('draggedItemEnd')
      setTimeout(() => {
        let movedItem = document.getElementsByClassName('wasMoved')[0]
        if (movedItem) movedItem.classList.remove('wasMoved')
      }, 400)
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
@import "../Styles/colors";
li {
  background-color: rgba(255,255,255,0.9);
  border-radius: 8px;
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
      background-color: $emptySlotColor;
      height: 0px;
    }
  }
  &.targetSlotPost {
    .slot {
      &.postSlot {
        height: 20px;
      }
    }
  }
  &.targetSlotPre {
    .slot {
      &.preSlot {
        height: 20px;
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
}
.blankSpot {
  opacity: 0.3;
}

.wasMoved {
  animation: scale-to-initial 400ms ease-out;
}
@keyframes scale-to-initial {
  from {
    transform: scale(1.3);
  }
  to {
    transform: scale(1);
  }
}
</style>

