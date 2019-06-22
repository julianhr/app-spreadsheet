/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { css, jsx } from '@emotion/core' // eslint-disable-line

import { Input as BaseInput } from '../Inputter/InputTag'


const PADDING_COMPARE = 3
const PADDING_SIZE = 7

const Input = styled(BaseInput)`
  position: absolute;
  margin-top: -200vh;
  visibility: hidden;
`

class InputSizer extends React.PureComponent {

  static propTypes = {
    // props
    setInputWidth: PropTypes.func.isRequired,
    // redux
    cellRect: PropTypes.object,
    valueEvent: PropTypes.object,
  }

  refInput = React.createRef()

  componentDidMount() {
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
    const width = textWidth + PADDING_COMPARE > this.props.cellRect.width
      ? Math.ceil(textWidth) + PADDING_SIZE
      : this.props.cellRect.width

    this.props.setInputWidth(width)
  }

  render() {
    return (
      <Input
        ref={this.refInput}
        readOnly
        value={this.props.valueEvent.value}
        css={{
          width: this.props.cellRect.width,
        }}
      />
    )
  }
}

export default InputSizer
