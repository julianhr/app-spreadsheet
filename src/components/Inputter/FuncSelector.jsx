/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core'

import formulaFuncs from '~/formulas/formulaFunctions'
import InteractiveList from '~/library/InteractiveList'
import Token from '~/formulas/Token'
import { InputContext } from './InputContext'
import { withTheme } from 'emotion-theming'


const Root = styled.div`
  border: 0;
  position: fixed;
`

const baseItemStyle = css`
  padding: 6px 8px;
`

const ItemBaseRoot = styled.div`
  ${baseItemStyle}
  background: ${props => props.theme.colors.dropdown.normal};
`

const ItemActiveRoot = styled.div`
  ${baseItemStyle}
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

  constructor() {
    super()
    this.handleOnClick = this.handleOnClick.bind(this)
    this.setIndex = this.setIndex.bind(this)
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
      this.keyEventSetIndex(keyEvent)
    }
  }

  keyActions() {
    const { keyEvent } = this.context
    if (this.state.keyEvent === keyEvent) { return }
    if (['Enter', 'Tab'].includes(keyEvent.key) && this.state.isVisible) {
      this.setInputterValueEvent()
    }
  }

  setInputterValueEvent() {
    const currInputValue = this.context.valueEvent.value
    const { token } = this.props
    const { fnName } = this.state.listItems[this.state.itemIndex]
    const rightChunkIndex = token.index + token.text.length
    const leftChunk = currInputValue.slice(0, token.index)
    const rightChunk = currInputValue.slice(rightChunkIndex)
    const value = `${leftChunk}${fnName}(${rightChunk}`
    const cursorPos = leftChunk.length + fnName.length + 1
    this.context.setValueEvent(value, cursorPos)
  }

  setListItems() {
    const { token } = this.props
    const text = token.text.toUpperCase()
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
    let isVisible = false
    let itemIndex

    itemIndex = Math.max(Math.min(listItems.length - 1, this.state.itemIndex), 0)

    if (listItems.length > 0) {
      listItems[itemIndex].isActive = isVisible = true
    }

    this.context.setIsFuncSelectorVisible(isVisible)
    this.setState({ listItems, itemIndex, isVisible })
  }

  keyEventSetIndex(keyEvent) {
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

  setIndex(itemIndex) {
    this.setState({ itemIndex }, () => {
      this.setListItems()
    })
  }

  itemBase(fnName) {
    return (
      <ItemBaseRoot>
        <Pre>
          {fnName}
        </Pre>
      </ItemBaseRoot>
    )
  }

  itemActive(fnName) {
    return (
      <ItemActiveRoot>
        <Pre>
          {fnName}
        </Pre>
        <Subtitle>
          {formulaFuncs[fnName].summary}
        </Subtitle>
      </ItemActiveRoot>
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

  handleOnClick(event) {
    event.nativeEvent.stopPropagation()
    this.setInputterValueEvent()
  }

  render() {
    const { listItems, isVisible } = this.state
    const { inputRect } = this.context

    return (
      <Root
        css={css`
          top: ${inputRect.bottom}px;
          left: ${inputRect.left}px;
        `}
        open={isVisible}
        onClick={this.handleOnClick}
      >
        <InteractiveList
          items={listItems}
          styles={this.getListStyles()}
          onMouseEnter={this.setIndex}
        />
      </Root>
    )
  }
}

export default withTheme(FuncSelector)
