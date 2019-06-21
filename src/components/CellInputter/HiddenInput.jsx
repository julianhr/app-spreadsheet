/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { css, jsx } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { Input as BaseInput } from './InputTag'


const INPUT_PADDING_RIGHT = 15

const Input = styled(BaseInput)`
  position: absolute;
  margin-top: -200vh;
  visibility: hidden;
`

class HiddenInput extends React.PureComponent {

  static propTypes = {
    // props
    setInputWidth: PropTypes.func.isRequired,
    // redux
    cellRect: PropTypes.object,
    entered: PropTypes.string.isRequired,
    valueEvent: PropTypes.object,
  }

  static defaultProps = {
    valueEvent: {}
  }

  state = {
    width: null,
  }

  refInput = React.createRef()

  componentDidMount() {
    this.setState({ width: this.props.cellRect.width })
    this.setInputWidth()
  }

  componentDidUpdate(prevProps, prevState) { // eslint-disable-line
    if (prevProps.valueEvent !== this.props.valueEvent) {
      this.setInputWidth()
    }
  }

  setInputWidth() {
    const inputEl = this.refInput.current
    const textWidth = inputEl.scrollWidth
    const clientRect = inputEl.getBoundingClientRect()
    const width = textWidth > clientRect.width
      ? textWidth
      : this.props.cellRect.width - INPUT_PADDING_RIGHT

    this.setState({ width })
    this.props.setInputWidth(width + INPUT_PADDING_RIGHT)
  }

  render() {
    const { value } = this.props.valueEvent
    const { entered } = this.props

    return (
      <Input
        ref={this.refInput}
        defaultValue={value || entered}
        css={{
          width: this.state.width - INPUT_PADDING_RIGHT,
        }}
      />
    )
  }
}

function mapStateToProps(state) {
  const {
    global: {
      activeCell: {
        entered,
      },
      cellInputter: {
        valueEvent,
        cellRect,
      }
    }
  } = state

  return { entered, valueEvent, cellRect }
}

export default connect(mapStateToProps)(HiddenInput)
