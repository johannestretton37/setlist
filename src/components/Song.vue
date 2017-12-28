<template>
  <li
    :id="song.id"
    :data-order="order"
    class="song-item-container" 
    :class="slotClasses"
    :draggable="order !== undefined"
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
    updateItemPositions() {
      const songs = document.getElementsByClassName('song-item-container')
      let itemPositions = {}
      for (let i = 0; i < songs.length; i++) {
        const element = songs[i]
        const id = element.id
        const order = element.dataset.order
        if (id) {
          let rect = element.getBoundingClientRect()
          itemPositions[element.id] = {
            order,
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height
          }
        }
      }
      this.$store.commit('itemPositions', itemPositions)
    },
    /**
     * Dragged item events
     */
    handleDragStart(e) {
      // Commit state
      this.$store.commit('draggedItem', this.song)
      // Hide drag image
      let img = document.getElementById('dragImg')
      img.style.display = 'block'
      img.style.top = window.pageYOffset + 'px'
      e.dataTransfer.setDragImage(img, 0, 0)
      e.dataTransfer.dropEffect = 'move'
      // Show custom drag image
      let placeholder = document.getElementById('draggedItemPlaceholder')
      if (placeholder) {
        let posY =
          e.clientY -
          placeholder.getBoundingClientRect().height * 0.5 +
          window.pageYOffset
        placeholder.style.transform = `translateY(${posY}px)`
      }
      // Update song items positions
      this.updateItemPositions()
    },
    handleDrag(e) {
      // Position placeholder
      let placeholder = document.getElementById('draggedItemPlaceholder')
      let posY =
        e.clientY -
        placeholder.getBoundingClientRect().height * 0.5 +
        window.pageYOffset
      placeholder.style.transform = `translateY(${posY}px)`
      // Find what song mouse is hovering over
      for (const id in this.itemPositions) {
        const item = this.itemPositions[id]
        if (e.clientY > item.top && e.clientY < item.bottom) {
          // Is mouse position above or below item center?
          const slotPre = e.clientY < item.top + 10 + item.height * 0.5
          this.$store.commit('draggingOverItemId', {
            id,
            targetSlot: slotPre
              ? parseInt(item.order, 10) - 1
              : parseInt(item.order, 10),
            slotPre,
            slotPost: !slotPre
          })
          break
        }
      }
    },
    handleDragEnd(e) {
      this.$store.commit('draggedItemEnd')
      setTimeout(() => {
        let movedItem = document.getElementsByClassName('wasMoved')[0]
        if (movedItem) movedItem.classList.remove('wasMoved')
      }, 400)
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
        draggable: this.order !== undefined,
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
    },
    itemPositions() {
      return this.$store.state.itemPositions
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../Styles/variables';
@import '../Styles/colors';
li {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  .draggable {
    cursor: pointer;
  }
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
    background: red;
    .slot {
      &.postSlot {
        height: 20px;
      }
    }
  }
  &.targetSlotPre {
    background: blue;
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
  z-index: 100;
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

