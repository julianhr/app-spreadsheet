import Token from './Token'
import formulas from './formulas'


const SIMPLE_SYMBOLS = {
  // structure
  '=': 'EQUALS',
  ',': 'COMMA',
  '(': 'LPAREN',
  ')': 'RPAREN',
  ':': 'COLON',
  // operators
  '+': 'PLUS',
  '-': 'MINUS',
  '*': 'MULT',
  '/': 'DIV',
}

class Lexer {
  // TOKENS
  EOF = '<EOF>'
  // complex symbols
  NUMBER = 'NUMBER'
  CELL = 'CELL'
  FUNCTION = 'FUNCTION'

  constructor(input) {
    this.pointer = 0
    this.input = input
    this.char = input[this.pointer]
    this.markers = []
    this.memo = {}
    this.setSimpleTokens()
  }

  setSimpleTokens() {
    for (let token of Object.values(SIMPLE_SYMBOLS)) {
      this[token] = token
    }
  }

  nextToken() {
    let whitespace

    if (this.char === this.EOF) {
      return new Token(this.EOF, this.EOF)
    }

    whitespace = this.getWhitespace()

    // simple symbols
    if (this.isSimpleSymbol()) {
      return this.tokenSimpleSymbol(whitespace)
      // complex symbols
    } else if (this.isNumberToken()) {
      return this.tokenNUMBER(whitespace)
    } else if (this.isCellToken()) {
      return this.tokenCELL(whitespace)
    } else if (this.isFunctionToken()) {
      return this.tokenFUNCTION(whitespace)
    } else {
      throw new Error(`Invalid character: ${this.char}`)
    }
  }

  consume() {
    this.pointer++

    if (this.pointer >= this.input.length) {
      this.char = this.EOF
    } else {
      this.char = this.input[this.pointer]
    }
  }

  match(regexFn) {
    const regex = regexFn()
    regex.lastIndex = this.pointer
    const reMatch = regex.exec(this.input)

    if (reMatch && reMatch.index === this.pointer) {
      this.pointer += reMatch[0].length - 1
      this.consume()
    } else {
      throw new Error(`No match for ${regexFn.name} at position ${this.pointer}`)
    }
  }

  lparen() {
    return new RegExp('\\(', 'g')
  }

  digit() {
    return new RegExp('\\d', 'g')
  }

  letter() {
    return new RegExp('[a-z]', 'gi')
  }

  letters() {
    return new RegExp('[a-z]+', 'ig')
  }

  number() {
    const reFloat = '\\d*\\.\\d+'
    const reInteger = '\\d+\\.?'
    return new RegExp(`${reFloat}|${reInteger}`, 'g') // float or integer
  }

  digits() {
    return new RegExp('\\d+', 'g')
  }

  tokenSimpleSymbol(whitespace) {
    const token = new Token(SIMPLE_SYMBOLS[this.char], this.char, whitespace)
    this.consume()
    return token
  }

  isSimpleSymbol() {
    return this.char in SIMPLE_SYMBOLS
  }

  isNumberToken() {
    let isMatch
    this.markPointer()

    try {
      this.match(this.number)
      if (this.char === '.') { throw new Error('Number has more than one dot') }
      isMatch = true
    } catch (error) {
      this.restorePointer()
      isMatch = false
    }

    return isMatch
  }

  tokenNUMBER(whitespace) {
    const start = this.markers.pop()
    let numStr = this.input.slice(start, this.pointer)
    const num = parseFloat(numStr)

    if (numStr[numStr.length - 1] === '.') {
      numStr = numStr.slice(0, -1)
    }

    return new Token(this.NUMBER, numStr, whitespace, num)
  }

  isCellToken() {
    let isMatch

    this.markPointer()

    try {
      this.match(this.letters)
      this.match(this.digits)
      isMatch = true
    } catch (error) {
      isMatch = false
    }

    this.restorePointer()
    return isMatch
  }

  tokenCELL(whitespace) {
    this.markPointer()
    this.match(this.letters)
    const letters = this.seekSlice(1).toUpperCase()

    this.markPointer()
    this.match(this.digits)
    const digits = this.seekSlice(1)

    const cellName = letters + digits
    const cellValue = `${letters}-${digits}`
    this.clearMarkers()
    return new Token(this.CELL, cellName, whitespace, cellValue)
  }

  isFunctionToken() {
    let isMatch, fnName

    this.markPointer()

    try {
      this.match(this.letters)
      this.markPointer()
      this.match(this.lparen)
      fnName = this.seekSlice(2, 1).toUpperCase()
      isMatch = fnName in formulas
    } catch (error) {
      isMatch = false
    }

    if (isMatch) {
      // subtract LPARENT
      this.memo[this.seekPointer(2)] = this.pointer - 2
    }

    this.restorePointer(2)
    return isMatch
  }

  tokenFUNCTION(whitespace) {
    const endI = this.memo[this.pointer]
    const fnName = this.input.slice(this.pointer, endI + 1).toUpperCase()
    this.pointer += fnName.length - 1
    this.consume()
    return new Token(this.FUNCTION, fnName, whitespace)
  }

  isWhitespace() {
    return Boolean(this.char.match(/\s/))
  }

  getWhitespace() {
    let len = 0

    while (this.isWhitespace(this.char)) {
      len += 1
      this.consume()
    }

    return Array(len)
      .fill(' ')
      .join('')
  }

  markPointer() {
    this.markers.push(this.pointer)
  }

  clearMarkers() {
    this.markers = []
  }

  restorePointer(steps=1) {
    for (let i = 0; i < steps; i++) {
      this.pointer = this.markers.pop()
    }
  }

  seekPointer(steps) {
    if (steps > this.markers.length) {
      throw new Error('step outside of range')
    }

    const index = this.markers.length - steps
    return this.markers[index]
  }

  seekSlice(start, end) {
    let startI, endI

    if (start > this.markers.length || end > this.markers.length) {
      throw new Error('Seek steps are outside range.')
    }

    startI = this.markers[this.markers.length - start]

    if (end === undefined) {
      return this.input.slice(startI, this.pointer)
    } else {
      endI = this.markers[this.markers.length - end]
      return this.input.slice(startI, endI)
    }

  }
}

export default Lexer
export { SIMPLE_SYMBOLS }
