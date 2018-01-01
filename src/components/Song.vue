<template>
  <li>
    <div
      :id="song.id"
      :data-order="order"
      class="song-item-container" 
      :class="slotClasses"
      :draggable="order !== undefined"
      @dragstart="handleDragStart"
      @drag="handleDrag"
      @dragend="handleDragEnd"
      @contextmenu="e => e.preventDefault()"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd">
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
      </div>
    <div
      @click="deleteSong"
      :data-id="song.id"
      class="delete-button">
      DELETE
    </div>
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
    positionPlaceholder(point) {
      let placeholder = document.getElementById('draggedItemPlaceholder')
      if (placeholder) {
        let posY =
          point.y -
          placeholder.getBoundingClientRect().height * 0.5 +
          window.pageYOffset
        placeholder.style.transform = `translateY(${posY}px)`
      }
    },
    deleteSong(e) {
      this.$store.commit('deleteSong', e.target.dataset.id)
    },
    selectItem(point) {
      // Commit state
      this.$store.commit('draggedItem', this.song)
      // Position placeholder
      this.positionPlaceholder(point)
      // Update song items positions
      this.updateItemPositions()
    },
    moveItem(point) {
      // Position placeholder
      this.positionPlaceholder(point)
      // Find what song mouse is hovering over
      for (const id in this.itemPositions) {
        const item = this.itemPositions[id]
        if (point.y > item.top && point.y < item.bottom) {
          // Is mouse position above or below item center?
          const slotPre = point.y < item.top + item.height * 0.5
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
    dropItem(e) {
      this.$store.commit('draggedItemEnd')
      setTimeout(() => {
        let movedItem = document.getElementsByClassName('wasMoved')[0]
        if (movedItem) movedItem.classList.remove('wasMoved')
        this.$store.commit('itemWasMoved')
      }, 400)
    },
    /**
     * Dragged item touch events
     */
    handleTouchStart(e) {
      // Ignore multiple finger touches
      if (e.touches.length == 1) {
        // Check if this is a scroll or a long press
        this.distance = 0
        this.startTime = new Date().getTime()
        this.startX = e.touches[0].clientX
        this.startY = e.touches[0].clientY

        // if (!this.isScrolling) {
        //   //        e.preventDefault()
        let point = this.pointFromEvent(e)
        this.longPressTimer = setTimeout(() => {
          // if (!this.isScrolling) {
          this.selectItem(point)
          // }
        }, 500)
        // }
      }
    },
    handleTouchMove(e) {
      if (!this.isDragging) {
        // This might be a scroll, measure distance moved
        const distanceX = this.startX - e.touches[0].clientX
        const distanceY = this.startY - e.touches[0].clientY
        if (Math.abs(distanceY) > Math.abs(distanceX)) console.log('scroll')
        if (Math.abs(distanceY) < Math.abs(distanceX)) {
          // SWIPE LEFT/RIGHT
          if (distanceX > 0) {
            // LEFT
            e.currentTarget.parentNode.classList.add('delete')
          } else {
            // RIGHT
          }
        }
        if (Math.abs(distanceY) > 50) {
          // This is a scroll, cancel long press detection
          this.cancelLongPress()
        } else {
          // This is not a scroll
        }
      } else {
        e.preventDefault()
        this.moveItem(this.pointFromEvent(e))
      }
    },
    handleTouchEnd(e) {
      this.cancelLongPress()
      if (this.isDragging) {
        e.preventDefault()
        this.dropItem(e)
      }
    },
    cancelLongPress() {
      if (this.longPressTimer) clearTimeout(this.longPressTimer)
      console.log('clearing longPressTimer')
    },
    /**
     * Dragged item events
     */
    handleDragStart(e) {
      // Hide drag image
      let img = document.getElementById('dragImg')
      img.style.display = 'block'
      img.style.top = window.pageYOffset + 'px'
      e.dataTransfer.setDragImage(img, 0, 0)
      e.dataTransfer.dropEffect = 'move'

      this.selectItem(this.pointFromEvent(e))
    },
    handleDrag(e) {
      this.moveItem(this.pointFromEvent(e))
    },
    handleDragEnd(e) {
      this.dropItem(e)
    },
    /**
     * Helper methods
     */
    pointFromEvent(e) {
      let userPos = e.touches ? e.touches[0] : e
      let x = userPos.clientX
      let y = userPos.clientY
      // (window.pageYOffset ||
      //   document.documentElement.scrollTop ||
      //   document.body.scrollTop ||
      //   0)
      return { x, y }
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
    },
    isDragging() {
      return this.$store.state.isDragging
    },
    isScrolling() {
      return this.$store.state.isScrolling
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../Styles/variables';
@import '../Styles/colors';
.song-item-container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  &.draggable {
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
    .slot {
      &.postSlot {
        height: $itemHeight * 0.5px;
      }
    }
  }
  &.targetSlotPre {
    .slot {
      &.preSlot {
        height: $itemHeight * 0.5px;
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

.delete-button {
  opacity: 0.5;
  display: block;
  position: absolute;
  top: 0;
  right: -100px;
  background: rgb(196, 30, 30);
  width: 100px;
  height: 100%;
  line-height: $itemHeight * 1px;
  color: white;
}
.delete {
  transform: translateX(-100px);
  transition: transform 400ms ease-out;
  &.delete-button {
    opacity: 1;
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
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>

