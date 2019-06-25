/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { closeFloatingInputter, setFloatingInputterInteractive } from '~/actions/globalActions'
import inputTagProps from './inputTagProps'
import Inputter from '../Inputter/Inputter'
import InputSizer from './InputSizer'
import KeyboardFocuser from './KeyboardFocuser'


const INIT_KEY_EVENT = { key: '' }

const Root = styled.div`
  position: fixed;
`

export class FloatingInputter extends React.PureComponent {

  static propTypes = {
    // redux
    cellRect: PropTypes.object,
    closeFloatingInputter: PropTypes.func.isRequired,
    setFloatingInputterInteractive: PropTypes.func.isRequired,
    inputter: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      isInteractive: PropTypes.bool.isRequired,
    }),
    isInputterOpen: PropTypes.bool,
  }

  static defaultProps = {
    cellRect: {},
    isInputterOpen: false,
  }

  constructor() {
    super()
    this.handleInputterOnMount = this.handleInputterOnMount.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
    this.keyboardFocuser = new KeyboardFocuser(this)
    this.setInputWidth = this.setInputWidth.bind(this)
  }

  state = {
    keyEvent: INIT_KEY_EVENT,
    width: 'auto',
  }

  refRoot = React.createRef()

  componentDidUpdate() {
    if (this.props.inputter.isInteractive) {
      this.keyboardFocuser.run()
    }
  }

  setInputWidth(width) {
    if (this.state.width !== width) {
      this.setState({ width })
    }
  }

  handleInputterOnMount(props, state, inputEl) {
    if (this.props.inputter.isInteractive) {
      inputEl.focus()
      inputEl.selectionEnd = inputEl.value.length
    }
    this.setState({ keyEvent: INIT_KEY_EVENT })
  }

  handleOnKeyDown(event) {
    const { key } = event
    this.setState({ keyEvent: { key } })
  }

  handleOnFocus() {
    if (!this.props.inputter.isInteractive) {
      this.props.setFloatingInputterInteractive(true)
    }
  }

  handleOnBlur(event) {
    if (!this.refRoot.current.contains(event.relatedTarget)) {
      this.props.closeFloatingInputter()
    }
  }

  render() {
    if (!this.props.inputter.isOpen) { return null }

    const { top, left, height } = this.props.cellRect
    const { width } = this.state

    return (
      <Root
        ref={this.refRoot}
        css={{ top, left, width, height }}
        onKeyDown={this.handleOnKeyDown}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
      >
        <InputSizer
          valueEvent={this.props.valueEvent}
          cellRect={this.props.cellRect}
          setInputWidth={this.setInputWidth}
        />
        <Inputter
          isInteractive={this.props.inputter.isInteractive}
          onMount={this.handleInputterOnMount}
          inputTagProps={inputTagProps}
        />
      </Root>
    )
  }
}

function mapStateToProps(state) {
  const {
    global: {
      activeCell: {
        location,
      },
      inputter: {
        valueEvent,
      },
      floatingInputter: {
        cellRect,
        isOpen,
        isInteractive,
      }
    }
  } = state

  const inputter = {
    isOpen,
    isInteractive,
  }

  return { cellRect, valueEvent, location, inputter }
}

const mapDispatchToProps = { closeFloatingInputter, setFloatingInputterInteractive }

export default connect(mapStateToProps, mapDispatchToProps)(FloatingInputter)
