import uid from 'uid'

class Song {
  constructor(index, title, artist, duration, isEncore) {
    this.id = uid()
    this.index = index
    this.title = title
    this.artist = artist
    this.duration = duration
    this.isEncore = isEncore || false
  }

  isValid = () => {
    return this.title !== '' && this.id !== undefined
  }

  isEqual = compareSong => {
    return (
      this.index === compareSong.index &&
      this.title === compareSong.title &&
      this.artist === compareSong.artist &&
      this.duration === compareSong.duration &&
      this.isEncore === compareSong.isEncore
    )
  }

  toStorage = () => {
    return {
      index: this.index,
      title: this.title,
      artist: this.artist,
      duration: this.duration,
      isEncore: this.isEncore
    }
  }

  static songFromDocData = (data, id) => {
    let song = new Song(
      data.index,
      data.title,
      data.artist,
      data.duration,
      data.isEncore
    )
    song.id = id
    return song
  }
}

export default Song
