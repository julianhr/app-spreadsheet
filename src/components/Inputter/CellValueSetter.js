import Lexer, { TOKENS as t } from '~/formulas/Lexer'
import graph from '~/formulas/graph'
import history from '../Table/TableHistory/TableHistory'


class CellValueSetter {
  constructor(props) {
    this.props = props
  }

  run() {
    const { location } = this.props
    const inputValue = this.props.valueEvent.value
    let cellValue

    if (this.isWhitespace(inputValue)) {
      if (this.props.entered.length > 0) {
        history.push('clear', location)
        graph.delVertex(location)
      }

      return
    }

    if (this.isFormula(inputValue)) {
      cellValue = this.sanitizeValue(inputValue)
    } else {
      cellValue = inputValue
    }

    const oldVertex = graph.adj[location]
    const newVertex = graph.addVertex(location, cellValue)
    history.push('add', location, oldVertex, newVertex)
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
        const value = this.getTokenValue(token)
        const whitespace = token.whitespace >= 1 ? ' ' : ''
        return whitespace + value
      })
      .join('')
  }

  getTokenValue(token) {
    switch (token.type) {
      case t.FUNCTION:
        return token.text.toUpperCase()
      case t.NUMBER:
        return token.value
      default:
        return token.text
    }
  }
}

export default CellValueSetter
