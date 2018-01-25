class SetList {
  constructor(title, subtitle, songs) {
    this.title = title || 'Untitled SetList'
    this.subtitle = subtitle || ''
    this.songs = songs || []
  }

  static setListFromDocData = (data, id) => {
    let setList = new SetList(data.title, data.subtitle, data.songs)
    setList.id = id
    return setList
  }
}

export default SetList
