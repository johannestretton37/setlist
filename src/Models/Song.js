import uid from 'uid'

class Song {
  constructor (title, artist, duration) {
    this.id = uid()
    this.title = title
    this.artist = artist
    this.duration = duration
  }
}

export default Song
