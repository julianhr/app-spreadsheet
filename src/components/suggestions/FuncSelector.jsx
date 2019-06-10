/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core'

import formulaFuncs from '~/formulas/formulaFunctions'
import InteractiveList from '~/library/InteractiveList'
import Token from '~/formulas/Token'
import { InputContext } from '../cell/InputContext'
import { withTheme } from 'emotion-theming'


const baseStyle = css`
  padding: 6px 8px;
`

const BaseRoot = styled.div`
  ${baseStyle}
  background: ${props => props.theme.colors.dropdown.normal};
`

const ActiveRoot = styled.div`
  ${baseStyle}
  background: ${props => props.theme.colors.dropdown.active};
`

const Pre = styled.pre`
  line-height: 1em;
  padding-bottom: 3px;
  font-size: 14px;
`

const Subtitle = styled.div`
  font-size: 12px;
`

class FuncSelector extends React.Component {

  static contextType = InputContext

  static propTypes = {
    token: PropTypes.instanceOf(Token),
    colors: PropTypes.object,
    theme: PropTypes.object,
  }

  state = {
    listItems: [],
    itemIndex: 0,
    keyEvent: null,
    isVisible: false,
  }

  componentDidMount() {
    this.setState({ itemIndex: 0 }, () => {
      this.setListItems()
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.listItems !== nextState.listItems
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateContextData(prevState)
    this.updateListItems(prevProps)
    this.keyActions()
  }

  componentWillUnmount() {
    this.context.setIsFuncSelectorVisible(false)
  }

  updateListItems(prevProps) {
    if (prevProps.token === this.props.token) { return }

    this.setState({ itemIndex: 0 }, () => {
      this.setListItems()
    })
  }

  updateContextData(prevState) {
    const { keyEvent } = this.context

    if (prevState.keyEvent !== keyEvent) {
      this.setState({ keyEvent })
      this.setItemIndex(keyEvent)
    }
  }

  keyActions() {
    const { keyEvent } = this.context
    if (this.state.keyEvent === keyEvent) { return }
    if (keyEvent.key === 'Enter' && this.state.isVisible) {
      this.updateInputValue()
    }
  }

  updateInputValue() {
    const { inputValue: currInputValue } = this.context
    const { token } = this.props
    const endIndex = currInputValue.length - token.text.length
    const inputValue = currInputValue.slice(0, endIndex)
    const { fnName } = this.state.listItems[this.state.itemIndex]
    const newInputValue = `${inputValue}${fnName}(`
    this.context.setInputValue(newInputValue)
  }

  setListItems() {
    const { token } = this.props
    const text = token.text.toUpperCase()
    let isVisible = false
    let itemIndex
    const listItems = Object
      .keys(formulaFuncs)
      .filter(fnName => fnName.startsWith(text))
      .sort()
      .map(fnName => ({
        item: {
          base: this.itemBase(fnName),
          active: this.itemActive(fnName),
        },
        isActive: false,
        fnName,
      }))

    itemIndex = Math.max(Math.min(listItems.length - 1, this.state.itemIndex), 0)

    if (listItems.length > 0) {
      listItems[itemIndex].isActive = isVisible = true
    }

    this.context.setIsFuncSelectorVisible(isVisible)
    this.setState({ listItems, itemIndex, isVisible })
  }

  setItemIndex(keyEvent) {
    let itemIndex = this.state.itemIndex

    switch (keyEvent.key) { // eslint-disable-line default-case
      case 'ArrowUp':
          itemIndex = this.state.itemIndex - 1
        break
      case 'ArrowDown':
          itemIndex = this.state.itemIndex + 1
        break
    }

    this.setState({ itemIndex }, () => {
      this.setListItems()
    })
  }

  itemBase(fnName) {
    return (
      <BaseRoot>
        <Pre>
          {fnName}
        </Pre>
      </BaseRoot>
    )
  }

  itemActive(fnName) {
    return (
      <ActiveRoot>
        <Pre>
          {fnName}
        </Pre>
        <Subtitle>
          {formulaFuncs[fnName].summary}
        </Subtitle>
      </ActiveRoot>
    )
  }

  getListStyles() {
    const { theme } = this.props

    return {
      ul: {
        marginTop: 1,
        boxShadow: `0 0 5px ${theme.colors.shadow}`,
        border: `1px solid ${theme.colors.dropdown.active}`,
        width: 300,
      }
    }
  }

  render() {
    const { listItems, isVisible } = this.state
    const { clientRect } = this.context

    if (isVisible) {
      return (
        <InteractiveList
          selectItem={() => {}}
          items={listItems}
          top={Math.round(clientRect.bottom)}
          left={Math.round(clientRect.left)}
          styles={this.getListStyles()}
        />
      )
    } else {
      return null
    }
  }
}

export default withTheme(FuncSelector)
