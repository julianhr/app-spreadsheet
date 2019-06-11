import Token from './Token'
import TokenSanitizer from './TokenSanitizer'
import LexerRule from './LexerRule'
import { isNumber } from '~/library/utils'


const TOKENS = {
  // internal
  EOF: 'EOF',
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

const GRAMMAR = [
  // structure
  new LexerRule(/=/g, 0, t.EQUALS, 'structure'),
  new LexerRule(/,/g, 0, t.COMMA, 'structure'),
  new LexerRule(/:/g, 0, t.COLON, 'structure'),
  new LexerRule(/\(/g, 0, t.LPAREN, 'structure'),
  new LexerRule(/\)/g, 0, t.RPAREN, 'structure'),
  // operators
  new LexerRule(/\+/g, 0, t.PLUS, 'operator'),
  new LexerRule(/\-/g, 0, t.MINUS, 'operator'), // eslint-disable-line
  new LexerRule(/\*/g, 0, t.MULT, 'operator'),
  new LexerRule(/\//g, 0, t.DIV, 'operator'),
  // multi-character
  new LexerRule(/[\d\.]+/g, 0, t.NUMBER, 'entity'), // eslint-disable-line
  new LexerRule(/[a-z]+[\d]+/gi, 0, t.CELL, 'entity'),
  new LexerRule(/([a-z]+)\(/gi, 1, t.FUNCTION, 'entity'),
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

    const sanitizer = new TokenSanitizer(this.tokens)
    this.tokens = sanitizer.sanitize()
    return this.tokens
  }

  nextToken() {
    if (this.char === t.EOF) {
      return new Token(t.EOF, t.EOF, 0, 'eof', this.index)
    }

    if (!this.isFormula()) {
      return this.tokenTEXTorNUMBER()
    }

    const whitespaceLen = this.getWhitespaceLen()
    let token

    for (let rule of GRAMMAR) {
      rule.setIndex(this.index)
      const match = rule.test(this.input)

      if (match && match.index === this.index) {
        const text = match[rule.groupIndex]
        token = new Token(rule.token, text, whitespaceLen, rule.category, this.index)
        this.index += text.length - 1
        this.consume()
        break
      }
    }

    if (!token) {
      token = this.tokenTEXT(whitespaceLen)
    }

    return token
  }

  initChar(input) {
    if (this.input.length === 0) {
      this.input = '0'
      this.index = -1
    }

    return input[this.index]
  }

  tokenTEXT(whitespace) {
    const chars = []

    while (!(this.isEOF() || this.isSeparator() || this.isWhitespace())) {
      chars.push(this.char)
      this.consume()
    }

    const text = chars.join('')
    return new Token(t.TEXT, text, whitespace, 'entity', this.index - text.length)
  }

  tokenTEXTorNUMBER() {
    let token

    if (isNumber(this.input)) {
      token = new Token(t.NUMBER, this.input, 0, 'entity', this.index)
    } else {
      token = new Token(t.TEXT, this.input, 0, 'entity', this.index)
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

  getWhitespaceLen() {
    let count = 0

    while (this.isWhitespace()) {
      count++
      this.consume()
    }

    return count
  }
}

export default Lexer
export { GRAMMAR, TOKENS, Lexer }
