import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { setCellData, clearCellData } from '~/actions/tableDataActions'
import { setInputterValueEvent } from '~/actions/globalActions'
import { InputContext } from './InputContext'
import Lexer from '~/formulas/Lexer'
import KeyboardActions from './KeyboardActions'
import KeyboardFocuser from './KeyboardFocuser'
import CellValueSetter from './CellValueSetter'
import Suggestions from './Suggestions'
import InputTag from './InputTag'


export class CellInputter extends React.PureComponent {

  static propTypes = {
    // redux
    cellRect: PropTypes.object.isRequired,
    clearCellData: PropTypes.func.isRequired,
    columns: PropTypes.number.isRequired,
    entered: PropTypes.string.isRequired,
    valueEvent: PropTypes.object.isRequired,
    location: PropTypes.string.isRequired,
    rows: PropTypes.number.isRequired,
    setCellData: PropTypes.func.isRequired,
    isCellInputterOpen: PropTypes.bool,
    setInputterValueEvent: PropTypes.func.isRequired,
  }

  constructor() {
    super()
    this.cellValueSetter = new CellValueSetter(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
    this.keyboardActions = new KeyboardActions(this)
    this.keyboardFocuser = new KeyboardFocuser(this)
    this.setInputWidth = this.setInputWidth.bind(this)
    this.setIsFuncSelectorVisible = this.setIsFuncSelectorVisible.bind(this)
    this.setValueEvent = this.setValueEvent.bind(this)
  }

  state = {
    tokens: [],
    isFuncSelectorVisible: false,
    keyEvent: { key: '' },
    width: null,
  }

  refInput = React.createRef()

  componentDidMount() {
    this.focusInputTag()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyEvent !== this.state.keyEvent) {
      this.keyboardFocuser.run()
      this.keyboardActions.run()
    }

    if (prevProps.valueEvent !== this.props.valueEvent) {
      this.focusInputTag()
      this.tokenizeInputValue()
    }
  }

  setInputWidth(width) {
    if (this.state.width !== width) {
      this.setState({ width })
    }
  }

  setValueEvent(value, cursorPos) {
    const valueEvent = { value, cursorPos }
    this.props.setInputterValueEvent(valueEvent)
  }

  tokenizeInputValue() {
    const { value } = this.props.valueEvent
    const lexer = new Lexer(value)
    const tokens = lexer.getTokens()
    this.setState({ tokens })
  }

  setIsFuncSelectorVisible(isFuncSelectorVisible) {
    this.setState({ isFuncSelectorVisible })
  }

  focusInputTag() {
    const inputEl = this.refInput.current
    const { cursorPos } = this.props.valueEvent

    inputEl.focus()

    if (inputEl.selectionEnd !== cursorPos) {
      inputEl.selectionStart = cursorPos
      inputEl.selectionEnd = cursorPos
    }
  }

  handleOnChange(event) {
    const { target: { value } } = event
    const cursorPos = event.target.selectionStart
    this.setValueEvent(value, cursorPos)
  }

  handleOnKeyDown(event) {
    const { key } = event

    if (this.state.isFuncSelectorVisible && key === 'Tab') {
      event.preventDefault()
    }

    this.setState({ keyEvent: { key } })
  }

  render() {
    const inputEl = this.refInput.current
    const inputRect = inputEl && inputEl.getBoundingClientRect()

    return (
      <InputContext.Provider
        value={{
          inputRect,
          setIsFuncSelectorVisible: this.setIsFuncSelectorVisible,
          keyEvent: this.state.keyEvent,
          valueEvent: this.props.valueEvent,
          setValueEvent: this.setValueEvent,
        }}
      >
        <InputTag
          fwdRef={this.refInput}
          location={this.props.location}
          value={this.props.valueEvent.value}
          onChange={this.handleOnChange}
          onKeyDown={this.handleOnKeyDown}
        />
        <Suggestions
          tokens={this.state.tokens}
          cursorPos={this.props.valueEvent.cursorPos}
        />
      </InputContext.Provider>
    )
  }
}

function mapStateToProps(state) {
  const {
    global: {
      activeCell: {
        location,
        entered,
      },
      cellInputter: {
        isCellInputterOpen,
        cellRect,
        valueEvent,
      },
      rows,
      columns,
    }
  } = state

  return {
    cellRect,
    columns,
    entered,
    isCellInputterOpen,
    location,
    rows,
    valueEvent,
  }
}

const mapDispatchToProps = { setCellData, clearCellData, setInputterValueEvent }

export default connect(mapStateToProps, mapDispatchToProps)(CellInputter)
