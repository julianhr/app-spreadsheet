/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { css, jsx } from '@emotion/core' // eslint-disable-line

import { Input as BaseInput } from '../Inputter/InputTag'


const NoOp = () => {}
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
    style: PropTypes.func,
    // redux
    cellRect: PropTypes.object,
    valueEvent: PropTypes.object,
  }

  static defaultProps = {
    style: NoOp,
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
        readOnly
        ref={this.refInput}
        value={this.props.valueEvent.value}
        css={theme => {
          const style1 = this.props.style(theme)
          const style2 = `width: ${this.props.cellRect.width}px;`
          return [style1, style2]
        }}
      />
    )
  }
}

export default InputSizer
