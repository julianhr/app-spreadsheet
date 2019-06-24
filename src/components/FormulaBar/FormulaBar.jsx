import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'

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
  width: 893px;
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
    
  }

  handleOnBlur(event) {
    if (!this.refRoot.current.contains(event.relatedTarget)) {
      this.setState({ isInteractive: false })
    }
  }

  renderInputter() {
    if (!this.props.location) { return null }

    return (
      <Inputter
        isInteractive={this.state.isInteractive}
        inputTagProps={inputTagProps}
      />
    )
  }

  render() {
    return (
      <Root
        ref={this.refRoot}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
      >
        <Fx>ƒx</Fx>
        {this.renderInputter()}
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

export default connect(mapStateToProps)(FormulaBar)
