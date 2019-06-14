import { TOKENS as t } from './Lexer'
import formulaFuncs from './formulaFunctions'
import { isNumber } from '~/library/utils'


class TokenSanitizer {
  constructor(tokens) {
    this.tokens = tokens
  }

  sanitize() {
    return this.tokens.map(token => {
      switch(token.type) {
        case t.NUMBER:
          return this.number(token)
        case t.CELL:
          return this.cell(token)
        case t.FUNCTION:
          return this.function(token)
        case t.STRING:
          return this.string(token)
        default:
          return token
      }
    })
  }

  number(token) {
    if (!isNumber(token.text)) {
      token.type = t.UNKNOWN
      return token
    }

    token.value = parseFloat(token.text)
    return token
  }

  cell(token) {
    token.value = this.getCellLabel(token)
    return token
  }

  function(token) {
    const fn = this.getFunction(token)
    
    if (fn) {
      token.value = fn
    } else {
      token.type = t.UNKNOWN
    }

    return token
  }

  string(token) {
    token.value = token.text.slice(1, -1)
    return token
  }

  getCellLabel(token) {
    const { text } = token
    const { index } = text.match(/\d+/)
    const col = text.slice(0, index).toUpperCase()
    const row = text.slice(index)
    return `${col}-${row}`
  }

  getFunction(token) {
    const fnName = token.text.toUpperCase()
    const fnNode = formulaFuncs[fnName]
    return fnNode && fnNode.fn
  }
}

export default TokenSanitizer
