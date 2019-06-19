import React from 'react'
import PropTypes from 'prop-types'

import { TOKENS as t } from '~/formulas/Lexer'
import FuncDescription from './FuncDescription'
import FuncSelector from './FuncSelector'


class Suggestions extends React.PureComponent {

  static propTypes = {
    tokens: PropTypes.array.isRequired,
    cursorPos: PropTypes.number,
  }

  static defaultProps = {
    cursorPos: 0,
  }

  state = {
    fnScopes: [],
  }

  componentDidMount() {
    this.setFnScopes()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tokens !== this.props.tokens) {
      this.setFnScopes()
    }
  }

  setFnScopes() {
    const stack = []
    const fnScopes = []

    for (let token of this.props.tokens) {
      if (token.type === t.FUNCTION) {
        const scope = { fnName: token.text, startIndex: token.index, endIndex: null }
        stack.push(scope)
        fnScopes.push(scope)
      } else if (token.type === t.LPAREN) {
        stack.push('(')
      } else if (token.type === t.RPAREN) {
        stack.pop()
        if (stack.length > 0 && stack[stack.length - 1] !== '(') {
          const scope = stack.pop()
          scope.endIndex = token.index - 1
        }
      }
    }

    fnScopes.sort((a, b) => a.startIndex - b.startIndex)
    this.setState({ fnScopes })
  }

  getCurrTokenIndex(tokens, cursorPos) {
    let index

    for (index = 0; index < tokens.length; index++) {
      const token = tokens[index]
      const endIndex = token.index + token.text.length

      if (cursorPos > token.index && cursorPos <= endIndex) {
        break
      }
    }

    return index
  }

  getCompareTokens() {
    const { tokens, cursorPos } = this.props
    const index = this.getCurrTokenIndex(tokens, cursorPos)
    const tokenBefore = index > 0 && tokens[index - 1]
    const tokenCurr = tokens[index]
    const tokenAfter = index < tokens.length - 2 && tokens[index + 1]
    return [ tokenBefore, tokenCurr, tokenAfter ]
  }

  getFuncSelector() {
    const [ tokenBefore, tokenCurr, tokenAfter ] = this.getCompareTokens()

    if (this.props.tokens.length < 2) { return null }

    const option1 = (
      tokenBefore
      && tokenCurr
      && tokenAfter
      && tokenBefore.category === 'operator'
      && [t.UNKNOWN, t.FUNCTION].includes(tokenCurr.type)
      && tokenAfter.type !== t.RPAREN
    )

    const option2 = (
      tokenBefore
      && tokenCurr
      && !tokenAfter
      && [t.UNKNOWN, t.FUNCTION].includes(tokenCurr.type)
    )

    if (option1 || option2) {
      return (
        <FuncSelector
            token={tokenCurr}
        />
      )
    }
  }

  render() {
    const renderedFuncSelector = this.getFuncSelector()

    if (renderedFuncSelector) {
      return renderedFuncSelector
    } else {
      return (
        <FuncDescription
          cursorPos={this.props.cursorPos}
          fnScopes={this.state.fnScopes}
        />
      )
    }
  }
}

export default Suggestions
