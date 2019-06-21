import Lexer, { TOKENS as t } from '~/formulas/Lexer'


class CellValueSetter {
  constructor(component) {
    this.c = component
  }

  run() {
    const { location } = this.c.props
    const inputValue = this.c.props.valueEvent.value
    let cellValue

    if (this.isWhitespace(inputValue)) {
      this.c.props.clearCellData(location)
      return
    }

    if (this.isFormula(inputValue)) {
      cellValue = this.sanitizeValue(inputValue)
    } else {
      cellValue = inputValue
    }

    this.c.props.setCellData(location, cellValue)
  }

  isFormula(text) {
    return text.length > 0 && text[0] === '='
  }

  isWhitespace(text) {
    return text.length === 0 || Boolean(text.match(/^\s+$/))
  }

  sanitizeValue(value) {
    const lexer = new Lexer(value)
    const tokens = lexer.getTokens()

    return tokens
      .map(token => {
        switch (token.type) {
          case t.FUNCTION:
            return token.text.toUpperCase()
          case t.NUMBER:
            return token.value
          default:
            return token.text
        }
      })
      .join('')
  }
}

export default CellValueSetter
