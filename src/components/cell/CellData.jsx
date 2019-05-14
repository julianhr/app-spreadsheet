import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { interpret } from 'xstate'

import displayMachine from './displayMachine'
import InputData from './InputData'
import TextData from './TextData'


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
    this.textTagOnDoubleClick = this.textTagOnDoubleClick.bind(this)
    this.textTagOnKeyDownEditable = this.textTagOnKeyDownEditable.bind(this)
    this.inputTagOnEscape = this.inputTagOnEscape.bind(this)
    this.inputTagOnCommit = this.inputTagOnCommit.bind(this)
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
  
  textTagOnDoubleClick() {
    this.displayService.send('EDITABLE_MODIFY')
  }

  textTagOnKeyDownEditable() {
    this.displayService.send('EDITABLE_REPLACE')
  }

  inputTagOnEscape() {
    this.displayService.send('STATIC_FOCUSED')
  }

  inputTagOnCommit() {
    this.displayService.send('STATIC')
  }

  renderData() {
    const { displayState } = this.state

    if (displayState.matches('editable')) {
      return (
        <InputData
          replaceValue={displayState.matches('editable.replace')}
          location={this.props.location}
          onEscape={this.inputTagOnEscape}
          onCommit={this.inputTagOnCommit}
        />
      )
    } else {
      return (
        <TextData
          location={this.props.location}
          onDoubleClick={this.textTagOnDoubleClick}
          onKeyDownEditable={this.textTagOnKeyDownEditable}
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
