/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { closeCellInputter } from '~/actions/globalActions'
import Inputter from './Inputter'
import HiddenInput from './HiddenInput'


const Root = styled.div`
  position: fixed;
`

export class CellInputter extends React.PureComponent {

  static propTypes = {
    // redux
    cellRect: PropTypes.object.isRequired,
    closeCellInputter: PropTypes.func.isRequired,
  }

  constructor() {
    super()
    this.setInputWidth = this.setInputWidth.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
  }

  state = {
    keyEvent: { key: '' },
    width: 'auto',
  }

  refRoot = React.createRef()

  componentDidMount() {
    this.setState({ width: this.props.cellRect.width })
  }

  setInputWidth(width) {
    if (this.state.width !== width) {
      this.setState({ width })
    }
  }

  handleOnBlur(event) {
    if (!this.refRoot.current.contains(event.relatedTarget)) {
      this.props.closeCellInputter()
    }
  }

  render() {
    const { top, left, height } = this.props.cellRect
    const width = this.state.width

    return (
      <Root
        ref={this.refRoot}
        css={{ top, left, width, height }}
        onBlur={this.handleOnBlur}
      >
        <HiddenInput
          setInputWidth={this.setInputWidth}
        />
        <Inputter
          onChange={this.handleOnChange}
        />
      </Root>
    )
  }
}

function mapStateToProps(state) {
  const {
    global: {
      cellInputter: {
        cellRect,
      },
    }
  } = state

  return { cellRect }
}

const mapDispatchToProps = { closeCellInputter }

export default connect(mapStateToProps, mapDispatchToProps)(CellInputter)
