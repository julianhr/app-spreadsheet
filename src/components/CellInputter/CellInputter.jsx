import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { setCellData, clearCellData } from '~/actions/tableDataActions'
import Lexer from '~/formulas/Lexer'
import Suggestions from './Suggestions'
import { InputContext } from './InputContext'
import { closeCellInputter } from '~/actions/globalActions'
import HiddenInput from './HiddenInput'
import InputTag from './InputTag'
import Wrapper from './Wrapper'
import KeyboardActions from './KeyboardActions'
import KeyboardFocuser from './KeyboardFocuser'
import CellValueSetter from './CellValueSetter'


export class CellInputter extends React.PureComponent {

  static propTypes = {
    // redux
    cellRect: PropTypes.object.isRequired,
    clearCellData: PropTypes.func.isRequired,
    closeCellInputter: PropTypes.func.isRequired,
    columns: PropTypes.number.isRequired,
    entered: PropTypes.string.isRequired,
    newEntered: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    rows: PropTypes.number.isRequired,
    setCellData: PropTypes.func.isRequired,
    isCellInputterOpen: PropTypes.bool,
  }

  constructor() {
    super()
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.setIsFuncSelectorVisible = this.setIsFuncSelectorVisible.bind(this)
    this.setInputValue = this.setInputValue.bind(this)
    this.setInputWidth = this.setInputWidth.bind(this)
    this.keyboardActions = new KeyboardActions(this)
    this.keyboardFocuser = new KeyboardFocuser(this)
    this.cellValueSetter = new CellValueSetter(this)
  }

  state = {
    tokens: [],
    isFuncSelectorVisible: false,
    inputValue: '',
    keyEvent: { key: '' },
    cursorPos: 0,
    width: null,
  }

  refInput = React.createRef()

  componentDidMount() {
    this.focusInputTag()
    this.setInputValue(this.props.newEntered)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyEvent !== this.state.keyEvent) {
      this.keyboardFocuser.run()
      this.keyboardActions.run()
    }

    if (prevState.inputValue !== this.state.inputValue) {
      this.tokenizeInputValue()
    }
  }

  setInputWidth(width) {
    if (this.state.width !== width) {
      this.setState({ width })
    }
  }

  tokenizeInputValue() {
    const { inputValue } = this.state
    const lexer = new Lexer(inputValue)
    const tokens = lexer.getTokens()
    this.setState({ tokens })
  }

  focusInputTag() {
    const inputEl = this.refInput.current

    setTimeout(() => {
      inputEl.focus()
      inputEl.selectionStart = inputEl.value.length
    }, 0)
  }

  setIsFuncSelectorVisible(isFuncSelectorVisible) {
    this.setState({ isFuncSelectorVisible })
  }

  setInputValue(inputValue, cursorPos) {
    const inputEl = this.refInput.current

    this.setState({ inputValue, cursorPos: inputValue.length }, () => {
      inputEl.focus()
      inputEl.selectionStart = cursorPos
      inputEl.selectionEnd = cursorPos
    })
  }

  handleOnChange(event) {
    const { target: { value } } = event
    const cursorPos = event.target.selectionStart
    this.setState({ inputValue: value, cursorPos })
  }

  handleOnKeyDown(event) {
    const { key, target: { value } } = event

    if (this.state.isFuncSelectorVisible && key === 'Tab') {
      event.preventDefault()
    }

    this.setState({ keyEvent: { key }, inputValue: value })
  }

  handleOnBlur(event) {
    if (this.state.isFuncSelectorVisible) { return }

    this.setState({ inputValue: event.target.value }, () => {
      this.cellValueSetter.run()
      this.props.closeCellInputter()
    })
  }

  render() {
    const inputEl = this.refInput.current
    const inputRect = inputEl && inputEl.getBoundingClientRect()
    const { top, left, height, width: cellWidth } = this.props.cellRect
    const width = this.state.width || cellWidth

    return (
      <InputContext.Provider
        value={{
          inputRect,
          setIsFuncSelectorVisible: this.setIsFuncSelectorVisible,
          setInputValue: this.setInputValue,
          keyEvent: this.state.keyEvent,
          inputValue: this.state.inputValue,
        }}
      >
        <Wrapper
          width={width}
          height={height}
          top={top}
          left={left}
        >
          <HiddenInput
            value={this.state.inputValue}
            cellWidth={width}
            setInputWidth={this.setInputWidth}
          />
          <InputTag
            fwdRef={this.refInput}
            location={this.props.location}
            value={this.state.inputValue}
            onChange={this.handleOnChange}
            onKeyDown={this.handleOnKeyDown}
            onBlur={this.handleOnBlur}
          />
          <Suggestions
            tokens={this.state.tokens}
            cursorPos={this.state.cursorPos}
          />
        </Wrapper>
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

const mapDispatchToProps = { setCellData, clearCellData, closeCellInputter }

export default connect(mapStateToProps, mapDispatchToProps)(CellInputter)
