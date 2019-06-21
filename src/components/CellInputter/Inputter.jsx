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


const NoOp = () => {}

export class CellInputter extends React.PureComponent {

  static propTypes = {
    // redux
    cellRect: PropTypes.object.isRequired,
    clearCellData: PropTypes.func.isRequired,
    columns: PropTypes.number.isRequired,
    entered: PropTypes.string.isRequired,
    newEntered: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    rows: PropTypes.number.isRequired,
    setCellData: PropTypes.func.isRequired,
    isCellInputterOpen: PropTypes.bool,
    onBlur: PropTypes.func,
  }

  static defaultProps = {
    onBlur: NoOp,
  }

  constructor() {
    super()
    this.cellValueSetter = new CellValueSetter(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
    this.keyboardActions = new KeyboardActions(this)
    this.keyboardFocuser = new KeyboardFocuser(this)
    this.setValueEvent = this.setValueEvent.bind(this)
    this.setInputWidth = this.setInputWidth.bind(this)
    this.setIsFuncSelectorVisible = this.setIsFuncSelectorVisible.bind(this)
  }

  state = {
    tokens: [],
    isFuncSelectorVisible: false,
    keyEvent: { key: '' },
    width: null,
    valueEvent: { value: '', cursorPos: 0 },
  }

  refInput = React.createRef()

  componentDidMount() {
    this.setValueEvent(this.props.newEntered)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyEvent !== this.state.keyEvent) {
      this.keyboardFocuser.run()
      this.keyboardActions.run()
    }

    if (prevState.valueEvent !== this.state.valueEvent) {
      this.tokenizeInputValue()
    }
  }

  setInputWidth(width) {
    if (this.state.width !== width) {
      this.setState({ width })
    }
  }

  tokenizeInputValue() {
    const { value } = this.state.valueEvent
    const lexer = new Lexer(value)
    const tokens = lexer.getTokens()
    this.setState({ tokens })
  }

  setIsFuncSelectorVisible(isFuncSelectorVisible) {
    this.setState({ isFuncSelectorVisible })
  }

  focusInputTag() {
    const inputEl = this.refInput.current
    const { cursorPos } = this.state.valueEvent

    if (inputEl.scelectionEnd !== cursorPos) {
      inputEl.focus()
      inputEl.selectionStart = cursorPos
      inputEl.selectionEnd = cursorPos
    }
  }

  setValueEvent(value, cursorPos) {
    const valueEvent = {
      value,
      cursorPos: cursorPos === undefined ? value.length : cursorPos
    }

    this.setState({ valueEvent }, () => {
      this.focusInputTag()
    })
  }

  handleOnChange(event) {
    const { target: { value } } = event
    const cursorPos = event.target.selectionStart
    const valueEvent = { value, cursorPos }
    this.setState({ valueEvent })
    this.props.setInputterValueEvent(valueEvent)
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
          setValueEvent: this.setValueEvent,
          keyEvent: this.state.keyEvent,
          inputValue: this.state.valueEvent.value,
        }}
      >
        <InputTag
          fwdRef={this.refInput}
          location={this.props.location}
          value={this.state.valueEvent.value}
          onChange={this.handleOnChange}
          onKeyDown={this.handleOnKeyDown}
        />
        <Suggestions
          tokens={this.state.tokens}
          cursorPos={this.state.valueEvent.cursorPos}
        />
      </InputContext.Provider>
    )
  }
}

function mapStateToProps(state) {
  const {
    global: {
      cellInputter: {
        isCellInputterOpen,
        newEntered,
        cellRect,
      },
      activeCell: {
        location,
        entered,
      },
      rows,
      columns,
    }
  } = state

  return { location, entered, newEntered, isCellInputterOpen, cellRect, rows, columns }
}

const mapDispatchToProps = { setCellData, clearCellData, setInputterValueEvent }

export default connect(mapStateToProps, mapDispatchToProps)(CellInputter)
