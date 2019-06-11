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


const INPUT_PADDING_RIGHT = 15

const Root = styled.div`
  position: fixed;
`

const Input = styled.input`
  align-items: center;
  background-color: white;
  border: 2px solid salmon;
  box-sizing: border-box;
  display: flex;
  font-size: 13px;
  height: 100%;
  outline: none;
  padding: 2px;
  width: 100%;
`

const HiddenInput = styled(Input)`
  position: absolute;
  margin-top: -100vh;
  visibility: hidden;
`

export class CellInputter extends React.PureComponent {

  static propTypes = {
    // redux
    cellRect: PropTypes.object.isRequired,
    clearCellData: PropTypes.func.isRequired,
    closeCellInputter: PropTypes.func.isRequired,
    columns: PropTypes.number.isRequired,
    entered: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    rows: PropTypes.number.isRequired,
    setCellData: PropTypes.func.isRequired,
    willReplaceValue: PropTypes.bool.isRequired,
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
    cursorPos: 0,
  }

  refInput = React.createRef()
  refHiddenInput = React.createRef()

  componentDidMount() {
    const entered = this.props.willReplaceValue ? '' : this.props.entered
    this.focusInputTag()
    this.setInputValue(entered)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyEvent !== this.state.keyEvent) {
      this.setFocus(this.state.keyEvent.key)
      this.keyActions()
    }

    if (prevState.inputValue !== this.state.inputValue) {
      this.tokenizeInputValue()
    }
  }

  keyActions() {
    switch (this.state.keyEvent.key) { // eslint-disable-line
      case 'Escape':
        this.props.closeCellInputter()
        break
      case 'Enter':
        if (!this.state.isFuncSelectorVisible) {
          this.setCellValue()
          this.props.closeCellInputter()
        }
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        this.setState({ cursorPos: this.refInput.current.selectionEnd })
    }
  }

  tokenizeInputValue() {
    const { inputValue } = this.state
    const lexer = new Lexer(inputValue)
    const tokens = lexer.getTokens()
    this.setState({ tokens })
  }

  focusInputTag() {
    const input = this.refInput.current
    input.focus()
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

  setCellValue() {
    const { location } = this.props
    const { inputValue } = this.state

    if (this.isWhitespace(inputValue)) {
      this.props.clearCellData(location)
      return
    }

    const cellValue = inputValue.length > 0 && inputValue[0] === '='
      ? inputValue.toUpperCase()
      : inputValue

    this.props.setCellData(location, cellValue)
  }

  isWhitespace(text) {
    return text.length === 0 || Boolean(text.match(/^\s+$/))
  }

  setIsFuncSelectorVisible(isFuncSelectorVisible) {
    this.setState({ isFuncSelectorVisible })
  }

  setInputValue(inputValue, cursorPos) {
    this.setState({ inputValue, cursorPos: inputValue.length }, () => {
      if (!cursorPos) { return }

      setImmediate(() => {
        this.refInput.current.selectionStart = cursorPos
        this.refInput.current.selectionEnd = cursorPos
      })
    })
  }

  handleOnChange(event) {
    const { target: { value } } = event
    const cursorPos = event.target.selectionStart
    this.setState({ inputValue: value, cursorPos })
  }

  handleOnKeyDown(event) {
    const { key, target: { value } } = event
    this.setState({ keyEvent: { key }, inputValue: value })
  }

  handleOnBlur(event) {
    this.setState({ inputValue: event.target.value }, () => {
      this.setCellValue()
      this.props.closeCellInputter()
    })
  }

  getRootStyle() {
    const { top, left, width: cellWidth, height: cellHeight } = this.props.cellRect
    const { current: hiddenInputEl } = this.refHiddenInput
    let width, height

    if (hiddenInputEl) {
      const textWidth = hiddenInputEl.scrollWidth
      const hiddenRect = hiddenInputEl.getBoundingClientRect()
      width = textWidth > hiddenRect.width
        ? Math.max(cellWidth, textWidth + INPUT_PADDING_RIGHT)
        : cellWidth
      height = cellHeight
    } else {
      width = cellWidth
      height = cellHeight
    }


    return {
      top,
      left,
      height,
      width,
    }
  }

  render() {
    const inputEl = this.refInput.current
    const { width, height } = this.props.cellRect

    if (!this.props.location) { return null }

    return (
      <InputContext.Provider
        value={{
          inputRect: inputEl && inputEl.getBoundingClientRect(),
          setIsFuncSelectorVisible: this.setIsFuncSelectorVisible,
          setInputValue: this.setInputValue,
          keyEvent: this.state.keyEvent,
          inputValue: this.state.inputValue,
        }}
      >
        <Root
          css={this.getRootStyle()}
        >
          <HiddenInput
            ref={this.refHiddenInput}
            defaultValue={this.state.inputValue}
            css={{
              width: width - INPUT_PADDING_RIGHT,
              height,
            }}
          />
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
            cursorPos={this.state.cursorPos}
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
