import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { interpret } from 'xstate'

import displayMachine from './displayMachine'
import InputData from './InputData'
import ResultData from './ResultData'


const Wrapper = styled.div`
  cursor: cell;
  font-size: 13px;
  border-right: 1px solid ${props => props.theme.colors.cell.border};
  border-bottom: 1px solid ${props => props.theme.colors.cell.border};
`
class CellData extends React.PureComponent {
  static propTypes = {
    location: PropTypes.string.isRequired,
  }

  constructor() {
    super()
    this.resultOnDoubleClick = this.resultOnDoubleClick.bind(this)
    this.resultOnKeyDownEditable = this.resultOnKeyDownEditable.bind(this)
    this.inputOnEscape = this.inputOnEscape.bind(this)
    this.inputOnCommit = this.inputOnCommit.bind(this)
  }

  state = {
    displayState: displayMachine.initialState,
  }

  displayService = interpret(displayMachine)
    .onTransition(displayState => this.setState({ displayState }))

  componentDidMount() {
    this.displayService.start()
  }
  
  componentWillUnmount() {
    this.displayService.stop()
  }
  
  resultOnDoubleClick() {
    this.displayService.send('EDITABLE_MODIFY')
  }

  resultOnKeyDownEditable() {
    this.displayService.send('EDITABLE_REPLACE')
  }

  inputOnEscape() {
    this.displayService.send('STATIC_FOCUSED')
  }

  inputOnCommit() {
    this.displayService.send('STATIC')
  }

  renderData() {
    const { displayState } = this.state

    if (displayState.matches('editable')) {
      return (
        <InputData
          replaceValue={displayState.matches('editable.replace')}
          location={this.props.location}
          onEscape={this.inputOnEscape}
          onCommit={this.inputOnCommit}
        />
      )
    } else {
      return (
        <ResultData
          location={this.props.location}
          onDoubleClick={this.resultOnDoubleClick}
          onKeyDownEditable={this.resultOnKeyDownEditable}
          isFocused={displayState.matches('static.focused')}
        />
      )
    }
  }

  render() {
    return (
      <Wrapper
        className='row-header-height col-label-width'
      >
        {this.renderData()}
      </Wrapper>
    )
  }
}

export default CellData
