/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { css, jsx } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { setCellData, clearCellData } from '~/actions/tableActions'
import { parseLocation, getColumnLabel } from '~/library/utils'
import Lexer from '~/formulas/Lexer'
import Suggestions from './Suggestions'
import { InputContext } from './InputContext'
import { closeCellInputter } from '~/actions/globalActions'


const Root = styled.div`
  position: fixed;
`

const Input = styled.input`
  display: flex;
  align-items: center;
  outline: none;
  height: 100%;
  width: 100%;
  border: 2px solid salmon;
  padding: 2px;
  box-sizing: border-box;
  font-size: 13px;
  padding-right: 10px;
  background-color: white;
`

export class CellInputter extends React.PureComponent {

  static propTypes = {
    // redux
    location: PropTypes.string.isRequired,
    cellRect: PropTypes.object.isRequired,
    entered: PropTypes.string.isRequired,
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
    willReplaceValue: PropTypes.bool.isRequired,
    clearCellData: PropTypes.func.isRequired,
    setCellData: PropTypes.func.isRequired,
    closeCellInputter: PropTypes.func.isRequired,
  }

  constructor() {
    super()
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.setIsFuncSelectorVisible = this.setIsFuncSelectorVisible.bind(this)
    this.setInputValue = this.setInputValue.bind(this)
  }

  state = {
    tokens: [],
    isFuncSelectorVisible: false,
    inputValue: '',
    keyEvent: { key: '' },
  }

  refInput = React.createRef()

  componentDidMount() {
    this.setInputValue(this.props.willReplaceValue ? '' : this.props.entered)
    this.tokenizeInputValue(this.refInput.current.value, '')
    this.focusInputTag()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyEvent !== this.state.keyEvent) {
      this.setFocus(this.state.keyEvent.key)
      this.keyActions()
    }
  }

  keyActions() {
    switch (this.state.keyEvent.key) { // eslint-disable-line
      case 'Escape':
        // this.props.onEscape()
        this.props.closeCellInputter()
        break
      case 'Enter':
        if (!this.state.isFuncSelectorVisible) {
          this.setNewValue()
          this.props.closeCellInputter()
          // this.props.onCommit()
        }
        break
    }
  }

  tokenizeInputValue(entered) {
    const lexer = new Lexer(entered)
    const tokens = lexer.getTokens()
    this.setState({ tokens })
  }

  focusInputTag() {
    const input = this.refInput.current
    input.focus()
    input.scrollLeft = input.scrollWidth
  }

  setFocus() {
    const { keyEvent: { key } } = this.state
    const { location } = this.props
    const [colIndex, rowIndex] = parseLocation(location)
    let el, elId

    if (key === 'Tab') {
      elId = `[data-cell="result"][data-location="${location}"]`
    } else if (key === 'Enter') {
      if (this.state.isFuncSelectorVisible) { return }

      const nextRowIndex = Math.min(this.props.rows - 1, rowIndex + 1)
      const colLabel = getColumnLabel(colIndex)
      const rowLabel = '' + (nextRowIndex + 1)
      const endLocation = `${colLabel}-${rowLabel}`
      elId = `[data-cell="result"][data-location="${endLocation}"]`
    } else if (key === 'Escape') {
      elId = `[data-cell="result"][data-location="${location}"]`
    } else {
      elId = `[data-cell="input"][data-location="${location}"]`
    }

    el = document.querySelector(elId)
    if (document.activeElement !== el) { el.focus() }
  }

  setNewValue() {
    const { location } = this.props
    const { inputValue } = this.state

    if (this.isWhitespace(inputValue)) {
      this.props.clearCellData(location)
      return
    }

    this.props.setCellData(location, inputValue)
  }

  isWhitespace(text) {
    return text.length === 0 || Boolean(text.match(/^\s+$/))
  }

  setIsFuncSelectorVisible(isFuncSelectorVisible) {
    this.setState({ isFuncSelectorVisible })
  }

  setInputValue(inputValue) {
    this.setState({ inputValue })
    this.tokenizeInputValue(inputValue)
  }

  handleOnChange(event) {
    const { target: { value } } = event
    this.tokenizeInputValue(value)
    this.setState({ inputValue: value })
  }

  handleOnKeyDown(event) {
    const { key, target: { value } } = event
    this.setState({ keyEvent: { key }, inputValue: value })
  }

  handleOnBlur(event) {
    this.setState({ inputValue: event.target.value }, () => {
      this.setNewValue()
      this.setFocus()
      this.props.closeCellInputter()
    })
  }

  render() {
    const inputEl = this.refInput.current
    const { cellRect } = this.props

    if (!this.props.location) { return null }

    return (
      <InputContext.Provider
        value={{
          clientRect: inputEl && inputEl.getBoundingClientRect(),
          setIsFuncSelectorVisible: this.setIsFuncSelectorVisible,
          setInputValue: this.setInputValue,
          keyEvent: this.state.keyEvent,
          inputValue: this.state.inputValue,
        }}
      >
        <Root
          css={{
            top: cellRect.top,
            left: cellRect.left,
            width: cellRect.width,
            height: cellRect.height,
          }}
        >
          <Input
            ref={this.refInput}
            data-cell='input'
            data-location={this.props.location}
            value={this.state.inputValue}
            onChange={this.handleOnChange}
            onKeyDown={this.handleOnKeyDown}
            onBlur={this.handleOnBlur}
          />
          <Suggestions
            tokens={this.state.tokens}
            cursorPos={inputEl && inputEl.selectionStart}
          />
        </Root>
      </InputContext.Provider>
    )
  }
}

function mapStateToProps(state) {
  const {
    global: {
      cellInputter: {
        location, willReplaceValue, cellRect
      },
      rows,
      columns,
    }
  } = state
  const cell = state.table[location]
  const entered = cell ? cell.entered : ''

  return { location, willReplaceValue, cellRect, entered, rows, columns }
}

const mapDispatchToProps = { setCellData, clearCellData, closeCellInputter }

export default connect(mapStateToProps, mapDispatchToProps)(CellInputter)
