class Token {
  constructor(type, text, whitespace, category, index) {
    this.type = type
    this.category = category
    this.text = text
    this.whitespace = whitespace
    this.index = index
    this.value = null
    this.html = null
  }
}

export default Token
