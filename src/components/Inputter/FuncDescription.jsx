/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core'

import formulaFuncs from '~/formulas/formulaFunctions'
import { InputContext } from './InputContext'


const Root = styled.div`
  background: ${props => props.theme.colors.dropdown.normal};
  margin-top: 1px;
  box-shadow: 0 0 5px ${props => props.theme.colors.shadow};
  border: 1px solid ${props => props.theme.colors.dropdown.active};
  width: 300px;
  padding: 6px 8px;
  position: fixed;
`

const Pre = styled.pre`
  line-height: 1em;
  padding-bottom: 3px;
  font-size: 14px;
`

const Subtitle = styled.div`
  padding-top: 12px;
  font-size: 12px;
`

const P = styled.p`
  line-height: 1em;
  font-size: 13px;
`

const Hr = styled.hr`
  border: 0;
  border-top: 1px solid ${props => props.theme.colors.dropdown.active};
`

class FuncDescription extends React.PureComponent {

  static contextType = InputContext

  static propTypes = {
    cursorPos: PropTypes.number,
    fnScopes: PropTypes.array,
  }

  getFnScope() {
    const { fnScopes, cursorPos } = this.props
    let currScope

    for (let scope of fnScopes) {
      if (cursorPos >= scope.startIndex + 1) {
        currScope = scope
      } else {
        break
      }
    }

    if (currScope && currScope.endIndex === null) { return currScope}
    if (currScope && cursorPos <= currScope.endIndex) { return currScope }
    return null
  }

  getFnNode(scope) {
    const key = scope.fnName.toUpperCase()
    return formulaFuncs[key]
  }

  render() {
    const scope = this.getFnScope()
    const { inputRect } = this.context
    let fnNode

    if (!scope) { return null }
    fnNode = this.getFnNode(scope)

    return (
      <Root
        css={css`
          top: ${inputRect.bottom}px;
          left: ${inputRect.left}px;
        `}
      >
        <Pre
          css={css`
            padding-bottom: 6px;
          `}
        >
          {fnNode.definition}
        </Pre>
        <Hr />
        <Subtitle>Example</Subtitle>
        <Pre>{fnNode.example}</Pre>
        <Subtitle>Summary</Subtitle>
        <P>{fnNode.summary}</P>
      </Root>
    )
  }
}

FuncDescription.propTypes = {
  cursorPos: PropTypes.number,
  fnScopes: PropTypes.array,
}

export default FuncDescription

