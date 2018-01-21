class SetList {
  constructor(name, subtitle, songs) {
    this.name = name || 'Untitled SetList'
    this.subtitle = subtitle || ''
    this.songs = songs || []
  }

  static setListFromDocData = data => {
    let setList = new SetList(data.title, data.subtitle, data.songs)
    return setList
  }
}

export default SetList
