import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'

import { setCellData, clearCellData } from '~/actions/tableDataActions'
import Lexer from '~/formulas/Lexer'
import Suggestions from '../suggestions/Suggestions'
import { InputContext } from './InputContext'


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
`

export class InputData extends React.PureComponent {

  static propTypes = {
    // props
    replaceValue: PropTypes.bool.isRequired,
    location: PropTypes.string.isRequired,
    onEscape: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    // redux
    clearCellData: PropTypes.func.isRequired,
    entered: PropTypes.string,
    setCellData: PropTypes.func.isRequired,
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
    const entered = this.props.replaceValue ? '' : this.props.entered
    this.setInputValue(entered)
    this.focusInputTag()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyEvent !== this.state.keyEvent) {
      this.keyActions()
    }

    if (prevState.inputValue !== this.state.inputValue) {
      this.tokenizeInputValue()
    }
  }

  keyActions() {
    switch (this.state.keyEvent.key) { // eslint-disable-line
      case 'Escape':
        this.props.onEscape()
        break
      case 'Enter':
        if (!this.state.isFuncSelectorVisible) {
          this.setNewValue()
          this.props.onCommit()
        }
        break
    }
  }

  focusInputTag() {
    const input = this.refInput.current
    input.focus()
    input.scrollLeft = input.scrollWidth
  }

  setInputValue(inputValue) {
    this.setState({ inputValue })
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

  tokenizeInputValue() {
    const { inputValue } = this.state
    const lexer = new Lexer(inputValue)
    const tokens = lexer.getTokens()
    this.setState({ tokens })
  }

  isWhitespace(text) {
    return text.length === 0 || Boolean(text.match(/^\s+$/))
  }

  setIsFuncSelectorVisible(isFuncSelectorVisible) {
    this.setState({ isFuncSelectorVisible })
  }

  handleOnChange(event) {
    const { target: { value } } = event
    this.setState({ inputValue: value })
  }

  handleOnKeyDown(event) {
    const { key, target: { value } } = event

    if (this.state.isFuncSelectorVisible) {
      event.stopPropagation()
    } else {
      if (!['Enter', 'Escape'].includes(key)) {
        event.stopPropagation()
      }
    }

    this.setState({ keyEvent: { key }, inputValue: value })
  }

  handleOnBlur(event) {
    this.setState({ inputValue: event.target.value }, () => {
      this.setNewValue()
      this.props.onCommit()
    })
  }

  render() {
    const inputEl = this.refInput.current

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
      </InputContext.Provider>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const cell = state.tableData[ownProps.location]
  const entered = cell ? cell.entered : ''
  return { entered }
}

const mapDispatchToProps = { setCellData, clearCellData }

export default connect(mapStateToProps, mapDispatchToProps)(InputData)
