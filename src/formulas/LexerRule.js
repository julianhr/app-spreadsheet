class LexerRule {
  constructor(regex, groupIndex, token, category) {
    this.regex = regex
    this.groupIndex = groupIndex
    this.token = token
    this.category = category
  }

  setIndex(index) {
    this.regex.lastIndex = index
  }

  test(input) {
    return this.regex.exec(input)
  }
}

export default LexerRule
