import uid from 'uid'

class Song {
  constructor(title, artist, duration, isEncore) {
    this.id = uid()
    this.title = title
    this.artist = artist
    this.duration = duration
    this.isEncore = isEncore || false
  }
}

export default Song
