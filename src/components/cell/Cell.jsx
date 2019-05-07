import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { connect } from 'react-redux'

import { setActiveCell, moveActiveCell } from '~/actions/rootActions'


const cellBase = css`
  display: flex;
  width: 180px;
  height: 34px;
  outline: none;
  align-items: center;
  border: 3px solid transparent;

  :focus {
    border: 3px solid salmon;
  }
`

const A = styled.a`
  ${cellBase}
  cursor: cell;
  padding: 3px;
`

const Input = styled.input`
  ${cellBase}
  margin: 0;
  padding: 0;
`

class Cell extends React.PureComponent {
  static propTypes = {
    activeCell: PropTypes.string,
    isActive: PropTypes.bool,
    location: PropTypes.string,
    moveActiveCell: PropTypes.func,
    setActiveCell: PropTypes.func,
  }

  state = {
    isEditable: false,
    isValueDirty: false,
    valueDirty: '',
    valueEditable: '',
    valueNonEditable: '',
  }

  refA = React.createRef()
  refInput = React.createRef()

  componentDidUpdate(prevProps, prevState) {
    const { isActive } = this.props
    const { isEditable } = this.state

    if (!isActive && isEditable) {
      this.setState({ isEditable: false })
    }

    if (isEditable) {
      this.focusInput()
    }
  }

  handleAonDoubleClick = (event) => {
    this.setState({ isEditable: true, isValueDirty: false })
    this.props.setActiveCell(this.props.location)
  }
  
  handleAonKeyDown = (event) => {
    const { key } = event
    
    if ('Backspace' === key) {
      this.setState({ valueEditable: '', valueNonEditable: '' })
    } else if (key.length === 1) {
      this.props.setActiveCell(this.props.location)
      this.setState({ isEditable: true, isValueDirty: true })
    }
  }

  handleInputOnKeyDown = (event) => {
    const key = event.key
    
    if (key === 'Escape') {
      event.target.value = this.state.valueNonEditable
      this.setState({ isEditable: false }, () => { this.refA.current.focus() })
    } else if (key === 'Enter') {
      this.setNewValue(event.target.value)
    } else {
      event.stopPropagation()
    }
  }

  handleInputOnBlur = (event) => {
    this.setNewValue(event.target.value)
  }

  setNewValue(value) {
    value = value.trim()

    const nextState = {
      isEditable: false,
      valueEditable: value
    }

    if (value[0] === '=') {
      nextState.valueNonEditable = this.evaluateFormula(value)
    } else {
      nextState.valueNonEditable = value
    }

    this.setState(nextState)
  }

  evaluateFormula() {
    return 'pending evaluateFormula'
  }

  focusInput() {
    const input = this.refInput.current
    input.focus()
    input.scrollLeft = input.scrollWidth
  }

  renderData() {
    if (this.state.isEditable) {
      const { valueEditable, isValueDirty } = this.state

      return (
        <Input
          data-location={this.props.location}
          ref={this.refInput}
          defaultValue={isValueDirty ? '' : valueEditable}
          onKeyDown={this.handleInputOnKeyDown}
          onBlur={this.handleInputOnBlur}
        />
      )
    } else {
      return (
        <A
          id={this.props.location}
          ref={this.refA}
          data-location={this.props.location}
          tabIndex='0'
          onKeyDown={this.handleAonKeyDown}
          onDoubleClick={this.handleAonDoubleClick}
        >
          {this.state.valueNonEditable}
        </A>
      )
    }
  }

  render() {
    return this.renderData()
  }
}

const mapDispatchToProps = { setActiveCell, moveActiveCell }

export default connect(null, mapDispatchToProps)(Cell)
