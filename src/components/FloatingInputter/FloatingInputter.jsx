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

  constructor(props) {
    super(props)
    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.handleOnMount = this.handleOnMount.bind(this)
    this.setInputWidth = this.setInputWidth.bind(this)
  }

  state = {
    width: 'auto',
  }

  refRoot = React.createRef()

  setInputWidth(width) {
    if (this.state.width !== width) {
      this.setState({ width })
    }
  }

  handleOnMount(props, state, inputEl) {
    if (this.props.inputter.isInteractive) {
      inputEl.focus()
      inputEl.selectionEnd = inputEl.value.length
    }
  }

  handleOnFocus() {
    if (!this.props.inputter.isInteractive) {
      this.props.setFloatingInputterInteractive(true)
    }
  }

  render() {
    if (!this.props.inputter.isOpen) { return null }

    const { top, left, height } = this.props.cellRect
    const { width } = this.state

    return (
      <Root
        css={{ top, left, width, height }}
        onFocus={this.handleOnFocus}
        ref={this.refRoot}
      >
        <InputSizer
          cellRect={this.props.cellRect}
          setInputWidth={this.setInputWidth}
          style={inputTagProps.style}
          valueEvent={this.props.valueEvent}
        />
        <Inputter
          inputTagProps={inputTagProps}
          isInteractive={this.props.inputter.isInteractive}
          onCommit={this.props.closeFloatingInputter}
          onEscape={this.props.closeFloatingInputter}
          onMount={this.handleOnMount}
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
