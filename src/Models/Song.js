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

  static songFromDocData = (data, id) => {
    let song = new Song(
      data.index,
      data.title,
      data.artist,
      data.duration,
      false
    )
    song.id = id
    return song
  }
}

export default Song
