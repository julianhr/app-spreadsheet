import Token from './Token'

const TOKENS = {
  // internal
  EOF: 'EOF',
  UNKNOWN: 'UNKNOWN',
  // structure
  EQUALS: 'EQUALS',
  COMMA: 'COMMA',
  COLON: 'COLON',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  // operators
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MULT: 'MULT',
  DIV: 'DIV',
  // entities
  NUMBER: 'NUMBER',
  CELL: 'CELL',
  FUNCTION: 'FUNCTION',
}

const t = TOKENS

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
  new Rule(/=/g, 0, t.EQUALS),
  new Rule(/,/g, 0, t.COMMA),
  new Rule(/:/g, 0, t.COLON),
  new Rule(/\(/g, 0, t.LPAREN),
  new Rule(/\)/g, 0, t.RPAREN),
  // operators
  new Rule(/\+/g, 0, t.PLUS),
  new Rule(/\-/g, 0, t.MINUS), // eslint-disable-line
  new Rule(/\*/g, 0, t.MULT),
  new Rule(/\//g, 0, t.DIV),
  // multi-character
  new Rule(/[\d\.]+/g, 0, t.NUMBER), // eslint-disable-line
  new Rule(/[a-z]+[\d]+/gi, 0, t.CELL),
  new Rule(/([a-z]+)\(/gi, 1, t.FUNCTION),
]


class Lexer {
  constructor(input, grammar) {
    this.input = input
    this.grammar = grammar
    this.index = 0
    this.char = input[this.index]
    this.markers = []
    this.tokens = []
  }

  getTokens() {
    while (this.char !== t.EOF) {
      const token = this.nextToken()
      this.tokens.push(token)
    }

    return this.tokens
  }

  nextToken() {
    if (this.char === t.EOF) {
      return new Token(t.EOF, t.EOF)
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
    return new Token(t.UNKNOWN, word, whitespace)
  }

  consume() {
    this.index++

    if (this.index < this.input.length) {
      this.char = this.input[this.index]
    } else {
      this.char = t.EOF
    }
  }

  isEOF() {
    return this.char === t.EOF
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
export { Rule, GRAMMAR, TOKENS, Lexer }
