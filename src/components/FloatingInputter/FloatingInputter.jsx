/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { closeFloatingInputter } from '~/actions/globalActions'
import Inputter from '../Inputter/Inputter'
import InputSizer from './InputSizer'
import KeyboardFocuser from './KeyboardFocuser'


const NoOp = () => {}

const INIT_KEY_EVENT = { key: '' }

const Root = styled.div`
  position: fixed;
`

export class FloatingInputter extends React.PureComponent {

  static propTypes = {
    // redux
    cellRect: PropTypes.object,
    closeFloatingInputter: PropTypes.func,
    isFloatingInputterOpen: PropTypes.bool,
  }

  static defaultProps = {
    cellRect: {},
    closeFloatingInputter: NoOp,
    isFloatingInputterOpen: false,
  }

  constructor() {
    super()
    this.handleOnBlur = this.handleOnBlur.bind(this)
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
    this.handleInputterOnMount = this.handleInputterOnMount.bind(this)
    this.keyboardFocuser = new KeyboardFocuser(this)
    this.setInputWidth = this.setInputWidth.bind(this)
  }

  state = {
    keyEvent: INIT_KEY_EVENT,
    width: 'auto',
  }

  refRoot = React.createRef()

  componentDidUpdate() {
    this.keyboardFocuser.run()
  }

  setInputWidth(width) {
    if (this.state.width !== width) {
      this.setState({ width })
    }
  }

  handleInputterOnMount(props, state, inputEl) {
    inputEl.focus()
    inputEl.selectionEnd = inputEl.value.length
    this.setState({ keyEvent: INIT_KEY_EVENT })
  }

  handleOnKeyDown(event) {
    const { key } = event
    this.setState({ keyEvent: { key } })
  }

  handleOnBlur(event) {
    if (!this.refRoot.current.contains(event.relatedTarget)) {
      this.props.closeFloatingInputter()
    }
  }

  renderInputter() {
    if (!this.props.valueEvent) { return null }

    return (
      <Inputter
        isInteractive
        onMount={this.handleInputterOnMount}
      />
    )
  }

  render() {
    const canRender = this.props.isFloatingInputterOpen && this.props.valueEvent
    if (!canRender) { return null }

    const { top, left, height } = this.props.cellRect
    const { width } = this.state

    return (
      <Root
        ref={this.refRoot}
        css={{ top, left, width, height }}
        onKeyDown={this.handleOnKeyDown}
        onBlur={this.handleOnBlur}
      >
        <InputSizer
          valueEvent={this.props.valueEvent}
          cellRect={this.props.cellRect}
          setInputWidth={this.setInputWidth}
        />
        {this.renderInputter()}
      </Root>
    )
  }
}

function mapStateToProps(state) {
  const {
    global: {
      activeCell: {
        cellRect,
        isFloatingInputterOpen,
        location,
        valueEvent,
      },
    }
  } = state

  return { cellRect, isFloatingInputterOpen, valueEvent, location }
}

const mapDispatchToProps = { closeFloatingInputter }

export default connect(mapStateToProps, mapDispatchToProps)(FloatingInputter)
