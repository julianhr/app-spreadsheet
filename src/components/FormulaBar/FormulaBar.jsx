import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'

import { scheduleFloatingInputter, closeFloatingInputter } from '~/actions/globalActions'
import inputTagProps from './inputTagProps'
import Inputter from '../Inputter/Inputter'
import { ROW_HEADER_WIDTH } from '../cell/RowHeader'


const Root = styled.div`
  display: flex;
  border-width: 2px 2px 0;
  border-style: solid;
  border-color: ${props => props.theme.colors.table.borderDark};
  position: relative;
  height: 30px;
  width: 100%;
  z-index: 10;
`

const Fx = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${props => props.theme.colors.table.borderDark};
  width: ${ROW_HEADER_WIDTH + 3}px;
  color: ${props => props.theme.colors.table.borderDark};
  font-style: italic;
`

class FormulaBar extends React.PureComponent {

  static propTypes = {
    location: PropTypes.string,
    scheduleFloatingInputter: PropTypes.func.isRequired,
    closeFloatingInputter: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
  }

  state = {
    isInteractive: false,
  }

  refRoot = React.createRef()

  handleOnFocus() {
    this.setState({ isInteractive: true })
    this.props.scheduleFloatingInputter(false)
  }

  handleOnBlur(event) {
    if (!this.refRoot.current.contains(event.relatedTarget)) {
      this.props.closeFloatingInputter()
      this.setState({ isInteractive: false })
    }
  }

  render() {
    return (
      <Root
        ref={this.refRoot}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
      >
        <Fx>ƒx</Fx>
        <Inputter
          isInteractive={this.state.isInteractive}
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
    }
  } = state

  return { location }
}

const mapDispatchtoProps = { scheduleFloatingInputter, closeFloatingInputter }

export default connect(mapStateToProps, mapDispatchtoProps)(FormulaBar)
