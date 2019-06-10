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
    if (prevProps.tokens !== this.props.tokens) { // avoid infinite loop
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

  getComponentToRender() {
    const { tokens, cursorPos } = this.props
    let componentName = null

    if (tokens.length < 2) {
      componentName = null
    } else {
      const token1 = tokens[tokens.length - 1]
      const token2 = tokens.length > 1 && tokens[tokens.length - 2]

      if (
        [t.UNKNOWN, t.FUNCTION].includes(token1.type)
        && (token2.category === 'operator'
            || token2.type === t.EQUALS)
      ) {
        if (cursorPos >= token1.index) {
          componentName = 'FuncSelector'
        }
      } else {
        componentName = 'FuncDescription'
      }
    }

    return componentName
  }

  render() {
    const { tokens, cursorPos } = this.props
    const token1 = tokens[tokens.length - 1]

    switch (this.getComponentToRender()) {
      case 'FuncSelector':
        return (
          <FuncSelector
            token={token1}
          />
        )
      case 'FuncDescription':
        return (
          <FuncDescription
            cursorPos={cursorPos}
            fnScopes={this.state.fnScopes}
          />
        )
      default:
        return null
    }
  }
}

export default Suggestions
