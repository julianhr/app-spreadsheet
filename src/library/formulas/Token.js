class Token {
  constructor(type, text, whitespace='', value=null) {
    this.type = type
    this.text = text
    this.value = value
    this.whitespace = whitespace
  }

  _repr() {
    const { text, value, type, whitespace } = this
    return { text, value, type, whitespace }
  }
}

export default Token
