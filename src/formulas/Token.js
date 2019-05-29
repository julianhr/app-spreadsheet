class Token {
  constructor(type, text, whitespace='') {
    this.type = type
    this.text = text
    this.value = null
    this.html = null
    this.whitespace = whitespace
  }

  _repr() {
    return Object
      .entries(this)
      .reduce((prev, curr) => {
        if (curr[1] !== null) {
          prev[curr[0]] = curr[1]
        }

        return prev
      }, {})
  }
}

export default Token
