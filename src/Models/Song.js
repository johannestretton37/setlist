import uid from 'uid'

class Song {
  constructor(title, artist, duration, isEncore) {
    this.id = uid()
    this.title = title
    this.artist = artist
    this.duration = duration
    this.isEncore = isEncore || false
  }

  static songFromDocData = data => {
    let song = new Song(data.title, data.artist, data.duration, false)
    return song
  }
}

export default Song
