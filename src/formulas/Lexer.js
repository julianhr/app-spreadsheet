import Token from './Token'

class Rule {
  constructor(regex, groupIndex, token) {
    this.regex = regex
    this.groupIndex = groupIndex
    this.token = token
  }

  setIndex(index) {
    this.regex.lastIndex = index
  }

  test(input) {
    return this.regex.exec(input)
  }
}

const GRAMMAR = [
  // internal
  new Rule(/=/g, 0, 'EQUALS'),
  new Rule(/,/g, 0, 'COMMA'),
  new Rule(/:/g, 0, 'COLON'),
  new Rule(/\(/g, 0, 'LPAREN'),
  new Rule(/\)/g, 0, 'RPAREN'),
  // operators
  new Rule(/\+/g, 0, 'PLUS'),
  new Rule(/\-/g, 0, 'MINUS'),
  new Rule(/\*/g, 0, 'MULT'),
  new Rule(/\//g, 0, 'DIV'),
  // multi-character
  new Rule(/[\d\.]+/g, 0, 'NUMBER'),
  new Rule(/[a-z]+[\d]+/gi, 0, 'CELL'),
  new Rule(/([a-z]+)\(/gi, 1, 'FUNCTION'),
]


class Lexer {
  EOF = -1
  UNKNOWN = 'UNKNOWN'

  constructor(input, grammar) {
    this.input = input
    this.grammar = grammar
    this.index = 0
    this.char = input[this.index]
    this.markers = []
    this.tokens = []
  }

  getTokens() {
    while (this.char !== this.EOF) {
      const token = this.nextToken()
      this.tokens.push(token)
    }

    return this.tokens
  }

  nextToken() {
    if (this.char === this.EOF) {
      return new Token('EOF', this.EOF)
    }

    // console.log('before whitespace', this.char, this.index)
    const whitespace = this.getWhitespace()
    let token

    for (let rule of this.grammar) {
      rule.setIndex(this.index)
      const match = rule.test(this.input)

      if (match && match.index === this.index) {
        const text = match[rule.groupIndex]
        token = new Token(rule.token, text, whitespace)
        this.index += text.length - 1
        this.consume()
        break
      }
    }

    if (!token) {
      token = this.tokenUNKNOWN(whitespace)
    }

    return token
  }

  tokenUNKNOWN(whitespace) {
    const chars = []

    while (!(this.isEOF() || this.isSeparator() || this.isWhitespace())) {
      chars.push(this.char)
      this.consume()
    }
    
    const word = chars.join('')
    return new Token(this.UNKNOWN, word, whitespace)
  }

  consume() {
    this.index++

    if (this.index < this.input.length) {
      this.char = this.input[this.index]
    } else {
      this.char = this.EOF
    }
  }

  isEOF() {
    return this.char === this.EOF
  }

  isWhitespace() {
    return !this.isEOF() && Boolean(this.char.match(/\s/))
  }

  isSeparator() {
    return !this.isEOF() && Boolean(this.char.match(/[()+-/*]{1}/))
  }

  getWhitespace() {
    let count = 0

    while (this.isWhitespace()) {
      count++
      this.consume()
    }

    return Array(count).fill(' ').join('')
  }
}

export default Lexer
export { Rule, GRAMMAR, Lexer }
