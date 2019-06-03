import Token from './Token'
import { isNumber } from '~/library/utils'


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
  TEXT: 'TEXT',
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
  constructor(input) {
    this.input = input
    this.index = 0
    this.char = this.initChar(input)
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

    if (!this.isFormula()) {
      return this.tokenTEXTorNUMBER()
    }

    const whitespace = this.getWhitespace()
    let token

    for (let rule of GRAMMAR) {
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

  initChar(input) {
    if (this.input.length === 0) {
      this.input = '0'
    }

    return input[this.index]
  }

  tokenUNKNOWN(whitespace) {
    const chars = []

    while (!(this.isEOF() || this.isSeparator() || this.isWhitespace())) {
      chars.push(this.char)
      this.consume()
    }

    const text = chars.join('')
    return new Token(t.UNKNOWN, text, whitespace)
  }

  tokenTEXTorNUMBER() {
    let token

    if (isNumber(this.input)) {
      token = new Token(t.NUMBER, this.input)
    } else {
      token = new Token(t.TEXT, this.input)
    }

    this.index = this.input.length - 1
    this.consume()
    return token
  }

  consume() {
    this.index++

    if (this.index < this.input.length) {
      this.char = this.input[this.index]
    } else {
      this.char = t.EOF
    }
  }

  isFormula() {
    return this.input[0] === '='
  }

  isEOF() {
    return this.char === t.EOF
  }

  isWhitespace() {
    return !this.isEOF() && Boolean(this.char.match(/\s/))
  }

  isSeparator() {
    return Boolean(this.char.match(/[\(\)\+\-\/\*]/)) // eslint-disable-line
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
