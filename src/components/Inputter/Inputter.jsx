import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { setCellData, clearCellData } from '~/actions/tableDataActions'
import { setInputterValueEvent, resetInputter } from '~/actions/globalActions'
import { InputContext } from './InputContext'
import Lexer from '~/formulas/Lexer'
import KeyboardActions from './KeyboardActions'
import KeyboardFocuser from './KeyboardFocuser'
import CellValueSetter from './CellValueSetter'
import InputTag from './InputTag'
import Suggestions from './Suggestions'


const NoOp = () => {}

export class Inputter extends React.PureComponent {

  static propTypes = {
    // props
    isInteractive: PropTypes.bool,
    // redux
    clearCellData: PropTypes.func.isRequired,
    columns: PropTypes.number.isRequired,
    entered: PropTypes.string.isRequired,
    valueEvent: PropTypes.object.isRequired,
    location: PropTypes.string.isRequired,
    rows: PropTypes.number.isRequired,
    setCellData: PropTypes.func.isRequired,
    setInputterValueEvent: PropTypes.func.isRequired,
    resetInputter: PropTypes.func.isRequired,
    inputTagProps: PropTypes.object,
    // lifecycle functions
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
  }

  static defaultProps = {
    onMount: NoOp,
    onUnmount: NoOp,
    isInteractive: false,
    inputTagProps: {},
  }

  constructor(props) {
    super(props)
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
    initValueEvent: null,
  }

  refInput = React.createRef()

  componentDidMount() {
    this.setState({ initValueEvent: this.props.valueEvent })
    this.props.onMount(this.props, this.state, this.refInput.current)
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

  componentWillUnmount() {
    this.props.onMount(this.props, this.state, this.refInput.current)
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
    if (!this.props.isInteractive) { return null }

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

    if (this.state.isFuncSelectorVisible && ['Tab', 'Enter'].includes(key)) {
      event.preventDefault()
    }

    this.setState({ keyEvent: { key } })
  }

  renderSuggestions() {
    if (!this.props.isInteractive) { return null }

    return (
      <Suggestions
        tokens={this.state.tokens}
        cursorPos={this.props.valueEvent.cursorPos}
      />
    )
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
          value={this.props.valueEvent.value}
          style={this.props.inputTagProps.style}
          props={this.props.inputTagProps.props}
          onChange={this.handleOnChange}
          onKeyDown={this.handleOnKeyDown}
        />
        {this.renderSuggestions()}
      </InputContext.Provider>
    )
  }
}

function mapStateToProps(state) {
  const {
    global: {
      activeCell: {
        entered,
        location,
        valueEvent,
      },
      rows,
      columns,
    }
  } = state

  return {
    columns,
    entered,
    location,
    rows,
    valueEvent,
  }
}

const mapDispatchToProps = {
  clearCellData,
  resetInputter,
  setCellData,
  setInputterValueEvent,
}

export default connect(mapStateToProps, mapDispatchToProps)(Inputter)
