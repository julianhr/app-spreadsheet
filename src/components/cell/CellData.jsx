import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { interpret } from 'xstate'

import displayMachine from './displayMachine'
import InputData from './InputData'
import EvaluatedData from './EvaluatedData'


const Wrapper = styled.div`
  cursor: cell;
  width: 100%;
  height: 100%;
  font-size: 13px;
  border-right: 1px solid #dfdfdf;
  border-bottom: 1px solid #dfdfdf;
`
class CellData extends React.PureComponent {
  static propTypes = {
    location: PropTypes.string.isRequired,
  }

  constructor() {
    super()
    this.evaluatedOnDoubleClick = this.evaluatedOnDoubleClick.bind(this)
    this.evaluatedOnKeyDownEditable = this.evaluatedOnKeyDownEditable.bind(this)
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
  
  evaluatedOnDoubleClick() {
    this.displayService.send('EDITABLE_MODIFY')
  }

  evaluatedOnKeyDownEditable() {
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
        <EvaluatedData
          location={this.props.location}
          onDoubleClick={this.evaluatedOnDoubleClick}
          onKeyDownEditable={this.evaluatedOnKeyDownEditable}
          isFocused={displayState.matches('static.focused')}
        />
      )
    }
  }

  render() {
    return (
      <Wrapper>
        {this.renderData()}
      </Wrapper>
    )
  }
}

export default CellData
