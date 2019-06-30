import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { setInputterValueEvent, resetInputterValueEvent } from '~/actions/globalActions'
import { InputContext } from './InputContext'
import Lexer from '~/formulas/Lexer'
import KeyboardActions from './KeyboardActions'
import KeyboardFocuser from './KeyboardFocuser'
import Wrapper from './Wrapper'
import InputTag from './InputTag'
import Suggestions from './Suggestions'


const NoOp = () => {}

export class Inputter extends React.PureComponent {

  static propTypes = {
    // props
    isInteractive: PropTypes.bool,
    // redux
    columns: PropTypes.number.isRequired,
    entered: PropTypes.string.isRequired,
    inputTagProps: PropTypes.object,
    location: PropTypes.string.isRequired,
    resetInputterValueEvent: PropTypes.func.isRequired,
    rows: PropTypes.number.isRequired,
    setInputterValueEvent: PropTypes.func.isRequired,
    valueEvent: PropTypes.object.isRequired,
    // lifecycle functions
    onCommit: PropTypes.func,
    onEscape: PropTypes.func,
    onMount: PropTypes.func,
  }

  static defaultProps = {
    inputTagProps: {},
    isInteractive: false,
    onCommit: NoOp,
    onEscape: NoOp,
    onMount: NoOp,
  }

  constructor(props) {
    super(props)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
    this.keyboardActions = new KeyboardActions(this)
    this.keyboardFocuser = new KeyboardFocuser(this)
    this.setInputWidth = this.setInputWidth.bind(this)
    this.setIsFuncSelectorVisible = this.setIsFuncSelectorVisible.bind(this)
  }

  state = {
    tokens: [],
    isFuncSelectorVisible: false,
    keyEvent: { key: '' },
    width: null,
  }

  refInput = React.createRef()

  componentDidMount() {
    this.props.onMount(this.props, this.state, this.refInput.current)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.valueEvent !== this.props.valueEvent) {
      this.focusInputTag()
      this.tokenizeInputValue()
    }
    
    if (prevState.keyEvent !== this.state.keyEvent) {
      this.keyboardActions.run()
      this.keyboardFocuser.run()
    }
  }

  setInputWidth(width) {
    if (this.state.width !== width) {
      this.setState({ width })
    }
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
    if (!this.props.isInteractive) { return }

    const inputEl = this.refInput.current
    const { cursorPos } = this.props.valueEvent

    inputEl.focus()

    if (inputEl.selectionEnd !== cursorPos) {
      inputEl.selectionStart = cursorPos
      inputEl.selectionEnd = cursorPos
    }
  }

  setValueEvent(event) {
    const { target: { value, selectionStart } } = event
    this.props.setInputterValueEvent(value, selectionStart)
  }

  setKeyEvent(event) {
    const { key, altKey, ctrlKey, shiftKey, metaKey } = event

    setTimeout(() => {
      const input = this.refInput.current
      const cursorPos = input.selectionStart
      const keyEvent = { key, altKey, ctrlKey, shiftKey, metaKey, cursorPos }

      this.setState({ keyEvent })
    }, 0)
  }

  keyDownEventBehavior(event) {
    if (['Tab', 'Enter'].includes(event.key)) {
      event.preventDefault()
    }
  }

  handleOnChange(event) {
    this.setValueEvent(event)
  }

  handleOnKeyDown(event) {
    this.keyDownEventBehavior(event)
    this.setKeyEvent(event)
  }

  renderSuggestions() {
    if (!this.props.isInteractive) { return null }

    return (
      <Suggestions
        tokens={this.state.tokens}
        cursorPos={this.state.keyEvent.cursorPos}
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
          setInputterValueEvent: this.props.setInputterValueEvent
        }}
      >
        <Wrapper
          location={this.props.location}
          keyEvent={this.state.keyEvent}
          onCommit={this.props.onCommit}
        >
          <InputTag
            fwdRef={this.refInput}
            props={this.props.inputTagProps.props}
            style={this.props.inputTagProps.style}
            value={this.props.valueEvent.value}
            onChange={this.handleOnChange}
            onKeyDown={this.handleOnKeyDown}
          />
          {this.renderSuggestions()}
        </Wrapper>
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
      },
      inputter: {
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
  resetInputterValueEvent,
  setInputterValueEvent,
}

export default connect(mapStateToProps, mapDispatchToProps)(Inputter)
