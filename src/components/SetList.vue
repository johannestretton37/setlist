<template>
  <div>
    <h1>{{ setlist.name }}</h1>
    <form @submit.prevent="addSong" class="song-items-container">
      <h2>Add new song</h2>
      <div class="song-item-container">
        <input class="center" v-model="newSongTitle" placeholder="Title" style="grid-column: 2 / 3" />
        <input class="center" v-model="newSongDuration" placeholder="0:00" style="grid-column: 3 / 4"/>
      </div>
      <button>Add song to list</button>
    </form>
    <Songs :songs="setlist.songs"></Songs>
  </div>
</template>

<script>
import Songs from "./Songs";

export default {
  name: "SetList",
  components: {
    Songs
  },
  props: ["setlist"],
  data() {
    return {
      newSongTitle: "",
      newSongDuration: ""
    };
  },
  methods: {
    addSong: function(e) {
      let newSong = {
        id: this.setlist.songs.length,
        title: this.newSongTitle || "Untitled",
        duration: this.toSeconds(this.newSongDuration)
      };
      this.setlist.songs.push(newSong);
    },
    toSeconds: function(input) {
      if (input === "") return 0;
      let parts = input.split(/[\:\,\.]/gi);
      if (parts.length <= 1) return parseInt(input, 10);
      let minutes = parseInt(parts[0].trim(), 10);
      let seconds = parseInt(parts[1].trim(), 10);
      return minutes * 60 + seconds;
    },
    notEmpty: function (value) {
      return {
        empty: value === ''
      }
    }

  }
};
</script>

<style lang="scss">
input, button {
  display:block;
  min-width:90%;
  font-size: 1rem;
  appearance: none;
  outline: none;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  background-color: rgb(152, 188, 202);
  color: white;
  &:focus, &:active {
    color: #000;
  }
  &.empty {
    color: white;
    border-color: rgb(95, 28, 28);
    background-color: rgb(245, 198, 190);
  }
}
button {
  display: block;
  margin: 1rem auto;
  min-width: 200px;
  background-color: rgb(21, 79, 105);
  color: #FFF;
}
::-webkit-input-placeholder {
  color: rgb(19, 46, 61);
}

.song-items-container {
  margin: 2em auto;
  max-width: 600px;
  .song-item-container {
    display: grid;
    grid-template-columns: 100px 5fr 100px;
    padding: 0.2em 0;
  }
}
</style>

