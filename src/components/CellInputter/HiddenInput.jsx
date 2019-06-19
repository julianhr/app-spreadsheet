/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { css, jsx } from '@emotion/core' // eslint-disable-line

import { Input as BaseInput } from './Inputter'


const INPUT_PADDING_RIGHT = 15

const Input = styled(BaseInput)`
  position: absolute;
  margin-top: -200vh;
  visibility: hidden;
`

class HiddenInput extends React.PureComponent {

  static propTypes = {
    value: PropTypes.string.isRequired,
    cellWidth: PropTypes.number.isRequired,
    setInputWidth: PropTypes.func.isRequired,
  }

  refInput = React.createRef()

  componentDidMount() {
    this.setInputWidth()
  }

  componentDidUpdate(prevProps, prevState) { // eslint-disable-line
    this.setInputWidth()
  }

  setInputWidth() {
    const { cellWidth } = this.props
    const inputEl = this.refInput.current
    const textWidth = inputEl.scrollWidth
    const clientRect = inputEl.getBoundingClientRect()
    const width = textWidth > clientRect.width
      ? Math.max(cellWidth, textWidth + INPUT_PADDING_RIGHT)
      : cellWidth

    this.props.setInputWidth(width)
  }

  render() {
    return (
      <Input
        ref={this.refInput}
        defaultValue={this.props.value}
        css={{
          width: this.props.cellWidth - INPUT_PADDING_RIGHT,
        }}
      />
    )
  }
}

export default HiddenInput
