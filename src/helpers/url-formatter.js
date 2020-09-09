export default class URLFormatter {
  static encode(clearTextUrl) {
    return encodeURI(url.toLowerCase()
      .split(" ").join("-")
      .split('å').join('a')
      .split('ø').join('o')
      .split('æ').join('ae'))
  }
}