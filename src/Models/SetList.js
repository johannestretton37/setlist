class SetList {
  constructor(title, subtitle, songs, encoreStart) {
    this.title = title || 'Untitled SetList'
    this.subtitle = subtitle || ''
    this.songs = songs || []
    this.encoreStart = encoreStart || -1
  }

  static setListFromDocData = (data, id) => {
    let setList = new SetList(data.title, data.subtitle, data.songs, data.encoreStart)
    setList.id = id
    return setList
  }
}

export default SetList
